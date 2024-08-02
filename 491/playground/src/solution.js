const cyrToLat = {
    A: "А",
    B: "Б",
    W: "В",
    G: "Г",
    D: "Д",
    E: "Е",
    V: "Ж",
    Z: "З",
    I: "И",
    J: "Й",
    K: "К",
    L: "Л",
    M: "М",
    N: "Н",
    O: "О",
    P: "П",
    R: "Р",
    S: "С",
    T: "Т",
    U: "У",
    F: "Ф",
    H: "Х",
    C: "Ц",
    Q: "Щ",
    X: "Ь",
    X: "Ъ",
    Y: "Ы",
};
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
    let letterUpped = letter.toUpperCase();

    if (cyrToLat[letterUpped]) {
        letterUpped = cyrToLat[letterUpped];
    }

    let codeMorze = alphabetMorze[letterUpped];
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
    return new Promise((res) => {
        setTimeout(res, ms, "true");
    });
};

function queue(fnArray, onError, initialData) {
    return fnArray.reduce((p, f) => p.then(f), Promise.resolve(initialData)).catch(onError);
}

class Queue {
    constructor() {
        this.queue = [];
        this.frontPtr = 0;
    }

    push(n) {
        this.queue.push(n);
        return "ok";
    }

    pop() {
        if (this.size() > 0) {
            return this.queue[this.frontPtr++];
        }
        return "error";
    }

    size() {
        return this.queue.length - this.frontPtr;
    }
}

class TransmitterUI {
    needWork = true;
    constructor(
        transmitter,
        { shortSignalPause, longSignalPause, charPause, wordPause },
        messageQueue
    ) {
        this.messageQueue = messageQueue;
        this.transmitter = transmitter;

        this.shortPausePromise = shortSignalPause;
        this.longPausePromise = longSignalPause;
        this.charPausePromise = charPause;
        this.wordPause = wordPause;

        this.actions = {
            short: () => [
                () => this._startSignal(),
                () => setPause(this.shortPausePromise),
                () => this._stopSignal(),
            ],

            long: () => [
                () => this._startSignal(),
                () => setPause(this.longPausePromise),
                () => this._stopSignal(),
            ],
            pause: () => [() => setPause(this.charPausePromise)],
        };
    }

    stopWork() {
        this.needWork = false;
    }

    _startSignal() {
        return new Promise((res, rej) => {
            this.transmitter.taskRunner(() =>
                Promise.all([this.transmitter.F(), this.transmitter.D()]).then(res).catch(rej)
            );
        });
    }
    _stopSignal() {
        return new Promise((res, rej) => {
            this.transmitter.taskRunner(() =>
                Promise.all([this.transmitter.B(), this.transmitter.U()]).then(res).catch(rej)
            );
        });
    }

    _charToSignal(letter) {
        const tokens = charToToken(letter);
        const actions = tokens.reduce((p, t) => p.concat(this.actions[t]()), []);

        return queue(actions, "", []);
    }

    async _sendWord(word) {
        const letters = word.trim().split("");
        let wordSended = false;

        let task; // = await setPause(this.wordPause);
        while (!wordSended) {
            try {
                if (letters.length > 0) {
                    task = await this._charToSignal(letters[0]);
                }
                for (let i = 1; i < letters.length; i++) {
                    task = await setPause(this.charPausePromise);
                    task = await this._charToSignal(letters[i]);
                }
                wordSended = true;
            } catch (e) {
                wordSended = false;
            }
        }
        task = await setPause(this.wordPause);

        return task;
    }

    async sendMessage(msg) {
        msg = msg
            .trim()
            .split(" ")
            .filter((word) => word.length > 0);

        let task = await this.transmitter.init();
        task = await setPause(this.wordPause);

        for (let word of msg) {
            task = await this._sendWord(word);
        }

        task = await this.transmitter.reset();

        return task;
    }

    async loop(stop, isStart) {
        while (this.messageQueue.size() === 0 && this.needWork) {
            //pause
        }

        if (this.messageQueue.size() > 0) {
            const incomingMessage = this.messageQueue.pop();

            if (incomingMessage.length > 0) {
                this.pointerQueue++;
                this.sendMessage(incomingMessage);
            }
        }

        if (!this.needWork) {
            return this.stopper();
        }
        console.log("tick");

        if (isStart) {
            this.stopper = stop;
        }
    }
}

module.exports = async function result(
    socket,
    transmitters = [],
    { shortSignalPause = 500, longSignalPause = 1000, charPause = 200, wordPause = 2000 }
) {
    const messages = new Queue();

    UIs = [];
    for (let transmitter of transmitters) {
        const ui = new TransmitterUI(
            transmitter,
            {
                shortSignalPause,
                longSignalPause,
                charPause,
                wordPause,
            },
            messages
        );

        UIs.push(ui);
    }

    if (transmitters.length > 0) {
        socket.onmessage = async (e) => {
            messages.push(String(e.data));
        };
        socket.onclose = async (e) => {
            UIs.forEach((ui) => ui.stopWork());
        };
    }

    const w = UIs.map((ui) => new Promise((res) => ui.loop(res, true)));
    console.log(w);
    await Promise.all(w);
    console.log("finish");
};
