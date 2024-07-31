/**
 * 416. Праздник
 */

function invite(n, friends) {
    const result = [];

    const positive = [];
    const negative = new Map();

    friends.forEach((needCount, i) => {
        if (needCount < 0) {
            const favorite = -1 * needCount;
            if (!negative.has(favorite)) {
                negative.set(favorite, []);
            }
            negative.get(favorite).push(i + 1);
        } else {
            positive.push({ needCount, position: i + 1 });
        }
    });
    positive.sort((a, b) => a["needCount"] - b["needCount"]);

    let countInvited = 0;

    for (let friend of positive) {
        if (friend.needCount > countInvited) {
            return [];
        }

        result.push(friend.position);

        if (negative.has(friend.position)) {
            const stack = [friend.position];

            while (stack.length > 0) {
                const friendPosition = stack.pop();

                if (negative.has(friendPosition)) {
                    negative.get(friendPosition).forEach((negFriend) => {
                        stack.push(negFriend);
                        result.push(negFriend);
                        countInvited++;
                    });
                    negative.delete(friendPosition);
                }
            }
        }

        countInvited++;
    }

    if (negative.size > 0) {
        return [];
    }

    return result;
}

const _readline = require("readline");

const _reader = _readline.createInterface({
    input: process.stdin,
});

const _inputLines = [];
let _curLine = 0;

_reader.on("line", (line) => {
    _inputLines.push(line);
});

process.stdin.on("end", solve);

function solve() {
    const n = readInt();
    const friends = readArray();

    const result = invite(n, friends);

    console.log(result.length > 0 ? result.join(" ") : 0);
}

function readInt() {
    const n = Number(_inputLines[_curLine]);
    _curLine++;
    return n;
}

function readArray() {
    var arr = _inputLines[_curLine]
        .trim(" ")
        .split(" ")
        .map((num) => Number(num));
    _curLine++;
    return arr;
}

function readString() {
    const s = _inputLines[_curLine].trim();
    _curLine++;
    return s;
}

module.exports = invite;
