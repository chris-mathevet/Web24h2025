const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('loading');

import { afficherTexteScene } from './afficherTexte.js';
import jsonreader from './jsonreader.js';

let sceneIndex = 0

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


// loead le fichier json des lumieres
async function loadLumieres() {
    let scene = await jsonreader("../assets/data/data.json");
    lumieresData = scene[sceneIndex]["interest"];
}

// function drawLightHalos() {
//     const scaleX = ctx.canvas.width / 1920;
//     const scaleY = ctx.canvas.height / 1080;

//     for (const halo of lumieresData) {
//         const coX = halo.coX * scaleX;
//         const coY = halo.coY * scaleY;
//         const radiusX = halo.radiusX * scaleX;
//         const radiusY = halo.radiusY * scaleY;

//         const gradient = ctx.createRadialGradient(
//             coX, coY, 0,
//             coX, coY, Math.max(radiusX, radiusY)
//         );
//         gradient.addColorStop(0, halo.colordebut);
//         gradient.addColorStop(1, halo.colorfin);

//         ctx.fillStyle = gradient;
//         ctx.beginPath();
//         ctx.ellipse(coX, coY, radiusX, radiusY, 0, 0, Math.PI * 2);
//         ctx.fill();
//     }
// }


// function drawLightHalos() {
//     const scaleX = ctx.canvas.width / 1920;
//     const scaleY = ctx.canvas.height / 1080;

//     // Spotlight "ellipse" calculée comme dans drawSpotlight
//     const distX = Math.abs(mouseX - canvas.width / 2);
//     const distY = Math.abs(mouseY - canvas.height / 2);
//     const spotlightWidth = spotlightRadius + distX * 0.05;
//     const spotlightHeight = spotlightRadius + distY * 0.05;

//     for (const halo of lumieresData) {
//         const coX = halo.coX * scaleX;
//         const coY = halo.coY * scaleY;
//         const radiusX = halo.radiusX * scaleX;
//         const radiusY = halo.radiusY * scaleY;

//         // Vérifier si le halo est dans l'ellipse du spotlight (collision ellipse)
//         const dx = coX - mouseX;
//         const dy = coY - mouseY;

//         const inSpotlight = (dx * dx) / ((spotlightWidth + gradientSize) ** 2) + (dy * dy) / ((spotlightHeight + gradientSize) ** 2) <= 1;

//         const gradient = ctx.createRadialGradient(
//             coX, coY, 0,
//             coX, coY, Math.max(radiusX, radiusY)
//         );

//         gradient.addColorStop(0, inSpotlight ? halo.colorfin : halo.colordebut);
//         gradient.addColorStop(1, inSpotlight ? halo.colorfin : halo.colorfin);

//         ctx.fillStyle = gradient;
//         ctx.beginPath();
//         ctx.ellipse(coX, coY, radiusX, radiusY, 0, 0, Math.PI * 2);
//         ctx.fill();
//     }
// }


// function drawLightHalos() {
//     const scaleX = ctx.canvas.width / 1920;
//     const scaleY = ctx.canvas.height / 1080;

//     const distX = Math.abs(mouseX - canvas.width / 2);
//     const distY = Math.abs(mouseY - canvas.height / 2);
//     const spotlightWidth = spotlightRadius + distX * 0.05;
//     const spotlightHeight = spotlightRadius + distY * 0.05;

//     // 1. DESSINER TOUS CEUX DÉJÀ VALIDÉS
//     for (const halo of lumieresDataValide) {
//         const coX = halo.coX * scaleX;
//         const coY = halo.coY * scaleY;
//         const radiusX = halo.radiusX * scaleX;
//         const radiusY = halo.radiusY * scaleY;

//         const gradient = ctx.createRadialGradient(
//             coX, coY, 0,
//             coX, coY, Math.max(radiusX, radiusY)
//         );
//         gradient.addColorStop(0, halo.colorfin);
//         gradient.addColorStop(1, halo.colorfin);

//         ctx.fillStyle = gradient;
//         ctx.beginPath();
//         ctx.ellipse(coX, coY, radiusX, radiusY, 0, 0, Math.PI * 2);
//         ctx.fill();
//     }

//     // 2. DESSINER CEUX NON VALIDÉS, ET TESTER SI ILS PASSENT EN VALIDÉ
//     // On doit utiliser une copie pour éviter de modifier un tableau pendant qu’on le parcourt
//     for (let i = lumieresData.length - 1; i >= 0; i--) {
//         const halo = lumieresData[i];

//         const coX = halo.coX * scaleX;
//         const coY = halo.coY * scaleY;
//         const radiusX = halo.radiusX * scaleX;
//         const radiusY = halo.radiusY * scaleY;

//         const dx = coX - mouseX;
//         const dy = coY - mouseY;
//         const inSpotlight = (dx * dx) / ((spotlightWidth + gradientSize) ** 2) +
//                             (dy * dy) / ((spotlightHeight + gradientSize) ** 2) <= 1;

//         if (inSpotlight) {
//             // Déplacer vers les validés
//             lumieresDataValide.push(halo);
//             lumieresData.splice(i, 1);
//             continue; // Ne le dessine plus ici
//         }

//         // Dessin normal en colordebut
//         const gradient = ctx.createRadialGradient(
//             coX, coY, 0,
//             coX, coY, Math.max(radiusX, radiusY)
//         );
//         gradient.addColorStop(0, halo.colordebut);
//         gradient.addColorStop(1, halo.colorfin);

//         ctx.fillStyle = gradient;
//         ctx.beginPath();
//         ctx.ellipse(coX, coY, radiusX, radiusY, 0, 0, Math.PI * 2);
//         ctx.fill();
//     }
// }


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

const LOGICAL_WIDTH = 1920;
const LOGICAL_HEIGHT = 1080;



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
        await loadLumieres();  // 👈 Charge le JSON avant d'animer
        animate();   
    };
    image.onerror = async function() {
        loading.textContent = 'Erreur de chargement - utilisation d\'un dégradé';
        imageLoaded = true;
        mouseX = targetX = canvas.width / 2;
        mouseY = targetY = canvas.height / 2;

        await loadLumieres();  // 👈 Même chose ici
        animate();    
    };
    // Votre image locale
    image.src = '../assets/img/chris.png';
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
                afficherTexteScene("../assets/data/data.json", 0, document.getElementById("text-container"));
                return; // on arrête ici pour ne pas redemander une frame
            }
        }
    }
    animationFrameId = requestAnimationFrame(animate);

}

// // Animation principale
// function animate() {
//     // Effacer le canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawBackground();
//     if (lumieresData.length !== 0) {
//         // Dessiner l'image de fond
//         // Appliquer l'effet spotlight
//         drawSpotlight();
//         drawLightHalos();
        
//         // Dessiner la lampe torche
//         drawFlashlight();
//     }else{
//         ombre();
//     }
    
//     // Continuer l'animation
//     requestAnimationFrame(animate);
// }



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
loadImage();

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


// canvas.addEventListener('mousemove', (e) => {
//     const rect = canvas.getBoundingClientRect();
//     const scale = LOGICAL_WIDTH / rect.width;
//     targetX = (e.clientX - rect.left) * scale;
//     targetY = (e.clientY - rect.top) * scale;
// });

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



canvas.addEventListener('click', () => {
    if (hoveredHaloIndex !== null) {
        // Valider ce halo
        const halo = lumieresData[hoveredHaloIndex];
        lumieresDataValide.push(halo);
        lumieresData.splice(hoveredHaloIndex, 1);
        hoveredHaloIndex = null;
    }
});
