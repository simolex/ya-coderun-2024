function hashStyles() {
    const hash = new Map();

    return function (level) {
        if (!hash.has(level)) {
            hash.set(level, { color: calculateColor(level), width: calculateWidth(level) });
        }
        return hash.get(level);
    };
}

const getStyles = hashStyles();

function drawTree(_startY, _angle, _level = 0) {
    const stack = [{ startY: _startY, angle: _angle, level: _level, restore: false }];

    while (stack.length > 0) {
        const { startY, angle, level, restore } = stack.pop();
        if (restore) {
            ctx.restore();
            continue;
        }
        const startX = canvas.width / 2;

        const len = length * Math.pow(depth, level);
        ctx.beginPath();
        ctx.save();

        ctx.translate(level ? 0 : startX, startY);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -len);

        const styles = getStyles(level);
        ctx.strokeStyle = styles.color;
        ctx.lineWidth = styles.width;

        ctx.stroke();

        if (len >= 10) {
            stack.push({ restore: true });
            const newLevel = level + 1;
            stack.push({
                startY: -len,
                angle: angle - angleOffset,
                level: newLevel
            });
            stack.push({
                startY: -len,
                angle: angle + angleOffset,
                level: newLevel
            });
        } else {
            ctx.restore();
        }
    }
}
