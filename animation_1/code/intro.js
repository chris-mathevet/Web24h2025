const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

const assets_src = "./animation_1/assets/"

// Chargement des images
const images = {
  rideauGauche: new Image(),
  rideauMilieu: new Image(),
  rideauDroite: new Image(),
  vitrine: new Image(),
  vitrineCassee: new Image(),

  BG_sombre: new Image(),
  BG_lumin: new Image(),

  bateau_musee: new Image(),
  bateau_justice: new Image(),
  noir: new Image()
};

images.rideauGauche.src = assets_src+'rideau_gauche.png';
images.rideauMilieu.src = assets_src+'rideau_haut.png';
images.rideauDroite.src = assets_src+'rideau_droit.png';
images.vitrine.src = assets_src+'vitrine2.png';
images.vitrineCassee.src = assets_src+'vitrine_casse2.png';

images.BG_sombre.src = assets_src+'confluence_sombre.jpg';
images.BG_lumin.src = assets_src+'confluence.jpg';

images.bateau_musee.src = assets_src+'musee.png';
images.bateau_justice.src = assets_src+'justice.png';
images.noir.src = assets_src+'noir.png';

let state = 'rideaux'; // 'rideaux', 'ouverture', 'vitrine', 'cassée'
let ouvertureProgress = 0;

let click_a_casser = 5;

let shakeOffsetX = 0;
let shakeOffsetY = 0;
let isShaking = false;


let glassShards = [];
let isBreaking = false;

images.shards = [];

for (let i = 1; i <= 5; i++) {
  const img = new Image();
  img.src = assets_src + `verrre${i}.png`;
  images[`verre${i}`] = img;
  images.shards.push(img);
}

let introVisible = true;
let showExclamation = false;

let isFadingOut = false;
let fadeOpacity = 0;

let fadeImage = null;
let fadeImageOpacity = 0;
let fadeImageX = 0;
let fadeImageY = 0;
let fadeImageWidth = 0;
let fadeImageHeight = 0;
let fadePhase = null; // 'in', 'hold', 'out'

let clickLocked = false; // état du verrou
let inrun = false;





let impact = new Audio(assets_src+"impact.mp3");
let narration = new Audio(assets_src+"texte-1.mp3");



const imageObjects = Object.values(images)
  .filter(img => img instanceof HTMLImageElement);

Promise.all(
  imageObjects.map(img => new Promise(resolve => img.onload = resolve))
).then(() => {
  draw();
});



canvas.addEventListener('click', () => {
  if (clickLocked) return; // ignore le clic s'il est trop tôt
  clickLocked = true;
  setTimeout(() => clickLocked = false, 200); // relâche le verrou après 200ms

  if (introVisible) {
    narration.play();
    let rideau = new Audio(assets_src + "rideau.mp3");
    rideau.play();
    introVisible = false;
    state = 'allum';
    animateOuverture();
    return;
  }

  if (state === 'vitrine') {
    click_a_casser--;
    shakeVitrine();
    if (click_a_casser <= 0) {
      state = 'eteint';
      const vitrineWidth = canvas.width * 0.25;
      const vitrineHeight = vitrineWidth;
      const vitrineX = (canvas.width - vitrineWidth) / 2;
      const vitrineY = (canvas.height - vitrineHeight) / 1.8;
      startGlassBreakAnimation(vitrineX, vitrineY, vitrineWidth, vitrineHeight);
    }
  }

  if (state === 'eteint' && inrun == false) {
    inrun = true;
    narration = new Audio(assets_src + "Texte-2.mp3");
    narration.pause();
    narration.currentTime = 0;
    narration.play();

    draw(); // ou autre action
    setTimeout(() => {
      showExclamation = true;
      draw(); // redraw pour afficher bulle
      setTimeout(() => {
        showExclamation = false;
        draw();
        setTimeout(() => {
          isFadingOut = true;
          fadeOpacity = 0;
          animateFadeOut();
        }, 6000);
      }, 3000);
    }, 3000);
  }
});


