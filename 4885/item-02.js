let str = [];

for (let key in globalThis) {
    str.push(key);
}

throw Error("//" + JSON.stringify(celestialGallery));

/**
 * //{"exhibit":null}
 * make: *** [Makefile:15: run] Error 1
 */
