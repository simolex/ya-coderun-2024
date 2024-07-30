// const ff = () => {
//     const data = [
//         "ijsoif+-+*-+kmasdligjuweijfsk9890qweasf",
//         "*******jsadvkmasdligjuweijfsk9890qweasf",
//         "ijsoifgjsadvkmasdli%^$^&%$#@*&890qweasf",
//         "ijsoifgjsadvkmasdligjuweijf)()*&^&*%$^&"
//     ];
//     let count = data.length - 1;
//     return function () {
//         const result = { data: data[count] };
//         if (count > 0) count--;
//         return result;
//     };
// };
// const fackFetch = ff();

async function solution() {
    // const API_URL = process.env.API_URL;
    const avaliableLetters = /[a-zA-Z0-9]+/g;

    let match;
    let result = [];
    let lengthString = 0;

    const mergeResult = (at, line) => {
        const splitLine = line.split("");

        for (let i = 0; i < splitLine.length; i++) {
            result[i + at] = splitLine[i];
        }
    };

    const checkString = () => result.reduce((sum, v) => (v ? sum + 1 : sum), 0) < lengthString;

    let resp;
    let json;
    let responseStr;
    do {
        resp = await fetch(API_URL).then((resp) => resp.json());
        json = resp.json();

        responseStr = json.data;

        if (responseStr.length > lengthString) {
            lengthString = responseStr.length;
        }

        while ((match = avaliableLetters.exec(responseStr)) !== null) {
            mergeResult(match.index, match[0]);
        }
    } while (checkString());

    return result.join("");
}

module.exports = solution;

console.log("result", solution());
