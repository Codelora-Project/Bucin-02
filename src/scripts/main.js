import { CONFIG } from '../config/content.js';
import { initParticleEngine, triggerCelebrationBurst, triggerConfettiFireworks } from './particles.js';
import { AudioController } from './audio.js';
import { initScrollReveal } from './scrollReveal.js';

let audioCtrl = null;
let currentPinInput = '';

/* Mobile Haptic Feedback Helper */
function triggerHaptic(type = 'light') {
  if (!('vibrate' in navigator)) return;
  try {
    if (type === 'light') navigator.vibrate(20);
    else if (type === 'medium') navigator.vibrate(40);
    else if (type === 'heavy') navigator.vibrate([30, 40, 60]);
    else if (type === 'success') navigator.vibrate([40, 30, 80]);
  } catch (e) {
    /* Ignore if unsupported */
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Start preloader to cache flower images & gallery assets
  initPreloader();

  // Initialize canvas particle background
  initParticleEngine();

  // Initialize live real-time relationship days counter
  initLiveDaysCounter();

  // Populate HTML with CONFIG data
  renderPinGate();
  renderHeroSection();
  renderDigitalBouquet();
  renderPhotoGallery();
  renderTimeline();
  renderLoveLetter();
  renderReasons();
  renderLoveJar();
  renderPlaylist();
  renderBirthdayCake();
  renderClosingSection();

  // Initialize Audio Controller with Multi-Track Playlist
  audioCtrl = new AudioController(CONFIG.playlistConfig);

  // Setup Event Listeners & Interactivity
  setupPinGate();
  setupWelcomeGate();
  setupHeroScroll();
  setupDigitalBouquet();
  setupLightbox();
  setupOrigamiLetter();
  setupReasonCards();
  setupLoveJar();
  setupPlaylist();
  setupBirthdayCake();
  setupClosingButton();
  setupScrollProgress();
});

/* -1. Asset Preloader Manager */
function initPreloader() {
  const loadingOverlay = document.getElementById('loading-screen');
  const progressFill = document.getElementById('loading-progress-fill');
  const percentText = document.getElementById('loading-percent-text');
  const statusText = document.getElementById('loading-status-text');
  const subtitleText = document.getElementById('loading-subtitle');

  if (!loadingOverlay) return;

  const flowerAssets = [
    '/flowers/flower-1.png',
    '/flowers/flower-2.png',
    '/flowers/flower-3.png',
    '/flowers/flower-4.png'
  ];

  const galleryAssets = (CONFIG.fotoGallery || []).map(item => item.url).filter(Boolean);
  const allAssets = [...flowerAssets, ...galleryAssets];

  let loadedCount = 0;
  const totalAssets = allAssets.length;

  function updateProgress(targetPercent, text) {
    if (percentText) percentText.textContent = `${Math.round(targetPercent)}%`;
    if (progressFill) progressFill.style.width = `${targetPercent}%`;
    if (statusText && text) statusText.textContent = text;
  }

  if (totalAssets === 0) {
    finishLoading();
    return;
  }

  const startTime = Date.now();
  const MIN_DISPLAY_TIME = 850; // Smooth minimal threshold for preloader visibility

  const handleAssetLoaded = () => {
    loadedCount++;
    const percent = Math.min(100, Math.round((loadedCount / totalAssets) * 100));

    let statusMsg = 'Memuat kelopak bunga... 🌸';
    if (percent > 40) statusMsg = 'Menyiapkan foto kenangan... 📷';
    if (percent > 85) statusMsg = 'Hampir selesai... ✨';

    updateProgress(percent, statusMsg);

    if (loadedCount >= totalAssets) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsedTime);

      setTimeout(() => {
        updateProgress(100, 'Siap! 🎉');
        if (subtitleText) subtitleText.textContent = 'Semua kejutan sudah siap! ❤️';
        setTimeout(finishLoading, 450);
      }, remainingTime);
    }
  };

  allAssets.forEach(src => {
    const img = new Image();
    img.onload = handleAssetLoaded;
    img.onerror = handleAssetLoaded; // Ensure app proceeds even if a remote photo fails
    img.src = src;
  });

  function finishLoading() {
    loadingOverlay.classList.add('is-hidden');
    setTimeout(() => {
      loadingOverlay.remove();
    }, 850);
  }
}

