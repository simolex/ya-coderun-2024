class MinHeap {
    constructor(initValues) {
        if (initValues) {
            this.values = initValues;
            const lastElementWithChilds = Math.floor(initValues.length / 2) - 1;
            for (let i = lastElementWithChilds; i >= 0; i--) {
                this._balancing(i);
            }
        } else this.values = [];
    }
    push(element) {
        this.values.push(element);
        let index = this.values.length - 1;

        while (index > 0) {
            const current = this.values[index];
            let parentIndex = Math.floor((index - 1) / 2);

            if (this.values[parentIndex] > current) {
                this.values[index] = this.values[parentIndex];
                this.values[parentIndex] = current;
                index = parentIndex;
            } else break;
        }
    }
    _balancing(index) {
        const length = this.values.length;
        while (index * 2 + 1 < length) {
            const current = this.values[index];
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;
            leftChild = this.values[leftChildIndex];
            rightChild = this.values[rightChildIndex];

            if (rightChildIndex === length) {
                swap = leftChild;
            }
            swap = swap === null && rightChild <= leftChild ? rightChildIndex : leftChildIndex;
            if (this.values[swap] < current) {
                this.values[index] = this.values[swap];
                this.values[swap] = current;
                index = swap;
            } else break;
        }
    }
    pop() {
        let index = 0;
        const min = this.values[index];
        this.values[index] = this.values[this.values.length - 1];

        this._balancing(index);
        this.values.pop();
        return min;
    }

    getValues() {
        return this.values;
    }
    getSize() {
        return this.values.length;
    }
}

const eventTypes = {
    start: 1,
    finish: -1,
};

module.exports = function solution(list, { dayWidth, gap, startWeek }) {
    const countTask = list.length;
    const eventsList = Array(2 * countTask);

    list.forEach((task, idx) => {
        for (let key in task) {
            eventsList.push({
                time: task[key],
                type: eventTypes[key],
                finish: task["finish"],
                idx,
            });
        }
    });

    eventsList.sort((a, b) => a.time - b.time || a.event - b.event || b.finish - a.finish);

    const eventsBlocks = [];
    let countEvent = 0;
    let maxLevels = 0;
    let sizeBlock = 0;
    let currentBlock = -1;

    eventsList.forEach((event) => {
        if (event.type === eventTypes.start) {
            if (countEvent === 0) {
                currentBlock++;
                eventsBlocks[currentBlock] = { start: event.time, events: [] };
                sizeBlock = 1;
            }
            countEvent++;
        } else if (event.type === eventTypes.finish) {
            countEvent--;
            if (countEvent === 0) {
                eventsBlocks[currentBlock].size = sizeBlock;
            }
        }

        sizeBlock = countEvent > sizeBlock ? countEvent : sizeBlock;
        maxLevels = sizeBlock > maxLevels ? sizeBlock : maxLevels;
        eventsBlocks[currentBlock].events.push(event);
    });

    const levelsHeap = new MinHeap(
        Array(maxLevels * 2)
            .fill(null)
            .map((_, i) => i)
    );

    const usedLevels = new Map();
    let level = -1;
    let indexCell;
    let cell;

    eventsBlocks.map((block) => {
        block.cells = [];
        const emptyLevels = Array(block.size).fill(true);

        block.events.forEach((event) => {
            if (event.type === eventTypes.start) {
                level = levelsHeap.pop();

                emptyLevels[level] = false;
                usedLevels.forEach((event) => {
                    event.emptyLevels[level] = false;
                });

                usedLevels.set(event.idx, {
                    top: event.time,
                    emptyLevels: Array.from(emptyLevels),
                    level,
                });
                // event["idxCell"] = block.cells.length - 1;
            } else if (event.type === eventTypes.finish) {
                cell = usedLevels.get(event.idx);
                level = cell.level;
                levelsHeap.push(level);
                emptyLevels[level] = true;

                cell.height = event.time - block.cells[indexCell].top;
                block.cells.push(cell);
                // event["idxCell"] = indexCell;
            }
        });
        return block;
    });

    eventsBlocks.forEach((t) => {
        const m = (t.start - startWeek) / 60;
        console.log(t.start, Math.floor(m / 1440), m % 1440, t.size, t.events, t.cells);
    });

    return [];
};
