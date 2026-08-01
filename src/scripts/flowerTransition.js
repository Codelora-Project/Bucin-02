export const FLOWER_ASSETS = Object.freeze([
  '/flowers/flower-1.webp',
  '/flowers/flower-2.webp',
  '/flowers/flower-3.webp',
  '/flowers/flower-4.webp'
]);

const spriteCache = new Map();
const MAX_DEVICE_DPR = 2;
const MAX_BACKING_PIXELS = 4_000_000;
const MIN_RENDER_DPR = 0.75;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.addEventListener('load', () => resolve(image), { once: true });
    image.addEventListener('error', reject, { once: true });
    image.src = src;
  });
}

/**
 * Decode each sprite once and share it between the preloader and transition.
 * ImageBitmap keeps decoding work away from the animation's first draw where supported.
 */
export function preloadFlowerSprite(src) {
  if (spriteCache.has(src)) return spriteCache.get(src);

  const spritePromise = (async () => {
    const image = await loadImage(src);

    if (typeof image.decode === 'function') {
      try {
        await image.decode();
      } catch (error) {
        // A completed image is still drawable when explicit decode is unavailable.
      }
    }

    if (typeof createImageBitmap === 'function') {
      try {
        return await createImageBitmap(image);
      } catch (error) {
        // The decoded HTMLImageElement remains a reliable fallback.
      }
    }

    return image;
  })();

  spriteCache.set(src, spritePromise);
  return spritePromise;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function greatestCommonDivisor(a, b) {
  let left = a;
  let right = b;

  while (right !== 0) {
    const remainder = left % right;
    left = right;
    right = remainder;
  }

  return left;
}

function getGridStep(cellCount) {
  let step = Math.max(1, Math.round(cellCount * 0.618));
  while (greatestCommonDivisor(step, cellCount) !== 1) step += 1;
  return step;
}

function getTransitionTiming(reducedMotion) {
  if (reducedMotion) {
    const timing = {
      burstStart: 0.24,
      shotSpan: 0.34,
      flightDuration: 0.42,
      coverHold: 0.08,
      fallDuration: 0.7,
      flowerCount: 42
    };
    timing.coverageTime = timing.burstStart + timing.shotSpan + timing.flightDuration * 1.12;
    timing.fallStart = timing.coverageTime + timing.coverHold;
    timing.totalDuration = timing.fallStart + timing.fallDuration + 0.08;
    return timing;
  }

  const timing = {
    burstStart: 0.38,
    shotSpan: 2.2,
    flightDuration: 0.78,
    coverHold: 0.18,
    fallDuration: 3.2,
    flowerCount: 144
  };
  timing.coverageTime = timing.burstStart + timing.shotSpan + timing.flightDuration * 1.12;
  timing.fallStart = timing.coverageTime + timing.coverHold;
  timing.totalDuration = timing.fallStart + timing.fallDuration + 0.1;
  return timing;
}

/**
 * A short-lived, single-canvas flower transition.
 * Visual density is viewport-based; render resolution is bounded by pixel cost.
 */
export function createFlowerTransition({
  container,
  sources = FLOWER_ASSETS,
  reducedMotion = false
}) {
  if (!container) throw new Error('A flower transition container is required.');

  const canvas = document.createElement('canvas');
  canvas.className = 'flower-burst-canvas';
  canvas.width = 1;
  canvas.height = 1;
  container.appendChild(canvas);

  const context = canvas.getContext('2d', {
    alpha: true,
    desynchronized: true
  });
  const timing = getTransitionTiming(reducedMotion);
  const spritePromise = Promise.allSettled(sources.map(preloadFlowerSprite))
    .then(results => results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value));

  let animationFrame = 0;
  let isRunning = false;
  let isDestroyed = false;
  let viewport = null;
  let particles = [];

  function prepare() {
    return spritePromise;
  }

  function configureCanvas() {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    const deviceDpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_DPR);
    const budgetDpr = Math.sqrt(MAX_BACKING_PIXELS / (width * height));
    const renderDpr = Math.min(deviceDpr, Math.max(MIN_RENDER_DPR, budgetDpr));

    canvas.width = Math.ceil(width * renderDpr);
    canvas.height = Math.ceil(height * renderDpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'medium';

    viewport = { width, height, dpr: renderDpr };
    return viewport;
  }

  function createParticles(sprites, originX, originY) {
    const { width, height } = viewport;
    const targetCells = 60;
    const aspectRatio = width / height;
    const columns = clamp(Math.round(Math.sqrt(targetCells * aspectRatio)), 6, 10);
    const rows = Math.ceil(targetCells / columns);
    const cellCount = columns * rows;
    const cellWidth = width / columns;
    const cellHeight = height / rows;
    const cellDiagonal = Math.hypot(cellWidth, cellHeight);
    const gridStep = getGridStep(cellCount);

    return Array.from({ length: timing.flowerCount }, (_, index) => {
      const cellIndex = (index * gridStep) % cellCount;
      const column = cellIndex % columns;
      const row = Math.floor(cellIndex / columns);
      const targetX = (column + 0.5) * cellWidth + (Math.random() - 0.5) * cellWidth * 0.5;
      const targetY = (row + 0.5) * cellHeight + (Math.random() - 0.5) * cellHeight * 0.5;

      return {
        image: sprites[index % sprites.length],
        targetX,
        targetY,
        originX,
        originY,
        rotation: Math.random() * 180 - 90,
        fallRotation: Math.random() * 240 - 120,
        size: cellDiagonal * (0.84 + Math.random() * 0.3),
        scale: 0.9 + Math.random() * 0.24,
        launchAt: timing.burstStart +
          (index / Math.max(1, timing.flowerCount - 1)) * timing.shotSpan,
        flightDuration: timing.flightDuration * (0.88 + Math.random() * 0.24),
        fallDelay: Math.random() * (reducedMotion ? 0.05 : 0.2),
        swayAmplitude: Math.min(cellWidth * 0.34, 58) * (0.65 + Math.random() * 0.35),
        swayCycles: 1.05 + Math.random() * 0.65,
        swayDirection: Math.random() > 0.5 ? 1 : -1
      };
    });
  }

  function clearCanvas() {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalAlpha = 1;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawFrame(elapsedSeconds) {
    const { width, height, dpr } = viewport;
    clearCanvas();

    particles.forEach(flower => {
      const localBurst = clamp01(
        (elapsedSeconds - flower.launchAt) / flower.flightDuration
      );
      if (localBurst <= 0) return;

      const burstEase = easeOutCubic(localBurst);
      const fallElapsed = elapsedSeconds - timing.fallStart - flower.fallDelay;
      const localFall = clamp01(fallElapsed / Math.max(0.01, timing.fallDuration - flower.fallDelay));
      const fallEase = localFall * localFall;
      const swayEnvelope = Math.sin(localFall * Math.PI);
      const sway = Math.sin(localFall * Math.PI * 2 * flower.swayCycles) *
        flower.swayAmplitude * flower.swayDirection * swayEnvelope;

      const x = flower.originX + (flower.targetX - flower.originX) * burstEase + sway;
      const y = flower.originY + (flower.targetY - flower.originY) * burstEase +
        (height + flower.size) * fallEase;
      const rotation = (flower.rotation * burstEase + flower.fallRotation * localFall) * Math.PI / 180;
      const scale = (0.14 + (flower.scale - 0.14) * burstEase) * (1 - fallEase * 0.08);
      const opacity = Math.min(1, localBurst * 5) * (1 - fallEase);
      const drawSize = flower.size * scale;
      const cos = Math.cos(rotation) * dpr;
      const sin = Math.sin(rotation) * dpr;

      context.setTransform(cos, sin, -sin, cos, x * dpr, y * dpr);
      context.globalAlpha = opacity;
      context.drawImage(flower.image, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
    });

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalAlpha = 1;
  }

  async function play({ originX, originY, onCovered, onComplete } = {}) {
    if (isRunning || isDestroyed) return;
    isRunning = true;

    const sprites = await spritePromise;
    if (isDestroyed) return;

    if (!context || sprites.length === 0) {
      onCovered?.();
      onComplete?.();
      return;
    }

    configureCanvas();
    canvas.classList.add('is-active');
    particles = createParticles(
      sprites,
      Number.isFinite(originX) ? originX : viewport.width / 2,
      Number.isFinite(originY) ? originY : viewport.height / 2
    );

    let covered = false;
    const startedAt = performance.now();

    const render = now => {
      if (!isRunning || isDestroyed) return;
      const elapsed = (now - startedAt) / 1000;

      if (!covered && elapsed >= timing.coverageTime) {
        // Draw an exact coverage frame, then keep it static during the DOM handoff.
        drawFrame(timing.coverageTime);
        covered = true;
        onCovered?.();
      } else if (!covered || elapsed >= timing.fallStart) {
        drawFrame(elapsed);
      }

      if (elapsed >= timing.totalDuration) {
        isRunning = false;
        clearCanvas();
        onComplete?.();
        return;
      }

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);
  }

  function destroy() {
    isDestroyed = true;
    isRunning = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    particles = [];
    canvas.width = 1;
    canvas.height = 1;
    canvas.remove();
  }

  return {
    timing,
    prepare,
    play,
    destroy
  };
}
