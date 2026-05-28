/**
 * cursor.js - Dual-Component Lerping Custom Cursor
 * Orchestrates a glowing cyan core dot and a smoothed lagging gold/cyan trail ring.
 */

function initCursor() {
  const cursor = document.getElementById('custom-cursor');
  const trail = document.getElementById('cursor-trail');
  
  if (!cursor || !trail) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  
  let cursorX = mouseX;
  let cursorY = mouseY;
  
  let trailX = mouseX;
  let trailY = mouseY;

  const lerpSpeed = 0.15; // Smoothness factor (0 to 1)

  // Flag to check if mouse has moved yet
  let hasMoved = false;

  // 1. Mouse coordinates listener
  window.addEventListener('mousemove', (e) => {
    hasMoved = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Core dot responds instantly
    cursorX = mouseX;
    cursorY = mouseY;
    
    // Reveal cursor elements once mouse starts moving
    cursor.style.opacity = '1';
    trail.style.opacity = '1';
  });

  // 2. Hide when mouse leaves document window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (hasMoved) {
      cursor.style.opacity = '1';
      trail.style.opacity = '1';
    }
  });

  // 3. Animation Loop with Linear Interpolation (lerp)
  function updateCursor() {
    if (hasMoved) {
      // Lerping formulas: position += (target - position) * speed
      trailX += (mouseX - trailX) * lerpSpeed;
      trailY += (mouseY - trailY) * lerpSpeed;

      // Render coordinates
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(updateCursor);
  }
  
  updateCursor();

  // 4. Hover states over interactive elements
  function addHoverEffects() {
    const clickables = document.querySelectorAll('a, button, input, textarea, .glow-logo-container, .mission-card, .glass-card, .skill-badge');
    
    clickables.forEach(elem => {
      // Check if listeners are already added
      if (elem.dataset.cursorBound) return;
      elem.dataset.cursorBound = 'true';

      elem.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        if (window.audioEngine && typeof window.audioEngine.playClick === 'function') {
          window.audioEngine.playClick();
        }
      });

      elem.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // Initial binding
  addHoverEffects();

  // Expose binding rebinder (useful after new HTML is fetched/injected)
  window.refreshCursorHoverEffects = addHoverEffects;
}

// Expose globally for script-tag structures
window.initCursor = initCursor;
