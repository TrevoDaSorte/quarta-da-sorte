const TOTAL_BILHETES = 250;

const container = document.getElementById("bilhetes");

for (let i = 1; i <= TOTAL_BILHETES; i++) {

    const bilhete = document.createElement("div");

    bilhete.className = "bilhete";

    bilhete.innerHTML = `
        🎟️ ${i}
    `;

    container.appendChild(bilhete);
}
