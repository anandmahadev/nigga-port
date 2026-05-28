/**
 * main.js - Master Orchestration Story Cinema Engine
 * Manages HUD timecode ticks, autoplay scroll snaps, audio triggers, and neural vector tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Bind Audio Uplink prompt options immediately
  initAudioHandshake();
});

/**
 * Orchestrates the cinematic core startup sequence upon user audio selection.
 */
function initAudioHandshake() {
  const overlay = document.getElementById('audio-uplink');
  const btnOn = document.getElementById('btn-audio-on');
  const btnOff = document.getElementById('btn-audio-off');

  function completeHandshake(enableSound) {
    // 1. Secured transition out
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 800);
    }

    // 2. Play sweep chime if enabled
    if (enableSound && window.audioEngine) {
      window.audioEngine.toggleAudio();
      
      // Update HUD toggle button status
      const toggleBtn = document.getElementById('audio-toggle-btn');
      if (toggleBtn) {
        toggleBtn.textContent = "AUDIO: ON";
        toggleBtn.classList.add('active');
      }
    }

    // 3. Initialize all systems
    initAllSubsystems();
    startTimecode();
  }

  if (btnOn) {
    btnOn.addEventListener('click', () => completeHandshake(true));
  }
  if (btnOff) {
    btnOff.addEventListener('click', () => completeHandshake(false));
  }
}

/**
 * Initializes all modular visual and physics subsystems in sequence.
 */
function initAllSubsystems() {
  if (typeof window.initParticles === 'function') window.initParticles();
  if (typeof window.initTypewriter === 'function') window.initTypewriter();
  if (typeof window.initCursor === 'function') window.initCursor();
  if (typeof window.initScrollAnimations === 'function') window.initScrollAnimations();
  if (typeof window.initTilt === 'function') window.initTilt();

  // Initialize FlipaClip drawing sketch editor
  if (window.animatorEngine && typeof window.animatorEngine.init === 'function') {
    window.animatorEngine.init();
  }

  // Configure Audio Toggle HUD button
  initAudioToggleController();

  // Configure Cinematic Autoplay Reel Player
  initAutoplayReelEngine();

  // Configure Proximity AI Neural network nodes reaction
  initNeuralProximitySensor();

  // Set up telemetry form event handlers
  initContactFormTelemetry();
}

/**
 * Calibrates running 24fps cinematic Frame-by-Frame Timecode Telemetry.
 */
function startTimecode() {
  const display = document.getElementById('timecode-display');
  if (!display) return;
  const startTime = Date.now();

  function updateTicks() {
    const elapsed = Date.now() - startTime;
    
    const hrs = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
    const mins = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
    const secs = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
    // 24fps frames calculate: remainder of second mapped to 24 bounds (1000ms / 24 frames = 41.6ms per frame)
    const frames = Math.floor((elapsed % 1000) / 41.6).toString().padStart(2, '0');

    display.textContent = `${hrs}:${mins}:${secs}:${frames}`;
    requestAnimationFrame(updateTicks);
  }
  
  requestAnimationFrame(updateTicks);
}

/**
 * Hooks toggle behavior onto the top bar Audio speaker HUD buttons.
 */
function initAudioToggleController() {
  const btn = document.getElementById('audio-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (window.audioEngine) {
      const active = window.audioEngine.toggleAudio();
      
      btn.textContent = active ? "AUDIO: ON" : "AUDIO: OFF";
      
      if (active) {
        btn.classList.add('active');
        // Play click feedback on toggle
        window.audioEngine.playSweep();
      } else {
        btn.classList.remove('active');
      }
    }
  });
}

/**
 * Controls the chronological "PLAY REEL" story cinema loop.
 */
function initAutoplayReelEngine() {
  const btn = document.getElementById('autoplay-reel-btn');
  if (!btn) return;

  const chapters = ['hero', 'origin', 'origin-data', 'skills', 'projects', 'ailab', 'contact'];
  let reelInterval = null;
  let isPlaying = false;

  btn.addEventListener('click', () => {
    // Sound FX feedback
    if (window.audioEngine && typeof window.audioEngine.playSweep === 'function') {
      window.audioEngine.playSweep();
    }

    if (isPlaying) {
      // STOP PLAYING
      clearInterval(reelInterval);
      btn.textContent = "PLAY REEL [►]";
      btn.classList.remove('playing');
      isPlaying = false;
      
      if (window.typeSubtitles) {
        window.typeSubtitles(">> SYSTEM_LOG: Story reel playback terminated manually. Manual navigation restored.");
      }
    } else {
      // START PLAYING
      btn.textContent = "STOP REEL [■]";
      btn.classList.add('playing');
      isPlaying = true;
      
      let index = 0;
      
      // Determine where user currently is to start snapping from nearest scene
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = window.innerHeight;
      index = Math.round(scrollTop / height);
      if (index >= chapters.length) index = 0;

      // Scroll to current snap instantly to align playhead
      document.getElementById(chapters[index]).scrollIntoView({ behavior: 'smooth' });

      reelInterval = setInterval(() => {
        index++;
        if (index >= chapters.length) {
          // Finished loop
          clearInterval(reelInterval);
          btn.textContent = "PLAY REEL [►]";
          btn.classList.remove('playing');
          isPlaying = false;
          window.typeSubtitles(">> SYSTEM_LOG: Story reel play completed. Operational telemetries online.");
          return;
        }

        // Snap to next chapter
        document.getElementById(chapters[index]).scrollIntoView({ behavior: 'smooth' });
      }, 7500); // 7.5 seconds per cinema slide (comfortable reading pace)
    }
  });

  // Stop autoplay if user performs high-frequency scroll wheel movements
  window.addEventListener('wheel', () => {
    if (isPlaying) {
      clearInterval(reelInterval);
      btn.textContent = "PLAY REEL [►]";
      btn.classList.remove('playing');
      isPlaying = false;
    }
  });
}

