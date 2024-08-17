const objectKeyBy = (arr, keyName) => arr.reduce((result, item) => {
    result[item[keyName]] = item;
    return result;
}, {});

const objectGroupBy = (arr, keyName) => arr.reduce((result, item) => {
    result[item[keyName]] ||= [];
    result[item[keyName]].push(item);

    return result;
}, {});

class Heap {
    constructor(compareFn) {
        this.storage = [];
        this.compareFn = compareFn;
    }

    add(value) {
        this.storage.push(value);
        this.#bubbleUp(this.storage.length - 1);
    }

    peek() {
        if (this.storage.length === 0) return undefined;
        return this.storage[0];
    }

    pop() {
        if (this.storage.length === 0) return undefined;
        this.#swap(0, this.storage.length - 1);
        const result = this.storage.pop();
        this.#siftDown(0);
        return result;
    }

    #bubbleUp(index) {
        let parent = Math.floor((index - 1) / 2);
        while (index > 0 && (this.compareFn(this.storage[parent], this.storage[index]) < 0)) {
            this.#swap(parent, index);
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }
    }

    #siftDown(index) {
        let child = 2 * index + 1;
        while (child < this.storage.length) {
            const rightChild = child + 1;
            if (rightChild < this.storage.length && (this.compareFn(this.storage[child], this.storage[rightChild]) < 0)) {
                child = rightChild;
            }
            if (this.compareFn(this.storage[child], this.storage[index]) < 0) break;
            this.#swap(child, index);
            index = child;
            child = 2 * index + 1;
        }
    }
    
    #swap(indexA, indexB) {
        [this.storage[indexA], this.storage[indexB]] = [this.storage[indexB], this.storage[indexA]];
    }
}
