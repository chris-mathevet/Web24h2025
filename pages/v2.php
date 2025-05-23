<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Effet Spotlight Canvas</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            overflow: hidden;
            background: #000;
            cursor: none;
        }

        #canvas {
            display: block;
            background: #000;
        }

        .instructions {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.8);
            text-align: center;
            font-size: 1rem;
            z-index: 10;
            background: rgba(0, 0, 0, 0.5);
            padding: 1rem 2rem;
            border-radius: 25px;
            backdrop-filter: blur(10px);
        }

        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 1.2rem;
            z-index: 5;
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <div class="loading" id="loading">Chargement de l'image...</div>
    <div class="instructions" id="instructions" style="display: none;">
        Déplacez votre souris pour explorer l'image cachée avec l'effet spotlight
    </div>

    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const loading = document.getElementById('loading');
        const instructions = document.getElementById('instructions');

        // Variables pour l'effet
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        let image = null;
        let imageLoaded = false;

        // Paramètres de l'effet
        const spotlightRadius = 150;
        const gradientSize = 100;
        const smoothing = 0.15;
        const overlayOpacity = 0.85;

        // Redimensionner le canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
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
                instructions.style.display = 'block';
                mouseX = targetX = canvas.width / 2;
                mouseY = targetY = canvas.height / 2;
                animate();
            };
            image.onerror = function() {
                loading.textContent = 'Erreur de chargement - utilisation d\'un dégradé';
                imageLoaded = true;
                instructions.style.display = 'block';
                mouseX = targetX = canvas.width / 2;
                mouseY = targetY = canvas.height / 2;
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

        // Créer l'effet spotlight
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
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(0.8, `rgba(0, 0, 0, ${overlayOpacity * 0.3})`);
            gradient.addColorStop(1, `rgba(0, 0, 0, ${overlayOpacity})`);

            overlayCtx.globalCompositeOperation = 'destination-out';
            overlayCtx.beginPath();
            overlayCtx.arc(mouseX, mouseY, spotlightRadius, 0, Math.PI * 2);
            overlayCtx.fill();

            // Ajouter le dégradé
            overlayCtx.globalCompositeOperation = 'source-over';
            overlayCtx.fillStyle = gradient;
            overlayCtx.beginPath();
            overlayCtx.arc(mouseX, mouseY, spotlightRadius + gradientSize, 0, Math.PI * 2);
            overlayCtx.fill();

            // Appliquer l'overlay sur le canvas principal
            ctx.drawImage(overlayCanvas, 0, 0);
        }

        // Animation principale
        function animate() {
            // Effacer le canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Dessiner l'image de fond
            drawBackground();
            
            // Appliquer l'effet spotlight
            drawSpotlight();
            
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
            instructions.style.display = 'none';
            
            const newImage = new Image();
            newImage.crossOrigin = 'anonymous';
            newImage.onload = function() {
                image = newImage;
                imageLoaded = true;
                loading.style.display = 'none';
                instructions.style.display = 'block';
            };
            newImage.src = url;
        };
    </script>
</body>
</html>