document.addEventListener("DOMContentLoaded", ()=>{

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('loading');

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

// Redimensionner le canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Position de la lampe torche (75% de la largeur, en bas)
    flashlightX = canvas.width * 0.75;
    flashlightY = canvas.height - 80;
    
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
    image.onload = function() {
        imageLoaded = true;
        loading.style.display = 'none';
        mouseX = targetX = canvas.width / 2;
        mouseY = targetY = canvas.height / 2;
        animate();
    };
    image.onerror = function() {
        loading.textContent = 'Erreur de chargement - utilisation d\'un dégradé';
        imageLoaded = true;
        mouseX = targetX = canvas.width / 2;
        mouseY = targetY = canvas.height / 2;
        animate();
    };
    // Votre image locale
    image.src = '../assets/img/quais-sans-lumiere.png';
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

// // Créer l'effet spotlight
// function drawSpotlight() {
//     // Lissage du mouvement de la souris
//     mouseX += (targetX - mouseX) * smoothing;
//     mouseY += (targetY - mouseY) * smoothing;

//     // Créer un masque pour l'overlay sombre
//     const overlayCanvas = document.createElement('canvas');
//     overlayCanvas.width = canvas.width;
//     overlayCanvas.height = canvas.height;
//     const overlayCtx = overlayCanvas.getContext('2d');

//     // Remplir avec la couleur sombre
//     overlayCtx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
//     overlayCtx.fillRect(0, 0, canvas.width, canvas.height);

//     // Créer le trou avec dégradé
//     const gradient = overlayCtx.createRadialGradient(
//         mouseX, mouseY, 0,
//         mouseX, mouseY, spotlightRadius + gradientSize
//     );
//     gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');  // Jaune pâle, opaque
//     gradient.addColorStop(0.2, 'rgba(248, 241, 226, 0.15)');   // Jaune un peu plus intense
//     gradient.addColorStop(0.4, 'rgba(247, 208, 115, 0.3)');   // Jaune un peu plus intense
//     gradient.addColorStop(0.6, 'rgba(247, 208, 115, 0.6)');   // Jaune un peu plus intense
//     gradient.addColorStop(0.7, 'rgba(249, 189, 133, 0.3)');   // Orange doux, plus transparent
//     gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');           // Transparency towards the edges

//     overlayCtx.globalCompositeOperation = 'destination-out';
//     overlayCtx.beginPath();
//     overlayCtx.arc(mouseX, mouseY, spotlightRadius, 0, Math.PI * 2);
//     overlayCtx.fill();

//     // Ajouter le dégradé
//     overlayCtx.globalCompositeOperation = 'source-over';
//     overlayCtx.fillStyle = gradient;
//     overlayCtx.beginPath();
//     overlayCtx.arc(mouseX, mouseY, spotlightRadius + gradientSize, 0, Math.PI * 2);
//     overlayCtx.fill();

//     // Appliquer l'overlay sur le canvas principal
//     ctx.drawImage(overlayCanvas, 0, 0);
// }
// Créer l'effet spotlight avec distorsion de l'ellipse
// function drawSpotlight() {
//     // Lissage du mouvement de la souris
//     mouseX += (targetX - mouseX) * smoothing;
//     mouseY += (targetY - mouseY) * smoothing;

//     // Créer un masque pour l'overlay sombre
//     const overlayCanvas = document.createElement('canvas');
//     overlayCanvas.width = canvas.width;
//     overlayCanvas.height = canvas.height;
//     const overlayCtx = overlayCanvas.getContext('2d');

//     // Remplir avec la couleur sombre
//     overlayCtx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
//     overlayCtx.fillRect(0, 0, canvas.width, canvas.height);

//     // Créer le trou avec dégradé
//     const gradient = overlayCtx.createRadialGradient(
//         mouseX, mouseY, 0,
//         mouseX, mouseY, spotlightRadius + gradientSize
//     );
    
//     // Dégradé avec différentes étapes de lumière
//     gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');  // Jaune pâle
//     gradient.addColorStop(0.2, 'rgba(248, 241, 226, 0.15)');   // Jaune plus intense
//     gradient.addColorStop(0.4, 'rgba(247, 208, 115, 0.3)');   // Jaune encore plus intense
//     gradient.addColorStop(0.6, 'rgba(247, 208, 115, 0.6)');   // Jaune très lumineux
//     gradient.addColorStop(0.7, 'rgba(249, 189, 133, 0.3)');   // Orange doux, plus transparent
//     gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');           // Transparency vers les bords

//     // Appliquer un effet d'ellipse (ovale) plutôt qu'un cercle
//     overlayCtx.globalCompositeOperation = 'destination-out';
//     overlayCtx.beginPath();
    
//     // On déforme l'ellipse en fonction de la position de la souris
//     const distX = Math.abs(mouseX - canvas.width / 2); // Distance horizontale à partir du centre
//     const distY = Math.abs(mouseY - canvas.height / 2); // Distance verticale à partir du centre
//     const ellipseWidth = spotlightRadius + distX * 0.2; // La largeur de l'ellipse augmente avec l'éloignement de la souris
//     const ellipseHeight = spotlightRadius + distY * 0.2; // La hauteur de l'ellipse augmente aussi

//     // Créer l'ellipse déformée en fonction des coordonnées de la souris
//     overlayCtx.ellipse(mouseX, mouseY, ellipseWidth, ellipseHeight, 0, 0, Math.PI * 2);
//     overlayCtx.fill();

//     // Ajouter le dégradé sur l'ellipse
//     overlayCtx.globalCompositeOperation = 'source-over';
//     overlayCtx.fillStyle = gradient;
//     overlayCtx.beginPath();
//     overlayCtx.ellipse(mouseX, mouseY, ellipseWidth + gradientSize, ellipseHeight + gradientSize, 0, 0, Math.PI * 2);
//     overlayCtx.fill();

//     // Appliquer l'overlay sur le canvas principal
//     ctx.drawImage(overlayCanvas, 0, 0);
// }


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



// // Dessiner la lampe torche
// function drawFlashlight() {
//     // Calculer l'angle vers la souris
//     const dx = mouseX - flashlightX;
//     const dy = mouseY - flashlightY;
//     flashlightAngle = Math.atan2(dy, dx);
    
//     ctx.save();
//     ctx.translate(flashlightX, flashlightY);
//     ctx.rotate(flashlightAngle);
    
//     // Corps de la lampe (manche)
//     ctx.fillStyle = '#4a4a4a';
//     ctx.fillRect(-60, -8, 80, 16);
    
//     // Bordures du manche
//     ctx.strokeStyle = '#333';
//     ctx.lineWidth = 2;
//     ctx.strokeRect(-60, -8, 80, 16);
    
//     // Détails du manche (grip)
//     ctx.fillStyle = '#555';
//     for (let i = 0; i < 5; i++) {
//         ctx.fillRect(-50 + i * 12, -6, 2, 12);
//     }
    
//     // Tête de la lampe
//     ctx.fillStyle = '#666';
//     ctx.fillRect(20, -12, 25, 24);
    
//     // Bordure de la tête
//     ctx.strokeStyle = '#333';
//     ctx.lineWidth = 2;
//     ctx.strokeRect(20, -12, 25, 24);
    
//     // Lentille
//     ctx.fillStyle = '#e6e6e6';
//     ctx.beginPath();
//     ctx.arc(32, 0, 8, 0, Math.PI * 2);
//     ctx.fill();
    
//     // Reflet sur la lentille
//     ctx.fillStyle = '#fff';
//     ctx.beginPath();
//     ctx.arc(30, -2, 3, 0, Math.PI * 2);
//     ctx.fill();
    
//     // Bouton on/off
//     ctx.fillStyle = '#2a2a2a';
//     ctx.fillRect(-25, -3, 6, 6);
    
//     ctx.restore();
// }

// Dessiner la lampe torche avec effet 3D et mise à l'échelle
function drawFlashlight() {
    // Calculer l'angle vers la souris
    const dx = mouseX - flashlightX;
    const dy = mouseY - flashlightY;
    flashlightAngle = Math.atan2(dy, dx);
    
    // Appliquer la mise à l'échelle pour l'effet 3D
    const scaleFactor = 2;  // Facteur de mise à l'échelle pour un effet 3D
    ctx.save();
    ctx.translate(flashlightX, flashlightY);
    ctx.rotate(flashlightAngle);
    ctx.scale(scaleFactor, scaleFactor); // Appliquer l'échelle
    
    // Corps de la lampe (manche) avec effet de lumière et ombre
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(-60, -8, 80, 16);
    
    // Ombre portée pour le manche
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(-60 + 4, -8 + 4, 80, 16);  // Ombre légèrement décalée

    // Bordures du manche
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(-60, -8, 80, 16);
    
    // Détails du manche (grip)
    ctx.fillStyle = '#555';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(-50 + i * 12, -6, 2, 12);
    }
    
    // Ombre portée sur le grip
    ctx.fillStyle = 'rgba(246, 255, 70, 0.5)';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(-50 + i * 12 + 4, -6 + 4, 2, 12);  // Ombre légèrement décalée
    }

    // Tête de la lampe avec effet de lumière et ombre
    ctx.fillStyle = '#666';
    ctx.fillRect(20, -12, 25, 24);
    
    // Ombre portée pour la tête de la lampe
    ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
    ctx.fillRect(20 + 4, -12 + 4, 25, 24);  // Ombre légèrement décalée
    
    // Bordure de la tête
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, -12, 25, 24);
    
    // Lentille avec dégradé et ombre
    ctx.fillStyle = '#e6e6e6';
    ctx.beginPath();
    ctx.arc(32, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Ombre portée sur la lentille
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(32 + 2, 0 + 2, 8, 0, Math.PI * 2);  // Ombre légèrement décalée
    ctx.fill();
    
    // Reflet sur la lentille (ajout d'un effet lumineux)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(30, -2, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Bouton on/off
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(-25, -3, 6, 6);
    
    // Ombre portée pour le bouton
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(-25 + 2, -3 + 2, 6, 6);  // Ombre légèrement décalée
    
    ctx.restore();
}




// Animation principale
function animate() {
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner l'image de fond
    drawBackground();
    
    // Appliquer l'effet spotlight
    // drawSpotlight();
    
    // Dessiner la lampe torche
    // drawFlashlight();
    
    // Continuer l'animation
    requestAnimationFrame(animate);
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

})
