/**
 * typewriter.js - Terminal Typer Utility
 * Types out cinematic tech taglines into the hero section header.
 */

function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const phrase1 = "Initializing AnandMahadev.exe...";
  const phrase2 = "AI Systems Architect. Full Stack Developer. Problem Solver.";
  const charDelay = 80; // 80ms per character
  const phasePause = 800; // 800ms pause between phrases

  // Create typewriter cursor element
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'typewriter-cursor';
  
  target.innerHTML = '';
  target.appendChild(cursorSpan);

  // Helper promise delay
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Type a given text character by character
  async function typeText(text) {
    for (let i = 0; i < text.length; i++) {
      // Insert character before the cursor span
      const charNode = document.createTextNode(text[i]);
      target.insertBefore(charNode, cursorSpan);
      await wait(charDelay);
    }
  }

  // Backspace / clear text character by character
  async function clearText() {
    while (target.childNodes.length > 1) {
      target.removeChild(target.childNodes[target.childNodes.length - 2]);
      await wait(charDelay / 2); // Deleting is twice as fast
    }
  }

  // Orchestrate the typewriter sequence
  async function runSequence() {
    await wait(500); // Small initial startup delay
    
    // Type phrase 1
    await typeText(phrase1);
    
    // Wait for the requested pause
    await wait(phasePause);
    
    // Clear phrase 1
    await clearText();
    
    // Small pause after clearing
    await wait(300);
    
    // Type phrase 2
    await typeText(phrase2);
  }

  runSequence();
}

// Expose globally for script-tag setups
window.initTypewriter = initTypewriter;
