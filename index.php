<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <!-- <meta name="viewport" content="width=device-width" /> -->
    <title>24h Info Web 2025</title>
  </head>
  <body>
    <h1>C'est les 24h de l'INFO !!!!!</h1>
    <img src="assets/img/julian.png" alt="My test image" />
    <img id="chris" src="assets/img/chris.png" style="display:none;width:100%; height:100%;" alt="My test image + commit" />

        <script>
        const image = document.getElementById("chris");

        setInterval(() => {
            image.style.display = (image.style.display === "none") ? "block" : "none";
        }, 1500);
    </script>


  </body>
</html>