/* 0. Passcode PIN Gate Renderer & Logic */
function renderPinGate() {
  const { title, subtitle, hint } = CONFIG.pinGateConfig;
  const titleEl = document.getElementById('pin-title');
  if (titleEl && title) titleEl.textContent = title;

  const subEl = document.getElementById('pin-subtitle');
  if (subEl && subtitle) subEl.textContent = subtitle;

  const hintEl = document.getElementById('pin-hint');
  if (hintEl && hint) hintEl.textContent = hint;
}

function setupPinGate() {
  const pinOverlay = document.getElementById('pin-gate');
  const dots = document.querySelectorAll('.pin-dot');
  const keys = document.querySelectorAll('.pin-key-btn');
  const padlockWrapper = document.querySelector('.pin-padlock-wrapper');
  const targetPin = CONFIG.pinGateConfig.pinCode || '2628';

  const handleKeyPress = (key) => {
    if (key === 'clear') {
      currentPinInput = '';
      updatePinDots(currentPinInput.length, dots);
    } else if (key === 'submit') {
      verifyPin();
    } else if (currentPinInput.length < 4) {
      currentPinInput += key;
      updatePinDots(currentPinInput.length, dots);

      if (currentPinInput.length === 4) {
        setTimeout(verifyPin, 120);
      }
    }
  };

  keys.forEach(keyBtn => {
    // Fast response on touch/mouse without 300ms delay
    const handlePress = (e) => {
      e.preventDefault();
      triggerHaptic('light');
      keyBtn.classList.add('is-pressed');
      setTimeout(() => keyBtn.classList.remove('is-pressed'), 120);
      
      const key = keyBtn.dataset.key;
      handleKeyPress(key);
    };

    keyBtn.addEventListener('pointerdown', handlePress);
  });

  function verifyPin() {
    if (currentPinInput === targetPin) {
      triggerHaptic('success');
      // Trigger Golden Padlock Opening Animation
      if (padlockWrapper) padlockWrapper.classList.add('is-unlocked');

      setTimeout(() => {
        if (pinOverlay) pinOverlay.classList.add('is-hidden');
        
        const welcomeGate = document.getElementById('welcome-gate');
        if (welcomeGate) welcomeGate.classList.remove('is-hidden');
      }, 550);
      
    } else {
      triggerHaptic('heavy');
      // Show error shake on dots
      dots.forEach(d => d.classList.add('is-error'));
      setTimeout(() => {
        dots.forEach(d => d.classList.remove('is-error'));
        currentPinInput = '';
        updatePinDots(0, dots);
      }, 500);
    }
  }

  function updatePinDots(count, dotElements) {
    dotElements.forEach((dot, idx) => {
      if (idx < count) {
        dot.classList.add('is-filled');
      } else {
        dot.classList.remove('is-filled');
      }
    });
  }
}

