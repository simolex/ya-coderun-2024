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

    return result.join(" | ");
}

function solution(values) {
    const allKeys = new Map();
    const allPrimitives = new Set();

    for (const item of values) {
        if (typeof item !== "object" || item === null) {
            allPrimitives.add(item);
            continue;
        }

        for (const key in item) {
            if (!allKeys.has(key)) {
                allKeys.set(key, new Set());
            }
            allKeys.get(key).add(item[key]);
        }
    }

    const keyPattern = [...allKeys.keys()];
    keyPattern.sort();

    const createObjectType = (patternKey, patternBody) => {
        const result = [];
        const negativePattern = JSON.parse(patternKey);
        const listPartials = new Set();

        keyPattern.forEach((v, i) => {
            if (negativePattern[i] === 1) {
                const typeField = createPrimitiveType([...allKeys.get(v).values()]);
                result.push(`${v}: ${typeField}`);
            }
        });

        patternBody = new Set(patternBody);
        for (let body of patternBody.values()) {
            const originPattern = JSON.parse(body);
            keyPattern.forEach((v, i) => {
                if (originPattern[i] === 1 - negativePattern[i]) {
                    listPartials.add(v);
                }
            });
        }

        listPartials.forEach((v) => {
            const typeField = createPrimitiveType([...allKeys.get(v).values()]);
            result.push(`${v}?: ${typeField}`);
        });
        return `{${result.join(", ")}}`;
    };

    const groupByKeys = new Set();

    for (const item of values) {
        const surprint = [];
        for (const key of keyPattern) {
            surprint.push(key in item ? 1 : 0);
        }
        const surprintHash = JSON.stringify(surprint);
        groupByKeys.add(surprintHash);
    }

    let checkSum;
    let intersectGroups = new Map();

    let allGroups = [...groupByKeys].reduce((obj, item) => {
        obj.push({ key: item, patterns: [item] });
        return obj;
    }, []);

    allGroups.forEach((v) => {
        intersectGroups.set(v.key, v.patterns);
    });

    do {
        checkSum = 0;

        allGroups.forEach((p1, i) => {
            allGroups.forEach((p2, j) => {
                if (j > i) {
                    let sum = 0;

                    const p1Key = JSON.parse(p1.key);
                    const p2Key = JSON.parse(p2.key);

                    const intSec = p1Key.map((v, idx) => {
                        const res = v && p2Key[idx];
                        sum += res;
                        return res;
                    });

                    if (sum > 0) {
                        const intSecHash = JSON.stringify(intSec);

                        if (!intersectGroups.has(intSecHash)) {
                            intersectGroups.set(intSecHash, []);
                        }
                        const arr = intersectGroups
                            .get(intSecHash)
                            .concat(p1.patterns)
                            .concat(p2.patterns);
                        intersectGroups.set(intSecHash, arr);

                        if (intSecHash !== p1.key) {
                            intersectGroups.delete(p1.key);
                        }

                        if (intSecHash !== p2.key) {
                            intersectGroups.delete(p2.key);
                        }
                    }
                    checkSum += sum;
                }
            });
        });

        allGroups = [...intersectGroups.keys()].reduce((obj, item) => {
            obj.push({ key: item, patterns: intersectGroups.get(item) });
            return obj;
        }, []);
    } while (checkSum > 0);

    const output = [];

    for (let [key, body] of intersectGroups) {
        output.push(createObjectType(key, body));
    }

    if (allPrimitives.size > 0) {
        output.push(createPrimitiveType([...allPrimitives.values()]));
    }

    return output.join(" | ");
}

module.exports = solution;
