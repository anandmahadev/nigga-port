/**
 * js/tests.js - Basic Diagnostics Framework.
 * Verifies key subsystems like AudioContext support and Starfield status.
 */
window.PORTFOLIO_DIAGNOSTICS = {
  runAll: function() {
    console.group('--- FlipaClip.SYS Diagnostics ---');
    this.checkAudioSupport();
    this.checkStarfieldCanvas();
    this.checkConfigEngine();
    console.groupEnd();
  },
  checkAudioSupport: function() {
    const audioContextSupported = !!(window.AudioContext || window.webkitAudioContext);
    console.log('[TEST] AudioContext Support:', audioContextSupported ? 'PASSED âœ…' : 'FAILED âŒ');
  },
  checkStarfieldCanvas: function() {
    const canvas = document.getElementById('star-canvas');
    console.log('[TEST] Starfield Canvas Node:', canvas ? 'PASSED âœ…' : 'FAILED âŒ');
  },
  checkConfigEngine: function() {
    const configExists = !!window.PORTFOLIO_CONFIG;
    console.log('[TEST] Configuration Modules:', configExists ? 'PASSED âœ…' : 'FAILED âŒ');
  }
};