/* 1. Welcome Gate (GSAP Flower Explosion) */
function setupWelcomeGate() {
  const welcomeGate = document.getElementById("welcome-gate");
  const initialView = document.getElementById("initial-view");
  const flowerContainer = document.getElementById("flower-container");
  
  if (!welcomeGate || !initialView || !flowerContainer) return;
  
  let isAnimating = false;
  const flowerImages = [
    "/flowers/flower-1.png",
    "/flowers/flower-2.png",
    "/flowers/flower-3.png",
    "/flowers/flower-4.png"
  ];
  const isMobile = window.innerWidth <= 600;
  const TOTAL_FLOWERS = isMobile ? 140 : 360; // Dense screen coverage

  // Pre-create flower elements
  for (let i = 0; i < TOTAL_FLOWERS; i++) {
    const flower = document.createElement("div");
    flower.classList.add("flower-particle");
    
    const randomImage = flowerImages[Math.floor(Math.random() * flowerImages.length)];
    flower.style.backgroundImage = `url('${randomImage}')`;
    flower.style.backgroundSize = "contain";
    flower.style.backgroundRepeat = "no-repeat";
    flower.style.backgroundPosition = "center";
    
    // Size settings for dense cover (65px - 170px)
    const randomSize = Math.random() * 105 + 65;
    flower.style.width = randomSize + "px";
    flower.style.height = randomSize + "px";
    flower.style.zIndex = Math.floor(Math.random() * 100) + 10;
    
    flowerContainer.appendChild(flower);
  }

  // Handle Explosion
  initialView.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;
    triggerHaptic('success');

    // Keep welcome-gate ON TOP during explosion
    welcomeGate.style.zIndex = '9998';

    const flowers = document.querySelectorAll(".flower-particle");
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Timeline GSAP
    const tl = gsap.timeline();

    // 1. Fade out hint text quickly
    tl.to('.gift-hint-text', {
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: "power1.out"
    });

    // 2. Wobble & Elastic Shake Gift Box Container (Stage 1)
    tl.to('.gift-box-container', {
      rotation: -10,
      scaleY: 0.9,
      duration: 0.07,
      repeat: 5,
      yoyo: true,
      ease: "sine.inOut"
    }, 0.1);

    // 3. Pop Lid Upward & Spin 360° (Stage 2)
    tl.to('.gift-lid', {
      y: -160,
      rotation: -360,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.4)"
    }, 0.48);

    // 4. Shrink/Fade Gift Body as flowers erupt (Stage 3)
    tl.to('.gift-body, .gift-shadow', {
      scale: 0,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in"
    }, 0.68);

    // 5. Flowers Fountain Spray out from inside open gift box to cover screen
    const flowerTargets = [];
    flowers.forEach((flower, index) => {
      // Screen coverage points
      const targetX = (Math.random() - 0.5) * (viewportWidth * 1.35);
      const targetY = (Math.random() - 0.5) * (viewportHeight * 1.35);
      const randomRotation = Math.random() * 720 - 360;
      const randomScale = Math.random() * 1.4 + 0.8;
      
      const burstDelay = 0.55 + (index / TOTAL_FLOWERS) * 0.65;
      const burstDuration = Math.random() * 0.4 + 0.6;

      flowerTargets.push({ targetX, targetY, randomRotation });

      tl.to(flower, {
        x: targetX,
        y: targetY,
        rotation: randomRotation,
        scale: randomScale,
        opacity: 1,
        duration: burstDuration,
        ease: "power2.out"
      }, burstDelay);
    });

    // 6. AT FULL SCREEN COVERAGE (~1.4s): Reveal main content underneath & start audio
    tl.call(() => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.style.opacity = '1';
      }
      
      if (audioCtrl) {
        audioCtrl.showWidget();
        audioCtrl.play();
      }
      initScrollReveal();

      // Make welcomeGate background transparent so falling flowers overlay main content smoothly
      welcomeGate.style.background = "transparent";
      welcomeGate.style.backgroundColor = "transparent";
    }, null, 1.4);

    // Top-to-Bottom Staggered Reveal for Hero Elements (Curtain Unveil)
    const heroElements = [
      document.getElementById('hero-subtitle'),
      document.getElementById('hero-title'),
      document.getElementById('hero-message'),
      document.querySelector('.hero-days-pill'),
      document.getElementById('hero-scroll-btn')
    ].filter(Boolean);

    gsap.set(heroElements, { y: -45, opacity: 0 });

    heroElements.forEach((el, index) => {
      tl.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power2.out"
      }, 1.5 + (index * 0.18));
    });

    // 7. FLOWERS FALL DOWNWARD WITH WIND SWAY (Left-Right Swaying Motion)
    flowers.forEach((flower, index) => {
      const target = flowerTargets[index];
      const fallDelay = 1.55 + (Math.random() * 0.45);
      const fallDuration = Math.random() * 1.2 + 2.0;

      // Vertical falling motion
      tl.to(flower, {
        y: target.targetY + viewportHeight + 450,
        rotation: target.randomRotation + (Math.random() * 360 - 180),
        opacity: 0,
        duration: fallDuration,
        ease: "power1.in"
      }, fallDelay);

      // Horizontal wind sway (wobbling left and right as if blown by gentle breeze)
      const swayOffset = Math.random() * 80 + 40;
      const swayDirection = Math.random() > 0.5 ? 1 : -1;
      const swayDuration = Math.random() * 0.25 + 0.45;

      gsap.to(flower, {
        x: target.targetX + (swayOffset * swayDirection),
        duration: swayDuration,
        repeat: 6,
        yoyo: true,
        ease: "sine.inOut",
        delay: fallDelay
      });
    });

    // 8. Cleanup welcome-gate overlay
    tl.call(() => {
      welcomeGate.classList.add('is-hidden');
      welcomeGate.style.pointerEvents = "none";
      if (initialView) initialView.style.display = "none";
    }, null, 4.2);
  });
}

