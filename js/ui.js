
export function renderExercises(data, exercises) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";

    const dataSensorMicro = document.createElement("div");
    dataSensorMicro.textContent = `Dato recibido del micro:bit: ${data}`;
    dataSensorMicro.classList.add("mb-3", "p-2", "bg-info", "text-dark", "rounded");
    outputDiv.appendChild(dataSensorMicro);

    exercises.forEach((exercise, index) => {
        const container = document.createElement("div");
        container.classList.add("exercise-container", "card", "p-3", "mb-3");

        const pregunta = document.createElement("p");
        pregunta.textContent = `${index + 1}. ${exercise.pregunta}`;
        container.appendChild(pregunta);

        const ul = document.createElement("ul");
        exercise.opciones.forEach((opcion) => {
            const li = document.createElement("li");
            li.textContent = opcion;
            ul.appendChild(li);
        });
        container.appendChild(ul);

        const btn = document.createElement("button");
        btn.textContent = "Mostrar Respuesta";
        btn.classList.add("btn", "mt-2","btn-success");

        const respuestaDiv = document.createElement("p");
        respuestaDiv.textContent = `Respuesta: ${exercise.respuesta}`;
        respuestaDiv.style.display = "none";
        respuestaDiv.style.fontWeight = "bold";

        btn.addEventListener("click", () => {
            respuestaDiv.style.display = "block";
            btn.disabled = true;
        });

        container.appendChild(btn);
        container.appendChild(respuestaDiv);

        outputDiv.appendChild(container);
    });
}
export function showSpinner(message = "Cargando...") {
    const spinner = document.getElementById("loadingSpinner");
    const textEl = document.getElementById("spinnerText");

    if (spinner) {
        spinner.style.display = "block";
    }
    if (textEl) {
        textEl.textContent = message;
    }
}

export function hideSpinner() {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) {
        spinner.style.display = "none";
    }
}

export function showToast(message, type = "primary", title = "Micro:bit") {
    const toastEl = document.getElementById("microbitToast");
    const toastBody = document.getElementById("microbitToastBody");
    const toastTitle = document.getElementById("microbitToastTitle");
    const toastTime = document.getElementById("microbitToastTime");

    toastBody.textContent = message;
    toastTitle.textContent = title;

    const now = new Date();
    toastTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    toastEl.className = `toast align-items-center text-bg-${type} border-0 shadow-lg`;

    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000, autohide: true });
    toast.show();
}


