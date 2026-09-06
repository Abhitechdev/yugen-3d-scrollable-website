/* =====================================================================
   YŪGEN — Calm & Peaceful Japanese Zen Audio (Web Audio API)
   Ultra-gentle, soothing Japanese garden soundscape:
   - Soft Zen Meditation Singing Bowl (Peaceful, pure 528Hz harmonic chime)
   - Warm Lantern Ember Glow sound for the Lanterns
   - Bamboo Water Droplet (Shishi-odoshi / 鹿脅し) for Moonwater
   - Sweet Koto Major Pentatonic melodies (Ryo scale: D, E, F#, A, B)
   - Gentle crystal wind chimes (Fūrin) in the peaceful breeze
   ===================================================================== */

(function () {
  'use strict';

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let bgmGain = null;
  let bgmTimer = null;
  let breezeNode = null;
  let chimeInterval = null;

  // Uplifting, peaceful Japanese Ryo / Major Pentatonic scale (D Major Pentatonic)
  const NOTES = {
    D3: 146.83,
    Fsharp3: 185.00,
    A3: 220.00,
    B3: 246.94,
    D4: 293.66,
    E4: 329.63,
    Fsharp4: 369.99,
    A4: 440.00,
    B4: 493.88,
    D5: 587.33,
    E5: 659.25,
    Fsharp5: 739.99,
    A5: 880.00,
    B5: 987.77,
    D6: 1174.66
  };

  const PEACEFUL_PENTATONIC = [
    NOTES.D4, NOTES.E4, NOTES.Fsharp4, NOTES.A4, NOTES.B4,
    NOTES.D5, NOTES.E5, NOTES.Fsharp5, NOTES.A5
  ];

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      bgmGain = audioCtx.createGain();
      bgmGain.gain.setValueAtTime(0.38, audioCtx.currentTime);
      bgmGain.connect(masterGain);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  /* ------------------------------------------------------------ 1 · Peaceful Zen Bell (Singing Bowl / Orin) */
  function playPeacefulBell(freq = 528, volume = 0.5) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const bellGain = ctx.createGain();
    bellGain.gain.setValueAtTime(0.0001, now);
    bellGain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    bellGain.gain.exponentialRampToValueAtTime(0.00001, now + 6.0);
    bellGain.connect(masterGain);

    // Pure, soothing harmonic overtones (Octave, Fifth, Major Third)
    const partials = [
      { f: freq, gain: 1.0, decay: 5.5 },
      { f: freq * 2.002, gain: 0.45, decay: 4.2 },
      { f: freq * 2.998, gain: 0.22, decay: 3.2 },
      { f: freq * 4.01, gain: 0.12, decay: 2.2 }
    ];

    partials.forEach(({ f, gain, decay }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine'; // Pure calm sine wave
      osc.frequency.setValueAtTime(f, now);

      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(gain, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.00001, now + decay);

      osc.connect(g);
      g.connect(bellGain);

      osc.start(now);
      osc.stop(now + decay + 0.2);
    });

    setTimeout(() => {
      try { bellGain.disconnect(); } catch (e) {}
    }, 6500);
  }

  /* ------------------------------------------------------------ 2 · Lantern Ember Tone (Warm & Cozy) */
  function playLanternSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const lanternGain = ctx.createGain();
    lanternGain.gain.setValueAtTime(0.0001, now);
    lanternGain.gain.linearRampToValueAtTime(0.28, now + 0.12);
    lanternGain.gain.exponentialRampToValueAtTime(0.00001, now + 2.8);
    lanternGain.connect(masterGain);

    // Warm wooden / amber resonance
    const warmFreqs = [NOTES.D4, NOTES.Fsharp4, NOTES.A4];
    warmFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle warm glow swelling
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.15 / (idx + 1), now + 0.15);
      g.gain.exponentialRampToValueAtTime(0.00001, now + 2.5);

      osc.connect(g);
      g.connect(lanternGain);
      osc.start(now);
      osc.stop(now + 2.8);
    });

    // Soft ember rustle (gentle lowpass noise)
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.35));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);

    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.06, now);
    nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(lanternGain);
    noise.start(now);
  }

  /* ------------------------------------------------------------ 3 · Water Droplet (Shishi-odoshi / 鹿脅し) */
  function playWaterDroplet() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const waterGain = ctx.createGain();
    waterGain.gain.setValueAtTime(0.22, now);
    waterGain.connect(masterGain);

    // Droplet pitch sweep (classic gentle water plop)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(1450, now + 0.09);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.25, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.00001, now + 0.38);

    osc.connect(g);
    g.connect(waterGain);
    osc.start(now);
    osc.stop(now + 0.45);

    // Hollow bamboo resonance tail
    const bamboo = ctx.createOscillator();
    bamboo.type = 'sine';
    bamboo.frequency.setValueAtTime(NOTES.A4, now + 0.08);

    const bGain = ctx.createGain();
    bGain.gain.setValueAtTime(0.0001, now + 0.08);
    bGain.gain.exponentialRampToValueAtTime(0.12, now + 0.095);
    bGain.gain.exponentialRampToValueAtTime(0.00001, now + 0.85);

    bamboo.connect(bGain);
    bGain.connect(waterGain);
    bamboo.start(now + 0.08);
    bamboo.stop(now + 0.9);
  }

  /* ------------------------------------------------------------ 4 · Sweet Koto Pluck (Major Pentatonic) */
  function playKotoPluck(freq, volume = 0.2) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const f = freq || PEACEFUL_PENTATONIC[Math.floor(Math.random() * PEACEFUL_PENTATONIC.length)];

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(f, now);

    // Gentle lowpass filter with soft decay
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(500, now + 1.2);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.00001, now + 2.0);

    osc.connect(filter);
    filter.connect(g);
    g.connect(masterGain);

    osc.start(now);
    osc.stop(now + 2.1);
  }

  /* ------------------------------------------------------------ 5 · Calm Ambient Melody Generator */
  function startPeacefulBGM() {
    const ctx = getAudioContext();
    if (!ctx) return;

    // A. Soft, comforting ambient pad chord (D Major 9: D, F#, A, E)
    const padChord = [NOTES.D3, NOTES.A3, NOTES.Fsharp4, NOTES.E5];
    const padNodes = padChord.map((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Very soft, relaxing bed of sound
      g.gain.setValueAtTime(0.015 / (i + 1), ctx.currentTime);
      osc.connect(g);
      g.connect(bgmGain);
      osc.start();
      return { osc, g };
    });

    // B. Gentle recurring peaceful Koto melodies (every 3-5 seconds)
    let step = 0;
    const peacefulMelody = [
      NOTES.D4, NOTES.Fsharp4, NOTES.A4, NOTES.B4,
      NOTES.D5, NOTES.Fsharp5, NOTES.E5, NOTES.A4,
      NOTES.Fsharp4, NOTES.D4, NOTES.A3, NOTES.D4
    ];

    function scheduleNextNote() {
      if (!isPlaying) {
        padNodes.forEach(p => { try { p.osc.stop(); } catch(e){} });
        return;
      }

      const note = peacefulMelody[step % peacefulMelody.length];
      step++;

      playKotoPluck(note, 0.14);

      // Random peaceful wind chime once in a while
      if (Math.random() < 0.35) {
        setTimeout(() => {
          if (isPlaying) playPeacefulBell(NOTES.A5, 0.12);
        }, 800);
      }

      const delay = 1800 + Math.random() * 2200; // soft spacious pacing
      bgmTimer = setTimeout(scheduleNextNote, delay);
    }

    scheduleNextNote();
  }

  function stopPeacefulBGM() {
    if (bgmTimer) {
      clearTimeout(bgmTimer);
      bgmTimer = null;
    }
  }

  /* ------------------------------------------------------------ 6 · Sound Toggle ON / OFF */
  function setSoundState(enable) {
    isPlaying = enable;
    const ctx = getAudioContext();
    const btn = document.getElementById('nav-sound');
    const label = btn ? btn.querySelector('.sound-label') : null;

    if (enable) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.0);

      startPeacefulBGM();
      // Sweet peaceful welcoming chime
      playPeacefulBell(528, 0.35);

      if (btn) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('title', 'Sound: ON (音: オン) — Click to Mute');
      }
      if (label) {
        label.textContent = 'SOUND: ON';
      }
    } else {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

      stopPeacefulBGM();

      if (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('title', 'Sound: OFF (音: オフ) — Click to Play');
      }
      if (label) {
        label.textContent = 'SOUND: OFF';
      }
    }
  }

  function toggleSound() {
    getAudioContext();
    setSoundState(!isPlaying);
  }

  /* ------------------------------------------------------------ 7 · Wire Asset Interactions */
  function initAudio() {
    // Nav sound toggle
    const btn = document.getElementById('nav-sound');
    if (btn) {
      btn.addEventListener('click', toggleSound);
    }

    // Asset 1: Sanmon / Bell Preview card (plays peaceful meditation singing bowl)
    const peek = document.querySelector('.peek');
    if (peek) {
      peek.addEventListener('click', () => {
        getAudioContext();
        if (!isPlaying) setSoundState(true);
        playPeacefulBell(440, 0.45);
      });
      peek.addEventListener('mouseenter', () => {
        if (isPlaying) playPeacefulBell(880, 0.15);
      });
    }

    // Asset 2: Still Gardens cards
    // - Lanterns card (card 2) -> warm lantern sound
    // - Moonwater card (card 3) -> gentle water drop
    // - Approach card (card 1) -> gentle koto chord
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, idx) => {
      card.addEventListener('mouseenter', () => {
        if (!isPlaying) return;
        if (idx === 0) playKotoPluck(NOTES.D5, 0.16);
        else if (idx === 1) playLanternSound();
        else if (idx === 2) playWaterDroplet();
      });

      card.addEventListener('click', () => {
        getAudioContext();
        if (!isPlaying) setSoundState(true);
        if (idx === 0) playPeacefulBell(528, 0.35);
        else if (idx === 1) playLanternSound();
        else if (idx === 2) playWaterDroplet();
      });
    });

    // Asset 3: Foreground stone lantern hover (if present in document)
    const lanternEl = document.querySelector('.fg-lantern');
    if (lanternEl) {
      lanternEl.addEventListener('mouseenter', () => {
        if (isPlaying) playLanternSound();
      });
    }

    // Chapter chips
    const chips = document.querySelectorAll('.chip');
    chips.forEach((chip, idx) => {
      chip.addEventListener('click', () => {
        if (isPlaying) playKotoPluck(PEACEFUL_PENTATONIC[idx % PEACEFUL_PENTATONIC.length], 0.18);
      });
    });

    // CTAs (Cross the threshold / Begin the walk)
    const ctas = document.querySelectorAll('.cta, .arrowlink');
    ctas.forEach(cta => {
      cta.addEventListener('click', () => {
        if (isPlaying) playPeacefulBell(528, 0.35);
      });
    });
  }

  window.YugenAudio = {
    setSoundState,
    toggleSound,
    playPeacefulBell,
    playLanternSound,
    playWaterDroplet,
    playKotoPluck,
    isPlaying: () => isPlaying
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudio);
  } else {
    initAudio();
  }
})();
