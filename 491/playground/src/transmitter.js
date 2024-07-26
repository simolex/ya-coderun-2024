import { TransmitterPresenter } from "./utils/transmitterPresenter";

const STATUSES = {
    off: "OFF",
    inited: "INITED",
    working: "WORKING",
};

export class Transmitter {
    constructor(id, percent = 100) {
        this.resultContainer = document.querySelector("#result");
        this.percent = percent;
        const el = document.createElement("div");
        el.textContent = `Передатчик ${id}: `;
        el.id = `id_result_${id}`;
        this.resultContainer.appendChild(el);
        this.result = el;
        this.id = id;
        this.status = STATUSES.off;
        this.isTaskRunning = false;
        this.logs = "";
        this.date = null;
        this.transmitter = new TransmitterPresenter();
    }

    async logger(move) {
        if (move === this.logs[this.logs.length - 1] && move !== "E" && move !== "T") {
            throw new Error("Oшибка повторения действия");
        }
        this.logs += move;
        const last = this.logs.slice(-2);
        const dif = this.date ? new Date() - this.date : 0;

        if (dif > 1500 && this.logs[this.logs.length - 1] !== "E") {
            // this.result.textContent += " ";
            this.result.textContent += "@";
            console.log("PPPPaused"); //my
        }

        if (last === "FD" || last === "DF") {
            if (this.logs.slice(-3, -2) !== "T") {
                throw new Error("TaskRunner может запускать только два действия одновременно");
            }
            this.date = new Date();
        } else if (last === "UB" || last === "BU") {
            if (this.logs.slice(-3, -2) !== "T") {
                throw new Error("TaskRunner может запускать только два действия одновременно");
            }
            if (this.date) {
                const dif = new Date() - this.date;
                if (dif > 500 && dif < 600) {
                    this.result.textContent += ".";
                    this.transmitter.sendRay("short");
                } else if (dif > 1000 && dif < 1100) {
                    this.result.textContent += "-";
                    this.transmitter.sendRay("long");
                }
            }
        }
        if (move === "R") {
            // this.result.textContent += "| ";
            this.result.textContent += "|@";
        }
        console.log(this.status);
    }

    getRandomResult(callback, timeout = 10, percent = this.percent) {
        return new Promise((res, rej) =>
            setTimeout(() => {
                if (Math.random() * 100 < percent) {
                    res();
                } else {
                    this.status = STATUSES.inited;
                    this.isTaskRunning = false;

                    this.logger("E");

                    this.result.textContent = this.result.textContent.slice(
                        0,
                        // this.result.textContent.lastIndexOf(" ") + 1
                        this.result.textContent.lastIndexOf("@") + 1
                    );
                    rej("Произошла ошибка, TaskRunner сброшен");
                }
            }, timeout)
        ).then(callback);
    }

    async init() {
        return this.getRandomResult(() => {
            this.logger("I");
            this.status = STATUSES.inited;
        });
    }

    taskRunner(task) {
        if (this.status !== STATUSES.inited) {
            throw new Error("Этот метод не может использоваться сейчас");
        }
        if (this.isTaskRunning) {
            throw new Error("Метод не может использоваться, т.к. используется другой метод");
        }

        this.isTaskRunning = true;
        this.logger("T");

        setTimeout(() =>
            task().then(() => {
                this.isTaskRunning = false;
            })
        );
    }

    async reset() {
        if (this.status !== STATUSES.inited) {
            throw new Error("Этот метод не может использоваться сейчас");
        }

        return this.getRandomResult(() => {
            this.status = STATUSES.inited;
            this.logger("R");
        });
    }

    async F() {
        if (!this.isTaskRunning) {
            throw new Error("Этот метод не может использоваться сейчас");
        }
        console.log("F");

        this.status = STATUSES.working;

        return this.getRandomResult(() => {
            this.status = STATUSES.inited;
            return this.logger("F");
        });
    }

    async D() {
        if (!this.isTaskRunning) {
            throw new Error("Этот метод не может использоваться здесь");
        }

        this.status = STATUSES.working;
        console.log("D");

        return this.getRandomResult(() => {
            this.status = STATUSES.inited;
            return this.logger("D");
        });
    }

    async B() {
        if (!this.isTaskRunning) {
            throw new Error("Этот метод не может использоваться здесь");
        }

        this.status = STATUSES.working;

        return this.getRandomResult(() => {
            this.status = STATUSES.inited;
            return this.logger("B");
        });
    }

    async U() {
        if (!this.isTaskRunning) {
            throw new Error("Этот метод не может использоваться здесь");
        }

        this.status = STATUSES.working;

        return this.getRandomResult(() => {
            this.status = STATUSES.inited;
            return this.logger("U");
        });
    }
}
