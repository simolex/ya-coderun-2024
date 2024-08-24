const fs = require("fs");
const runPath = "./secretPicture.jpg";

globalThis.celestialGallery.next();
globalThis.celestialGallery.next();
const key_1 = globalThis.global.key;

const code = globalThis.celestialGallery.exhibit.inspect().split(`"`)[1];
const alph = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let key_2 = "";

for (let i = 0; i < code.length; i++) {
    const currChar = code.charAt(i);

    if (!alph.includes(currChar)) {
        key_2 += currChar;
        continue;
    }

    key_2 += alph[Math.abs(3 * alph.length + alph.indexOf(currChar) - i ** 2 - 1) % alph.length];
}

globalThis.celestialGallery.next();

const fileName = globalThis.celestialGallery.exhibit.unlock(key_1, key_2);

globalThis.celestialGallery.exit(fs.readFileSync(fileName, "utf-8"));
