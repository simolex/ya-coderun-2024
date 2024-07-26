const alphabetMorze = {
    А: ".-",
    Б: "-...",
    В: ".--",
    Г: "--.",
    Д: "-..",
    Е: ".",
    Ё: ".",
    Ж: "...-",
    З: "--..",
    И: "..",
    Й: ".---",
    К: "-.-",
    Л: ".-..",
    М: "--",
    Н: "-.",
    О: "---",
    П: ".--.",
    Р: ".-.",
    С: "...",
    Т: "-",
    У: "..-",
    Ф: "..-.",
    Х: "....",
    Ц: "-.-.",
    Ч: "---.",
    Ш: "----",
    Щ: "--.-",
    Ь: "-..-",
    Ъ: "-..-",
    Ы: "-.--",
    Э: "..-..",
    Ю: "..--",
    Я: ".-.-",
    1: ".----",
    2: "..---",
    3: "…--",
    4: "….-",
    5: "…..",
    6: "-….",
    7: "--…",
    8: "---..",
    9: "----.",
    0: "-----"
};

const charToToken = (letter) => {
    const codeMorze = alphabetMorze[letter.toUpperCase()];
    if (!codeMorze) {
        return [];
    }
    return codeMorze
        .split("")
        .map((v) => (v === "." ? "short" : "long"))
        .join(" pause ")
        .split(" ");
};

const setPause = (_ms) => {
    const ms = _ms;
    console.log(_ms);
    return new Promise((res) => {
        setTimeout(res, ms, "true");
    });
};

function queue(fnArray, onError, initialData) {
    return fnArray
        .reduce((p, f) => {
            console.log(p);
            return p.then(f);
        }, Promise.resolve(initialData))
        .catch(onError);
}

class TransmitterUI {
    constructor(transmitter, { shortSignalPause, longSignalPause, charPause, wordPause }) {
        this.transmitter = transmitter;

        this.shortPausePromise = shortSignalPause;
        this.longPausePromise = longSignalPause;
        this.charPausePromise = charPause;
        this.wordPause = wordPause;

        this.actions = {
            short: () => [() => this._startSignal(), () => setPause(this.shortPausePromise), () => this._stopSignal()],

            long: () => [
                () => () => this._startSignal(),
                () => () => setPause(this.longSignalPause),
                () => () => this._stopSignal()
            ],
            pause: () => [() => () => setPause(this.charPause)]
        };
    }

    _startSignal() {
        return new Promise((res, rej) => {
            this.transmitter.taskRunner(async () => {
                try {
                    const p = await Promise.all([this.transmitter.F(), this.transmitter.D()]);
                    res(p);
                } catch (e) {
                    rej(e);
                }
            });
        });
    }

    _stopSignal() {
        return new Promise((res, rej) => {
            this.transmitter.taskRunner(() => {
                Promise.all([this.transmitter.B(), this.transmitter.U()]).then(res).catch(rej);
            });
        });
    }

    async _charToSignal(letter) {
        const tokens = charToToken(letter);
        console.log(tokens);
        const t = tokens.reduce((p, t) => p.concat(this.actions[t]()), []);
        // .filter((f) => typeof f === "function");
        console.log(t);

        queue(t, "", []);

        //return Promise.all(m).catch((e) => console.error(e));
    }
}

module.exports = async function result(
    socket,
    transmitters = [],
    { shortSignalPause = 500, longSignalPause = 1000, charPause = 200, wordPause = 2000 }
) {
    const ui = new TransmitterUI(transmitters[0], {
        shortSignalPause,
        longSignalPause,
        charPause,
        wordPause
    });
    await ui.transmitter.init().then(() => ui._charToSignal("ф"));
};
