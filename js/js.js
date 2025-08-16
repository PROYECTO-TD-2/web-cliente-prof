let port;
let writer;
let reader;

// Leer datos del micro:bit
async function readLoop() {
    const decoder = new TextDecoder();
    while (true) {
        try {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
                document.getElementById("output").innerHTML += decoder.decode(value) + "<br>";
            }
        } catch (error) {
            console.error("Error leyendo:", error);
            break;
        }
    }
}

// Enviar datos al micro:bit
async function sendData(data) {
    const encoded = new TextEncoder().encode(data + "\n");
    console.log("Enviando:", data);
    await writer.write(encoded);
}

// Conectar al micro:bit (solo en clic de usuario)
async function connectMicrobit() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });

        writer = port.writable.getWriter();
        reader = port.readable.getReader();

        readLoop();
        alert("Micro:bit conectado ✅");
    } catch (err) {
        alert("Error al conectar: " + err);
    }
}

// Esperar a que cargue toda la página
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
        const premisa = document.getElementById("premisa").value;
        const nivel = document.getElementById("nivel").value;

        const mensaje = `${sensor},${premisa},${nivel}`;
        await sendData(mensaje);
    });
});
