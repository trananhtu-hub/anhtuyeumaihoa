/**
 * Romantic Love Confession Experience — Anh Tú ❤️ Mai Hoa
 * Creative Motion, Audio Engine & 3D Interactive State Machine
 */

(function () {
  'use strict';

  // ==========================================
  // CONFIGURATION & CONSTANTS
  // ==========================================
  const STAGES = {
    INTRO: 1,      // Stage 1: Mở món quà tình yêu (bouquet.png)
    BOUQUET: 2,    // Stage 2: Bó hoa dành riêng cho Mai Hoa (bouquet-photos.png)
    MEMORIES: 3,   // Stage 3: Khoảnh khắc kỷ niệm (3D Floating Gallery)
    LETTER: 4      // Stage 4 & 5: Lá thư tỏ tình & Tương tác kết thúc
  };

  let currentStage = STAGES.INTRO;
  let isTransitioning = false;
  let quotesInterval = null;
  let currentQuoteIndex = 0;

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const sceneBouquet = document.getElementById('sceneBouquet');
  const sceneMemories = document.getElementById('sceneMemories');
  const sceneLetter = document.getElementById('sceneLetter');

  const bouquetOriginal = document.getElementById('bouquetOriginal');
  const bouquetPhotos = document.getElementById('bouquetPhotos');
  const sparkleLayer = document.getElementById('sparkleLayer');
  const stage1Text = document.getElementById('stage1Text');
  const stage2Text = document.getElementById('stage2Text');

  const btnOpenGift = document.getElementById('btnOpenGift');
  const btnToMemories = document.getElementById('btnToMemories');
  const btnToLetter = document.getElementById('btnToLetter');
  const btnReplayAll = document.getElementById('btnReplayAll');
  const btnBackToMemories = document.getElementById('btnBackToMemories');

  const envelopePresentation = document.getElementById('envelopePresentation');
  const envelopeBox = document.getElementById('envelopeBox');
  const waxSeal = document.getElementById('waxSeal');
  const letterParchment = document.getElementById('letterParchment');
  const letterBodyScroll = document.getElementById('letterBodyScroll');

  const stepDots = document.querySelectorAll('.step-dot');
  const rain3dViewport = document.getElementById('rain3dViewport');
  const rain3dStage = document.getElementById('rain3dStage');

  // Audio Elements
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicDisc = document.getElementById('musicDisc');
  const equalizer = document.getElementById('equalizer');
  const musicLabel = document.getElementById('musicLabel');

  // ==========================================
  // SINGLETON AUDIO SYSTEM
  // ==========================================
  const bgMusic = new Audio('assets/music.mp3');
  bgMusic.loop = true;
  bgMusic.preload = 'auto';
  let isMusicPlaying = false;
  let audioUnlocked = false;

  function setMusicPlayingState(playing) {
    isMusicPlaying = playing;
    if (playing) {
      musicDisc.classList.add('playing');
      equalizer.classList.add('active');
      musicLabel.textContent = 'Giai điệu tình yêu';
    } else {
      musicDisc.classList.remove('playing');
      equalizer.classList.remove('active');
      musicLabel.textContent = 'Tạm dừng nhạc';
    }
  }

  function fadeInMusic(duration = 2000, targetVolume = 0.75) {
    bgMusic.volume = 0;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setMusicPlayingState(true);
          const steps = 20;
          const stepTime = duration / steps;
          const volStep = targetVolume / steps;
          let currentVol = 0;
          const volInterval = setInterval(() => {
            currentVol += volStep;
            if (currentVol >= targetVolume) {
              bgMusic.volume = targetVolume;
              clearInterval(volInterval);
            } else {
              bgMusic.volume = currentVol;
            }
          }, stepTime);
        })
        .catch(() => {
          setMusicPlayingState(false);
        });
    }
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      bgMusic.pause();
      setMusicPlayingState(false);
    } else {
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            bgMusic.volume = 0.75;
            setMusicPlayingState(true);
          })
          .catch(() => {
            setMusicPlayingState(false);
          });
      }
    }
  }

  function unlockAudioOnFirstInteraction() {
    if (!audioUnlocked) {
      audioUnlocked = true;
      if (!isMusicPlaying) {
        fadeInMusic();
      }
      ['click', 'touchstart', 'keydown'].forEach(evt => {
        document.removeEventListener(evt, unlockAudioOnFirstInteraction);
      });
    }
  }

  ['click', 'touchstart', 'keydown'].forEach(evt => {
    document.addEventListener(evt, unlockAudioOnFirstInteraction, { once: true });
  });

  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    audioUnlocked = true;
    toggleMusic();
  });

  // ==========================================
  // SPARKLE BURST GENERATOR (STAGE 2)
  // ==========================================
  function createSparkleBurst() {
    sparkleLayer.innerHTML = '';
    const numSparkles = 28;
    for (let i = 0; i < numSparkles; i++) {
      const dot = document.createElement('div');
      dot.className = 'sparkle-burst-dot';
      
      const angle = (Math.PI * 2 * i) / numSparkles + (Math.random() * 0.4 - 0.2);
      const distance = 80 + Math.random() * 140;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      dot.style.setProperty('--tx', `${tx}px`);
      dot.style.setProperty('--ty', `${ty}px`);
      dot.style.left = '50%';
      dot.style.top = '45%';
      dot.style.animationDelay = `${Math.random() * 0.25}s`;
      
      sparkleLayer.appendChild(dot);
    }

    setTimeout(() => {
      sparkleLayer.innerHTML = '';
    }, 2200);
  }

  // ==========================================
  // STAGE 3: 3D RAIN OF MEMORIES ENGINE
  // ==========================================
  const LOVE_SENTENCES = [
    'Anh Tú yêu Mai Hoa nhiều lắmmm',
    'Yêu Mai Hoa nhất trên đời',
    'Mai Hoa có yêu anh hông zọoo',
    'Mai Hoa của chồng Tú là xinh nhất',
    'Mai Hoa đáng yêu quá điiiiii',
    'chồng Tú mê vợ Hoa quáaaa'
  ];

  const PHOTO_ITEMS = [
    { src: 'assets/face-1.png', tag: 'Ngôi sao sáng nhất ✨' },
    { src: 'assets/face-2.png', tag: 'Ánh mắt dịu dàng 💖' },
    { src: 'assets/face-3.png', tag: 'Nụ cười thiên thần 🌸' },
    { src: 'assets/face-4.png', tag: 'Hóm hỉnh tinh nghịch 🥰' },
    { src: 'assets/face-5.png', tag: 'Người con gái anh thương ❤️' }
  ];

  let rainItems = [];
  let rainAnimationFrame = null;
  let isRainActive = false;
  let rainStageWidth = window.innerWidth;
  let rainStageHeight = window.innerHeight;

  // Parallax angles
  let targetParallaxY = 0;
  let targetParallaxX = 0;
  let currentParallaxY = 0;
  let currentParallaxX = 0;

  function init3dRain() {
    if (!rain3dStage) return;
    rain3dStage.innerHTML = '';
    rainItems = [];

    const isMobile = window.innerWidth < 768;
    const numPhotos = isMobile ? 6 : 9;
    const numTexts = isMobile ? 12 : 18;

    rainStageWidth = rain3dViewport ? rain3dViewport.clientWidth : window.innerWidth;
    rainStageHeight = rain3dViewport ? rain3dViewport.clientHeight : window.innerHeight;

    // 1. Create Photo Rain Items
    for (let i = 0; i < numPhotos; i++) {
      const photoData = PHOTO_ITEMS[i % PHOTO_ITEMS.length];
      const el = document.createElement('div');
      el.className = 'rain-item rain-item-photo';

      const frame = document.createElement('div');
      frame.className = 'rain-photo-frame';

      const inner = document.createElement('div');
      inner.className = 'rain-photo-inner';

      const img = document.createElement('img');
      img.src = photoData.src;
      img.alt = photoData.tag;
      img.className = 'rain-photo-img';
      img.loading = 'eager';

      const tag = document.createElement('div');
      tag.className = 'rain-photo-tag';
      tag.textContent = photoData.tag;

      inner.appendChild(img);
      frame.appendChild(inner);
      frame.appendChild(tag);
      el.appendChild(frame);
      rain3dStage.appendChild(el);

      // Depth layer assignment
      const layerRand = Math.random();
      let z, baseWidth, baseHeight, speed, targetOpacity;

      if (layerRand < 0.28) {
        // Foreground (near)
        z = 70 + Math.random() * 140;
        baseWidth = isMobile ? 115 : 155;
        baseHeight = isMobile ? 150 : 200;
        speed = 1.9 + Math.random() * 0.9;
        targetOpacity = 0.96;
      } else if (layerRand < 0.72) {
        // Midground
        z = -70 + Math.random() * 120;
        baseWidth = isMobile ? 95 : 125;
        baseHeight = isMobile ? 125 : 165;
        speed = 1.3 + Math.random() * 0.7;
        targetOpacity = 0.88;
      } else {
        // Background (far)
        z = -420 + Math.random() * 260;
        baseWidth = isMobile ? 75 : 95;
        baseHeight = isMobile ? 100 : 130;
        speed = 0.85 + Math.random() * 0.5;
        targetOpacity = 0.65;
      }

      el.style.width = `${baseWidth}px`;
      el.style.height = `${baseHeight}px`;

      // Horizontal spread across width
      const baseX = (Math.random() - 0.5) * (rainStageWidth * 0.92);
      // Vertical stagger so rain is already falling across the entire stage
      const y = -120 + (i / numPhotos) * (rainStageHeight + 200) + (Math.random() * 60 - 30);

      const item = {
        type: 'photo',
        el: el,
        baseX: baseX,
        x: baseX,
        y: y,
        z: z,
        speed: speed,
        targetOpacity: targetOpacity,
        rotX: (Math.random() - 0.5) * 16,
        rotY: (Math.random() - 0.5) * 20,
        rotZ: (Math.random() - 0.5) * 16,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.8 + Math.random() * 0.8,
        driftAmp: 18 + Math.random() * 25,
        isHighlighted: false
      };

      // Tap / Click Interaction on Photo
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerPhotoHighlight(item);
      });

      rainItems.push(item);
    }

    // 2. Create Text Rain Items
    for (let i = 0; i < numTexts; i++) {
      const sentence = LOVE_SENTENCES[i % LOVE_SENTENCES.length];
      const el = document.createElement('div');
      el.className = 'rain-item rain-item-text';
      el.textContent = sentence;
      rain3dStage.appendChild(el);

      const layerRand = Math.random();
      let z, fontSize, speed, targetOpacity;

      if (layerRand < 0.3) {
        // Foreground (near)
        z = 60 + Math.random() * 150;
        fontSize = isMobile ? 1.4 : 1.95;
        speed = 1.8 + Math.random() * 0.85;
        targetOpacity = 0.96;
      } else if (layerRand < 0.72) {
        // Midground
        z = -70 + Math.random() * 110;
        fontSize = isMobile ? 1.15 : 1.45;
        speed = 1.25 + Math.random() * 0.6;
        targetOpacity = 0.85;
      } else {
        // Background (far)
        z = -420 + Math.random() * 260;
        fontSize = isMobile ? 0.95 : 1.15;
        speed = 0.8 + Math.random() * 0.45;
        targetOpacity = 0.6;
      }

      el.style.fontSize = `${fontSize}rem`;

      const baseX = (Math.random() - 0.5) * (rainStageWidth * 0.88);
      const y = -100 + (i / numTexts) * (rainStageHeight + 200) + (Math.random() * 50 - 25);

      const item = {
        type: 'text',
        el: el,
        baseX: baseX,
        x: baseX,
        y: y,
        z: z,
        speed: speed,
        targetOpacity: targetOpacity,
        rotX: (Math.random() - 0.5) * 12,
        rotY: (Math.random() - 0.5) * 16,
        rotZ: (Math.random() - 0.5) * 14,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.9 + Math.random() * 0.7,
        driftAmp: 16 + Math.random() * 22,
        textIndex: i % LOVE_SENTENCES.length
      };

      rainItems.push(item);
    }
  }

  // Highlight Photo on Click
  function triggerPhotoHighlight(item) {
    if (item.isHighlighted) return;
    item.isHighlighted = true;
    item.el.classList.add('highlighted');

    // Spawn 5 floating sparkle hearts
    const rect = item.el.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const hearts = ['❤️', '💖', '✨', '🌸', '💕'];

    for (let i = 0; i < 5; i++) {
      const h = document.createElement('span');
      h.className = 'floating-click-heart';
      h.textContent = hearts[i % hearts.length];
      const angle = (Math.PI * 2 * i) / 5;
      const dist = 45 + Math.random() * 40;
      h.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      h.style.setProperty('--ty', `${Math.sin(angle) * dist - 25}px`);
      h.style.left = `${centerX}px`;
      h.style.top = `${centerY}px`;
      item.el.appendChild(h);

      setTimeout(() => h.remove(), 1200);
    }

    setTimeout(() => {
      item.isHighlighted = false;
      item.el.classList.remove('highlighted');
    }, 1300);
  }

  // 3D Rain Loop
  function update3dRain(time) {
    if (!isRainActive) return;

    // Parallax interpolation
    currentParallaxX += (targetParallaxX - currentParallaxX) * 0.06;
    currentParallaxY += (targetParallaxY - currentParallaxY) * 0.06;

    if (rain3dStage) {
      // Gentle ambient sine wave tilt combined with mouse parallax
      const autoSwayY = Math.sin(time * 0.0008) * 2.5;
      const autoSwayX = Math.cos(time * 0.0006) * 1.8;
      rain3dStage.style.transform = `rotateX(${currentParallaxX + autoSwayX}deg) rotateY(${currentParallaxY + autoSwayY}deg)`;
    }

    const stageH = rainStageHeight || window.innerHeight;
    const stageW = rainStageWidth || window.innerWidth;

    for (let i = 0; i < rainItems.length; i++) {
      const it = rainItems[i];

      // If highlighted, slow down fall to let viewer admire
      const currentSpeed = it.isHighlighted ? it.speed * 0.25 : it.speed;
      it.y += currentSpeed;

      // Slight horizontal drift
      const drift = Math.sin(time * 0.001 * it.driftSpeed + it.driftPhase) * it.driftAmp;
      it.x = it.baseX + drift;

      // Opacity fade in at top and fade out at bottom
      let opacity = it.targetOpacity;
      if (it.y < 80) {
        opacity = Math.max(0, it.targetOpacity * ((it.y + 100) / 180));
      } else if (it.y > stageH - 120) {
        opacity = Math.max(0, it.targetOpacity * ((stageH + 120 - it.y) / 240));
      }

      it.el.style.opacity = opacity.toFixed(3);
      it.el.style.transform = `translate3d(${it.x.toFixed(1)}px, ${it.y.toFixed(1)}px, ${it.z.toFixed(1)}px) rotateX(${it.rotX.toFixed(1)}deg) rotateY(${it.rotY.toFixed(1)}deg) rotateZ(${it.rotZ.toFixed(1)}deg)`;

      // Respawn when fallen below viewport
      if (it.y > stageH + 140) {
        it.y = -100 - Math.random() * 120;
        it.baseX = (Math.random() - 0.5) * (stageW * 0.92);
        it.rotX = (Math.random() - 0.5) * 16;
        it.rotY = (Math.random() - 0.5) * 20;
        it.rotZ = (Math.random() - 0.5) * 16;

        // If text, cycle phrase
        if (it.type === 'text') {
          it.textIndex = (it.textIndex + 1) % LOVE_SENTENCES.length;
          it.el.textContent = LOVE_SENTENCES[it.textIndex];
        }
      }
    }

    rainAnimationFrame = requestAnimationFrame(update3dRain);
  }

  function start3dRain() {
    if (isRainActive) return;
    isRainActive = true;
    if (rainItems.length === 0) {
      init3dRain();
    }
    rainAnimationFrame = requestAnimationFrame(update3dRain);
  }

  function stop3dRain() {
    isRainActive = false;
    if (rainAnimationFrame) {
      cancelAnimationFrame(rainAnimationFrame);
      rainAnimationFrame = null;
    }
  }

  // Setup Mouse Parallax for Stage 3 Rain
  function setupRainParallax() {
    window.addEventListener('mousemove', (e) => {
      if (currentStage !== STAGES.MEMORIES) return;
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      targetParallaxY = Math.max(-8, Math.min(8, x * 8));
      targetParallaxX = Math.max(-6, Math.min(6, -y * 6));
    });

    window.addEventListener('resize', () => {
      rainStageWidth = rain3dViewport ? rain3dViewport.clientWidth : window.innerWidth;
      rainStageHeight = rain3dViewport ? rain3dViewport.clientHeight : window.innerHeight;
      if (isRainActive) {
        init3dRain();
      }
    });
  }

  // ==========================================
  // ENVELOPE OPENING & LETTER ANIMATION (STAGE 4)
  // ==========================================
  let letterOpened = false;

  function triggerOpenEnvelope() {
    if (letterOpened) return;
    letterOpened = true;

    envelopePresentation.classList.add('unfolding');

    setTimeout(() => {
      envelopePresentation.classList.add('opened');
      letterParchment.classList.add('active');
      if (letterBodyScroll) {
        letterBodyScroll.scrollTop = 0;
      }
    }, 700);
  }

  function resetLetterState() {
    letterOpened = false;
    envelopePresentation.classList.remove('unfolding', 'opened');
    letterParchment.classList.remove('active');
    if (letterBodyScroll) {
      letterBodyScroll.scrollTop = 0;
    }
  }

  envelopeBox.addEventListener('click', triggerOpenEnvelope);
  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerOpenEnvelope();
  });

  // ==========================================
  // STATE MACHINE & TRANSITIONS
  // ==========================================
  function updateStepper(step) {
    stepDots.forEach((dot) => {
      const dotStep = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.toggle('active', dotStep === step);
    });
  }

  function goToStage(targetStage) {
    if (isTransitioning || targetStage === currentStage) return;
    isTransitioning = true;

    // Exit current stage
    if (currentStage === STAGES.INTRO || currentStage === STAGES.BOUQUET) {
      if (targetStage >= STAGES.MEMORIES) {
        sceneBouquet.classList.remove('active');
        sceneBouquet.classList.add('exiting');
      }
    } else if (currentStage === STAGES.MEMORIES) {
      stop3dRain();
      sceneMemories.classList.remove('active');
      sceneMemories.classList.add('exiting');
    } else if (currentStage === STAGES.LETTER) {
      sceneLetter.classList.remove('active');
      sceneLetter.classList.add('exiting');
    }

    setTimeout(() => {
      // Clean up previous scenes
      [sceneBouquet, sceneMemories, sceneLetter].forEach(s => s.classList.remove('exiting'));

      currentStage = targetStage;
      updateStepper(currentStage);

      if (currentStage === STAGES.INTRO) {
        sceneBouquet.classList.add('active');
        bouquetOriginal.classList.add('active');
        bouquetPhotos.classList.remove('active');
        stage1Text.classList.add('active');
        stage2Text.classList.remove('active');
        resetLetterState();
      } else if (currentStage === STAGES.BOUQUET) {
        sceneBouquet.classList.add('active');
        bouquetOriginal.classList.remove('active');
        bouquetPhotos.classList.add('active');
        stage1Text.classList.remove('active');
        stage2Text.classList.add('active');
        createSparkleBurst();
      } else if (currentStage === STAGES.MEMORIES) {
        sceneBouquet.classList.remove('active');
        sceneMemories.classList.add('active');
        start3dRain();
      } else if (currentStage === STAGES.LETTER) {
        sceneMemories.classList.remove('active');
        sceneLetter.classList.add('active');
        // Auto unfold after brief moment if not unfolded
        setTimeout(() => {
          if (!letterOpened && currentStage === STAGES.LETTER) {
            triggerOpenEnvelope();
          }
        }, 900);
      }

      isTransitioning = false;
    }, 550);
  }

  // Buttons Event Handlers
  btnOpenGift.addEventListener('click', () => {
    goToStage(STAGES.BOUQUET);
  });

  btnToMemories.addEventListener('click', () => {
    goToStage(STAGES.MEMORIES);
  });

  btnToLetter.addEventListener('click', () => {
    goToStage(STAGES.LETTER);
  });

  btnReplayAll.addEventListener('click', () => {
    goToStage(STAGES.INTRO);
  });

  btnBackToMemories.addEventListener('click', () => {
    goToStage(STAGES.MEMORIES);
  });

  // Stepper dots click
  stepDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-step'), 10);
      goToStage(target);
    });
  });

  // ==========================================
  // AMBIENT COSMIC PARTICLES & PETALS CANVAS
  // ==========================================
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle models
  const stars = [];
  const numStars = 60;
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      phase: Math.random() * Math.PI * 2,
      isGold: Math.random() > 0.5
    });
  }

  // Bokeh circles
  const bokehs = [];
  const numBokeh = 16;
  for (let i = 0; i < numBokeh; i++) {
    bokehs.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 55 + 25,
      alpha: Math.random() * 0.05 + 0.02,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      hue: Math.random() > 0.4 ? '345, 85%, 65%' : '42, 75%, 65%'
    });
  }

  // Soft Rose Petals
  const petals = [];
  const numPetals = 18;
  for (let i = 0; i < numPetals; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 10 + 9,
      speedY: Math.random() * 0.7 + 0.35,
      speedX: (Math.random() - 0.5) * 0.4,
      angle: Math.random() * 360,
      spinSpeed: (Math.random() - 0.5) * 1.2,
      oscillation: Math.random() * 2 + 1,
      oscSpeed: Math.random() * 0.02 + 0.01,
      alpha: Math.random() * 0.45 + 0.25
    });
  }

  let animationFrameId = null;
  let isCanvasPaused = false;

  function renderAmbientCanvas(time) {
    if (isCanvasPaused) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Bokeh Orbs
    bokehs.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < -b.radius) b.x = width + b.radius;
      if (b.x > width + b.radius) b.x = -b.radius;
      if (b.y < -b.radius) b.y = height + b.radius;
      if (b.y > height + b.radius) b.y = -b.radius;

      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
      grad.addColorStop(0, `hsla(${b.hue}, ${b.alpha})`);
      grad.addColorStop(1, `hsla(${b.hue}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Draw Twinkling Stardust
    stars.forEach(s => {
      s.phase += s.twinkleSpeed;
      const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.isGold ? `rgba(240, 210, 150, ${currentAlpha})` : `rgba(255, 200, 215, ${currentAlpha})`;
      ctx.shadowBlur = s.radius * 3;
      ctx.shadowColor = s.isGold ? 'rgba(230, 190, 120, 0.5)' : 'rgba(255, 140, 180, 0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 3. Draw Soft Drifting Rose Petals
    petals.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(time * 0.001 * p.oscSpeed) * 0.6;
      p.angle += p.spinSpeed;

      if (p.y > height + 40) {
        p.y = -30;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.8, p.size * 1.2, p.size * 0.3, 0, p.size * 1.3);
      ctx.bezierCurveTo(-p.size * 1.2, p.size * 0.3, -p.size * 0.6, -p.size * 0.8, 0, 0);
      
      const petalGrad = ctx.createLinearGradient(0, -p.size * 0.5, 0, p.size * 1.2);
      petalGrad.addColorStop(0, `rgba(255, 140, 170, ${p.alpha})`);
      petalGrad.addColorStop(1, `rgba(180, 30, 65, ${p.alpha * 0.8})`);
      
      ctx.fillStyle = petalGrad;
      ctx.fill();
      ctx.restore();
    });

    animationFrameId = requestAnimationFrame(renderAmbientCanvas);
  }

  // Handle visibility pause
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isCanvasPaused = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      isCanvasPaused = false;
      animationFrameId = requestAnimationFrame(renderAmbientCanvas);
    }
  });

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    setupRainParallax();
    animationFrameId = requestAnimationFrame(renderAmbientCanvas);
    updateStepper(currentStage);
  }

  // Start experience on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
