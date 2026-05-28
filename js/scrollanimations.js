/**
 * scrollanimations.js - Cinematic Scroll Snap, Warp & Telemetry Subtitles Observer
 * Drives screen reveals, scroll snappy time indicators, and narrative telemetry channels.
 */

let subtitleInterval = null;
let animeStoryInterval = null;

const SCENE_SUBTITLES = {
  'hero': '>> SYSTEM_LOG // SCENE 00: Initializing neural architectures. Accessing cognitive core engrams.',
  'origin': '>> SUBJECT_SCAN // SCENE 01-A: Analyzing engram parameters. Anime character profile locked. Synced at 98.4%.',
  'origin-data': '>> ARCHITECT_LOG // SCENE 01-B: Retreiving chronological journey registry. SDE and clinical vectors active.',
  'skills': '>> UTILITY_SCAN // SCENE 02: Auditing full-stack engineering tools, database coordinates, and machine intelligence nodes.',
  'projects': '>> OPERATION_BRIEF // SCENE 03: Mapping active production uplinks. CardioNerve and AgroNova clinical parameters scanned.',
  'ailab': '>> COGNITIVE_FLOW // SCENE 04: Visualizing neural net flow paths, national hackathon telemetry, and verified industry credentials.',
  'contact': '>> TELEMETRY_ESTABLISH // SCENE 05: Satellite uplink coordinates locked. Transmit payload to establish connection.'
};

const SCENE_LABELS = {
  'hero': 'SCENE 00 // CORE',
  'origin': 'SCENE 01-A // SUBJECT_ID',
  'origin-data': 'SCENE 01-B // CHRONICLES',
  'skills': 'SCENE 02 // ARSENAL',
  'projects': 'SCENE 03 // MISSIONS',
  'ailab': 'SCENE 04 // AI_LAB',
  'contact': 'SCENE 05 // TELEMETRY'
};

const ANIME_STORY_PARAGRAPHS = [
  ">> INITIATING ENGRAM RETRIEVAL SEQUENCE...",
  ">> SUBJECT PROFILE: ANAND MAHADEV. Tech architect born inside the clinical software lines, engineered to bridge machine learning models with secure full-stack runtimes.",
  ">> OPERATIONAL BENCHMARKS: Specializes in distributed database systems, MLOps, and real-time medical-grade AI engines (CardioNerve squads).",
  ">> COMPLIANCE LEVEL: S-Rank. Sync stabilized. Pull the snap scroll trigger below to access core professional telemetry..."
];

function typeSubtitles(text) {
  const target = document.getElementById('subtitle-telemetry-text');
  if (!target) return;

  if (subtitleInterval) {
    clearInterval(subtitleInterval);
  }
  
  target.textContent = '';
  let i = 0;
  
  subtitleInterval = setInterval(() => {
    if (i < text.length) {
      target.textContent += text[i];
      i++;
      
      // Play high-frequency typewriter click sound (synthesized)
      if (window.audioEngine && typeof window.audioEngine.playTypewriter === 'function') {
        window.audioEngine.playTypewriter();
      }
    } else {
      clearInterval(subtitleInterval);
    }
  }, 25); // Very crisp typing speed
}

function typeAnimeStory() {
  const target = document.getElementById('anime-terminal-log-content');
  if (!target) return;
  
  // Prevent duplicate runs if already typed
  if (target.dataset.typed === 'true') return;
  target.dataset.typed = 'true';

  target.innerHTML = '';
  let paragraphIndex = 0;
  let charIndex = 0;
  
  function typeNext() {
    if (paragraphIndex < ANIME_STORY_PARAGRAPHS.length) {
      if (charIndex === 0) {
        const p = document.createElement('p');
        p.style.marginBottom = '12px';
        p.style.color = paragraphIndex === 0 ? 'var(--gold)' : 'var(--gray-text)';
        p.style.textShadow = paragraphIndex === 0 ? '0 0 5px var(--gold-glow)' : 'none';
        target.appendChild(p);
      }
      
      const currentPara = ANIME_STORY_PARAGRAPHS[paragraphIndex];
      const pElements = target.querySelectorAll('p');
      const activeP = pElements[pElements.length - 1];
      
      activeP.textContent += currentPara[charIndex];
      charIndex++;
      
      // Sound FX clack click
      if (window.audioEngine && typeof window.audioEngine.playTypewriter === 'function') {
        window.audioEngine.playTypewriter();
      }

      if (charIndex >= currentPara.length) {
        paragraphIndex++;
        charIndex = 0;
        setTimeout(typeNext, 450); // Pause between paragraphs
      } else {
        setTimeout(typeNext, 12); // Speed character typing
      }
    }
  }
  
  typeNext();
}

function initScrollAnimations() {
  // 1. Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, revealOptions);

    revealElements.forEach(elem => {
      revealObserver.observe(elem);
    });
  }

  // 2. Intersection Observer for Cinematic Scene Transitions & Telemetry
  const sections = document.querySelectorAll('section');
  const sceneLabel = document.getElementById('active-scene-lbl');
  
  if (sections.length > 0) {
    const sceneOptions = {
      root: null,
      threshold: 0.4, // Snap triggers
      rootMargin: '0px'
    };

    let lastActiveSection = null;

    const sceneObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          
          if (lastActiveSection !== sectionId) {
            lastActiveSection = sectionId;
            
            // A. Update Widescreen HUD Top Active Label
            if (sceneLabel && SCENE_LABELS[sectionId]) {
              sceneLabel.textContent = SCENE_LABELS[sectionId];
            }

            // B. Type Narrative Subtitles at the bottom
            if (SCENE_SUBTITLES[sectionId]) {
              typeSubtitles(SCENE_SUBTITLES[sectionId]);
            }

            // C. Trigger Hyperspace Warp on background star canvas!
            if (window.triggerWarp && typeof window.triggerWarp === 'function') {
              window.triggerWarp(800);
            }

            // D. Highlight timeline/nav indicators in HUD Nav
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
              if (link.getAttribute('data-sec') === sectionId) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });

            // E. Trigger specialized anime story typewriter on character card entry
            if (sectionId === 'origin') {
              setTimeout(typeAnimeStory, 400); // Small delay to sync with snap visual entry
            }
          }
        }
      });
    }, sceneOptions);

    sections.forEach(sec => {
      sceneObserver.observe(sec);
    });
  }

  // 3. Scroll Progress Telemetry
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    let activeFrame = false;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (scrollHeight > 0) {
        const progressPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${progressPercent}%`;
      } else {
        progressBar.style.width = '0%';
      }
      
      activeFrame = false;
    };

    window.addEventListener('scroll', () => {
      if (!activeFrame) {
        requestAnimationFrame(updateScrollProgress);
        activeFrame = true;
      }
    });

    updateScrollProgress();
  }
}

// Expose globally for initialization engine
window.initScrollAnimations = initScrollAnimations;
window.typeSubtitles = typeSubtitles;
window.typeAnimeStory = typeAnimeStory;