function renderHeroSection() {
  if (!CONFIG.heroConfig) return;
  const { subtitle, title, message, daysTogetherText, scrollHint } = CONFIG.heroConfig;

  const subEl = document.getElementById('hero-subtitle');
  if (subEl && subtitle) subEl.textContent = subtitle;

  const titleEl = document.getElementById('hero-title');
  if (titleEl && title) titleEl.textContent = title;

  const msgEl = document.getElementById('hero-message');
  if (msgEl && message) msgEl.textContent = message;

  const daysEl = document.getElementById('hero-days-text');
  if (daysEl && daysTogetherText) daysEl.textContent = daysTogetherText;

  const hintEl = document.getElementById('hero-scroll-hint');
  if (hintEl && scrollHint) hintEl.textContent = scrollHint;
}

/* 1B. Live Real-Time Days Together Counter */
function initLiveDaysCounter() {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const startDateStr = CONFIG.heroConfig?.relationshipStartDate || '2023-02-14';
  const startDate = new Date(startDateStr).getTime();

  function updateCounter() {
    const now = Date.now();
    const diff = Math.max(0, now - startDate);

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    daysEl.textContent = days.toLocaleString();
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  updateCounter();
  setInterval(updateCounter, 1000);
}

function setupHeroScroll() {
  const scrollBtn = document.getElementById('hero-scroll-btn');
  const targetSection = document.getElementById('section-bouquet') || document.getElementById('section-gallery');

  if (scrollBtn && targetSection) {
    scrollBtn.addEventListener('click', () => {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* 1C. Digital Bouquet Renderer (Interactive Emoji Arch) */
function renderDigitalBouquet() {
  const bouquet = CONFIG.digitalBouquet;
  if (!bouquet) return;

  const msgEl = document.getElementById('bouquet-active-message');
  if (msgEl && bouquet.defaultMessage) msgEl.textContent = bouquet.defaultMessage;

  const grid = document.getElementById('bouquet-flowers');
  if (grid && bouquet.flowers) {
    grid.innerHTML = bouquet.flowers.map(flower => `
      <button class="bouquet-flower-btn" data-id="${flower.id}" data-msg="${escapeHtml(flower.message)}">
        <span class="flower-emoji-symbol">${escapeHtml(flower.flowerSymbol)}</span>
      </button>
    `).join('');

    // Position in an arch
    setTimeout(() => {
      const btns = grid.querySelectorAll('.bouquet-flower-btn');
      const positions = [
        { top: '5%', left: '50%' }, // 1 (Top Center)
        { top: '25%', left: '25%' }, // 2 (Mid-High Left)
        { top: '25%', left: '75%' }, // 3 (Mid-High Right)
        { top: '55%', left: '15%' }, // 4 (Mid Left)
        { top: '55%', left: '85%' }, // 5 (Mid Right)
        { top: '80%', left: '35%' }, // 6 (Bottom Left)
        { top: '80%', left: '65%' }, // 7 (Bottom Right)
      ];
      btns.forEach((btn, idx) => {
        if (positions[idx]) {
          btn.style.top = positions[idx].top;
          btn.style.left = positions[idx].left;
          btn.style.transform = 'translate(-50%, -50%)';
        }
      });
    }, 0);
  }
}

function setupDigitalBouquet() {
  const btns = document.querySelectorAll('.bouquet-flower-btn');
  const msgEl = document.getElementById('bouquet-active-message');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      if (msgEl) {
        msgEl.style.opacity = '0';
        setTimeout(() => {
          msgEl.textContent = btn.dataset.msg;
          msgEl.style.opacity = '1';
        }, 150);
      }
    });
  });
}

/* 2. Photo Gallery Renderer (Scrapbook Polaroid) */
function renderPhotoGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const tilts = ['tilt-left-1', 'tilt-right-1', 'tilt-left-2', 'tilt-right-2'];

  grid.className = 'gallery-scrapbook-container';
  grid.innerHTML = CONFIG.fotoGallery.map((photo, idx) => {
    const tiltClass = tilts[idx % tilts.length];
    return `
      <div class="polaroid-card ${tiltClass} gallery-item reveal-on-scroll" data-id="${photo.id}" data-url="${escapeHtml(photo.url)}" data-title="${escapeHtml(photo.title)}" data-caption="${escapeHtml(photo.caption)}" data-date="${escapeHtml(photo.date)}">
        <div class="polaroid-img-wrapper">
          <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.title)}" class="polaroid-img" loading="lazy" />
        </div>
        <div class="polaroid-footer">
          <span class="polaroid-date">${escapeHtml(photo.date)}</span>
          <h3 class="polaroid-title">${escapeHtml(photo.title)}</h3>
          <p class="polaroid-caption-preview">${escapeHtml(photo.caption)}</p>
        </div>
      </div>
    `;
  }).join('');
}

function setupLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalCaption = document.getElementById('lightbox-caption');
  const modalDate = document.getElementById('lightbox-date');
  const closeBtn = document.getElementById('lightbox-close-btn');

  if (!modal) return;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const url = item.dataset.url;
      const title = item.dataset.title;
      const caption = item.dataset.caption;
      const date = item.dataset.date;

      if (modalImg) modalImg.src = url;
      if (modalTitle) modalTitle.textContent = title;
      if (modalCaption) modalCaption.textContent = caption;
      if (modalDate) modalDate.textContent = date;

      modal.classList.add('is-active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('is-active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('is-active');
    }
  });
}

/* 2B. Our Journey Timeline Renderer */
function renderTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container || !CONFIG.timelineJourney) return;

  container.innerHTML = CONFIG.timelineJourney.map(item => `
    <div class="timeline-item reveal-on-scroll">
      <div class="timeline-icon-badge">
        <span>${escapeHtml(item.stepNumber)}</span>
      </div>
      <div class="timeline-card">
        <span class="timeline-date">${escapeHtml(item.date)}</span>
        <h3 class="timeline-title">${escapeHtml(item.title)}</h3>
        <p class="timeline-desc">${escapeHtml(item.description)}</p>
      </div>
    </div>
  `).join('');
}

/* 3. Love Letter Renderer */
function renderLoveLetter() {
  const { title, subtitle, salutation, paragraphs, closing, signature } = CONFIG.loveLetter;

  const titleEl = document.getElementById('letter-title');
  if (titleEl) titleEl.textContent = title;

  const subtitleEl = document.getElementById('letter-subtitle');
  if (subtitleEl) subtitleEl.textContent = subtitle;

  const salutationEl = document.getElementById('letter-salutation');
  if (salutationEl) salutationEl.textContent = salutation;

  const bodyEl = document.getElementById('letter-body');
  if (bodyEl) {
    bodyEl.innerHTML = paragraphs.map(p => `
      <p class="letter-paragraph">${escapeHtml(p)}</p>
    `).join('');
  }

  const closingEl = document.getElementById('letter-closing-text');
  if (closingEl) closingEl.textContent = closing;

  const sigEl = document.getElementById('letter-signature');
  if (sigEl) sigEl.textContent = signature;
}

function setupOrigamiLetter() {
  const envelopeCard = document.getElementById('origami-envelope-card');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const refoldBtn = document.getElementById('refold-letter-btn');

  if (!envelopeCard || !waxSealBtn) return;

  const openLetter = () => {
    triggerHaptic('medium');
    envelopeCard.classList.add('is-open');

    // Trigger paragraph reveal inside letter smoothly as paper unfolds
    setTimeout(() => {
      const paragraphs = document.querySelectorAll('.letter-paragraph');
      paragraphs.forEach((p, idx) => {
        setTimeout(() => {
          p.classList.add('is-visible');
        }, idx * 280);
      });
    }, 600);
  };

  const foldLetterBack = (e) => {
    e.stopPropagation();
    triggerHaptic('light');
    envelopeCard.classList.remove('is-open');
    const paragraphs = document.querySelectorAll('.letter-paragraph');
    paragraphs.forEach(p => p.classList.remove('is-visible'));
  };

  waxSealBtn.addEventListener('click', openLetter);
  envelopeCard.addEventListener('click', (e) => {
    if (!envelopeCard.classList.contains('is-open')) {
      openLetter();
    }
  });

  if (refoldBtn) {
    refoldBtn.addEventListener('click', foldLetterBack);
  }
}

