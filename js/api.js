import { showToast } from "./ui.js";
const API_URL = "<url api>/generate";

export async function fetchExercises(payload) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
          showToast("Error llamando a la API", "danger");
          throw new Error(`Error en API: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) { 
        showToast("Error llamando a la API", "danger");
        console.error("Error llamando a la API:", err);
        return null;
    }
}
