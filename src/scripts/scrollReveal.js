/**
 * Smooth Staggered Scroll Reveal Controller
 */

export function initScrollReveal() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Selectors that should animate on scroll
  const selectors = [
    '.section-header',
    '.polaroid-card',
    '.envelope-card',
    '.timeline-item',
    '.bouquet-display-card',
    '.bouquet-flower-btn',
    '.love-jar-graphic-svg',
    '#shake-jar-btn',
    '.playlist-card',
    '.letter-paper-wrapper',
    '.letter-paragraph',
    '.closing-card'
  ];

  selectors.forEach(sel => {
    const elements = document.querySelectorAll(sel);
    elements.forEach(el => {
      if (!el.classList.contains('reveal-on-scroll')) {
        el.classList.add('reveal-on-scroll');
      }
    });
  });

  // Staggered animation delays for grid items
  const gridGroups = [
    '.gallery-scrapbook-container',
    '.reasons-grid',
    '.timeline-container',
    '.bouquet-flowers-grid',
    '.letter-body'
  ];

  gridGroups.forEach(groupSel => {
    const group = document.querySelector(groupSel);
    if (group) {
      const children = group.querySelectorAll('.reveal-on-scroll');
      children.forEach((child, idx) => {
        child.style.transitionDelay = `${(idx % 6) * 0.12}s`;
      });
    }
  });

  // Observe all revealable elements
  const allRevealable = document.querySelectorAll('.reveal-on-scroll');
  allRevealable.forEach(el => observer.observe(el));
}
