<!DOCTYPE html>
<html lang="fr">
<head>
    
    <meta charset="UTF-8">
    <title>Projet Lumière - JSremove 24H Info 2025</title>
    <meta name="viewport" content="width=1920px, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="../assets/style/style.css"/>

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
<body id="body">
    <h1 id="titre"></h1>
    <p id="score">0/1</p>
    <div id="text-container" style="display:none;"></div>

    <canvas id="canvas" width="1920" height="1080"></canvas>
    <div class="loading" id="loading">Chargement de l'image...</div>
    <script type="module" src="../assets/script/effect.js"></script>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        console.log(`Coordonnées du clic : x=${x}, y=${y}`);
        });
    </script>
</body>
</html>                                                               