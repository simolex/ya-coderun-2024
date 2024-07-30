const ff = () => {
    const data = [
        "ijsoif+-+*-+kmasdligjuweijfsk9890qweasf",
        "*******jsadvkmasdligjuweijfsk9890qweasf",
        "ijsoifgjsadvkmasdli%^$^&%$#@*&890qweasf",
        "ijsoifgjsadvkmasdligjuweijf)()*&^&*%$^&",
    ];
    let count = data.length - 1;
    return function () {
        const result = { data: data[count] };
        if (count > 0) count--;
        return result;
    };
};
const fackFetch = ff();

function solution() {
    const API_URL = process.env.API_URL;
    const avaliableLetters = /[a-zA-Z0-9 ]+/g;

    console.log(API_URL);

    const RequestData = async () => {
        try {
            const resp = await fetch(API_URL);
            if (resp.ok) {
                return await resp.json();
            }
        } catch (e) {
            return { data: "" };
        }
    };
    // const RequestData = () => fackFetch();

    let match;
    let result = [];
    let lengthString = 0;

    const mergeResult = (at, line) => {
        const splitLine = line.split("");

        for (let i = 0; i < splitLine.length; i++) {
            if (result[i + at] !== undefined && result[i + at] !== splitLine[i]) {
                throw "ehuuuu";
            }
            result[i + at] = splitLine[i];
        }
    };

    const checkString = () => result.reduce((sum, v) => (v ? sum + 1 : sum), 0) < lengthString;

    const getData = (resp, key = "data") => (resp !== null ? (resp[key] ? resp[key] : "") : "");
    do {
        try {
            const r = RequestData();
            const responce = getData(r);
            if (responce.length > lengthString) {
                lengthString = responce.length;
            }
            console.log(responce);
            while ((match = avaliableLetters.exec(responce)) !== null) {
                mergeResult(match.index, match[0]);
            }
        } catch (e) {
            throw new Error(e);
        }
    } while (checkString());

    return result.join("");
}

module.exports = solution;

console.log("result", solution());
