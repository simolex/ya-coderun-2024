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
    Y: "Ы"
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
    0: "-----"
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

const setPause = (ms, ...params) => {
    return new Promise((res) => {
        setTimeout(res, ms, ...params);
    });
};

// function queuePromises(fnArray, initialPromise) {
//     return ;
// }

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

const actions = {
    short: [
        (TMObject) => _startSignal(TMObject),
        (TMObject) => setPause(TMObject.params.shortSignalPause, TMObject),
        (TMObject) => _stopSignal(TMObject)
    ],
    long: [
        (TMObject) => _startSignal(TMObject),
        (TMObject) => setPause(TMObject.params.longSignalPause, TMObject),
        (TMObject) => _stopSignal(TMObject)
    ],
    pause: [(TMObject) => setPause(TMObject.params.charPause, TMObject)]
};

const _startSignal = function (TMObject) {
    return new Promise((resolve, rej) => {
        TMObject.transmitter.taskRunner(() =>
            Promise.all([TMObject.transmitter.F(), TMObject.transmitter.D()])
                .then(() => resolve(TMObject))
                .catch(rej)
        );
    });
};
const _stopSignal = function (TMObject) {
    return new Promise((resolve, rej) => {
        TMObject.transmitter.taskRunner(() =>
            Promise.all([TMObject.transmitter.B(), TMObject.transmitter.U()])
                .then(() => resolve(TMObject))
                .catch(rej)
        );
    });
};

const _charToSignal = function (TMObject, letter) {
    console.log("_charToSignal", TMObject, letter); //DEBUG
    const tokens = charToToken(letter);

    const actionPromises = tokens.reduce((resolve, token) => resolve.concat(actions[token]), []);
    return actionPromises.reduce((prev, f) => prev.then((TM) => f(TM)), Promise.resolve(TMObject));
};

const _sendWord = function (TMObject, word) {
    const letters = word.trim().split("");
    const fromTwoLetter = letters.slice(1);

    const pauseAndLetterPromise = (TM, letter) =>
        Promise.resolve(TM)
            .then((TM) => setPause(TM.params.charPause, TM))
            .then((TM) => _charToSignal(TM, letter));

    const trySendWord = function (TMObject, letters) {
        console.log("try", TMObject, letters); //DEBUG
        return Promise.resolve(TMObject)
            .then((TM) => _charToSignal(TM, letters[0]))
            .then((TM) =>
                fromTwoLetter.reduce((prev, l) => prev.then((TM) => pauseAndLetterPromise(TM, l)), Promise.resolve(TM))
            )
            .catch((e) => {
                console.error("error", e); //DEBUG
                return trySendWord(TMObject, letters);
            });
    };

    return trySendWord(TMObject, letters).then((TM) => setPause(TM.params.wordPause, TM));
};

const sendMessage = function (TMObject, message) {
    const wordOfMessage = message
        .trim()
        .split(" ")
        .filter((word) => word.length > 0);

    return TMObject.transmitter
        .init()
        .then(() => TMObject)
        .then((TM) => setPause(TM.params.wordPause, TM))
        .then((TM) => wordOfMessage.reduce((prev, word) => prev.then((TM) => _sendWord(TM, word)), Promise.resolve(TM)))
        .then((TM) => setPause(TM.params.wordPause, TM))
        .then((TM) => TM.transmitter.reset());
};

const loop = async function (TMObject, stop, isStart) {
    while (transmitter.messageQueue.size() === 0 && this.needWork) {
        //pause
    }

    if (transmitter.messageQueue.size() > 0) {
        const incomingMessage = transmitter.messageQueue.pop();

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
};
// }

module.exports = async function result(
    socket,
    transmitters = [],
    { shortSignalPause = 500, longSignalPause = 1000, charPause = 200, wordPause = 2000 }
) {
    const messages = new Queue();

    const listTMObjects = [];
    for (let transmitter of transmitters) {
        listTMObjects.push({
            transmitter,
            params: {
                shortSignalPause,
                longSignalPause,
                charPause,
                wordPause
            },
            messages
        });
    }

    if (transmitters.length > 0) {
        socket.onmessage = async (e) => {
            messages.push(String(e.data));
        };

        socket.onclose = async (e) => {
            UIs.forEach((ui) => ui.stopWork());
        };
    }

    const result = sendMessage(transmitterObject, "hello word").then(console.log);
    console.log(result);

    // const w = UIs.map((ui) => new Promise((res) => ui.loop(res, true)));
    // console.log(w);
    // await Promise.all(w);
    // console.log("finish");
};