async function animateFadeOut() {
  return new Promise(resolve => {
    const fadeInterval = setInterval(() => {
      fadeOpacity += 0.02;
      if (fadeOpacity >= 1) {
        fadeOpacity = 1;
        clearInterval(fadeInterval);
        resolve(); // fin du fade-out
      }
      draw(); // Redessine avec le fondu
    }, 30);
  }).then(async () => {
    // Attendre 5 secondes après le fondu noir complet
    
    narration = new Audio(assets_src+"Texte-4.mp3")
    narration.pause()
    narration.currentTime=0;
    narration.play();

    let son_fond = new Audio(assets_src+"bruits_pas.mp3");
    son_fond.pause();
    son_fond.currentTime = 0;
    son_fond.play();


    await sleep(7000);
    
    
    son_fond.pause();
    son_fond = new Audio(assets_src+"moteur_bateau_court.mp3");
    son_fond.currentTime = 0;
    son_fond.play();

    await sleep(5000);

    // // Affiche la première image
    // showImageWithFade(
    //   images.bateau_musee,
    //   0,
    //   0,
    //   canvas.width,
    //   canvas.height,
    //   5000
    // );

    // while (fadeImage != null) {await sleep(500);}
    // await sleep(2000); // délai partiel avant la seconde image

    // showImageWithFade(
    //   images.bateau_justice,
    //   0,
    //   0,
    //   canvas.width,
    //   canvas.height,
    //   5000
    // );

    // while (fadeImage != null) {await sleep(500);}
    setTimeout(()=>{fin_animation();}, 2000)
    

    // Tu peux enchaîner ici une autre étape si tu veux
    // await sleep(6000); // etc.
  });
}


function showImageWithFade(img, x, y, width, height, duration = 5000) {
  fadeImage = img;
  fadeImageX = x;
  fadeImageY = y;
  fadeImageWidth = width;
  fadeImageHeight = height;
  fadeImageOpacity = 0;
  fadePhase = 'in';

  const fadeInSpeed = 0.01;
  const fadeOutSpeed = 0.01;

  const interval = setInterval(() => {
    if (fadePhase === 'in') {
      fadeImageOpacity += fadeInSpeed;
      if (fadeImageOpacity >= 1) {
        fadeImageOpacity = 1;
        fadePhase = 'hold';

        // après "duration" ms, passe à la phase de disparition
        setTimeout(() => {
          fadePhase = 'out';
        }, duration);
      }
    } else if (fadePhase === 'out') {
      fadeImageOpacity -= fadeOutSpeed;
      if (fadeImageOpacity <= 0) {
        fadeImageOpacity = 0;
        fadeImage = null;
        fadePhase = null;
        clearInterval(interval);
      }
    }

    draw(); // redraw la scène
  }, 30);
}



function fin_animation(){
  window.location.href = "./pages/scene.php?scene=0";
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (state === 'rideaux' || state === 'allum') {
    const offset = ouvertureProgress * 300; // ajuste la vitesse/distance
    let offset_H = 0

    if (ouvertureProgress >= 1) {
      offset_H = (ouvertureProgress-1) * 100
      console.log(offset_H)
    }

    const bg_width = canvas.width;
    const bg_height = canvas.height;
    ctx.drawImage(images.BG_lumin, 0, 0, bg_width, bg_height);
    

    const vitrineWidth = canvas.width * 0.25;
    const vitrineHeight = vitrineWidth;
    const vitrineX = (canvas.width - vitrineWidth) / 2;
    const vitrineY = (canvas.height - vitrineHeight) / 1.4;
    ctx.drawImage(images.vitrine, vitrineX, vitrineY, vitrineWidth, vitrineHeight);

    ctx.drawImage(images.rideauGauche, -offset, 0);
    ctx.drawImage(images.rideauDroite, canvas.width - images.rideauDroite.width + offset, 0);
    ctx.drawImage(images.rideauMilieu, 0, -offset_H, canvas.width, canvas.height);
  }

  if (state === 'vitrine'){
    const bg_width = canvas.width;
    const bg_height = canvas.height;
    ctx.drawImage(images.BG_lumin, 0, 0, bg_width, bg_height);
    

    const vitrineWidth = canvas.width * 0.25;
    const vitrineHeight = vitrineWidth;
    const vitrineX = (canvas.width - vitrineWidth) / 2;
    const vitrineY = (canvas.height - vitrineHeight) / 1.4;
    ctx.drawImage(images.vitrine, vitrineX + shakeOffsetX, vitrineY + shakeOffsetY, vitrineWidth, vitrineHeight);


  }

  if (state === 'eteint') {
    const bg_width = canvas.width;
    const bg_height = canvas.height;
    ctx.drawImage(images.BG_sombre, 0, 0, bg_width, bg_height);

    const vitrineWidth = canvas.width * 0.25;
    const vitrineHeight = vitrineWidth;
    const vitrineX = (canvas.width - vitrineWidth) / 2;
    const vitrineY = (canvas.height - vitrineHeight) / 1.4;
    ctx.drawImage(images.vitrineCassee, vitrineX, vitrineY, vitrineWidth, vitrineHeight);
  }
  if (isBreaking) {
    glassShards.forEach(shard => {
      ctx.save();
      ctx.translate(shard.x, shard.y);
      ctx.rotate(shard.rotation);
      ctx.drawImage(shard.img, -shard.size / 2, -shard.size / 2, shard.size, shard.size);
      ctx.restore();
    });
  }

  if (introVisible) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText('LES LUMIERES DE LA CONFLUENCES', canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('Ceci est une experience interactive et auditive', canvas.width / 2, canvas.height / 2 +20);
    
    ctx.font = '20px sans-serif';
    ctx.fillText("Cliquez pour commencer (nous vous conseillons d'avoir le son activé)", canvas.width / 2, canvas.height / 2 + 48);
  }


  if (showExclamation) {
    narration = new Audio(assets_src+"texte-3.mp3");
    narration.pause()
    narration.currentTime=0;
    narration.play();
    const padding = 20;
    const width = 200;
    const height = 60;
    const x = (canvas.width - width) / 2;
    const y = canvas.height - height - 40;

    // fond bulle semi-transparent, arrondi
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, width, height, 15, true, true);

    // texte
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('!!!', canvas.width / 2, y + height / 1.6);
  }

  if (isFadingOut) {
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (fadeImage && fadePhase) {
    console.log(fadeImage)
    ctx.save();
    ctx.globalAlpha = fadeImageOpacity;
    ctx.drawImage(fadeImage, fadeImageX, fadeImageY, fadeImageWidth, fadeImageHeight);
    ctx.restore();
  }




}

