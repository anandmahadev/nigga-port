/**
 * tilt.js - 3D Parallax Card Hover Engine
 * Applies dynamic perspective rotations and spotlight cursor mapping to grids.
 */

function initTilt() {
  const cards = document.querySelectorAll('.mission-card, .glass-card');
  
  if (cards.length === 0) return;

  const maxTilt = 12; // Maximum tilt rotation in degrees

  cards.forEach(card => {
    // 1. Mouse Move Tilt Logic
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Mouse x relative to card
      const y = e.clientY - rect.top;  // Mouse y relative to card
      
      const width = rect.width;
      const height = rect.height;

      // Normalized coordinates (-1 to 1) from card center
      const xNorm = (x - width / 2) / (width / 2);
      const yNorm = (y - height / 2) / (height / 2);

      // Rotations around X and Y axes
      const tiltX = -(yNorm * maxTilt).toFixed(2);
      const tiltY = (xNorm * maxTilt).toFixed(2);

      // Disable transition temporarily for buttery zero-delay tracking
      card.style.transition = 'none';

      // Apply 3D rotation and slight lift scale
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Map coordinates to CSS custom properties for neon spotlight tracks
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    // 2. Mouse Leave Reset Logic
    card.addEventListener('mouseleave', () => {
      // Restore CSS transition for smooth return animation
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      
      // Reset coordinates to flat center
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // Expose rebinder for fresh post-fetch elements
  window.refreshTiltEffects = initTilt;
}

// Expose globally for standard HTML script inclusion
window.initTilt = initTilt;
