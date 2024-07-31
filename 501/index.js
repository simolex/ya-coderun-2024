module.exports = {
    get(target, property, receiver) {
        const targetValue = Reflect.get(target, property, receiver);

        if (property in target) {
            if (property.charAt(0) === "_") {
                return false;
            }

            if (typeof targetValue === "function") {
                if (property === "phone") {
                    return targetValue.apply(target, arguments);
                }
                return function () {
                    return targetValue.apply(target, arguments);
                };
            }
            return targetValue.value;
        }
        return false;
    },

    set(target, property, value, receiver) {
        if (property in target) {
            if (property.charAt(0) === "_") {
                return false;
            }
            if (typeof target[property] === "function") {
                return false;
            }

            if (property === "phone" && typeof value === target["_phone"].type) {
                target["_phone"].value = value;
                return true;
            }

            if (typeof target[property] !== "function" && typeof value === target[property].type) {
                target[property].value = value;
                return true;
            }
        }

        return false;
    },

    deleteProperty(target, property) {
        if (property in target) {
            if (property.charAt(0) === "_") {
                return false;
            }

            if (typeof target[property] === "function") {
                return false;
            }
        }

        Reflect.deleteProperty(target, property);
        return true;
    },

    has(target, property) {
        if (property.charAt(0) === "_") {
            return false;
        }
        return Reflect.has((target, property));
    },

    ownKeys(target) {
        return Object.keys(target).filter((key) => key.charAt(0) !== "_");
    },

    apply(target, thisArg, argumentsList) {
        Reflect.apply(target, thisArg, argumentsList);
    }
};