function shakeVitrine(duration = 300, intensity = 10) {
  impact.pause();
  impact.currentTime = 0;
  impact.play();

  if (isShaking) return; // évite de relancer si déjà en cours

  isShaking = true;
  const startTime = performance.now();

  function animateShake(time) {
    const elapsed = time - startTime;
    if (elapsed < duration) {
      // Génère une vibration aléatoire autour de 0
      shakeOffsetX = (Math.random() - 0.5) * intensity;
      shakeOffsetY = (Math.random() - 0.5) * intensity;
      draw();
      requestAnimationFrame(animateShake);
    } else {
      // Fin du tremblement
      shakeOffsetX = 0;
      shakeOffsetY = 0;
      isShaking = false;
      draw();
    }
  }

  requestAnimationFrame(animateShake);
}

function startGlassBreakAnimation(vitrineX, vitrineY, vitrineWidth, vitrineHeight) {
  impact.pause();
  impact.currentTime = 0;
  impact.play();

  glassShards = [];

  for (let i = 0; i < 5; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;

    glassShards.push({
      x: vitrineX + vitrineWidth / 2,
      y: vitrineY + vitrineHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      img: images.shards[i],
      size: 200 + Math.random() * 30,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    });
  }

  isBreaking = true;
  impact = new Audio(assets_src+"impact_2.mp3");
  impact.pause();
  impact.currentTime = 0;
  impact.play();

  narration.pause();
  animateGlassBreak();
}


function animateGlassBreak() {
  const interval = setInterval(() => {
    glassShards.forEach(shard => {
      shard.x += shard.vx;
      shard.y += shard.vy;
      shard.vy += 0.3; // gravité
      shard.rotation += shard.rotationSpeed;
    });

    draw();

    if (glassShards.every(shard => shard.y > canvas.height + shard.size)) {
      clearInterval(interval);
      isBreaking = false;
    }


  }, 30);

}




function resizeCanvas() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Calcul du ratio 16:9
  let width = windowWidth;
  let height = (9 / 18) * width;

  if (height > windowHeight) {
    height = windowHeight;
    width = (18 / 9) * height;
    console.log(height)
    console.log(height * (18/9))
  }

  canvas.width = width;
  canvas.height = height;

  // Redessine selon le nouvel espace
  draw();
}

async function animateOuverture() {
  draw()
  await sleep(500);
  const interval = setInterval(() => {
    ouvertureProgress += 0.01;
    if (ouvertureProgress >= 1) {
      ouvertureProgress += 0.01;
      if (ouvertureProgress >= 2.5) {
        ouvertureProgress = 1;
        clearInterval(interval);
        state = 'vitrine';
      }
    }
    draw();
  }, 30);
}

// Ajuste au début et à chaque redimensionnement
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // appel initial


canvas.addEventListener('mousemove', (e) => {
  if (state !== 'vitrine') {
    canvas.classList.remove('cursor-marteau');
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const vitrineWidth = canvas.width * 0.25;
  const vitrineHeight = vitrineWidth;
  const vitrineX = (canvas.width - vitrineWidth) / 2;
  const vitrineY = (canvas.height - vitrineHeight) / 1.4;

  const isHovering =
    mouseX >= vitrineX &&
    mouseX <= vitrineX + vitrineWidth &&
    mouseY >= vitrineY &&
    mouseY <= vitrineY + vitrineHeight;

  if (isHovering) {
    canvas.classList.add('cursor-marteau');
  } else {
    canvas.classList.remove('cursor-marteau');
  }
});







function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof r === 'undefined') {
    r = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}



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