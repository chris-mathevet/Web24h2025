<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Effet Spotlight Canvas</title>
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
            /* cursor: none; */
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
    </style>
</head>

<body>
    <script src="../assets/script/effectTextes.js"></script>

    <div id="text-container"></div>

    <canvas id="canvas"></canvas>
    <div class="loading" id="loading">Chargement de l'image...</div>

    <script type="module">
        import { afficherTexteScene } from '../assets/script/afficherTexte.js';
        afficherTexteScene("../assets/data/data.json", 0, document.getElementById("text-container"));
    </script>

</body>

</html>