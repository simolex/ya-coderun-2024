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
    finish: -1
};

const cellTypes = {
    DIVIDER: "divider",
    NATIVE: "native"
};

const appendLink = (node, linkName, reference) => {
    if (!(linkName in node)) {
        node[linkName] = [];
    }
    node[linkName].push(reference);
};

function solution(list, { dayWidth, gap, startWeek }) {
    const eventsList = [];
    list.forEach((task, idx) => {
        for (let key in task) {
            if (["start", "finish"].includes(key)) {
                eventsList.push({
                    time: (task[key] - startWeek) / 60,
                    type: eventTypes[key],
                    finish: (task["finish"] - startWeek) / 60,
                    idx
                });
            }
            // else {
            //     throw Error("Некорректные данные о событиях");
            // }
        }
    });

    eventsList.sort((a, b) => a.time - b.time || a.type - b.type || b.finish - a.finish);

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
                eventsBlocks[currentBlock].finish = event.time;
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
    let newEvent, newDivider;
    eventsBlocks.map((block) => {
        const linkedListLevels = Array(block.size)
            .fill(null)
            .map((_, i) => ({ type: cellTypes.DIVIDER, top: block.start, level: i }));
        const stateLinkedLevels = linkedListLevels.map((node, idx, nodes) => {
            if (idx > 0) {
                appendLink(nodes[idx - 1], "upLevel", node);
                appendLink(node, "downLevel", nodes[idx - 1]);
            }
            return node;
        });

        block.events.forEach((event) => {
            if (event.type === eventTypes.start) {
                level = levelsHeap.pop();

                newEvent = {
                    type: cellTypes.NATIVE,
                    top: event.time,
                    level
                };

                if (stateLinkedLevels[level].type === cellTypes.DIVIDER) {
                    stateLinkedLevels[level].bottom = event.time;
                }

                stateLinkedLevels[level].nextCell = newEvent;
                newEvent.prevCell = stateLinkedLevels[level];
                stateLinkedLevels[level] = newEvent;

                usedLevels.set(event.idx, level);
            } else if (event.type === eventTypes.finish) {
                level = usedLevels.get(event.idx);
                levelsHeap.push(level);

                stateLinkedLevels[level].bottom = event.time;

                usedLevels.delete(event.idx);

                newDivider = {
                    type: cellTypes.DIVIDER,
                    top: event.time,
                    level
                };

                stateLinkedLevels[level].nextCell = newDivider;
                newDivider.prevCell = stateLinkedLevels[level];
                stateLinkedLevels[level] = stateLinkedLevels[level].nextCell;

                if (level - 1 >= 0 && stateLinkedLevels[level - 1].type === cellTypes.DIVIDER) {
                    appendLink(newDivider, "downLevel", stateLinkedLevels[level - 1]);
                    // newDivider.downLevel = stateLinkedLevels[level - 1];
                    appendLink(stateLinkedLevels[level - 1], "upLevel", newDivider);
                    // stateLinkedLevels[level - 1].upLevel = newDivider;
                }

                if (level + 1 < block.size && stateLinkedLevels[level + 1].type === cellTypes.DIVIDER) {
                    appendLink(newDivider, "upLevel", stateLinkedLevels[level + 1]);
                    // newDivider.upLevel = stateLinkedLevels[level + 1];
                    appendLink(stateLinkedLevels[level + 1], "downLevel", newDivider);
                    // stateLinkedLevels[level + 1].downLevel = newDivider;
                }

                // let divider = newDivider;
                // while (divider.prevLevel !== undefined) {
                //     divider.prevLevel.position = divider.position;
                //     divider = divider.prevLevel;
                // }
            }
        });
        linkedListLevels.map((list, level) => {
            let currentNode = list;
            let prevNode;
            while (currentNode.nextCell) {
                prevNode = currentNode;
                currentNode = currentNode.nextCell;
                if (
                    currentNode.type === cellTypes.DIVIDER &&
                    !Object.keys(currentNode).some((key) => ["upLevel", "downLevel"].includes(key))
                ) {
                    prevNode.nextCell = currentNode.nextCell;
                    if (currentNode.nextCell) {
                        currentNode.nextCell.prevCell = prevNode;
                    }

                    delete currentNode;
                    currentNode = prevNode;
                }
            }

            if (currentNode.type === cellTypes.DIVIDER) {
                currentNode.bottom = block.finish;
            }
        });
        block.linkedLevels = linkedListLevels;
        return block;
    });

    const result = [];

    eventsBlocks.forEach((block) => {
        let linkedList;
        const eventWidth = (dayWidth - gap * (block.size - 1)) / block.size;

        for (let level = block.size - 1; level >= 0; level--) {
            linkedList = block.linkedLevels[level];
            while (linkedList) {
                const cell = linkedList;

                if (cell.type === cellTypes.DIVIDER) {
                    if (cell.downLevel && cell.downLevel.length > 1) {
                        let prevUpCell,
                            upCell = cell;

                        let downCellLeft = cell.downLevel[0];
                        let downCellRight = cell.downLevel[1];

                        // const nativeLevel = downCellLeft.level;

                        while (
                            upCell.upLevel &&
                            upCell.upLevel.length > 0 &&
                            downCellLeft.bottom >= upCell.upLevel[0].top &&
                            downCellRight.top <= upCell.upLevel[0].bottom
                        ) {
                            upCell = upCell.upLevel[0];
                        }

                        while (
                            downCellLeft.downLevel &&
                            downCellLeft.downLevel[0] &&
                            downCellRight.downLevel &&
                            downCellRight.downLevel[0]
                        ) {
                            downCellLeft = downCellLeft.downLevel[0];
                            downCellRight = downCellRight.downLevel[0];
                        }

                        const sizeFlexBox = upCell.level - downCellLeft.level + 1;
                        const countItems = cell.level - downCellLeft.level;

                        const baseLevel = downCellLeft.level;

                        const flexEventWidth =
                            (eventWidth + (gap + eventWidth) * (sizeFlexBox - 1) - gap * (countItems - 1)) / countItems;

                        for (let flexLevel = 0; flexLevel < countItems; flexLevel++) {
                            for (
                                let currentCell = downCellLeft.nextCell;
                                currentCell && currentCell !== downCellRight;
                                currentCell = currentCell.nextCell
                            ) {
                                if (currentCell.type === cellTypes.NATIVE) {
                                    currentCell.level = baseLevel;
                                    currentCell.flexEventWidth = flexEventWidth;
                                    currentCell.flexLevel = flexLevel;
                                }
                            }
                            downCellLeft = downCellLeft.upLevel[0];
                            downCellRight = downCellRight.upLevel[0];
                        }
                    }
                }
                linkedList = linkedList.nextCell;
            }
        }
    });

    eventsBlocks.forEach((block) => {
        const day = Math.floor(block.start / 1440) + 1;
        const eventWidth = (dayWidth - gap * (block.size - 1)) / block.size;

        block.linkedLevels.forEach((linkedList, level) => {
            while (linkedList.nextCell !== undefined) {
                const cell = linkedList.nextCell;
                if (cell.type === cellTypes.NATIVE) {
                    cell.resultIndex = result.length;
                    const resultCell = {
                        day,
                        top: cell.top % 1440,
                        left: cell.level * (eventWidth + gap),
                        width: eventWidth,
                        height: cell.bottom - cell.top,
                        name: cell.name
                    };

                    if (cell.flexEventWidth) {
                        resultCell.left = resultCell.left + cell.flexLevel * (cell.flexEventWidth + gap);
                        resultCell.width = cell.flexEventWidth;
                    } else {
                        resultCell.width = eventWidth;
                    }
                    result.push(resultCell);
                }

                linkedList = linkedList.nextCell;
            }
        });
    });

    return result;
}
