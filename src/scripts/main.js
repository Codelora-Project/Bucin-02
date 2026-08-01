import { CONFIG } from '../config/content.js';
import { initParticleEngine, triggerCelebrationBurst, triggerConfettiFireworks } from './particles.js';
import { AudioController } from './audio.js';
import { initScrollReveal } from './scrollReveal.js';
import {
  FLOWER_ASSETS,
  createFlowerTransition,
  preloadFlowerSprite
} from './flowerTransition.js';

let audioCtrl = null;
let particleCtrl = null;
let currentPinInput = '';

/* Always start the surprise from the top instead of restoring an old scroll position. */
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function resetPageScroll() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
}

window.addEventListener('pageshow', resetPageScroll);

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
  resetPageScroll();

  // Start preloader to cache flower images & gallery assets
  initPreloader();

  // Initialize canvas particle background
  particleCtrl = initParticleEngine();

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
  initScrollReveal();
});

/* -1. Asset Preloader Manager */
function initPreloader() {
  const loadingOverlay = document.getElementById('loading-screen');
  const progressFill = document.getElementById('loading-progress-fill');
  const percentText = document.getElementById('loading-percent-text');
  const statusText = document.getElementById('loading-status-text');
  const subtitleText = document.getElementById('loading-subtitle');

  if (!loadingOverlay) return;

  const galleryAssets = (CONFIG.fotoGallery || []).map(item => item.url).filter(Boolean);
  const allAssets = [...FLOWER_ASSETS, ...galleryAssets];

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

  FLOWER_ASSETS.forEach(src => {
    preloadFlowerSprite(src).then(handleAssetLoaded, handleAssetLoaded);
  });

  galleryAssets.forEach(src => {
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
        resetPageScroll();
        
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
  const giftBody = initialView?.querySelector('.gift-body');
  
  if (!welcomeGate || !initialView || !flowerContainer) return;
  
  let isAnimating = false;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const flowerTransition = createFlowerTransition({
    container: flowerContainer,
    reducedMotion: prefersReducedMotion
  });
  flowerTransition.prepare();

  // Handle Explosion
  initialView.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;
    resetPageScroll();
    triggerHaptic('success');
    particleCtrl?.pause();

    // Start audio on the actual user gesture, away from the hero reveal frame.
    if (audioCtrl) {
      audioCtrl.play();
    }

    // Keep welcome-gate ON TOP during explosion
    welcomeGate.style.zIndex = '9998';

    const heroSection = document.querySelector('.hero-section');
    const motionScale = prefersReducedMotion ? 0.55 : 1;
    const { burstStart, shotSpan } = flowerTransition.timing;
    const giftRect = giftBody?.getBoundingClientRect();
    const originX = giftRect ? giftRect.left + giftRect.width / 2 : window.innerWidth / 2;
    const originY = giftRect ? giftRect.top + 22 : window.innerHeight / 2 - 48;

    // The hero is fully painted while it is still hidden behind the gate.
    // At full flower coverage the gate can be removed without animating a full-screen layer.
    if (heroSection) {
      heroSection.classList.remove('hero-transition-pending');
      gsap.set(heroSection, { clearProps: 'opacity,transform' });
    }

    const tl = gsap.timeline();

    // 1. Hide hint text instantly upon click
    gsap.set('.gift-hint-text', {
      opacity: 0,
      display: "none"
    });

    // 2. Wobble & Elastic Shake Gift Box Container (Stage 1)
    tl.to('.gift-box-container', {
      rotation: -10,
      scaleY: 0.9,
      duration: 0.055 * motionScale,
      repeat: prefersReducedMotion ? 1 : 4,
      yoyo: true,
      ease: "sine.inOut"
    }, 0.05);

    // 3. Pop Lid Upward & Spin 360° (Stage 2)
    tl.to('.gift-lid', {
      y: -160,
      rotation: -360,
      opacity: 0,
      duration: 0.42 * motionScale,
      ease: "back.out(1.4)"
    }, 0.3);

    // 4. Give the open box a small recoil while it fires.
    if (!prefersReducedMotion) {
      tl.to('.gift-body', {
        scaleX: 0.94,
        scaleY: 0.9,
        duration: 0.11,
        repeat: 11,
        yoyo: true,
        ease: 'sine.inOut'
      }, burstStart);
    }

    // Sink the box behind the flowers after roughly 65% of the shots have fired.
    tl.to('.gift-body, .gift-shadow', {
      scale: 0,
      y: 30,
      opacity: 0,
      duration: 0.36 * motionScale,
      ease: "power2.inOut"
    }, burstStart + shotSpan * 0.65);

    flowerTransition.play({
      originX,
      originY,
      onCovered: () => {
        welcomeGate.classList.add('is-revealed');
        initialView.style.display = 'none';
      },
      onComplete: () => {
        flowerTransition.destroy();
        welcomeGate.classList.add('is-hidden');
        welcomeGate.style.pointerEvents = "none";
        document.body.classList.remove('gate-active');
        particleCtrl?.resume();
        audioCtrl?.showWidget();
      }
    });
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
  const envelopeSurface = envelopeCard?.querySelector('.envelope-shell-surface');
  const envelopeFlap = envelopeCard?.querySelector('.envelope-flap-top');
  const envelopePocket = envelopeCard?.querySelector('.envelope-pocket-front');
  const letterPaper = document.getElementById('letter-paper');

  if (!envelopeCard || !waxSealBtn || !envelopeSurface || !envelopeFlap ||
    !envelopePocket || !letterPaper) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const letterContent = [
    letterPaper.querySelector('.letter-header'),
    letterPaper.querySelector('.letter-salutation'),
    ...letterPaper.querySelectorAll('.letter-paragraph'),
    letterPaper.querySelector('.letter-footer')
  ].filter(Boolean);
  let isOpen = false;
  let isAnimating = false;

  waxSealBtn.setAttribute('aria-expanded', 'false');
  waxSealBtn.setAttribute('aria-controls', 'letter-paper');
  letterPaper.setAttribute('aria-hidden', 'true');
  letterPaper.setAttribute('inert', '');

  gsap.set(envelopeFlap, {
    scaleY: 1,
    y: 0,
    opacity: 1,
    transformOrigin: '50% 0%'
  });
  gsap.set(waxSealBtn, {
    x: 0,
    y: 0,
    xPercent: -50,
    yPercent: -50,
    scale: 1,
    rotation: 0,
    opacity: 1
  });
  gsap.set([envelopeSurface, envelopePocket], { y: 0, scale: 1, opacity: 1 });
  gsap.set(letterPaper, { height: 0, y: 72, scale: 0.965, opacity: 0 });
  gsap.set(letterContent, { opacity: 0, y: 18 });

  const getPaperHeights = () => {
    const fullHeight = letterPaper.scrollHeight;
    const previewHeight = Math.min(fullHeight, Math.max(190, Math.min(260, window.innerHeight * 0.3)));
    return { fullHeight, previewHeight };
  };

  waxSealBtn.addEventListener('pointerenter', () => {
    if (isOpen || isAnimating) return;
    gsap.to(waxSealBtn, { scale: 1.1, rotation: 6, duration: 0.28, ease: 'power2.out' });
  });

  waxSealBtn.addEventListener('pointerleave', () => {
    if (isOpen || isAnimating) return;
    gsap.to(waxSealBtn, { scale: 1, rotation: 0, duration: 0.28, ease: 'power2.out' });
  });

  const openLetter = () => {
    if (isOpen || isAnimating) return;

    triggerHaptic('medium');
    isAnimating = true;
    envelopeCard.classList.add('is-animating');
    envelopeCard.style.overflow = 'visible';
    waxSealBtn.setAttribute('aria-expanded', 'true');
    letterPaper.setAttribute('aria-hidden', 'false');
    letterPaper.removeAttribute('inert');

    const { fullHeight, previewHeight } = getPaperHeights();
    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        gsap.set(letterPaper, { height: 'auto' });
        envelopeCard.classList.remove('is-animating');
        envelopeCard.classList.add('is-open');
        isAnimating = false;
        isOpen = true;
      }
    });

    if (prefersReducedMotion) {
      timeline
        .set(waxSealBtn, { opacity: 0 })
        .set(envelopeFlap, { scaleY: 0, y: -8, opacity: 0 })
        .set([envelopePocket, envelopeSurface], { opacity: 0 })
        .to(letterPaper, {
          height: fullHeight,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.24,
          ease: 'power1.out'
        })
        .to(letterContent, { opacity: 1, y: 0, duration: 0.18 }, 0.08);
      return;
    }

    timeline
      // Press and release the seal before it breaks away.
      .to(envelopeCard, { y: 3, duration: 0.12, ease: 'power1.inOut' }, 0)
      .to(waxSealBtn, { scale: 0.92, duration: 0.12, ease: 'power2.in' }, 0)
      .to(waxSealBtn, {
        scale: 1.18,
        rotation: -9,
        duration: 0.16,
        ease: 'back.out(2)'
      }, 0.12)
      .to(waxSealBtn, {
        scale: 0.24,
        rotation: 20,
        opacity: 0,
        duration: 0.24,
        ease: 'power2.in'
      }, 0.26)
      // Collapse the flap toward its hinge without projecting outside the envelope.
      .to(envelopeFlap, {
        scaleY: 0.12,
        y: -4,
        opacity: 0.68,
        duration: 0.42,
        ease: 'power2.inOut'
      }, 0.22)
      .to(envelopeFlap, {
        scaleY: 0,
        y: -8,
        opacity: 0,
        duration: 0.16,
        ease: 'power2.in'
      }, 0.6)
      .set(envelopeFlap, { zIndex: 2 }, 0.76)
      // Pull a short portion of paper out while the front pocket is still visible.
      .to(letterPaper, {
        height: previewHeight,
        y: -18,
        scale: 0.985,
        opacity: 1,
        duration: 0.54,
        ease: 'power3.out'
      }, 0.62)
      .to(envelopePocket, {
        y: 18,
        opacity: 0,
        duration: 0.38,
        ease: 'power2.in'
      }, 0.9)
      .to(envelopeSurface, {
        y: 18,
        scale: 0.985,
        opacity: 0,
        duration: 0.42,
        ease: 'power2.in'
      }, 0.98)
      // Expand to the measured content height instead of an arbitrary max-height.
      .to(letterPaper, {
        height: fullHeight,
        y: 0,
        scale: 1,
        duration: 0.78,
        ease: 'power3.inOut'
      }, 1.16)
      .to(envelopeCard, { y: 0, duration: 0.4, ease: 'power2.out' }, 1.08)
      .to(letterContent, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.09,
        ease: 'power2.out'
      }, 1.36);
  };

  const foldLetterBack = (e) => {
    e.stopPropagation();
    if (!isOpen || isAnimating) return;

    triggerHaptic('light');
    isAnimating = true;
    isOpen = false;
    envelopeCard.classList.remove('is-open');
    envelopeCard.classList.add('is-animating');
    waxSealBtn.setAttribute('aria-expanded', 'false');

    const { previewHeight } = getPaperHeights();
    gsap.set(letterPaper, { height: letterPaper.getBoundingClientRect().height });

    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        envelopeCard.classList.remove('is-animating');
        envelopeCard.style.overflow = 'hidden';
        letterPaper.setAttribute('aria-hidden', 'true');
        letterPaper.setAttribute('inert', '');
        isAnimating = false;
      }
    });

    if (prefersReducedMotion) {
      timeline
        .to(letterContent, { opacity: 0, y: 18, duration: 0.12 })
        .to(letterPaper, {
          height: 0,
          y: 72,
          scale: 0.965,
          opacity: 0,
          duration: 0.22,
          ease: 'power1.in'
        }, 0)
        .set([envelopeSurface, envelopePocket, waxSealBtn], { opacity: 1 })
        .set(envelopeFlap, { scaleY: 1, y: 0, opacity: 1, zIndex: 10 })
        .set(waxSealBtn, { scale: 1, rotation: 0 });
      return;
    }

    timeline
      .to(letterContent, {
        opacity: 0,
        y: 16,
        duration: 0.24,
        stagger: { each: 0.035, from: 'end' },
        ease: 'power1.in'
      }, 0)
      .to(letterPaper, {
        height: previewHeight,
        y: -8,
        scale: 0.99,
        duration: 0.52,
        ease: 'power2.inOut'
      }, 0.18)
      .to(envelopeSurface, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.38,
        ease: 'power2.out'
      }, 0.35)
      .to(envelopePocket, {
        y: 0,
        opacity: 1,
        duration: 0.36,
        ease: 'power2.out'
      }, 0.42)
      .to(letterPaper, {
        height: 0,
        y: 72,
        scale: 0.965,
        opacity: 0,
        duration: 0.55,
        ease: 'power2.in'
      }, 0.68)
      .set(envelopeFlap, { zIndex: 10 }, 0.78)
      .to(envelopeFlap, {
        scaleY: 1,
        y: 0,
        opacity: 1,
        duration: 0.42,
        ease: 'power2.out'
      }, 0.82)
      .to(waxSealBtn, {
        opacity: 1,
        scale: 0.72,
        rotation: -8,
        duration: 0.2,
        ease: 'power1.out'
      }, 1.14)
      .to(waxSealBtn, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: 'back.out(1.8)'
      }, 1.28);
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
  const reasonColumns = [[], []];

  CONFIG.alasanCinta.forEach((reason, idx) => {
    const offsetClass = idx % 2 === 0 ? 'offset-up' : 'offset-down';
    reasonColumns[idx % 2].push(`
      <div class="envelope-card ${offsetClass} reveal-on-scroll" data-id="${reason.id}" style="--reason-order: ${idx};">
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
    `);
  });

  grid.innerHTML = reasonColumns.map(column => `
    <div class="love-envelope-column">
      ${column.join('')}
    </div>
  `).join('');
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
