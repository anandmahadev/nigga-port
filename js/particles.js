/**
 * particles.js - Space Starfield Generator with Hyperspace Warp
 * Animates a 2D drifting star canvas with vertical speed trail warps on scroll.
 */

let starfieldWarpFactor = 1.0;
let targetWarpFactor = 1.0;

function initParticles() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  const numStars = 220;
  const stars = [];

  // Handle Resize
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Initialize Stars
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.4, // Sizes 0.4px to 1.9px
      speed: Math.random() * 0.5 + 0.15, // Normal drift speed
      opacity: Math.random() * 0.6 + 0.4 // Depth variations
    });
  }

  // Animation Loop
  function animate() {
    // Fill canvas background with solid near-black for deep space depth
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Smoothly interpolate warp factor towards target
    starfieldWarpFactor += (targetWarpFactor - starfieldWarpFactor) * 0.1;

    for (let i = 0; i < numStars; i++) {
      const star = stars[i];

      // Draw Star or speed trail line
      ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      
      const currentSpeed = star.speed * starfieldWarpFactor;
      
      if (starfieldWarpFactor > 1.8) {
        // Hyperspace stretched trail
        ctx.lineWidth = star.size * 0.8;
        ctx.beginPath();
        // Draw line from current position to previous trailed coordinates
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x, star.y - currentSpeed * 1.2);
        ctx.stroke();
      } else {
        // Standard drifting dot
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update Star Position
      star.y += currentSpeed;

      // Reset to Top if off-screen (handles wrap around dynamically)
      if (star.y > canvas.height) {
        star.y = -20;
        star.x = Math.random() * canvas.width;
        star.speed = Math.random() * 0.5 + 0.15;
        star.opacity = Math.random() * 0.6 + 0.4;
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  // Expose triggers globally
  window.triggerWarp = function(durationMs = 800) {
    targetWarpFactor = 32.0; // Warp Speed engaged!
    
    // Play transition sweep sound when starting warp!
    if (window.audioEngine && typeof window.audioEngine.playSweep === 'function') {
      window.audioEngine.playSweep();
    }
    
    setTimeout(() => {
      targetWarpFactor = 1.0; // Smooth deceleration back to normal drift
    }, durationMs);
  };

  // Expose cancellation logic
  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resizeCanvas);
  };
}

// Expose globally for standard script support
window.initParticles = initParticles;
window.starfieldWarpFactor = starfieldWarpFactor;
window.targetWarpFactor = targetWarpFactor;
