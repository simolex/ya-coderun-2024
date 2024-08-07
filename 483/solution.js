let vizitedIndex = [];
let prevCurrentTime;

const beep = function (audioContext, destination, freq, startAt = 0) {
    const oscillator = audioContext.createOscillator();
    const currentTime = audioContext.currentTime;

    oscillator.type = "triangle";
    oscillator.frequency.value = freq;
    oscillator.connect(destination);
    oscillator.start(currentTime + startAt * (currentTime - prevCurrentTime));
    oscillator.stop(currentTime + startAt * (currentTime - prevCurrentTime) + 0.25);
};

const A = (a, b) => b.y - a.y;
const B = (a, b) => a.x - b.x;
const C = (a, b) => a.y * b.x - a.x * b.y;

const intersection = function (a, b, c, d) {
    const denom = A(a, b) * B(c, d) - B(a, b) * A(c, d);

    if (denom === 0) {
        return null;
    }

    return {
        x: (B(a, b) * C(c, d) - C(a, b) * B(c, d)) / denom,
        y: (C(a, b) * A(c, d) - A(a, b) * C(c, d)) / denom,
    };
};

const distance = function (a, b) {
    return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
};

export function solution(player, platforms, audioContext, destination) {
    const currentTime = audioContext.currentTime;

    if (!prevCurrentTime) {
        prevCurrentTime = currentTime;
    }
    let { x, y, vx, vy, ax, ay } = player;
    let isBounce = false;

    let xNew = x + vx;
    let yNew = y + vy;

    for (let i = 0; i < platforms.length && !isBounce; i++) {
        // if (!vizitedIndex[i]) {
        const { x: px, y: py, width, height, freq } = platforms[i];
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        if (!isBounce && yNew <= py + halfHeight + 1) {
            const iSec = intersection(
                { x, y },
                { x: xNew, y: yNew },
                { x: px - halfWidth, y: py + halfHeight + 1 },
                { x: px + halfWidth, y: py + halfHeight + 1 }
            );
            if (
                iSec !== null &&
                iSec.x >= px - halfWidth &&
                iSec.x <= px + halfWidth &&
                Math.min(x, xNew) <= iSec.x &&
                Math.max(x, xNew) >= iSec.x &&
                Math.min(y, yNew) <= iSec.y &&
                Math.max(y, yNew) >= iSec.y
            ) {
                const partDistance = distance({ x, y }, iSec);
                const fullDistance = distance({ x: 0, y: 0 }, { x: vx, y: vy });
                const relDistance = partDistance / fullDistance;

                beep(audioContext, destination, freq, relDistance);
                vx = -1 * vx;
                vy = -0.5 * vy;

                xNew = iSec.x + vx * (1 - relDistance);
                yNew = iSec.y + vy * (1 - relDistance);

                vizitedIndex[i] = true;

                isBounce = true;
            }
        }
        // }
    }

    if (!isBounce) {
        vx += ax;
        vy += ay;
    }

    prevCurrentTime = currentTime;
    return { x: xNew, y: yNew, vx, vy, ax, ay };
}
