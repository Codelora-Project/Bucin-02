import { CONFIG } from '../config/content.js';
import { initParticleEngine, triggerCelebrationBurst } from './particles.js';
import { AudioController } from './audio.js';
import { initScrollReveal } from './scrollReveal.js';

let audioCtrl = null;
let currentPinInput = '';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize canvas particle background
  initParticleEngine();

  // Populate HTML with CONFIG data
  renderPinGate();
  renderHeroSection();
  renderPhotoGallery();
  renderTimeline();
  renderLoveLetter();
  renderReasons();
  renderLoveJar();
  renderPlaylist();
  renderClosingSection();

  // Initialize Audio Controller with Multi-Track Playlist
  audioCtrl = new AudioController(CONFIG.playlistConfig);

  // Setup Event Listeners & Interactivity
  setupPinGate();
  setupWelcomeGate();
  setupHeroScroll();
  setupLightbox();
  setupReasonCards();
  setupLoveJar();
  setupPlaylist();
  setupClosingButton();
  setupScrollProgress();
});

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
      keyBtn.classList.add('is-pressed');
      setTimeout(() => keyBtn.classList.remove('is-pressed'), 120);
      
      const key = keyBtn.dataset.key;
      handleKeyPress(key);
    };

    keyBtn.addEventListener('pointerdown', handlePress);
  });

  function verifyPin() {
    if (currentPinInput === targetPin) {
      // Trigger Golden Padlock Opening Animation
      if (padlockWrapper) padlockWrapper.classList.add('is-unlocked');

      setTimeout(() => {
        if (pinOverlay) pinOverlay.classList.add('is-hidden');
        
        const welcomeGate = document.getElementById('welcome-gate');
        if (welcomeGate) welcomeGate.classList.remove('is-hidden');
      }, 550);
      
    } else {
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
  const TOTAL_FLOWERS = isMobile ? 120 : 180; // Dikurangi signifikan agar HP tidak lag dan animasi lancar

  // Pre-create flower elements
  for (let i = 0; i < TOTAL_FLOWERS; i++) {
    const flower = document.createElement("div");
    flower.classList.add("flower-particle");
    
    const randomImage = flowerImages[Math.floor(Math.random() * flowerImages.length)];
    flower.style.backgroundImage = `url('${randomImage}')`;
    flower.style.backgroundSize = "contain";
    flower.style.backgroundRepeat = "no-repeat";
    flower.style.backgroundPosition = "center";
    
    // Ukuran bunga disetting persis 75px - 190px
    const randomSize = Math.random() * 115 + 75;
    flower.style.width = randomSize + "px";
    flower.style.height = randomSize + "px";
    
    // Tambahkan sedikit z-index acak agar tumpukannya natural
    flower.style.zIndex = Math.floor(Math.random() * 100) + 10;
    
    flowerContainer.appendChild(flower);
  }

  // Handle Explosion
  initialView.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;

    // Check if gsap is loaded
    if (typeof gsap === 'undefined') {
      console.error("GSAP is not loaded!");
      showMainContent();
      return;
    }

    const tl = gsap.timeline();

    // A. Fade out initial view and reveal main content behind the flowers
    tl.to(initialView, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        initialView.style.display = "none";
        
        // Mulai tampilkan konten utama di belakangnya
        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.style.display = 'block';
        
        // Putar audio & setup scroll
        if (audioCtrl) {
          audioCtrl.showWidget();
          audioCtrl.play();
        }
        setTimeout(() => { initScrollReveal(); }, 300);

        // Pudar background welcome-gate menjadi transparan agar website utama terlihat
        gsap.to(welcomeGate, {
          backgroundColor: "rgba(0,0,0,0)",
          duration: 1.5,
          ease: "power1.inOut"
        });
        
        // Biarkan kita bisa klik ke website utama selagi bunga berjatuhan (pointer-events: none)
        welcomeGate.style.pointerEvents = "none";
      }
    });

    // B. Flower Burst (THE GALAXY SPIRAL STYLE)
    const flowers = document.querySelectorAll(".flower-particle");
    const NUM_ARMS = 3; // 3 lengan spiral galaksi
    
    flowers.forEach((flower, index) => {
      // Tentukan bunga ini masuk ke lengan spiral yang mana (0, 1, atau 2)
      const armIndex = index % NUM_ARMS;
      // Posisi progress (0.0 hingga 1.0) bunga ini di sepanjang lengannya
      const progress = Math.floor(index / NUM_ARMS) / (TOTAL_FLOWERS / NUM_ARMS);
      
      // Sudut dasar lengan (terpisah 120 derajat) ditambah putaran spiral (3 putaran penuh)
      const armOffset = (armIndex / NUM_ARMS) * Math.PI * 2;
      const angle = armOffset + (progress * Math.PI * 2 * 3); 
      
      const maxDistance = Math.max(window.innerWidth, window.innerHeight) * 0.9; 
      // Jarak melebar secara eksponensial kecil agar bentuk spiralnya padat di tengah dan renggang di luar
      const distance = Math.pow(progress, 0.8) * maxDistance + 50; 
      
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      
      const randomRotation = Math.random() * 360 + 720; 
      const randomScale = Math.random() * 1.5 + 1;
      const duration = progress * 1.5 + 1.0; // Durasi menembak bervariasi

      tl.to(flower, {
        x: endX,
        y: endY,
        rotation: randomRotation,
        scale: randomScale,
        opacity: 1,
        duration: duration,
        ease: "power2.out"
      }, progress * 1.5); // Stagger mengikuti garis spiral bersama-sama
      
      // Setelah spiral terbentuk, jatuh perlahan bagaikan bintang jatuh
      gsap.to(flower, {
        y: endY + (Math.random() * 600 + 400),
        opacity: 0,
        rotation: randomRotation + 180,
        duration: Math.random() * 3 + 3,
        ease: "power1.inOut",
        delay: (progress * 1.5) + duration + 0.5 
      });
    });

    // Hapus welcome-gate sepenuhnya setelah semua bunga selesai berjatuhan (misal ~8 detik)
    setTimeout(() => {
      welcomeGate.classList.add('is-hidden');
    }, 8000);
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
      jarGraphic.classList.add('is-shaking');
      noteModal.classList.remove('is-active');

      setTimeout(() => {
        jarGraphic.classList.remove('is-shaking');
        noteIndex = (noteIndex + 1) % notes.length;
        if (noteText) noteText.textContent = notes[noteIndex];
        noteModal.classList.add('is-active');
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
        <span class="playlist-track-title">${escapeHtml(track.title)}</span>
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
      items.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');

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
