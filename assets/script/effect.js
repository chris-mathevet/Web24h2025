const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('loading');

import { afficherTexteScene } from './afficherTexte.js';
import jsonreader from './jsonreader.js';
const params = new URLSearchParams(window.location.search);

let sceneIndex = params.get("scene")??0;

// Variables pour l'effet
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let image = null;
let imageLoaded = false;

// Variables pour la lampe
let flashlightX = 0;
let flashlightY = 0;
let flashlightAngle = 0;

// Paramètres de l'effet
const spotlightRadius = 150;
const gradientSize = 100;
const smoothing = 0.15;
const overlayOpacity = 0.85;

let lumieresData = [];
let lumieresDataValide = [];
let hoveredHaloIndex = null; // -1 ou null = rien en hover
let scenesData = []
scenesData = await jsonreader("../assets/data/data.json");

const audioClickLigths = new Audio("../assets/audio/light-switch.mp3");
const success = new Audio("../assets/audio/success.mp3");
const night = new Audio("../assets/audio/night-ambience.mp3");

success.volume = 0.5;
audioClickLigths.volume = 0.5;
night.volume = 0.2;
night.loop = true;
document.getElementById("body").addEventListener("click", ()=>{
    night.play();
}
)

console.log(sceneIndex)

function changementScene(){
    if(sceneIndex == 0){
        const audioDebut = new Audio("../assets/audio/debut.m4a");
        audioDebut.volume = 0.5;
        document.getElementById("body").addEventListener("click",()=>{
            audioDebut.play();
        });
    }
    console.log(scenesData);


    document.getElementById("titre").textContent = scenesData[sceneIndex]["titre"]
    lumieresData = scenesData[sceneIndex]["interest"];

    loadImage();
    canvas.addEventListener('click', () => {
        if (hoveredHaloIndex !== null) {
            // Valider ce halo
            const halo = lumieresData[hoveredHaloIndex];
            lumieresDataValide.push(halo);
            lumieresData.splice(hoveredHaloIndex, 1);
            hoveredHaloIndex = null;
            if(lumieresData.length == 0){
                success.play();
                image = new Image();
                image.crossOrigin = 'anonymous';
                image.src = scenesData[sceneIndex]["imageFin"];
            }
            else
                audioClickLigths.play();
        }
    });
}

