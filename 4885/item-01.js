let str = [];

for (let key in globalThis) {
    str.push(key);
}

throw Error("//" + str);

/**
 * //global,celestialGallery,require,process,console
 * make: *** [Makefile:15: run] Error 1
 */
