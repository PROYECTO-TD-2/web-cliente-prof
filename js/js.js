let port;
let writer;
let reader;
const apiKey = "API_KEY_DE_OPENAI_AQUI";  // por el momento la vamos a tener en el cliente luego por temas de seguiridad esta logica debe hacerce en el servidor

async function handleMicrobitResponse(data) {
   /* console.log("Respuesta Micro:bit B:", data);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
         body: JSON.stringify({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Eres un asistente educativo que ayuda con ejercicios de micro:bit." },
      { role: "user", content: "El sensor enviado es temperatura y el nivel es fácil." }
    ],
    max_tokens: 150
  })
    });

    const result = await response.json();
    const chatText = result.choices[0].message.content;*/
    debugger
    document.getElementById("output").innerHTML +="<br>" +   data + "<br>";
}

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
                
                let parts = buffer.split("\n");
                buffer = parts.pop(); // guarda lo incompleto
                debugger
                for (const msg of parts) {
                    await handleMicrobitResponse(msg.trim());
                }
            }
        }
    } catch (error) {
        console.error("Error leyendo puerto:", error);
    } finally {
        reader.releaseLock();
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
    if (writer) {
        alert("Micro:bit ya está conectado");
        return;
    }
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
