function solution(container, size, onEnd) {
    const { padding } = getComputedStyle(container);
    const sizePadding = Number.parseInt(padding);
    const { left, top, width, height } = container.getBoundingClientRect();

    const contentLeft = left + sizePadding;
    const contentTop = top + sizePadding;
    const contentWidth = width - sizePadding * 2;
    const contentHeight = height - sizePadding * 2;

    const cellWidth = contentWidth / size;
    const cellHeight = contentHeight / size;

    const board = Array(size * size).fill(null);

    const getBoardIndex = (rect) => {
        const { left: leftDiv, top: topDiv, right: rightDiv, bottom: bottomDiv } = rect;

        const centerAxisX = (leftDiv + rightDiv) / 2 - contentLeft;
        const centerAxisY = (topDiv + bottomDiv) / 2 - contentTop;

        return Math.floor(centerAxisX / cellWidth) + Math.floor(centerAxisY / cellHeight) * size;
    };

    const readMessage = () => board.filter((v) => v !== null).join("");

    const config = {
        childList: true,
        subtree: true,
    };

    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((el) => {
                    const index = getBoardIndex(el.getBoundingClientRect());
                    const content = el.innerText;
                    board[index] = content;
                    if (content === ".") {
                        const message = readMessage();
                        onEnd(message);
                    }
                });
            }
        }
    };

    const observer = new MutationObserver(callback);

    observer.observe(container, config);
}