/**
 * Live interactive SVG Neural network vector map - node scale proximity triggers.
 */
function initNeuralProximitySensor() {
  const netSvg = document.getElementById('neural-net');
  if (!netSvg) return;

  const nodes = netSvg.querySelectorAll('circle.node');
  const edges = netSvg.querySelectorAll('path.edge');

  netSvg.addEventListener('mousemove', (e) => {
    const rect = netSvg.getBoundingClientRect();
    
    // Normalized pointer inside SVG coordinates
    const mouseX = ((e.clientX - rect.left) / rect.width) * 800; // viewBox width is 800
    const mouseY = ((e.clientY - rect.top) / rect.height) * 350; // viewBox height is 350

    nodes.forEach(node => {
      const cx = parseFloat(node.getAttribute('cx'));
      const cy = parseFloat(node.getAttribute('cy'));
      
      // Distance calculation
      const dist = Math.hypot(mouseX - cx, mouseY - cy);
      
      if (dist < 70) {
        // Expand node size based on proximity
        const scale = 1.0 + (70 - dist) / 45;
        node.style.transform = `scale(${scale})`;
        node.style.transformOrigin = `${cx}px ${cy}px`;
        
        // Increase node outline intensity
        node.style.strokeWidth = `${3 + (70 - dist) / 15}px`;
        node.style.stroke = 'var(--gold)';
        
        // Custom shadow bloom
        if (node.classList.contains('gold-node')) {
          node.setAttribute('r', '13');
        } else {
          node.setAttribute('r', '11');
        }
      } else {
        // Restore default properties
        node.style.transform = 'none';
        node.style.strokeWidth = node.classList.contains('gold-node') ? '2px' : '1.5px';
        node.style.stroke = node.classList.contains('gold-node') ? 'var(--gold)' : 'var(--cyan)';
        node.setAttribute('r', node.classList.contains('gold-node') ? '12' : '8');
      }
    });

    edges.forEach(edge => {
      const d = edge.getAttribute('d');
      // Simple parse of edge lines to check proximity (e.g. M 100,75 L 280,50)
      const matches = d.match(/M\s+(\d+),(\d+)\s+L\s+(\d+),(\d+)/);
      if (matches) {
        const x1 = parseFloat(matches[1]);
        const y1 = parseFloat(matches[2]);
        const x2 = parseFloat(matches[3]);
        const y2 = parseFloat(matches[4]);

        // Midpoint of edge
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const dist = Math.hypot(mouseX - midX, mouseY - midY);

        if (dist < 100) {
          edge.style.stroke = 'rgba(255, 215, 0, 0.4)';
          edge.style.strokeWidth = '1.8px';
        } else {
          edge.style.stroke = '';
          edge.style.strokeWidth = '';
        }
      }
    });
  });

  // Restore everything when mouse leaves net
  netSvg.addEventListener('mouseleave', () => {
    nodes.forEach(node => {
      node.style.transform = 'none';
      node.style.strokeWidth = '';
      node.style.stroke = '';
      node.setAttribute('r', node.classList.contains('gold-node') ? '12' : '8');
    });
    edges.forEach(edge => {
      edge.style.stroke = '';
      edge.style.strokeWidth = '';
    });
  });
}

/**
 * Runs the cinematic multi-step button launch sequence on form submit.
 */
function initContactFormTelemetry() {
  const form = document.getElementById('transmission-form');
  if (!form) return;

  const btn = form.querySelector('.btn-transmit');
  if (!btn) return;

  const btnText = btn.querySelector('.btn-transmit-text');
  const originalText = btnText.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (btn.classList.contains('launching') || btn.classList.contains('success')) return;

    btn.classList.add('launching');
    
    // Play sweep initialization chime!
    if (window.audioEngine && typeof window.audioEngine.playSweep === 'function') {
      window.audioEngine.playSweep();
    }
    
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Phase 1: Charge
    btnText.textContent = "CHARGING TELEMETRY COILS [3...]";
    await wait(600);

    // Phase 2: Align
    btnText.textContent = "ALIGNING FREQUENCY BEAM [2...]";
    await wait(600);

    // Phase 3: Transmit
    btnText.textContent = "UPLINKING COORDINATES [1...]";
    await wait(600);

    // Phase 4: Success
    btn.classList.remove('launching');
    btn.classList.add('success');
    btnText.textContent = "TRANSMISSION SECURED [SIGNAL ON AIR]";
    
    // Play chime again on secure
    if (window.audioEngine && typeof window.audioEngine.playSweep === 'function') {
      window.audioEngine.playSweep();
    }

    // Type a neat log in subtitles
    if (window.typeSubtitles) {
      window.typeSubtitles(">> SUCCESS // DIRECT_UPLINK: SECURE COMMUNICATIONS HANDSHAKE ESTABLISHED WITH CLIENT NODE.");
    }

    form.reset();

    // Reset button after cooloff
    await wait(3000);
    btn.classList.remove('success');
    btnText.textContent = originalText;
  });
}
