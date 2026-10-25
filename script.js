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
  const loveQuotes = document.querySelectorAll('.love-quote');
  const galleryViewport = document.getElementById('gallery3dViewport');
  const galleryCarousel = document.getElementById('gallery3dCarousel');
  const memoryCards = document.querySelectorAll('.memory-card');

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
  // 3D GALLERY & LOVE QUOTES ROTATOR (STAGE 3)
  // ==========================================
  function startLoveQuotes() {
    stopLoveQuotes();
    loveQuotes.forEach((q, idx) => {
      q.classList.toggle('active', idx === 0);
    });
    currentQuoteIndex = 0;

    quotesInterval = setInterval(() => {
      loveQuotes[currentQuoteIndex].classList.remove('active');
      currentQuoteIndex = (currentQuoteIndex + 1) % loveQuotes.length;
      loveQuotes[currentQuoteIndex].classList.add('active');
    }, 3600);
  }

  function stopLoveQuotes() {
    if (quotesInterval) {
      clearInterval(quotesInterval);
      quotesInterval = null;
    }
  }

  // Mouse Parallax for 3D Gallery
  function setupGalleryParallax() {
    if (!galleryViewport) return;

    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;
    let isParallaxActive = false;

    window.addEventListener('mousemove', (e) => {
      if (currentStage !== STAGES.MEMORIES) return;
      const rect = galleryViewport.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      targetRotY = Math.max(-10, Math.min(10, x * 10));
      targetRotX = Math.max(-8, Math.min(8, -y * 8));

      if (!isParallaxActive) {
        isParallaxActive = true;
        requestAnimationFrame(updateParallax);
      }
    });

    function updateParallax() {
      if (currentStage !== STAGES.MEMORIES) {
        isParallaxActive = false;
        return;
      }
      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;

      if (galleryCarousel) {
        galleryCarousel.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
      }

      if (Math.abs(targetRotY - currentRotY) > 0.05 || Math.abs(targetRotX - currentRotX) > 0.05) {
        requestAnimationFrame(updateParallax);
      } else {
        isParallaxActive = false;
      }
    }

    // Card click focus interaction
    memoryCards.forEach(card => {
      card.addEventListener('click', () => {
        memoryCards.forEach(c => c.classList.remove('active-center'));
        card.classList.add('active-center');
      });
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
      stopLoveQuotes();
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
        startLoveQuotes();
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
    setupGalleryParallax();
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
