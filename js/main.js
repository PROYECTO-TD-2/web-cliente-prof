import { connectMicrobit, sendData } from "./microbit.js";

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("connectBtn").addEventListener("click", connectMicrobit);

    document.getElementById("microbitForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const sensor = document.getElementById("sensor").value;
        await sendData(sensor);
    });
});
