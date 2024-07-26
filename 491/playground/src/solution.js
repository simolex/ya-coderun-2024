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
    0: "-----",
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
    return () =>
        new Promise((res) => {
            setTimeout(res, ms);
        });
};

class TransmitterUI {
    actions = {
        short: () => [this._startSignal, this.shortPausePromise, this._stopSignal],
        // await this._startSignal();
        // await this.shortPausePromise();
        // await this._stopSignal();
        // },
        long: () => Promise.race([this._startSignal, this.longPausePromise, this._stopSignal]),
        pause: () => setPause(this.charPause),
    };

    constructor(transmitter, { shortSignalPause, longSignalPause, charPause, wordPause }) {
        this.transmitter = transmitter;

        this.shortPausePromise = setPause(shortSignalPause);
        this.longPausePromise = setPause(longSignalPause);
        this.charPausePromise = setPause(charPause);
        this.wordPause = wordPause;
    }

    _startSignal() {
        return this.transmitter.taskRunner(() =>
            Promise.resolve.then(() => {
                this.transmitter.F();
                this.transmitter.D();
                return;
            })
        );

        // new Promise((res, rej) =>
        //     this.transmitter
        //         .taskRunner()
        //         .then((resp) => res(resp))
        //         .catch((err) => rej(err))
        // );
    }

    _stopSignal() {
        return new Promise((res, rej) =>
            this.transmitter
                .taskRunner(Promise.all([this.transmitter.B, this.transmitter.U]))
                .then((resp) => res(resp))
                .catch((err) => rej(err))
        );
        // return this.transmitter.taskRunner(Promise.all([this.transmitter.B, this.transmitter.U]));
    }

    async _charToSignal(letter) {
        const tokens = charToToken(letter);
        console.log(tokens);
        const m = tokens.map((t) => this.actions[t]());
        console.log(m);
        return Promise.race(m);
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
        wordPause,
    });
    await ui.transmitter.init().then(() => ui._charToSignal("ф"));
};
