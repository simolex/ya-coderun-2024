"use strict";
const fs = require("fs");

class LineByLine {
    constructor(file, options) {
        options = options || {};

        if (!options.readChunk) options.readChunk = 1024;

        if (!options.newLineCharacter) {
            options.newLineCharacter = 0x0a; //linux line ending
        } else {
            options.newLineCharacter = options.newLineCharacter.charCodeAt(0);
        }

        if (typeof file === "number") {
            this.fd = file;
        } else {
            this.fd = fs.openSync(file, "r");
        }

        this.options = options;

        this.newLineCharacter = options.newLineCharacter;

        this.reset();
    }

    _searchInBuffer(buffer, hexNeedle) {
        let found = -1;

        for (let i = 0; i <= buffer.length; i++) {
            let b_byte = buffer[i];
            if (b_byte === hexNeedle) {
                found = i;
                break;
            }
        }

        return found;
    }

    reset() {
        this.eofReached = false;
        this.linesCache = [];
        this.positionsCache = [];
        this.lastPosition = 0;
        this.fdPosition = 0;
    }

    close() {
        fs.closeSync(this.fd);
        this.fd = null;
    }

    _extractLines(buffer) {
        let line;
        const lines = [];
        let bufferPosition = 0;

        let lastNewLineBufferPosition = 0;
        while (true) {
            let bufferPositionValue = buffer[bufferPosition++];

            if (bufferPositionValue === this.newLineCharacter) {
                line = buffer.slice(lastNewLineBufferPosition, bufferPosition);
                lines.push(line);
                this.positionsCache.push(this.lastPosition);
                this.lastPosition += bufferPosition;

                lastNewLineBufferPosition = bufferPosition;
                this.fdPosition = this.lastPosition;
                break;
            } else if (bufferPositionValue === undefined) {
                break;
            }
        }

        let leftovers = buffer.slice(lastNewLineBufferPosition, bufferPosition);
        if (leftovers.length) {
            lines.push(leftovers);
        }

        return lines;
    }

    _readChunk(lineLeftovers) {
        let totalBytesRead = 0;

        let bytesRead;
        const buffers = [];
        do {
            const readBuffer = Buffer.alloc(this.options.readChunk);

            bytesRead = fs.readSync(this.fd, readBuffer, 0, this.options.readChunk, this.fdPosition);
            totalBytesRead = totalBytesRead + bytesRead;

            this.fdPosition = this.fdPosition + bytesRead;

            buffers.push(readBuffer);
        } while (bytesRead && this._searchInBuffer(buffers[buffers.length - 1], this.options.newLineCharacter) === -1);

        let bufferData = Buffer.concat(buffers);

        if (bytesRead < this.options.readChunk) {
            this.eofReached = true;
            bufferData = bufferData.slice(0, totalBytesRead);
        }

        if (totalBytesRead) {
            this.linesCache = this._extractLines(bufferData);

            if (lineLeftovers) {
                this.linesCache[0] = Buffer.concat([lineLeftovers, this.linesCache[0]]);
            }
        }

        return totalBytesRead;
    }

    next() {
        let savePosition = this.fdPosition;
        if (!this.fd) return false;

        let line = false;
        let position = 0;

        if (this.eofReached && this.linesCache.length === 0) {
            return { line, position };
        }

        let bytesRead;

        if (!this.linesCache.length) {
            bytesRead = this._readChunk();
        }

        if (this.linesCache.length) {
            line = this.linesCache.shift();
            position = this.positionsCache.shift();

            const lastLineCharacter = line[line.length - 1];

            if (lastLineCharacter !== this.newLineCharacter) {
                bytesRead = this._readChunk(line);

                if (bytesRead) {
                    line = this.linesCache.shift();
                    position = this.positionsCache.shift();
                }
            }
        }

        if (this.eofReached && this.linesCache.length === 0) {
            this.close();
        }

        if (line && line[line.length - 1] === this.newLineCharacter) {
            line = line.slice(0, line.length - 1);
        }

        return { line, position };
    }
}

module.exports = async () => {
    const buffer = [];
    const files = [];
    const isFinished = [false, false, false, false];
    const output = fs.createWriteStream("output.log", {
        flags: "a",
        autoClose: true
    });

    files[0] = new LineByLine("server_1.log");
    files[1] = new LineByLine("server_2.log");
    files[2] = new LineByLine("server_3.log");
    files[3] = new LineByLine("server_4.log");

    for (let i = 0; i < 4; i++) {
        let { line, position } = files[i].next();
        if (line && line[line.length - 1] === 0x0d) {
            line = line.slice(0, line.length - 1);
        }

        // while (line.length === 0 || line[line.length - 1] === 0x0d) {
        //     ({ line, position } = files[i].next());
        //     if (line && line[line.length - 1] === 0x0d) {
        //         line = line.slice(0, line.length - 1);
        //     }
        // }

        if (!!line) {
            const { timestamp } = JSON.parse(line);
            buffer.push([Number(timestamp), position, i]);
        } else {
            isFinished[i] = true;
        }
    }

    while (!isFinished.reduce((res, flag) => res && flag, true)) {
        buffer.sort((a, b) => b[0] - a[0] || b[2] - a[2]);

        const record = buffer.pop();

        const fileNum = record[2];
        files[fileNum].fdPosition = record[1];
        files[fileNum].eofReached = false;

        console.log(fileNum, files[fileNum], record[1]);
        output.write(`${files[fileNum].next().line}\n`);

        if (!isFinished[fileNum]) {
            let next = files[fileNum].next();
            if (next) {
                let { line, position } = next;

                if (line && line[line.length - 1] === 0x0d) {
                    line = line.slice(0, line.length - 1);
                }

                // while (line.length === 0 || line[line.length - 1] === 0x0d) {
                //     ({ line, position } = files[fileNum].next());

                //     if (line && line[line.length - 1] === 0x0d) {
                //         line = line.slice(0, line.length - 1);
                //     }
                // }
                if (line) {
                    const { timestamp } = JSON.parse(line);

                    buffer.push([Number(timestamp), position, fileNum]);
                }
            } else {
                isFinished[fileNum] = true;
            }
        }
    }

    output.close();
};