function drawLightHalos() {
    const scaleX = ctx.canvas.width / 1920;
    const scaleY = ctx.canvas.height / 1080;

    const distX = Math.abs(mouseX - canvas.width / 2);
    const distY = Math.abs(mouseY - canvas.height / 2);
    const spotlightWidth = spotlightRadius + distX * 0.05;
    const spotlightHeight = spotlightRadius + distY * 0.05;

    hoveredHaloIndex = null;

    // DESSINER LES HALOS VALIDÉS
    for (const halo of lumieresDataValide) {
        const coX = halo.coX * scaleX;
        const coY = halo.coY * scaleY;
        const radiusX = halo.radiusX * scaleX;
        const radiusY = halo.radiusY * scaleY;

        const gradient = ctx.createRadialGradient(
            coX, coY, 0,
            coX, coY, Math.max(radiusX, radiusY)
        );
        gradient.addColorStop(0, halo.colorfin);
        gradient.addColorStop(1, halo.colorfin);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(coX, coY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // DESSINER LES HALOS NON VALIDÉS
    for (let i = 0; i < lumieresData.length; i++) {
        const halo = lumieresData[i];
        const coX = halo.coX * scaleX;
        const coY = halo.coY * scaleY;
        const radiusX = halo.radiusX * scaleX;
        const radiusY = halo.radiusY * scaleY;

        const dx = coX - mouseX;
        const dy = coY - mouseY;
        const inSpotlight = (dx * dx) / ((spotlightWidth + gradientSize) ** 2) +
                            (dy * dy) / ((spotlightHeight + gradientSize) ** 2) <= 1;

        let color = halo.colordebut;
        if (inSpotlight) {
            color = halo.colorHover;
            hoveredHaloIndex = i; // stocker l'index pour le clic
        }

        const gradient = ctx.createRadialGradient(
            coX, coY, 0,
            coX, coY, Math.max(radiusX, radiusY)
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, halo.colorfin);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(coX, coY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Redimensionner le canvas
function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const aspectRatio = 16 / 9;

    let canvasWidth, canvasHeight;

    if (windowWidth / windowHeight > aspectRatio) {
        // Trop large : hauteur fait foi
        canvasHeight = windowHeight;
        canvasWidth = canvasHeight * aspectRatio;
    } else {
        // Trop haut : largeur fait foi
        canvasWidth = windowWidth;
        canvasHeight = canvasWidth / aspectRatio;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Centrer le canvas avec du CSS
    canvas.style.position = 'absolute';
    canvas.style.left = `${(windowWidth - canvasWidth) / 2}px`;
    canvas.style.top = `${(windowHeight - canvasHeight) / 2}px`;
    canvas.style.backgroundColor = 'black'; // pour combler les bords

    // (Optionnel) mettre un fond noir derrière
    document.body.style.backgroundColor = 'black';

    // const windowWidth = window.innerWidth;
    // const windowHeight = window.innerHeight;
    // const scaleX = windowWidth / LOGICAL_WIDTH;
    // const scaleY = windowHeight / LOGICAL_HEIGHT;
    // const scale = Math.min(scaleX, scaleY);

    // const displayWidth = LOGICAL_WIDTH * scale;
    // const displayHeight = LOGICAL_HEIGHT * scale;

    // // Redimensionne le style (affichage) mais pas la résolution logique
    // canvas.style.width = `${displayWidth}px`;
    // canvas.style.height = `${displayHeight}px`;

    // // Centre le canvas dans la fenêtre
    // canvas.style.position = 'absolute';
    // canvas.style.left = `${(windowWidth - displayWidth) / 2}px`;
    // canvas.style.top = `${(windowHeight - displayHeight) / 2}px`;

    // document.body.style.backgroundColor = 'black';

    // // Prépare le contexte avec le bon scale pour le dessin
    // ctx.setTransform(scale, 0, 0, scale, 0, 0);


    // Position de la lampe torche (75% de la largeur, en bas)
    flashlightX = canvas.width * 0.80;
    flashlightY = canvas.height - 20;
    
    // Réinitialiser la position de la souris au centre
    if (!imageLoaded) {
        mouseX = targetX = canvas.width / 2;
        mouseY = targetY = canvas.height / 2;
    }
}

// Charger l'image de fond
function loadImage() {
    image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = async function() {
        imageLoaded = true;
        loading.style.display = 'none';
        mouseX = targetX = canvas.width / 2;
        mouseY = targetY = canvas.height / 2;
        animate();   
    };
    image.onerror = async function() {
        loading.textContent = 'Erreur de chargement - utilisation d\'un dégradé';
        imageLoaded = true;
        mouseX = targetX = canvas.width / 2;
        mouseY = targetY = canvas.height / 2;
        animate();
    };
    // Votre image locale
    image.src = scenesData[sceneIndex]["image"];
}

// Dessiner l'image de fond
function drawBackground() {
    if (image && image.complete) {
        // Calculer les dimensions pour couvrir tout le canvas
        const canvasRatio = canvas.width / canvas.height;
        const imageRatio = image.width / image.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (canvasRatio > imageRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imageRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imageRatio;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }
        
        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    } else {
        // Fallback: dégradé coloré si l'image ne charge pas
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(0.25, '#4ecdc4');
        gradient.addColorStop(0.5, '#45b7d1');
        gradient.addColorStop(0.75, '#96ceb4');
        gradient.addColorStop(1, '#ffd93d');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Créer l'effet spotlight avec distorsion subtile de l'ellipse et du gradient
function drawSpotlight() {
    // Lissage du mouvement de la souris
    mouseX += (targetX - mouseX) * smoothing;
    mouseY += (targetY - mouseY) * smoothing;

    // Créer un masque pour l'overlay sombre
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = canvas.width;
    overlayCanvas.height = canvas.height;
    const overlayCtx = overlayCanvas.getContext('2d');

    // Remplir avec la couleur sombre
    overlayCtx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
    overlayCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Créer le trou avec dégradé
    const gradient = overlayCtx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, spotlightRadius + gradientSize
    );
    
    // Dégradé avec différentes étapes de lumière
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');  // Jaune pâle
    gradient.addColorStop(0.2, 'rgba(248, 241, 226, 0.15)');   // Jaune plus intense
    gradient.addColorStop(0.4, 'rgba(247, 208, 115, 0.3)');   // Jaune encore plus intense
    gradient.addColorStop(0.6, 'rgba(247, 208, 115, 0.6)');   // Jaune très lumineux
    gradient.addColorStop(0.7, 'rgba(249, 189, 133, 0.3)');   // Orange doux, plus transparent
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');           // Transparency vers les bords

    // Appliquer un effet d'ellipse (ovale) plutôt qu'un cercle, mais plus subtil
    overlayCtx.globalCompositeOperation = 'destination-out';
    overlayCtx.beginPath();
    
    // Calculer les distances de la souris par rapport au centre pour une distorsion subtile
    const distX = Math.abs(mouseX - canvas.width / 2); // Distance horizontale à partir du centre
    const distY = Math.abs(mouseY - canvas.height / 2); // Distance verticale à partir du centre
    const ellipseWidth = spotlightRadius + distX * 0.05; // Légère augmentation de la largeur
    const ellipseHeight = spotlightRadius + distY * 0.05; // Légère augmentation de la hauteur

    // Créer l'ellipse déformée en fonction des coordonnées de la souris
    overlayCtx.ellipse(mouseX, mouseY, ellipseWidth, ellipseHeight, 0, 0, Math.PI * 2);
    overlayCtx.fill();

    // Ajouter le dégradé sur l'ellipse, avec une distorsion subtile similaire
    overlayCtx.globalCompositeOperation = 'source-over';
    overlayCtx.fillStyle = gradient;
    overlayCtx.beginPath();
    overlayCtx.ellipse(mouseX, mouseY, ellipseWidth + gradientSize, ellipseHeight + gradientSize, 0, 0, Math.PI * 2);
    overlayCtx.fill();

    // Appliquer l'overlay sur le canvas principal
    ctx.drawImage(overlayCanvas, 0, 0);
}

function drawFlashlight() {
    // Calculer l'angle vers la souris
    const dx = mouseX - flashlightX;
    const dy = mouseY - flashlightY;
    flashlightAngle = Math.atan2(dy, dx);

    // Appliquer mise à l'échelle et transformation
    const scaleFactor = 2;
    ctx.save();
    ctx.translate(flashlightX, flashlightY);
    ctx.rotate(flashlightAngle);
    ctx.scale(scaleFactor, scaleFactor);

    // Corps de la lampe (manche)
    ctx.fillStyle = '#2c2c2c'; // gris foncé uniforme
    ctx.fillRect(-50, -6, 70, 12);

    // Tête de la lampe (plus large et inclinée)
    ctx.beginPath();
    ctx.moveTo(20, -10);
    ctx.lineTo(45, -14);
    ctx.lineTo(45, 14);
    ctx.lineTo(20, 10);
    ctx.closePath();
    ctx.fillStyle = '#3a3a3a';
    ctx.fill();

    // Bordure de la tête
    ctx.strokeStyle = '#1f1f1f';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Lentille ronde (simulée au bout de la tête)
    ctx.beginPath();
    ctx.arc(44, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f1f1f1';
    ctx.fill();

    // Halo de lumière doux
    ctx.beginPath();
    ctx.ellipse(55, 0, 15, 20, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 150, 0.1)';
    ctx.fill();

    // Bouton rond jaune
    ctx.beginPath();
    ctx.arc(-15, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fcd440';
    ctx.fill();

    // Ombre du bouton
    ctx.beginPath();
    ctx.arc(-14, 1, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();

    ctx.restore();
}

function ombre(timestamp) {
    if (!fadeOutStart) fadeOutStart = timestamp;
    const elapsed = timestamp - fadeOutStart;

    const duration = 5000; // 500ms
    const progress = Math.min(elapsed / duration, 1);
    overlayOpacityFin = 0.8 * (1 - progress);

    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = canvas.width;
    overlayCanvas.height = canvas.height;
    const overlayCtx = overlayCanvas.getContext('2d');

    overlayCtx.fillStyle = `rgba(0, 0, 0, ${overlayOpacityFin})`;
    overlayCtx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(overlayCanvas, 0, 0);

    if (progress < 1) {
        requestAnimationFrame(ombre); // continuer le fondu
    }
}

let overlayOpacityFin = 0.8;
let isFadingOut = false;
let fadeStartTime = null;
const fadeDuration = 500; // en ms
let progressAnime = -1;
let animationFrameId; 
let hasAnimationEnded = false;

function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    if (lumieresData.length !== 0) {
        drawSpotlight();
        drawLightHalos();
        drawFlashlight();
    } else {
        // Lancer le fondu si pas déjà lancé
        if (!isFadingOut) {
            isFadingOut = true;
            fadeStartTime = timestamp;
        }

        // Animer la diminution de l'opacité
        if (isFadingOut) {
            const elapsed = timestamp - fadeStartTime;
            progressAnime = Math.min(elapsed / fadeDuration, 1);
            overlayOpacityFin = 0.8 * (1 - progressAnime);

            // Dessiner l'ombre avec opacité animée
            const overlayCanvas = document.createElement('canvas');
            overlayCanvas.width = canvas.width;
            overlayCanvas.height = canvas.height;
            const overlayCtx = overlayCanvas.getContext('2d');
            overlayCtx.fillStyle = `rgba(0, 0, 0, ${overlayOpacityFin})`;
            overlayCtx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(overlayCanvas, 0, 0);

            // COUPER ANIMATION ICI
            if (progressAnime >= 1 && !hasAnimationEnded) {
                hasAnimationEnded = true;
                cancelAnimationFrame(animationFrameId); // stop l’animation
                setTimeout(()=>{
                    afficherTexteScene(scenesData[sceneIndex], document.getElementById("text-container"));
                },1000)
                return; // on arrête ici pour ne pas redemander une frame
            }
        }
    }

    // applyFishEyeEffect(ctx, canvas, 0.96);

    animationFrameId = requestAnimationFrame(animate);
}


function applyFishEyeEffect(ctx, canvas, intensity = 0.3) {
    const width = canvas.width;
    const height = canvas.height;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Créer un buffer pour l'image modifiée
    const output = ctx.createImageData(width, height);
    const outputData = output.data;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            // Coordonnées relatives au centre
            let dx = x - centerX;
            let dy = y - centerY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Calcul du facteur de déformation fish-eye
            let r = distance / radius;
            let rDistorted = Math.pow(r, intensity);

            // Nouvelle position déformée
            let newX = Math.round(centerX + (dx / distance) * rDistorted * radius || x);
            let newY = Math.round(centerY + (dy / distance) * rDistorted * radius || y);

            // Clamp coordonnées
            newX = Math.min(width - 1, Math.max(0, newX));
            newY = Math.min(height - 1, Math.max(0, newY));

            const srcIndex = (newY * width + newX) * 4;
            const destIndex = (y * width + x) * 4;

            // Copier pixel
            outputData[destIndex] = data[srcIndex];
            outputData[destIndex + 1] = data[srcIndex + 1];
            outputData[destIndex + 2] = data[srcIndex + 2];
            outputData[destIndex + 3] = data[srcIndex + 3];
        }
    }

    // Appliquer l'image déformée
    ctx.putImageData(output, 0, 0);
}


// Gestion des événements de souris
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
    targetX = canvas.width / 2;
    targetY = canvas.height / 2;
});

// Gestion du redimensionnement
window.addEventListener('resize', resizeCanvas);

// Initialisation
resizeCanvas();
changementScene();

// Fonction pour changer l'image (vous pouvez l'appeler depuis la console)
window.changeImage = function(url) {
    imageLoaded = false;
    loading.style.display = 'block';
    loading.textContent = 'Chargement de la nouvelle image...';
    
    const newImage = new Image();
    newImage.crossOrigin = 'anonymous';
    newImage.onload = function() {
        image = newImage;
        imageLoaded = true;
        loading.style.display = 'none';
    };
    newImage.src = url;
};


document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault();
    }
});

window.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
    }
}, { passive: false });

const attendreBouton = setInterval(() => {
    const bouton = document.getElementById("NextScene");
    
    if (bouton) {
        if(sceneIndex==5){
            bouton.remove();
        }else{

            console.log("bouton");
            bouton.addEventListener("click", () => {
                console.log("click btn");
                console.log("sceneIndex:", sceneIndex, "type:", typeof sceneIndex);
                let sceneIndex2 = parseInt(sceneIndex, 10);
                
                if (scenesData.hasOwnProperty(`${sceneIndex2 + 1}`)) {
                    console.log(`${sceneIndex2 + 1}`);
                    window.location.href = `?scene=${sceneIndex2 + 1}`;
                }
            });
        }

        clearInterval(attendreBouton); 
    }
}, 100);