/* 4. Reasons Why I Love You Renderer (Love Envelope Deck) */
function renderReasons() {
  const grid = document.getElementById('reasons-grid');
  if (!grid) return;

  grid.className = 'love-envelope-deck';
  grid.innerHTML = CONFIG.alasanCinta.map((reason, idx) => {
    const offsetClass = idx % 2 === 0 ? 'offset-up' : 'offset-down';
    return `
      <div class="envelope-card ${offsetClass} reveal-on-scroll" data-id="${reason.id}">
        <div class="envelope-header">
          <div class="envelope-seal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <div class="envelope-title-wrapper">
            <span class="envelope-number">Reason #${escapeHtml(reason.number)}</span>
            <h3 class="envelope-title">${escapeHtml(reason.title)}</h3>
          </div>
        </div>

        <div class="envelope-closed-hint">
          <span>Tap to open note</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>

        <div class="envelope-letter-wrapper">
          <div class="envelope-letter-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span>From the heart</span>
          </div>
          <p class="envelope-letter-text">${escapeHtml(reason.description)}</p>
        </div>
      </div>
    `;
  }).join('');
}

function setupReasonCards() {
  document.querySelectorAll('.envelope-card').forEach(card => {
    card.addEventListener('click', () => {
      triggerHaptic('medium');
      card.classList.toggle('is-open');
    });
  });
}

/* 4B. Love Notes Jar Renderer & Interactivity */
function renderLoveJar() {
  const textEl = document.getElementById('jar-note-text');
  if (textEl && CONFIG.loveJarNotes?.[0]) {
    textEl.textContent = CONFIG.loveJarNotes[0];
  }
}

function setupLoveJar() {
  const shakeBtn = document.getElementById('shake-jar-btn');
  const jarGraphic = document.getElementById('jar-graphic');
  const noteModal = document.getElementById('jar-note-modal');
  const noteText = document.getElementById('jar-note-text');
  const notes = CONFIG.loveJarNotes || [];
  let noteIndex = 0;

  if (shakeBtn && jarGraphic && noteModal) {
    shakeBtn.addEventListener('click', () => {
      triggerHaptic('medium');
      jarGraphic.classList.add('is-shaking');
      noteModal.classList.remove('is-active');

      setTimeout(() => {
        jarGraphic.classList.remove('is-shaking');
        noteIndex = (noteIndex + 1) % notes.length;
        if (noteText) noteText.textContent = notes[noteIndex];
        noteModal.classList.add('is-active');
        triggerCelebrationBurst();
      }, 650);
    });
  }
}

/* 4C. Special Multi-Track Playlist Renderer */
function renderPlaylist() {
  const container = document.getElementById('playlist-tracks');
  if (!container || !CONFIG.playlistConfig) return;

  container.innerHTML = CONFIG.playlistConfig.map((track, idx) => `
    <div class="playlist-track-item ${idx === 0 ? 'is-active' : ''}" data-index="${idx}">
      <span class="playlist-track-number">${idx + 1}</span>
      <div class="playlist-track-info">
        <span class="playlist-track-title">
          ${escapeHtml(track.title)}
          ${idx === 0 ? '<span class="track-equalizer"><span></span><span></span><span></span></span>' : ''}
        </span>
        <span class="playlist-track-artist">${escapeHtml(track.artist)}</span>
      </div>
      <div class="playlist-play-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
      </div>
    </div>
  `).join('');
}

