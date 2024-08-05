function createPrimitiveType(list) {
    let result = [];

    const listString = [];
    const listNumber = [];

    for (const type of list) {
        if (typeof type === "string") {
            listString.push(`'${type}'`);
            continue;
        }

        if (typeof type === "number") {
            listNumber.push(`${type}`);
            continue;
        }

        if (type === null) {
            listNumber.push("null");
            continue;
        }

        result.push(typeof type);
    }

    if (listString.length > 0) {
        if (listString.length <= 5) {
            result.push(listString.join(" | "));
        } else {
            result.push("string");
        }
    }

    if (listNumber.length > 0) {
        if (listNumber.length <= 5) {
            result.push(listNumber.join(" | "));
        } else {
            result.push("number");
        }
    }

    return result.length > 0 ? result.join("|") : "";
}

function solution(records) {
    const allKeys = new Set();
    const allPrimitives = new Set();
    const indexAllObjects = [];

    records.forEach((item, index) => {
        if (typeof item !== "object" || item === null) {
            allPrimitives.add(item);
        } else {
            for (const key in item) {
                allKeys.add(key);
            }
            indexAllObjects.push(index);
        }
    });

    const keyPattern = [...allKeys.keys()];
    keyPattern.sort();

    const groupByKeys = new Map();
    indexAllObjects.forEach((idxObj) => {
        const currentObject = records[idxObj];
        const hashKey = keyPattern.filter((key) => key in currentObject).join("~|~");

        if (!groupByKeys.has(hashKey)) {
            groupByKeys.set(hashKey, new Map());
        }

        const propertySet = groupByKeys.get(hashKey);
        for (let property in currentObject) {
            if (!propertySet.has(property)) {
                propertySet.set(property, new Set());
            }
            propertySet.get(property).add(currentObject[property]);
        }
    });

    const resultType = [];
    groupByKeys.forEach((group) => {
        const currentType = [];

        group.forEach((valueSet, key) => {
            const typeField = createPrimitiveType([...valueSet.values()]);
            currentType.push(`${key}: ${typeField}`);
        });

        resultType.push(`{${currentType.join(", ")}}`);
    });

    resultType.push(createPrimitiveType([...allPrimitives.values()]));

    return resultType.filter((str) => str.length > 0).join("|");
}

module.exports = solution;
