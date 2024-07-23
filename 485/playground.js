// helpers

const trigger = function () {
    const objectThis = Symbol.for("objectThis");

    if (this[objectThis]) {
        let originalFields = this[objectThis];

        Object.assign(this, originalFields);

        delete this[objectThis];
        return;
    }

    this[objectThis] = {};

    const allKeys = Reflect.ownKeys(this);
    for (let i = 0; i < allKeys.length; i++) {
        if (typeof allKeys[i] !== "symbol" && /^\$/.test(allKeys[i]) === false) {
            this[objectThis][allKeys[i]] = this[allKeys[i]];
            delete this[allKeys[i]];
        }
    }
};

const getter = function (key) {
    const objectThis = Symbol.for("objectThis");
    let result = this[key];

    if (!result && this[objectThis]) {
        result = this[objectThis][key];
    }
    return result;
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