function setupPlaylist() {
  const items = document.querySelectorAll('.playlist-track-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      triggerHaptic('light');
      items.forEach(i => {
        i.classList.remove('is-active');
        const eq = i.querySelector('.track-equalizer');
        if (eq) eq.remove();
      });
      item.classList.add('is-active');
      const titleEl = item.querySelector('.playlist-track-title');
      if (titleEl && !titleEl.querySelector('.track-equalizer')) {
        const eqSpan = document.createElement('span');
        eqSpan.className = 'track-equalizer';
        eqSpan.innerHTML = '<span></span><span></span><span></span>';
        titleEl.appendChild(eqSpan);
      }

      const idx = parseInt(item.dataset.index, 10);
      if (audioCtrl) {
        audioCtrl.loadTrack(idx);
      }
    });
  });
}

/* 5. Closing Section Renderer */
function renderClosingSection() {
  const { title, message, subtext, tombolPelukText } = CONFIG.pesanPenutup;

  const titleEl = document.getElementById('closing-title');
  if (titleEl) titleEl.textContent = title;

  const msgEl = document.getElementById('closing-message');
  if (msgEl) msgEl.textContent = message;

  const subEl = document.getElementById('closing-subtext');
  if (subEl) subEl.textContent = subtext;

  const btnEl = document.getElementById('closing-hug-btn-text');
  if (btnEl) btnEl.textContent = tombolPelukText;
}

function setupClosingButton() {
  const hugBtn = document.getElementById('closing-hug-btn');
  if (hugBtn) {
    hugBtn.addEventListener('click', () => {
      triggerHaptic('heavy');
      triggerCelebrationBurst();
    });
  }
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function setupScrollProgress() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }
  });
}

/* 6. Interactive Birthday Cake & Candle Blow */
function renderBirthdayCake() {
  const cfg = CONFIG.birthdayCakeConfig;
  if (!cfg) return;

  const subTitleEl = document.getElementById('cake-section-subtitle');
  if (subTitleEl && cfg.subtitle) subTitleEl.textContent = cfg.subtitle;

  const titleEl = document.getElementById('cake-section-title');
  if (titleEl && cfg.title) {
    const highlightWord = cfg.title.replace(/^Blow the /i, '');
    titleEl.innerHTML = `Blow the <span>${escapeHtml(highlightWord)}</span>`;
  }

  const subTextEl = document.getElementById('cake-section-subtext');
  if (subTextEl && cfg.subtitleText) subTextEl.textContent = cfg.subtitleText;

  const instructEl = document.getElementById('cake-instruction');
  if (instructEl && cfg.instructionText) instructEl.textContent = cfg.instructionText;

  const blowBtnText = document.getElementById('blow-btn-text');
  if (blowBtnText && cfg.buttonText) blowBtnText.textContent = cfg.buttonText;

  const wishTitleEl = document.getElementById('wish-title');
  if (wishTitleEl && cfg.wishTitle) wishTitleEl.textContent = cfg.wishTitle;

  const wishMsgEl = document.getElementById('wish-message');
  if (wishMsgEl && cfg.wishMessage) wishMsgEl.textContent = cfg.wishMessage;
}

