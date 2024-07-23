setInterval(() => {
    const lastChatUpdate = +JSON.parse(localStorage.getItem("lastChatUpdate"));

    if (chat && (!chat.lastUpdate || chat.lastUpdate !== lastChatUpdate)) {
        chat.lastUpdate = lastChatUpdate;

        const lcMessages = JSON.parse(localStorage.getItem("chatMessage") || "{}");
        chat.renderMessages(lcMessages);
    }
}, 300);

const typeActions = {
    new: function (message, allMessage) {
        const { chatId } = message;
        if (!allMessage[chatId]) {
            allMessage[chatId] = [];
        }

        allMessage[chatId].push(message);
    },
    updated: function (message, allMessage) {
        const { id, chatId, body } = message;
        if (!allMessage[chatId]) {
            allMessage[chatId] = [];
            return;
        }
        allMessage[chatId].forEach((msg, i) => {
            if (id === msg.id) {
                allMessage[chatId][i].body = body;
            }
        });
    },
    deleted: function (message, allMessage) {
        const { id, chatId } = message;
        if (!allMessage[chatId]) {
            allMessage[chatId] = [];
            return;
        }

        allMessage[chatId] = allMessage[chatId].filter((msg) => msg.id !== id);
    },
};

function callback(responce) {
    let lastUpdate = +JSON.parse(localStorage.getItem("lastChatUpdate") || "0");
    const waitingStack = JSON.parse(localStorage.getItem("waitingStack") || "[]");
    const lcMessages = JSON.parse(localStorage.getItem("chatMessage") || "{}");

    if (lastUpdate + 1 !== responce.id) {
        waitingStack.push(responce);
        waitingStack.sort((a, b) => b.id - a.id);
        localStorage.setItem("waitingStack", JSON.stringify(waitingStack));
        return;
    }

    lastUpdate++;
    const { id, type, message } = responce;

    if (typeActions[type]) {
        typeActions[type](message, lcMessages);
    }

    while (waitingStack.length > 0 && lastUpdate + 1 === waitingStack[waitingStack.length - 1].id) {
        const { id, type, message } = waitingStack.pop();

        if (typeActions[type]) {
            typeActions[type](message, lcMessages);
        }
        lastUpdate++;
    }

    localStorage.setItem("chatMessage", JSON.stringify(lcMessages));
    localStorage.setItem("lastChatUpdate", JSON.stringify(lastUpdate));
    localStorage.setItem("waitingStack", JSON.stringify(waitingStack));
}

// инициализация класса чата с вашим коллбеком
const chat = new Chat(callback);
