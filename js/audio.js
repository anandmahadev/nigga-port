/**
 * audio.js - Synthetic Web Audio FX Engine
 * Generates futuristic retro soundscapes and clicks with ZERO network footprint.
 */

const audioEngine = {
  ctx: null,
  droneNodes: [],
  lfoNode: null,
  masterGain: null,
  isPlayingHum: false,
  isMuted: true,

  /**
   * Initializes the AudioContext upon user gesture.
   */
  init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      console.warn("[AUDIO]: Web Audio API is not supported in this browser.");
      return;
    }

    this.ctx = new AudioContextClass();
    
    // Create master volume node
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime); // Start muted
    this.masterGain.connect(this.ctx.destination);
    
    console.log("[AUDIO]: Synthetic Telemetry Audio Engine Online.");
  },

  /**
   * Starts the cosmic dual-oscillator background drone.
   */
  startDrone() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    if (this.isPlayingHum) return;

    this.ctx.resume().then(() => {
      // Detuned dual oscillators for rich low-frequency chorusing (55Hz / A1)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55.0, this.ctx.currentTime); // A1 note
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(55.4, this.ctx.currentTime); // Slightly detuned

      // Filter out high-frequency buzzing for a warm atmospheric drone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.ctx.currentTime); // Low cut
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // Low hum level

      // Add a slow LFO to oscillate filter frequency for a breathing atmosphere
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // Very slow (1 cycle per 8s)
      lfoGain.gain.setValueAtTime(30, this.ctx.currentTime); // Oscillate between 90Hz and 150Hz
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Connect nodes
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this.masterGain);

      // Play
      osc1.start(0);
      osc2.start(0);
      lfo.start(0);

      this.droneNodes = [osc1, osc2, filter, droneGain];
      this.lfoNode = lfo;
      this.isPlayingHum = true;
      console.log("[AUDIO]: Cinematic hum engine charging...");
    });
  },

  /**
   * Stops the cosmic background drone.
   */
  stopDrone() {
    if (!this.isPlayingHum) return;

    this.droneNodes.forEach(node => {
      if (node.stop) {
        try { node.stop(0); } catch(e) {}
      }
    });

    if (this.lfoNode) {
      try { this.lfoNode.stop(0); } catch(e) {}
    }

    this.droneNodes = [];
    this.lfoNode = null;
    this.isPlayingHum = false;
    console.log("[AUDIO]: Cinematic hum engine offline.");
  },

  /**
   * Generates a sleek, high-frequency interface hover feedback click.
   */
  playClick() {
    if (this.isMuted || !this.ctx) return;
    this.ctx.resume().then(() => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(0);
      osc.stop(this.ctx.currentTime + 0.05);
    });
  },

  /**
   * Generates an extremely rapid, crisp click for the typing narrative subtitles.
   */
  playTypewriter() {
    if (this.isMuted || !this.ctx) return;
    
    // Slight randomization of click timing/frequency to mimic high-end keyboard keys
    const randFreq = 1800 + Math.random() * 600;
    const duration = 0.015 + Math.random() * 0.01;

    this.ctx.resume().then(() => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(randFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(randFreq, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime); // Low volume click
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(0);
      osc.stop(this.ctx.currentTime + duration + 0.01);
    });
  },

  /**
   * Generates a breathtaking cyber-uplink frequency sweep (transition chime).
   */
  playSweep() {
    if (this.isMuted || !this.ctx) return;
    this.ctx.resume().then(() => {
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = this.ctx.createDelay();
      const feedback = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime); // A3
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 1.2); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(222, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(884, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.4);

      // Create a gorgeous sci-fi echo delay line
      delay.delayTime.setValueAtTime(0.25, this.ctx.currentTime); // 250ms echo
      feedback.gain.setValueAtTime(0.4, this.ctx.currentTime); // 40% feedback

      osc.connect(gain);
      osc2.connect(gain);
      
      // Delay feedback routing
      gain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      
      // Output connections
      gain.connect(this.masterGain);
      delay.connect(this.masterGain);

      osc.start(0);
      osc2.start(0);
      osc.stop(this.ctx.currentTime + 1.5);
      osc2.stop(this.ctx.currentTime + 1.5);
    });
  },

  /**
   * Enables or disables master volume.
   */
  toggleAudio() {
    this.init();
    if (!this.ctx) return false;

    if (this.isMuted) {
      // Unmute
      this.isMuted = false;
      this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(1.0, this.ctx.currentTime + 0.3); // Fade in
      
      this.startDrone();
      document.body.classList.add('audio-playing');
      console.log("[AUDIO]: Audio Uplink Secured.");
      return true;
    } else {
      // Mute
      this.isMuted = true;
      this.masterGain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 0.3); // Fade out
      
      setTimeout(() => {
        if (this.isMuted) this.stopDrone();
      }, 350);

      document.body.classList.remove('audio-playing');
      console.log("[AUDIO]: Transmission Muted.");
      return false;
    }
  }
};

// Bind to window to allow access
window.audioEngine = audioEngine;
