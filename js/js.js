let port;
let writer;
let reader;

const apiKey = "API_KEY_DE_OPENAI_AQUI";  

async function handleMicrobitResponse(data) {
    console.log("Respuesta Micro:bit B:", data);

    const sensor = document.getElementById("sensor").value;
    const premisa = document.getElementById("premisa").value;
    const nivel = document.getElementById("nivel").value;

    try {
        const response = await fetch("https://4a67951e04c4.ngrok-free.app/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sensor: sensor,
                values: [data],
                units: ['Celsius'],
                student_level: nivel,     
                exercise_context: premisa
            })
        });

        if (!response.ok) {
            console.error("Error en la API:", response.statusText);
            return;
        }

        const result = await response.json();
        console.log("Respuesta API:", result);

        // Mostrar resultado en pantalla
        const outputDiv = document.getElementById("output");
        const p = document.createElement("p");
        p.innerHTML = result.exercises;
        outputDiv.appendChild(p);
    } catch (err) {
        console.error("Error al llamar a la API:", err);
    }
}

// Leer datos del micro:bit
// Leer datos del micro:bit
async function readLoop() {
    const decoder = new TextDecoder();
    let buffer = "";

    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            if (value) {
                buffer += decoder.decode(value, { stream: true });
                if (buffer.includes("]")) {
                    const completeMsg = buffer.substring(0, buffer.indexOf("]") + 1).trim();
                    buffer = buffer.slice(buffer.indexOf("]") + 1); // deja lo que viene después, si hay

                    // 🚫 Ignorar eco del mensaje enviado
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

async function sendData(data) {
    const encoded = new TextEncoder().encode(data + "\n");
    console.log("Enviando a micro:bit:", data);
    await writer.write(encoded);
}

// Conectar al micro:bit
async function connectMicrobit() {
    if (writer) {
        alert("Micro:bit ya está conectado");
        return;
    }
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });   // ✅ más común

        writer = port.writable.getWriter();
        reader = port.readable.getReader();

        readLoop();
        alert("Micro:bit conectado ✅");
    } catch (err) {
        alert("Error al conectar: " + err);
    }
}

// Inicialización
window.addEventListener("DOMContentLoaded", () => {
    // Evento para conectar
    document.getElementById("connectBtn").addEventListener("click", connectMicrobit);

    // Evento para enviar datos
    document.getElementById("microbitForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!writer) {
            alert("Primero conecta el micro:bit");
            return;
        }

        const sensor = document.getElementById("sensor").value;
        await sendData(sensor);
    });
});
