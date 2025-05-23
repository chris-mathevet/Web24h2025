<!DOCTYPE html>
<html lang="fr">
<head>
    
    <meta charset="UTF-8">
    <title>Effet Spotlight Canvas</title>
    <meta name="viewport" content="width=1920px, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
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
    <canvas id="canvas" width="1920" height="1080"></canvas>
    <div class="loading" id="loading">Chargement de l'image...</div>
    <script src="../assets/script/effect.js"></script>
</body>
</html>                                                               