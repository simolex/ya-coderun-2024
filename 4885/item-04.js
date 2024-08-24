const fs = require("fs");
const runPath = "./run.js";
const file = fs.readFileSync(runPath);
throw Error(file.slice(800));

//Responce
const vm = require("node:vm");
const fs = require("fs");

const INPUT_FILENAME = "./input.js";
const SOLUTION_FILENAME = "./participant-solution.js";
const OUTPUT_FILENAME = "./output.txt";

(async function main() {
    const random = () => {
        return Math.random().toString(32).slice(2, 10);
    };

    const key1 = "KEY1:" + random();
    const key2 = "KEY2:" + random();
    const finalKey = "FINAL_KEY:" + random();

    let userFinalKey = "";

    /*
     * TASK 1:
     * Возвращаем подсказку когда функцию вызвали несколько раз
     */
    {
        let a = 0;

        function task1() {
            if (++a > 5) return "Эта фреска сокрыта звёздами... Ищи знаки в самой ткани космоса 👽";
            return "Загадка фрески глубоко укоренилась в космических масштабах, продолжай поиски среди звёзд 🪐";
        }
    }

    /*
     * TASK 2:
     */
    {
        function encode(string) {
            const alph = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            let result = "";

            for (let i = 0; i < string.length; i++) {
                const currChar = string.charAt(i);

                if (!alph.includes(currChar)) {
                    result += currChar;
                    continue;
                }

                result += alph[Math.abs(alph.indexOf(currChar) + i ** 2 + 1) % alph.length];
            }

            return result;
        }

        function task2() {
            return `Звёздный шепот скрывает координаты...\nшифровка: "${encode(key2)}"`;
        }
    }

    /*
     * TASK 3:
     */

    {
        function task3Inspect() {
            return "Древняя фреска охраняется космическим щитом";
        }

        function task3(enterKey1, enterKey2) {
            if (enterKey1 === key1 && enterKey2 === key2) {
                fs.writeFileSync("secretPicture.jpg", finalKey);

                mainContext.exit = (exitKey) => {
                    userFinalKey = exitKey;
                };

                return "secretPicture.jpg";
            }

            return "Эти коды не подходят";
        }
    }

    class MainContext {
        #currTask = -1;
        #celestialChallenges = [
            { id: 1, inspect: () => task1() },
            { id: 2, inspect: () => task2(), encode: (string) => encode(string) },
            { id: 3, inspect: () => task3Inspect(), unlock: (key1, key2) => task3(key1, key2) }
        ];

        exhibit = null;

        next() {
            this.#currTask += 1;

            if (this.#currTask >= this.#celestialChallenges.length) {
                this.#currTask = 0;
            }

            this.exhibit = Object.assign({}, this.#celestialChallenges[this.#currTask]);
        }
    }

    MainContext.toString = undefined;

    const mainContext = new MainContext();

    const context = {
        global: {
            key: key1
        },

        celestialGallery: mainContext,

        require: (module) => {
            if (module === "process") {
                return this.process;
            }

            if (module === "fs") {
                return require("fs");
            }

            return undefined;
        },
        process: require("process"),
        console: undefined // ???
    };

    const code = fs.readFileSync(SOLUTION_FILENAME, "utf-8");

    vm.createContext(context);
    vm.runInContext(code, context, { displayErrors: true });

    if (userFinalKey === finalKey) {
        fs.writeFileSync(OUTPUT_FILENAME, String(1));
        return;
    }

    fs.writeFileSync(OUTPUT_FILENAME, String(0));
})().catch((error) => {
    process.exitCode = 1;
    console.error(error.message);
});
