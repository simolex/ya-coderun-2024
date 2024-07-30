const patchFetch = require("./patchFetch.js");
patchFetch(142);

const wait = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const getResult = (num) => {
    const replyDelay = (num) => {
        return wait(100).then(() => getResult(num));
    };
    const reply = (num) => {
        return wait(0).then(() => getResult(num));
    };

    return fetch(`https://game.yandex?value=${num}`)
        .catch(console.log)
        .then((resp) => {
            if (resp.stautus === 429) {
                return replyDelay(num);
            }
            if (resp.status === 403) {
                return { result: "finish", body: resp };
            }
            if (resp.status !== 200) {
                return reply(num);
            }
            return resp.json();
        });
};

module.exports = async () => {
    const INIT_VALUE = 2 ** 53;

    let l = 0;
    let r = INIT_VALUE;
    let m;

    while (l < r) {
        m = l + Math.floor((r - l) / 2);
        const res = await getResult(m);
        switch (res.result) {
            case "less":
                r = m;
                break;
            case "more":
                l = m + 1;
                break;
            case "equal":
                return m;
            default:
                return res.body;
        }
    }
};
