/**
 * animator.js - Canvas Sketchbook Controller.
 * Handles frame overlays, multi-layered canvas drawing, and onion-skin layers.
 */
/**
 * animator.js - FlipaClip Embedded 2D Sketch Editor Engine
 * Runs multi-frame sketch pads, onion skin ghosting, and 12fps looping playbacks.
 */

const animatorEngine = {
  drawingCanvas: null,
  drawingCtx: null,
  onionSkinCanvas: null,
  onionSkinCtx: null,
  
  frames: [],          // Array of base64 image strings representing drawn frames
  currentFrameIndex: 0,
  isDrawing: false,
  isPlaying: false,
  playbackInterval: null,
  fps: 8,             // 8 Frames Per Second loop speed
  
  brushColor: '#00f5ff',
  brushWidth: 4,
  lastX: 0,
  lastY: 0,

  /**
   * Initializes the animator elements and drawing loops.
   */
  init() {
    this.drawingCanvas = document.getElementById('drawing-canvas');
    this.onionSkinCanvas = document.getElementById('onion-skin-canvas');

    if (!this.drawingCanvas || !this.onionSkinCanvas) return;

    this.drawingCtx = this.drawingCanvas.getContext('2d');
    this.onionSkinCtx = this.onionSkinCanvas.getContext('2d');

    // Calibrate Canvas dimensions matching layouts
    this.resizeCanvases();
    window.addEventListener('resize', () => this.resizeCanvases());

    // Initialize with a single blank frame
    this.clearCanvas(false);
    this.saveCurrentFrame();

    // Configure draw events listeners (Mouse & Touch)
    this.bindDrawEvents();
    
    // Configure Scrubber UI Button listeners
    this.bindScrubberControls();
    
    // Pre-draw a cute starting guide on frame 0 to welcome visitors!
    this.drawStartGuide();
    
    console.log("[ANIMATOR]: FlipaClip Sketch Engine Charged.");
  },

  /**
   * Adjusts drawing coordinates on viewport scale transitions.
   */
  resizeCanvases() {
    const container = this.drawingCanvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Set internal resolution matching layout box
    this.drawingCanvas.width = width;
    this.drawingCanvas.height = height;
    
    this.onionSkinCanvas.width = width;
    this.onionSkinCanvas.height = height;

    this.loadFrame(this.currentFrameIndex);
  },

  /**
   * Binds Mouse and Touch vector listening systems onto canvases.
   */
  bindDrawEvents() {
    const canvas = this.drawingCanvas;

    const startDraw = (x, y) => {
      if (this.isPlaying) this.stop();
      this.isDrawing = true;
      this.lastX = x;
      this.lastY = y;
      
      // Play high-frequency pen click sound on draw startup
      if (window.audioEngine && typeof window.audioEngine.playClick === 'function') {
        window.audioEngine.playClick();
      }
    };

    const draw = (x, y) => {
      if (!this.isDrawing) return;

      this.drawingCtx.strokeStyle = this.brushColor;
      this.drawingCtx.lineWidth = this.brushWidth;
      this.drawingCtx.lineCap = 'round';
      this.drawingCtx.lineJoin = 'round';
      this.drawingCtx.shadowBlur = 8;
      this.drawingCtx.shadowColor = this.brushColor;

      this.drawingCtx.beginPath();
      this.drawingCtx.moveTo(this.lastX, this.lastY);
      this.drawingCtx.lineTo(x, y);
      this.drawingCtx.stroke();

      // Reset shadows immediately to prevent leakage
      this.drawingCtx.shadowBlur = 0;

      this.lastX = x;
      this.lastY = y;

      // Play soft marker squeak sounds periodically while drawing!
      if (Math.random() < 0.15 && window.audioEngine && typeof window.audioEngine.playTypewriter === 'function') {
        window.audioEngine.playTypewriter();
      }
    };

    const stopDraw = () => {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveCurrentFrame();
      }
    };

    // Get coordinates relative to canvas boundaries
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    // Mouse Listeners
    canvas.addEventListener('mousedown', (e) => {
      const pos = getPos(e);
      startDraw(pos.x, pos.y);
    });
    canvas.addEventListener('mousemove', (e) => {
      const pos = getPos(e);
      draw(pos.x, pos.y);
    });
    window.addEventListener('mouseup', stopDraw);

    // Touch Listeners
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const pos = getPos(e);
      startDraw(pos.x, pos.y);
    });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const pos = getPos(e);
      draw(pos.x, pos.y);
    });
    window.addEventListener('touchend', stopDraw);
  },

  /**
   * Binds UI frame scrubber button triggers.
   */
  bindScrubberControls() {
    const playBtn = document.getElementById('anim-play-btn');
    const addBtn = document.getElementById('anim-add-btn');
    const deleteBtn = document.getElementById('anim-delete-btn');
    const clearBtn = document.getElementById('anim-clear-btn');

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (this.isPlaying) {
          this.stop();
        } else {
          this.play();
        }
      });
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.addFrame();
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        this.deleteFrame();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearCanvas(true);
      });
    }
  },

  /**
   * Draws a simple welcoming guide illustration on startup.
   */
  drawStartGuide() {
    const ctx = this.drawingCtx;
    const w = this.drawingCanvas.width;
    const h = this.drawingCanvas.height;

    // Reset any existing shadow
    ctx.shadowBlur = 0;

    // Draw Corner Visor HUD target lines (Magenta `#d600ff` neon glow)
    ctx.strokeStyle = '#d600ff';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#d600ff';

    // Top left bracket
    ctx.beginPath();
    ctx.moveTo(w / 2 - 60, h / 2 - 60);
    ctx.lineTo(w / 2 - 80, h / 2 - 60);
    ctx.lineTo(w / 2 - 80, h / 2 - 40);
    ctx.stroke();

    // Top right bracket
    ctx.beginPath();
    ctx.moveTo(w / 2 + 60, h / 2 - 60);
    ctx.lineTo(w / 2 + 80, h / 2 - 60);
    ctx.lineTo(w / 2 + 80, h / 2 - 40);
    ctx.stroke();

    // Bottom left bracket
    ctx.beginPath();
    ctx.moveTo(w / 2 - 60, h / 2 + 60);
    ctx.lineTo(w / 2 - 80, h / 2 + 60);
    ctx.lineTo(w / 2 - 80, h / 2 + 40);
    ctx.stroke();

    // Bottom right bracket
    ctx.beginPath();
    ctx.moveTo(w / 2 + 60, h / 2 + 60);
    ctx.lineTo(w / 2 + 80, h / 2 + 60);
    ctx.lineTo(w / 2 + 80, h / 2 + 40);
    ctx.stroke();

    // Draw Central Cyber Visor face (Cyan `#00f5ff` neon glow)
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f5ff';

    // Outer face circle
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 40, 0, Math.PI * 2);
    ctx.stroke();

    // Visor eyes (crosshair dots filled with cyan)
    ctx.fillStyle = '#00f5ff';
    ctx.beginPath();
    ctx.arc(w / 2 - 15, h / 2 - 10, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(w / 2 + 15, h / 2 - 10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Cyber Visor smile
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 + 5, 18, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Draw high-tech HUD instructions (Orbitron/Space Mono hybrid feel)
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#00f5ff';
    ctx.fillStyle = '#00f5ff';
    ctx.font = "bold 10px 'Space Mono', monospace";
    ctx.fillText("SYSTEM: VISOR_ACTIVE", w / 2 - 58, h / 2 - 85);

    ctx.shadowBlur = 0; // Disable shadow for descriptions to keep it crisp
    ctx.fillStyle = '#8a8a93';
    ctx.font = "11px 'Space Mono', monospace";
    ctx.fillText("Draw tactical vectors here...", w / 2 - 85, h / 2 + 90);
    ctx.fillText("Press [+ Add Frame] to record timeline", w / 2 - 110, h / 2 + 110);

    this.saveCurrentFrame();
  },

  /**
   * Saves active drawing canvas onto the base64 frames buffer.
   */
  saveCurrentFrame() {
    this.frames[this.currentFrameIndex] = this.drawingCanvas.toDataURL();
  },

  /**
   * Appends a new blank frame and triggers Onion Skin background ghost layer.
   */
  addFrame() {
    if (this.isPlaying) this.stop();

    // Save active drawing first
    this.saveCurrentFrame();

    // Move index forward
    this.currentFrameIndex++;
    this.frames.splice(this.currentFrameIndex, 0, ""); // Insert new blank frame at index

    this.clearCanvas(false);
    this.saveCurrentFrame();

    // Draw Onion skin (faint ghost overlay of previous frame)
    this.renderOnionSkin();
    this.updateScrubberHUD();

    // Play tactile flipbook page snap sound
    if (window.audioEngine && typeof window.audioEngine.playSweep === 'function') {
      window.audioEngine.playSweep();
    }
  },

  /**
   * Deletes the currently selected frame and calibrates neighboring frames.
   */
  deleteFrame() {
    if (this.isPlaying) this.stop();
    if (this.frames.length <= 1) {
      this.clearCanvas(true);
      return;
    }

    this.frames.splice(this.currentFrameIndex, 1);
    
    // Readjust index
    if (this.currentFrameIndex >= this.frames.length) {
      this.currentFrameIndex = this.frames.length - 1;
    }

    this.loadFrame(this.currentFrameIndex);
    this.updateScrubberHUD();
  },

  /**
   * Clears the active drawing canvas frame.
   */
  clearCanvas(saveAfterClear = true) {
    this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
    
    if (saveAfterClear) {
      this.saveCurrentFrame();
    }
  },

  /**
   * Draws a faint ghost engram of the previous frame onto the Onion skin layer.
   */
  renderOnionSkin() {
    this.onionSkinCtx.clearRect(0, 0, this.onionSkinCanvas.width, this.onionSkinCanvas.height);

    if (this.currentFrameIndex > 0) {
      const prevFrameData = this.frames[this.currentFrameIndex - 1];
      if (prevFrameData) {
        const img = new Image();
        img.onload = () => {
          this.onionSkinCtx.drawImage(img, 0, 0);
        };
        img.src = prevFrameData;
      }
    }
  },

  /**
   * Loads and renders a given frame by index.
   */
  loadFrame(index) {
    this.clearCanvas(false);
    this.onionSkinCtx.clearRect(0, 0, this.onionSkinCanvas.width, this.onionSkinCanvas.height);

    const frameData = this.frames[index];
    if (frameData) {
      const img = new Image();
      img.onload = () => {
        this.drawingCtx.drawImage(img, 0, 0);
      };
      img.src = frameData;
    }

    this.currentFrameIndex = index;
    this.renderOnionSkin();
    this.updateScrubberHUD();
  },

  /**
   * Starts the 12fps real-time drawing animation playback loop.
   */
  play() {
    if (this.frames.length === 0) return;
    this.saveCurrentFrame();
    
    this.isPlaying = true;
    const playBtn = document.getElementById('anim-play-btn');
    if (playBtn) playBtn.textContent = "STOP [â– ]";

    // Hide onion skin overlay during playback for clean viewing
    this.onionSkinCtx.clearRect(0, 0, this.onionSkinCanvas.width, this.onionSkinCanvas.height);

    let frameToPlay = 0;
    
    this.playbackInterval = setInterval(() => {
      this.clearCanvas(false);
      
      const frameData = this.frames[frameToPlay];
      if (frameData) {
        const img = new Image();
        img.onload = () => {
          this.drawingCtx.drawImage(img, 0, 0);
        };
        img.src = frameData;
      }

      // Play soft click on each frame tick!
      if (window.audioEngine && typeof window.audioEngine.playTypewriter === 'function') {
        window.audioEngine.playTypewriter();
      }

      frameToPlay++;
      if (frameToPlay >= this.frames.length) {
        frameToPlay = 0; // Infinite loop
      }
    }, 1000 / this.fps);

    document.body.classList.add('audio-playing'); // Trigger HUD synth waves animations
  },

  /**
   * Halts the playback loop.
   */
  stop() {
    if (!this.isPlaying) return;

    clearInterval(this.playbackInterval);
    this.isPlaying = false;

    const playBtn = document.getElementById('anim-play-btn');
    if (playBtn) playBtn.textContent = "PLAY [â–¶]";

    // Reload active frame drawing and onion overlay
    this.loadFrame(this.currentFrameIndex);
  },

  /**
   * Refreshes the frame numbering indicators in the scrubber HUD.
   */
  updateScrubberHUD() {
    const badge = document.getElementById('anim-frame-badge');
    if (badge) {
      badge.textContent = `FRAME: ${this.currentFrameIndex + 1} / ${this.frames.length}`;
    }
  }
};

// Bind to window to allow DOM onload triggers
window.animatorEngine = animatorEngine;

