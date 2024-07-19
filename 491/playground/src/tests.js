import result from "./solution";
import { Transmitter } from "./transmitter";

const socket = new WebSocket("ws://localhost:8080");

const expectedContainer = document.querySelector("#expected");
const resultContainer = document.querySelector("#result");
const transmittersContainer = document.querySelector('.transmitters-container');

const clear = () => {
    document.querySelectorAll('.transmitter-rays-container').forEach(el => el.remove());

    expectedContainer.innerHTML = "";
    resultContainer.innerHTML = "";
    transmittersContainer.innerHTML = "";
};

const testcase1 = async () => {
    clear();

    const transmitter1 = new Transmitter(1, 99);
    await result(socket, [transmitter1], {})
    expectedContainer.innerHTML =
        '<div id="id_result_1">Передатчик 1: ......-...-..--- .-----.-..-..-.. | </div>';

    socket.send("HELLO WORLD");
};

const testcase2 = async () => {
    clear();

    const transmitter1 = new Transmitter(1);
    const transmitter2 = new Transmitter(2);
    const transmitter3 = new Transmitter(3);
    await result(socket, [transmitter1, transmitter2, transmitter3], {})
    expectedContainer.innerHTML =
        '<div id="id_result_1">Передатчик 1: ...-..--.-.-.- | ......-...--. | -.-..-...-- | </div><div id="id_result_2">Передатчик 2: ----. -.....-----... | .-.....-.-...-. | </div><div id="id_result_3">Передатчик 3: -...-.. | ..-.-.--..-.- | ....-.-.. | </div>';

    socket.send("Stuck");
    socket.send("on Deimos");
    socket.send("need");
    socket.send("urgent");
    socket.send("help");
    socket.send("send");
    socket.send("rescue");
    socket.send("crew");

};

document.querySelector("#testcase1").addEventListener("click", testcase1);
document.querySelector("#testcase2").addEventListener("click", testcase2);
