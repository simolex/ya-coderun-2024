// helpers

const deletedKeys = Symbol.for("deleted");
const hiddenIn = Symbol.for("isHidden");
const deletedSets = new Map();

const initTrigger = function (_deletedKeys, _hiddenIn) {
    const deletedKeys = _deletedKeys;
    const hiddenIn = _hiddenIn;
    return function () {
        console.log(Symbol.keyFor(deletedKeys));
        console.log(Symbol.keyFor(hiddenIn));
    };
};

const trigger = initTrigger(deletedKeys, hiddenIn);
console.log(trigger);

const trigger_ = function () {
    // Object.prototype.hasOwn = function () {
    //     return false;
    // };
    if (this[Symbol.for("deleted")] === undefined) {
        this[Symbol.for("deleted")] = deletedSets;
        if (this[isHidden]) {
        }
    }
    const allKeys = Reflect.ownKeys(this);
    for (let i = 0; i < allKeys.length; i++) {
        if (/^\$/.test(allKeys[i]) === false) {
            const gettedDescriptor = Object.getOwnPropertyDescriptor(this, allKeys[i]);
            const gettedEnumerable = gettedDescriptor.enumerable;
            console.log(allKeys[i], gettedEnumerable);
            Object.defineProperty(this, allKeys[i], {
                enumerable: gettedEnumerable === undefined ? false : !gettedEnumerable,
                configurable: gettedEnumerable === undefined ? false : !gettedEnumerable,
                writable: gettedEnumerable === undefined ? false : !gettedEnumerable
            });
            console.log(this.propertyIsEnumerable(allKeys[i]));
        }
    }
};
const getter = function (key) {
    const desc = Object.getOwnPropertyDescriptor(this, key);
    return desc ? desc.value : undefined;
};

module.exports = { trigger, getter };

// example

const artObject = {
    $redRose: 11101,
    metroStations: ["Park Kultury", "Delovoy Center"],
    busStops: ["B", "c910", "379"],
    $city: 10101,
    towers: ["Oko", "Neva"],
    $getTransports() {
        const stations = this.$getter("metroStations");
        const stops = this.$getter("busStops");
        return [...stations, ...stops];
    },
    $trigger: trigger,
    $getter: getter
};

artObject.$trigger();

// basic tests
console.log(artObject["towers"]);
console.log("towers" in artObject); //-> false
console.log(artObject.$getter("towers")); //-> [ 'Oko', 'Neva' ]
console.log(artObject.$redRose); //-> 11101
console.log(artObject.$getTransports()); //-> [ 'Park Kultury', 'Delovoy Center', 'B', 'c910', '379' ]
