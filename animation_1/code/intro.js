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
  BG_lumin: new Image()
};

images.rideauGauche.src = assets_src+'rideau_gauche.png';
images.rideauMilieu.src = assets_src+'rideau_haut.png';
images.rideauDroite.src = assets_src+'rideau_droit.png';
images.vitrine.src = assets_src+'vitrine2.png';
images.vitrineCassee.src = assets_src+'vitrine_casse2.png';

images.BG_sombre.src = assets_src+'confluence_sombre.jpg';
images.BG_lumin.src = assets_src+'confluence.jpg';

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





const imageObjects = Object.values(images)
  .filter(img => img instanceof HTMLImageElement);

Promise.all(
  imageObjects.map(img => new Promise(resolve => img.onload = resolve))
).then(() => {
  draw();
});



canvas.addEventListener('click', () => {
  if (introVisible) {
    introVisible = false;
    state = 'allum';
    animateOuverture();
    return;
  }
  // if (state === 'rideaux') {
  //   state = 'allum';
  //   animateOuverture();
  // } 
  else if (state === 'vitrine') {
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
  } if (state === 'eteint') {
    draw(); // ou autre action
    setTimeout(() => {
      showExclamation = true;
      draw(); // redraw pour afficher bulle
      setTimeout(() => {
        showExclamation = false;
        draw();
      }, 5000);
    }, 3000);
    
  }
});


function fin_animation(){
  location.href("./pages/page.php")
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
    const padding = 20;
    const width = 200;
    const height = 60;
    const x = (canvas.width - width) / 2;
    const y = canvas.height - height - 40;

    // fond bulle semi-transparent, arrondi
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, width, height, 15, true, true);

    // texte
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('!!!', canvas.width / 2, y + height / 1.6);
  }


}

function shakeVitrine(duration = 300, intensity = 10) {
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
