"use strict";
const fs = require("fs");

class LineByLine {
    constructor(file, options) {
        options = options || {};

        if (!options.readChunk) options.readChunk = 256;

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
                lastNewLineBufferPosition = bufferPosition;
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

            bytesRead = fs.readSync(
                this.fd,
                readBuffer,
                0,
                this.options.readChunk,
                this.fdPosition
            );
            totalBytesRead = totalBytesRead + bytesRead;

            this.fdPosition = this.fdPosition + bytesRead;

            buffers.push(readBuffer);
        } while (
            bytesRead &&
            this._searchInBuffer(buffers[buffers.length - 1], this.options.newLineCharacter) === -1
        );

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
        if (!this.fd) return false;

        let line = false;

        if (this.eofReached && this.linesCache.length === 0) {
            return line;
        }

        let bytesRead;

        if (!this.linesCache.length) {
            bytesRead = this._readChunk();
        }

        if (this.linesCache.length) {
            line = this.linesCache.shift();

            const lastLineCharacter = line[line.length - 1];

            if (lastLineCharacter !== this.newLineCharacter) {
                bytesRead = this._readChunk(line);

                if (bytesRead) {
                    line = this.linesCache.shift();
                }
            }
        }

        if (this.eofReached && this.linesCache.length === 0) {
            this.close();
        }

        if (line && line[line.length - 1] === this.newLineCharacter) {
            line = line.slice(0, line.length - 1);
        }

        return line;
    }
}

module.exports = async () => {
    const sizeChunk = 256;
    const timestampRE = /[^\d]*['"]?timestamp['"]?\:[ ]*?(\d+)[^\d]*?/;
    const buffer = [];
    const files = [[], []];
    const isFinished = [false, false, false, false];
    const fdOutput = fs.openSync("output.log", "a");

    files[0][0] = new LineByLine("server_1.log", { readChunk: sizeChunk });
    files[0][1] = new LineByLine("server_2.log", { readChunk: sizeChunk });
    files[0][2] = new LineByLine("server_3.log", { readChunk: sizeChunk });
    files[0][3] = new LineByLine("server_4.log", { readChunk: sizeChunk });
    files[1][0] = new LineByLine("server_1.log", { readChunk: sizeChunk });
    files[1][1] = new LineByLine("server_2.log", { readChunk: sizeChunk });
    files[1][2] = new LineByLine("server_3.log", { readChunk: sizeChunk });
    files[1][3] = new LineByLine("server_4.log", { readChunk: sizeChunk });

    let line;
    let timestamp;
    for (let i = 0; i < 4; i++) {
        line = files[0][i].next();

        if (!!line) {
            timestamp = timestampRE.exec(line)[1];
            buffer.push([Number(timestamp), 0, i]);
        } else {
            isFinished[i] = true;
        }
    }

    // console.log(buffer);
    // process.exit();

    while (!isFinished.reduce((res, flag) => res && flag, true)) {
        buffer.sort((a, b) => b[0] - a[0] || b[2] - a[2]);

        const record = buffer.pop();

        const fileNum = record[2];

        line = files[1][fileNum].next();

        const len = Math.ceil(line.length / sizeChunk);
        let chunk;

        for (let i = 0; i < len; i++) {
            chunk = line.slice(i * sizeChunk, i * sizeChunk + sizeChunk);
            if (i === len - 1) {
                chunk = `${chunk}\n`;
            }

            fs.writeSync(fdOutput, chunk);
        }

        if (!isFinished[fileNum]) {
            line = files[0][fileNum].next();

            if (line) {
                timestamp = timestampRE.exec(line)[1];

                buffer.push([timestamp, 0, fileNum]);
            } else {
                isFinished[fileNum] = true;
            }
        }
    }

    fs.closeSync(fdOutput);
};
