import jsonreader from "./jsonreader.js";

function afficherTexte(texte, container) {

    const msPerChar = 80; // 🕒 temps moyen par caractère

    texte.split("").forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.classList.add("letter");
        container.appendChild(span);

        const delay = msPerChar * i + (Math.random() * 40); // légère variation

        setTimeout(() => {
            span.classList.add("visible");
        }, delay);
    });

    setTimeout(()=>{
        const bouton = document.createElement("button");
        bouton.textContent = "Avancer";
        bouton.classList.add("boutonSuite")
        container.appendChild(bouton);
        bouton.style.opacity = 0
        const timer = setInterval(() => {
            let currentOpacity = parseFloat(bouton.style.opacity);
            if (currentOpacity < 1) {
                currentOpacity += 0.05;
            if (currentOpacity > 1) currentOpacity = 1;
                bouton.style.opacity = currentOpacity;
            } else {
                clearInterval(timer);
            }
        }, 50);

    }, 1000)
}

export async function afficherTexteScene(json, scene, container) {
    const data = await jsonreader(json);
    afficherTexte(data[scene]["texte"], container);
    const audio = new Audio(data[scene]["audio"]);
    audio.volume = 0.5;
    container.addEventListener('click', () => {
        audio.play();
  });
}