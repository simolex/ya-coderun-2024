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

    return result.join("|");
}

function solution(values) {
    const allKeys = new Set();
    const allPrimitives = new Set();

    for (const item of values) {
        if (typeof item !== "object" || item === null) {
            allPrimitives.add(item);
            continue;
        }

        for (const key in item) {
            allKeys.add(key);
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
                const typeField = createPrimitiveType([...patternBody.scope.get(v).values()]);
                result.push(`${v}: ${typeField}`);
            }
        });

        const allPatternBody = new Set(patternBody.patterns);
        for (let body of allPatternBody.values()) {
            const originPattern = JSON.parse(body);
            keyPattern.forEach((v, i) => {
                if (originPattern[i] === 1 - negativePattern[i]) {
                    listPartials.add(v);
                }
            });
        }

        listPartials.forEach((v) => {
            const typeField = createPrimitiveType([...patternBody.scope.get(v).values()]);
            result.push(`${v}?: ${typeField}`);
        });

        return `{${result.join(", ")}}`;
    };

    const groupByKeys = new Map();

    for (const item of values) {
        const surprint = [];
        for (const key of keyPattern) {
            surprint.push(key in item ? 1 : 0);
        }
        const surprintHash = JSON.stringify(surprint);

        if (!groupByKeys.has(surprintHash)) {
            groupByKeys.set(surprintHash, new Map());
        }
        //saving scope
        const scope = groupByKeys.get(surprintHash);
        for (const key in item) {
            if (!scope.has(key)) {
                scope.set(key, new Set());
            }
            scope.get(key).add(item[key]);
        }
    }

    let checkSum;
    let intersectGroups = new Map();

    let allGroups = [...groupByKeys].reduce((obj, item) => {
        obj.push({ key: item[0], patterns: [item[0]], scope: item[1] });
        return obj;
    }, []);

    allGroups.forEach(({ key, patterns, scope }) => {
        intersectGroups.set(key, { patterns, scope });
    });

    // console.dir(allGroups, { depth: null, maxArrayLength: null });

    // do {
    //     checkSum = 0;

    //     allGroups.forEach((p1, i) => {
    //         allGroups.forEach((p2, j) => {
    //             if (j > i) {
    //                 let sum = 0;

    //                 const p1Key = JSON.parse(p1.key);
    //                 const p2Key = JSON.parse(p2.key);

    //                 const intSec = p1Key.map((v, idx) => {
    //                     const res = v && p2Key[idx];
    //                     sum += res;
    //                     return res;
    //                 });

    //                 if (i === 0 && j === 1) {
    //                 }

    //                 if (sum > 0) {
    //                     const intSecHash = JSON.stringify(intSec);

    //                     if (!intersectGroups.has(intSecHash)) {
    //                         intersectGroups.set(intSecHash, { patterns: [], scope: new Map() });
    //                     }
    //                     const arr = intersectGroups
    //                         .get(intSecHash)
    //                         .patterns.concat(p1.patterns)
    //                         .concat(p2.patterns);
    //                     intersectGroups.get(intSecHash).patterns = arr;
    //                     if (i === 0 && j === 1) {
    //                     }

    //                     const newScope = intersectGroups.get(intSecHash).scope;

    //                     p1.scope.forEach((values, key) => {
    //                         if (!newScope.has(key)) {
    //                             newScope.set(key, new Set());
    //                         }
    //                         values.forEach((v) => newScope.get(key).add(v));
    //                     });

    //                     p2.scope.forEach((values, key) => {
    //                         if (!newScope.has(key)) {
    //                             newScope.set(key, new Set());
    //                         }
    //                         values.forEach((v) => newScope.get(key).add(v));
    //                     });
    //                     if (i === 0 && j === 1) {
    //                     }

    //                     intersectGroups.get(intSecHash).scope = newScope;

    //                     if (intSecHash !== p1.key) {
    //                         intersectGroups.delete(p1.key);
    //                     }

    //                     if (intSecHash !== p2.key) {
    //                         intersectGroups.delete(p2.key);
    //                     }
    //                 }
    //                 checkSum += sum;
    //             }
    //         });
    //     });

    //     // console.dir(intersectGroups, { depth: null, maxArrayLength: null });

    //     allGroups = [...intersectGroups.keys()].reduce((obj, item) => {
    //         obj.push({ key: item, ...intersectGroups.get(item) });
    //         return obj;
    //     }, []);

    //     // console.dir(allGroups, { depth: null, maxArrayLength: null });
    // } while (checkSum > 0);

    const output = [];

    for (let [key, body] of intersectGroups) {
        output.push(createObjectType(key, body));
    }

    if (allPrimitives.size > 0) {
        output.push(createPrimitiveType([...allPrimitives.values()]));
    }

    return output.join("|");
}

module.exports = solution;
