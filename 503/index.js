/**
 *
 * type OnMessage<T> = (message: T) => void;
 * type AddTimeout<T> = (chatName: string, timeoutMs: number) => OnMessage<T>;
 * type RemoveTimeout = (chatName: string) => void;
 * type SummaryFn<T> = (data: Record<string, T>) => void;
 *
 * function solution<T>(
 *  sendNotification: SummaryFn<T>
 * ): [AddTimeout<T>, RemoveTimeout<T>] {
 *  // your code here
 * }
 */

function solution(callback) {
    let chats = {};
    let timers = {};
    let idMessage = 0;
    let allTimeouts = {};

    const AddTimeout = (chatName, timeoutMs) => {
        const thisChatName = chatName;

        allTimeouts[chatName] = timeoutMs;

        if (timeoutMs > 0) {
            timers[thisChatName] = new Map();
        }

        const onMessage = (msg) => {
            if (allTimeouts[thisChatName] > 0) {
                chats[thisChatName] = msg;

                idMessage++;

                const hTimeout = setTimeout(
                    sendNotification,
                    allTimeouts[thisChatName],
                    thisChatName,
                    idMessage
                );
                timers[thisChatName].set(idMessage, hTimeout);
            }
        };

        return onMessage;
    };

    const RemoveTimeout = (chatName) => {
        delete chats[chatName];

        if (timers[chatName]) {
            timers[chatName].forEach((handler) => clearTimeout(handler));

            delete timers[chatName];

            allTimeouts[chatName] = 0;
            // sendNotification(); ///TODO
        }
    };

    const sendNotification = (chatName, idMessage) => {
        if (timers[chatName]) {
            timers[chatName].delete(idMessage);
        }

        if (
            Object.keys(timers).reduce((count, name) => count + timers[name].size, 0) === 0
            //&& Object.keys(chats) > 0 /// TODO
        ) {
            callback(chats);
            chats = {};
        }
    };

    return [AddTimeout, RemoveTimeout];
}

module.exports = solution;