function setupBirthdayCake() {
  const cakeTrigger = document.getElementById('birthday-cake-trigger');
  const blowBtn = document.getElementById('blow-candle-btn');
  const flameGroup = document.getElementById('cake-flame');
  const smokeGroup = document.getElementById('cake-smoke');
  const candleGlow = document.getElementById('candle-glow');
  const dimOverlay = document.getElementById('cake-dim-overlay');
  const wishCard = document.getElementById('wish-revealed-card');
  const blowBtnText = document.getElementById('blow-btn-text');
  const instructionEl = document.getElementById('cake-instruction');
  const progressFill = document.getElementById('cake-progress-fill');

  if (!cakeTrigger || !blowBtn || !flameGroup) return;

  let isCandleBlown = false;
  let holdStartTime = 0;
  let holdAnimFrame = null;
  const HOLD_DURATION = 1800; // 1.8 seconds target hold
  const CIRCLE_CIRCUMFERENCE = 722; // 2 * PI * 115

  const updateHoldProgress = (now) => {
    if (!holdStartTime || isCandleBlown) return;

    const elapsed = now - holdStartTime;
    const progress = Math.min(1, elapsed / HOLD_DURATION);

    // Update SVG progress ring
    if (progressFill) {
      const strokeOffset = CIRCLE_CIRCUMFERENCE * (1 - progress);
      progressFill.style.strokeDashoffset = `${strokeOffset}`;
    }

    // Shrink and dim flame dynamically as progress advances (scaling around wick base 100px 52px)
    const flameScale = 1 - progress * 0.7;
    const flameOpacity = 1 - progress * 0.5;
    flameGroup.style.transformOrigin = '100px 52px';
    flameGroup.style.transform = `scale(${flameScale})`;
    flameGroup.style.opacity = `${flameOpacity}`;

    // Haptic tick pulse on mobile
    if (navigator.vibrate && Math.floor(elapsed / 300) !== Math.floor((elapsed - 16) / 300)) {
      try { navigator.vibrate(15); } catch (e) {}
    }

    if (progress >= 1) {
      completeBlowOut();
    } else {
      holdAnimFrame = requestAnimationFrame(updateHoldProgress);
    }
  };

  const startHolding = (e) => {
    if (isCandleBlown) return;
    if (e && e.cancelable) e.preventDefault();

    holdStartTime = performance.now();
    flameGroup.classList.add('is-holding');
    blowBtn.classList.add('is-holding');
    if (instructionEl) instructionEl.textContent = 'Keep holding...';

    if (holdAnimFrame) cancelAnimationFrame(holdAnimFrame);
    holdAnimFrame = requestAnimationFrame(updateHoldProgress);
  };

  const cancelHolding = () => {
    if (isCandleBlown || !holdStartTime) return;

    holdStartTime = 0;
    if (holdAnimFrame) {
      cancelAnimationFrame(holdAnimFrame);
      holdAnimFrame = null;
    }

    flameGroup.classList.remove('is-holding');
    blowBtn.classList.remove('is-holding');
    flameGroup.style.transform = '';
    flameGroup.style.opacity = '';

    // Reset progress ring fill
    if (progressFill) {
      progressFill.style.strokeDashoffset = `${CIRCLE_CIRCUMFERENCE}`;
    }

    if (instructionEl) {
      instructionEl.textContent = CONFIG.birthdayCakeConfig?.instructionText || 'Press and hold to blow out the candle';
    }
  };

  const completeBlowOut = () => {
    isCandleBlown = true;
    holdStartTime = 0;
    if (holdAnimFrame) cancelAnimationFrame(holdAnimFrame);

    flameGroup.classList.remove('is-holding');
    blowBtn.classList.remove('is-holding');

    if (navigator.vibrate) {
      try { navigator.vibrate([40, 30, 80]); } catch (e) {}
    }

    // 1. Extinguish flame & glow
    flameGroup.classList.add('is-blown');
    if (candleGlow) candleGlow.classList.add('is-extinguished');
    if (smokeGroup) smokeGroup.classList.add('is-active');

    // 2. Dim background lighting briefly
    if (dimOverlay) {
      dimOverlay.classList.add('is-active');
      setTimeout(() => {
        dimOverlay.classList.remove('is-active');
      }, 750);
    }

    // 3. Update button & instructions
    blowBtn.classList.add('is-disabled');
    if (blowBtnText) blowBtnText.textContent = 'Wish Made';
    if (instructionEl) instructionEl.textContent = 'The candle has been blown. Your wish is on its way.';

    const cakeUi = document.getElementById('cake-interactive-ui');
    if (cakeUi) {
      cakeUi.classList.add('is-faded-out');
    }

    // 4. Launch Confetti & Fireworks Burst
    triggerConfettiFireworks();

    // 5. Reveal Wish Card
    setTimeout(() => {
      if (wishCard) {
        wishCard.classList.add('is-visible');
      }
    }, 450);
  };

  // Attach pointer events to both candle graphic & button
  const targets = [cakeTrigger, blowBtn];
  targets.forEach(el => {
    el.addEventListener('pointerdown', startHolding);
    el.addEventListener('mousedown', startHolding);
    el.addEventListener('touchstart', startHolding, {passive: true});

    el.addEventListener('pointerup', cancelHolding);
    el.addEventListener('mouseup', cancelHolding);
    el.addEventListener('touchend', cancelHolding);
    
    el.addEventListener('pointercancel', cancelHolding);
    el.addEventListener('mouseleave', cancelHolding);
  });
}
