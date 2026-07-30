  /**
 * High-Performance Starry Night & Falling Romantic Flower Petals Engine
 * Fully optimized for 60 FPS performance.
 */

export function initParticleEngine() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const isMobile = width <= 600;

  // 1. Ambient stars (optimized count for mobile 60fps)
  const starCount = isMobile ? 35 : Math.min(100, Math.floor((width * height) / 11000));
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random(),
      maxAlpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      isGolden: Math.random() > 0.85
    });
  }

  // 2. Floating romantic flower petals (Rose Gold & Sakura Pink)
  const petalCount = isMobile ? 16 : Math.min(40, Math.floor(width / 25));
  const petals = [];
  const petalColors = [
    'rgba(245, 185, 200, 0.75)', // Sakura Pink
    'rgba(224, 169, 109, 0.80)', // Rose Gold
    'rgba(248, 215, 190, 0.70)', // Blush Peach
    'rgba(235, 150, 175, 0.65)', // Deep Rose
    'rgba(255, 230, 238, 0.85)'  // Soft White Blossom
  ];

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 10 + 6,
      speedY: Math.random() * 0.9 + 0.5,
      speedX: Math.random() * 0.4 - 0.2,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.008,
      swayWidth: Math.random() * 1.2 + 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      color: petalColors[Math.floor(Math.random() * petalColors.length)]
    });
  }

  // Helper to draw organic flower petal shape
  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.beginPath();
    ctx.moveTo(0, -p.size / 2);
    ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size / 1.5, p.size / 2, 0, p.size);
    ctx.bezierCurveTo(-p.size / 1.5, p.size / 2, -p.size / 2, -p.size / 2, 0, -p.size / 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw twinkling stars
    stars.forEach(star => {
      star.alpha += star.twinkleSpeed;
      if (star.alpha > star.maxAlpha || star.alpha < 0.1) {
        star.twinkleSpeed = -star.twinkleSpeed;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.isGolden
        ? `rgba(245, 213, 179, ${Math.max(0, star.alpha)})`
        : `rgba(240, 230, 245, ${Math.max(0, star.alpha)})`;
      ctx.fill();
    });

    // Draw & update falling flower petals
    petals.forEach(p => {
      p.swayAngle += p.swaySpeed;
      p.x += Math.sin(p.swayAngle) * p.swayWidth + p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      // Reset when drifting off screen bottom
      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      drawPetal(p);
    });

    requestAnimationFrame(render);
  }

  render();
}

/**
 * Clean SVG celebration burst
 */
export function triggerCelebrationBurst() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  const particleCount = 28;
  const svgShapes = [
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="#e0a96d"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="#f5b9c8"><path d="M12 2c-4 0-7 3.5-7 7.5S8.5 19 12 22c3.5-3 7-9 7-12.5S16 2 12 2z"/></svg>`,
    `<svg width="18" height="18" viewBox="0 0 24 24" fill="#f5d5b3"><circle cx="12" cy="12" r="8"/></svg>`
  ];

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * 0.7;

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement('div');
    el.innerHTML = svgShapes[Math.floor(Math.random() * svgShapes.length)];
    el.style.position = 'absolute';
    el.style.left = `${centerX}px`;
    el.style.top = `${centerY}px`;
    el.style.userSelect = 'none';
    el.style.willChange = 'transform, opacity';
    el.style.transition = 'transform 1.6s cubic-bezier(0.15, 0.85, 0.35, 1), opacity 1.6s ease-out';
    
    container.appendChild(el);

    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
    const distance = Math.random() * 220 + 120;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 80;

    requestAnimationFrame(() => {
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${Math.random() * 0.5 + 0.8})`;
      el.style.opacity = '0';
    });
  }

  setTimeout(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, 1700);
}

/**
 * Multi-color Birthday Fireworks & Confetti Rain Burst
 */
export function triggerConfettiFireworks() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9998';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  const colors = ['#E89898', '#A67BB5', '#7D5A95', '#F5DFDF', '#FFAE42', '#FFF59D', '#E91E63'];
  const confettiCount = 65;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 6;
    const isCircle = Math.random() > 0.5;

    confetti.style.position = 'absolute';
    confetti.style.width = `${size}px`;
    confetti.style.height = isCircle ? `${size}px` : `${size * 1.8}px`;
    confetti.style.backgroundColor = color;
    confetti.style.borderRadius = isCircle ? '50%' : '2px';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = '-20px';
    confetti.style.opacity = (Math.random() * 0.5 + 0.5).toString();
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.willChange = 'transform, opacity';
    confetti.style.transition = `transform ${Math.random() * 2 + 2}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${Math.random() * 1.5 + 1.5}s ease-out`;

    container.appendChild(confetti);

    const fallDistance = window.innerHeight + 60;
    const swayDistance = (Math.random() - 0.5) * 200;
    const rotation = Math.random() * 720;

    requestAnimationFrame(() => {
      confetti.style.transform = `translate3d(${swayDistance}px, ${fallDistance}px, 0) rotate(${rotation}deg)`;
      confetti.style.opacity = '0';
    });
  }

  // Also call standard celebration burst
  triggerCelebrationBurst();

  setTimeout(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, 3500);
}
