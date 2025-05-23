<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Effet Spotlight</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            overflow: hidden;
            cursor: none;
        }

        .container {
            position: relative;
            width: 100vw;
            height: 100vh;
            background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            pointer-events: none;
            transition: background 0.3s ease;
        }

        .spotlight {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(
                circle,
                transparent 0%,
                transparent 40%,
                rgba(0, 0, 0, 0.1) 60%,
                rgba(0, 0, 0, 0.4) 80%,
                rgba(0, 0, 0, 0.8) 100%
            );
            mix-blend-mode: multiply;
            pointer-events: none;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease-out;
            z-index: 10;
        }

        .content {
            position: relative;
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: white;
            text-align: center;
            padding: 2rem;
        }

        .text-content {
            background: rgba(0, 0, 0, 0.3);
            padding: 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .text-content h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradient 3s ease-in-out infinite alternate;
        }

        .text-content p {
            font-size: 1.2rem;
            line-height: 1.6;
            opacity: 0.9;
        }

        @keyframes gradient {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }

        .instructions {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
            font-size: 0.9rem;
            z-index: 20;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="overlay"></div>
        <div class="spotlight" id="spotlight"></div>
        
        <div class="content">
            <div class="text-content">
                <h1>Effet Spotlight</h1>
                <p>Déplacez votre souris pour révéler l'image de fond à travers l'effet de lampe torche. L'overlay sombre s'efface progressivement dans un cercle qui suit votre curseur.</p>
            </div>
        </div>

        <div class="instructions">
            Bougez votre souris pour explorer l'image cachée derrière l'overlay sombre
        </div>
    </div>

    <script>
        const spotlight = document.getElementById('spotlight');
        const container = document.querySelector('.container');
        
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        
        // Initialiser la position du spotlight au centre
        spotlight.style.left = mouseX + 'px';
        spotlight.style.top = mouseY + 'px';

        // Fonction pour mettre à jour la position du spotlight
        function updateSpotlight(x, y) {
            spotlight.style.left = x + 'px';
            spotlight.style.top = y + 'px';
            
            // Créer un masque CSS dynamique pour l'overlay
            const overlay = document.querySelector('.overlay');
            overlay.style.maskImage = `radial-gradient(circle 150px at ${x}px ${y}px, transparent 0%, transparent 40%, black 70%)`;
            overlay.style.webkitMaskImage = `radial-gradient(circle 150px at ${x}px ${y}px, transparent 0%, transparent 40%, black 70%)`;
        }

        // Écouter le mouvement de la souris
        container.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            updateSpotlight(mouseX, mouseY);
        });

        // Effet au survol - agrandir le spotlight
        container.addEventListener('mouseenter', () => {
            spotlight.style.width = '350px';
            spotlight.style.height = '350px';
        });

        container.addEventListener('mouseleave', () => {
            spotlight.style.width = '300px';
            spotlight.style.height = '300px';
            // Repositionner au centre quand la souris quitte
            setTimeout(() => {
                updateSpotlight(window.innerWidth / 2, window.innerHeight / 2);
            }, 200);
        });

        // Initialiser l'effet
        updateSpotlight(mouseX, mouseY);

        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            if (!container.matches(':hover')) {
                mouseX = window.innerWidth / 2;
                mouseY = window.innerHeight / 2;
                updateSpotlight(mouseX, mouseY);
            }
        });
    </script>
</body>
</html>