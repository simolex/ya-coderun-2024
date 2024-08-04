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
        return Promise.resolve(TMObject)
            .then((TM) => _charToSignal(TM, letters[0]))
            .then((TM) =>
                fromTwoLetter.reduce((prev, l) => prev.then((TM) => pauseAndLetterPromise(TM, l)), Promise.resolve(TM))
            )
            .catch((e) => {
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
        .then((TM) => wordOfMessage.reduce((prev, word) => prev.then((TM) => _sendWord(TM, word)), Promise.resolve(TM)))
        .then((TM) => TM.transmitter.reset())
        .then(() => TMObject);
};

const loop = function (TMObject, stopResolve, isStart) {
    if (isStart) {
        TMObject["stopper"] = stopResolve;
    }

    return Promise.resolve(TMObject).then((TMObject) => {
        if (TMObject.messages.size() > 0) {
            const incomingMessage = TMObject.messages.pop();

            if (incomingMessage.length > 0) {
                TMObject.messages.pointerQueue++;
                return sendMessage(TMObject, incomingMessage).then(() => loop(TMObject));
            }
        }

        TMObject.stopper();
    });
};

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
            messages,
            existSession: true
        });
    }

    const TMPromises = [];

    if (transmitters.length > 0) {
        socket.onmessage = (e) => {
            messages.push(String(e.data));
            if (TMPromises.length < transmitters.length) {
                const currentTM = TMPromises.length;
                TMPromises[currentTM] = new Promise((stopResolve) => loop(listTMObjects[currentTM], stopResolve, true));
            }
        };

        socket.onclose = (e) => {
            listTMObjects.forEach((TM) => (TM.existSession = false));
        };
    }
};
