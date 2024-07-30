function solution(container, size, onEnd) {
    const { boxSizing, padding, height, width } = getComputedStyle(container);

    console.dir(container.getBoundingClientRect());

    const board = Array(size * size).fill(null);

    const config = {
        childList: true,
        subtree: true
    };

    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                console.log("A child node has been added or removed.");
                console.log("added", mutation.addedNodes);
                mutation.addedNodes.forEach((el) => console.dir(el.getBoundingClientRect()));
                console.log("removed", mutation.removedNodes);
                mutation.removedNodes.forEach((el) => console.dir(getComputedStyle(el)));
            }
        }
    };

    const observer = new MutationObserver(callback);

    observer.observe(container, config);

    onEnd("is Ended");
}
