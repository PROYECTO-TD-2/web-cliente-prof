import { fetchExercises } from "./api.js";
import { renderExercises, showSpinner, hideSpinner,showToast } from "./ui.js";

let port, writer, reader;

const unitsMap = {
    temperatura: "Celsius",
    luz: "Lux",
    sonido: "Decibeles",
};

export async function connectMicrobit() {
    if (writer) {
       showToast("Micro:bit ya está conectado", "info");
        return;
    }
    try {
        showSpinner("Conectando con micro:bit...");
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        writer = port.writable.getWriter();
        reader = port.readable.getReader();

        readLoop();
        hideSpinner();
         showToast("Micro:bit conectado", "success");
    } catch (err) {
        hideSpinner();
        showToast("Error al conectar: " + err, "danger");
    }
}

export async function sendData(data) {
    if (!writer) { 
      showToast("Micro:bit no está conectado", "warning");
      return;
    }
    showSpinner("Enviando datos a micro:bit alumno...");
    const encoded = new TextEncoder().encode(data + "\n");
    console.log("Enviando a micro:bit:", data);
    await writer.write(encoded);
}

async function readLoop() {
    const decoder = new TextDecoder();
    let buffer = "";

    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                console.warn("El puerto se cerró");
                break;
            }

            if (value) {
                buffer += decoder.decode(value, { stream: true });
                if (buffer.includes("]")) {
                    const completeMsg = buffer.substring(0, buffer.indexOf("]") + 1).trim();
                    buffer = buffer.slice(buffer.indexOf("]") + 1);

                    if (completeMsg === document.getElementById("sensor").value) {
                        console.log("Ignorando eco:", completeMsg);
                        continue;
                    }

                    console.log("Paquete completo recibido:", completeMsg);
                    await handleMicrobitResponse(completeMsg);
                }
            }
        }
    } catch (error) {
        console.error("Error leyendo puerto:", error);
    } finally {
        reader.releaseLock();
    }
}

async function handleMicrobitResponse(data) {
    const sensor = document.getElementById("sensor").value;
    const premisa = document.getElementById("premisa").value;
    const nivel = document.getElementById("nivel").value;

    const payload = {
        sensor,
        values: [data],
        units: unitsMap[sensor] || "",
        student_level: nivel,
        exercise_context: premisa,
    };

    showSpinner("Generando ejercicios..."); 
    const result = await fetchExercises(payload);
    hideSpinner();

    if (result && result.exercises) {
        renderExercises(data, result.exercises);
    }
}

