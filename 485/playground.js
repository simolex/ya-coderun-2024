// helpers

const objectThis = Symbol("objectThis");
const deletedSets = new Map();

const initTrigger = function (_objectThis, _deletedSets) {
    const objectThis = _objectThis;
    const deletedSets = _deletedSets;

    return function () {
        if (this[objectThis]) {
            let originalFields = deletedSets.get(this[objectThis]);

            //проверяем,что нас не скопировали
            if (this[objectThis] !== this) {
                originalFields = Object.assign({}, originalFields);
            }

            Object.assign(this, originalFields);

            if (deletedSets.has(this)) {
                deletedSets.delete(this);
            }
            this[objectThis] = undefined;
            return;
        }

        this[objectThis] = this;
        Object.defineProperty(this, objectThis, {
            enumerable: false,
        });

        const allKeys = Reflect.ownKeys(this);
        deletedSets.set(this, {});
        for (let i = 0; i < allKeys.length; i++) {
            if (typeof allKeys[i] !== "symbol" && /^\$/.test(allKeys[i]) === false) {
                deletedSets.get(this)[allKeys[i]] = this[allKeys[i]];
                delete this[allKeys[i]];
            }
        }
    };
};

const initGetter = function (_objectThis, _deletedSets) {
    const objectThis = _objectThis;
    const deletedSets = _deletedSets;

    return function (key) {
        let result = this[key];

        if (this[objectThis] !== this) {
            const originalFields = Object.assign({}, originalFields);
            deletedSets.set(this, originalFields);
        }

        if (!result && this[objectThis]) {
            result = deletedSets.get(this)[key];
        }
        return result;
    };
};

const trigger = initTrigger(objectThis, deletedSets);
const getter = initGetter(objectThis, deletedSets);

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
    $getter: getter,
};
artObject.$trigger();

// basic tests
console.log(artObject);
console.log(artObject["towers"]);
console.log("towers" in artObject); //-> false
console.log(artObject.$getter("towers")); //-> [ 'Oko', 'Neva' ]
console.log(artObject.$redRose); //-> 11101
console.log(artObject.$getTransports()); //-> [ 'Park Kultury', 'Delovoy Center', 'B', 'c910', '379' ]
