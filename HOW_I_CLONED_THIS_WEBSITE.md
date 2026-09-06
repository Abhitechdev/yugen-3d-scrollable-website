# How I Cloned and Built This 3D Scrollable Japanese Zen Sanctuary (Step-by-Step Guide)

> **Project:** *Yūgen (幽玄) — Where stillness reveals the unseen*  
> **Recreated & Engineered by:** Abhishek ([@abhitechdecoded](https://www.instagram.com/abhitechdecoded/))  
> **Core Technologies:** HTML5, CSS3, Three.js (WebGL), Web Audio API, Canvas 2D Procedural Shaders, Catmull-Rom Camera Splines  

---

## Table of Contents
1. [Deconstruction & Architectural Vision](#1-deconstruction--architectural-vision)
2. [Project File Structure](#2-project-file-structure)
3. [Step 1: The Cinematic DOM & Stacking Layer Hierarchy](#step-1-the-cinematic-dom--stacking-layer-hierarchy)
4. [Step 2: WebGL Scene Setup & Three.js Canvas Pipeline](#step-2-webgl-scene-setup--threejs-canvas-pipeline)
5. [Step 3: The Zero-Asset Procedural Texture Engine (Canvas PRNG & Sobel Filters)](#step-3-the-zero-asset-procedural-texture-engine)
6. [Step 4: Procedural 3D World Construction (Architecture, Lanterns & Foliage)](#step-4-procedural-3d-world-construction)
7. [Step 5: The Catmull-Rom 3D Camera Rig & Scroll Interpolation](#step-5-the-catmull-rom-3d-camera-rig--scroll-interpolation)
8. [Step 6: Responsive Aspect-Ratio Compensation & Dolly Easing](#step-6-responsive-aspect-ratio-compensation--dolly-easing)
9. [Step 7: Foreground Parallax Cutout Compositing](#step-7-foreground-parallax-cutout-compositing)
10. [Step 8: Procedural Web Audio API Zen Soundscape (Ryo Pentatonic Engine)](#step-8-procedural-web-audio-api-zen-soundscape)
11. [Step 9: Interactive UI, Smooth Reveals & Dynamic Cursor](#step-9-interactive-ui-smooth-reveals--dynamic-cursor)
12. [Step 10: Performance Optimization & 60 FPS Polish](#step-10-performance-optimization--60-fps-polish)
13. [How to Run & Deploy](#how-to-run--deploy)

---

## 1. Deconstruction & Architectural Vision

The inspiration for this experience originates from the award-winning WebGL interactive website **"Kage"** — an evocative nighttime walk through a sacred Kyoto mountain temple.

### The Reverse-Engineering Goals:
1. **Zero External Heavy 3D Models:** Rather than burdening the browser with a 50MB GLTF/GLB file that takes 15 seconds to download, reconstruct the entire temple sanctuary procedurally in WebGL using Three.js primitives and canvas-generated textures.
2. **Scroll as the Navigation Driver:** Link the user's vertical scroll position directly to a continuous 3D camera flight path traversing through 5 distinct chapters.
3. **Atmospheric Lighting:** Emulate night mist, a glowing vermilion moon (*Shugetsu*), flickering stone lanterns (*Tōrō*), and wet ground reflections.
4. **Autonomous Zen Audio Synthesis:** Create a 100% code-generated Japanese ambient soundtrack using the browser's native Web Audio API (no audio MP3 files required).
5. **Modern Hybrid Layering:** Blend a WebGL canvas in the background with crisp typography, Japanese vertical glyphs, glassmorphic HUD controls, and parallax foreground cutouts.

---

## 2. Project File Structure

```
d:/3d scrollable website/
├── index.html                 # Semantic HTML structure & multi-layer DOM
├── styles.css                 # Custom CSS typography, layouts, animations & HUD
├── fonts.css                  # High-grade Japanese & Western web typography
├── script.js                  # Three.js scene, procedural textures, camera spline & scroll logic
├── sound.js                   # Web Audio API procedural Zen soundscape synthesizer
├── three.min.js               # Standalone Three.js library
├── images-assets/             # Curated foreground foliage & architectural cutouts
│   └── images/
│       ├── basalt-stones.webp
│       ├── garden-bush.webp
│       ├── hill.webp
│       ├── maple-leaves.webp
│       ├── pine-tree.webp
│       ├── sakura-branch.webp
│       ├── shrine-ruins.webp
│       ├── stone-lantern.webp
│       ├── tall-grass.webp
│       └── temple-wall.webp
├── generated/                 # Preview cards & visual snapshots
└── HOW_I_CLONED_THIS_WEBSITE.md # This complete step-by-step master breakdown
```

---

## Step 1: The Cinematic DOM & Stacking Layer Hierarchy

To achieve a game-like cinematic look, the web page is built as a multi-tier composition:

```
[ Topmost: Custom Magnetic Cursor (.cur-dot) ]
[ Tier 5: Atmospheric Film Grain (#grain SVG filter) ]
[ Tier 4: Radial Vignette Gradient (#vignette) ]
[ Tier 3: Foreground Parallax Sky Cutouts (#fg-sky) ]
[ Tier 2: Interactive HTML Page Content (.page, .nav, .sec, .cards, .cur) ]
[ Base Layer: Fullscreen WebGL Canvas (<canvas id="gl">) ]
```

### Key Implementation Details:
- **The Fixed Fullscreen Canvas (`#gl`):** Styled with `position: fixed; inset: 0; pointer-events: none; z-index: 1;`. It stays pinned behind everything while the user scrolls normally through the DOM.
- **Grain Overlay (`#grain`):** Uses an SVG turbulence noise tile rendered with CSS `mix-blend-mode: overlay; opacity: 0.07;` to break the sterile digital look of WebGL.
- **Vignette (`#vignette`):** An inverted radial gradient that darkens edges to focus attention on the glowing center.

---

## Step 2: WebGL Scene Setup & Three.js Canvas Pipeline

In [`script.js`](file:///d:/3d%20scrollable%20website/script.js), the Three.js pipeline is initialized with high-precision configuration:

```javascript
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
  stencil: false,
  depth: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
```

### Camera Rig:
A `THREE.PerspectiveCamera` with dynamic field of view (`fov: 36°` to `48°`) positioned on a **Catmull-Rom spline curve** that glides through 3D space.

---

## Step 3: The Zero-Asset Procedural Texture Engine

One of the most impressive technical feats of this recreation is the **zero-asset texture generator**. Instead of loading large image maps over the network, textures are painted onto in-memory `<canvas>` elements at boot time using deterministic mathematical noise:

### 1. Pseudo-Random Number Generator (Mulberry32)
```javascript
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
```

### 2. Fractional Brownian Motion (FBM) Value Noise Canvas
```javascript
function fbmCanvas(W, H, seed, octaves, baseCells, contrast) {
  const out = cvs(W, H), o = out.getContext('2d');
  o.fillStyle = '#808080'; o.fillRect(0, 0, W, H);
  let cells = baseCells || 3, alpha = 1;
  for (let i = 0; i < (octaves || 5); i++) {
    const n = cvs(cells, cells), nx = n.getContext('2d');
    const im = nx.createImageData(cells, cells), d = im.data, r = mulberry32(seed + i * 977);
    for (let k = 0; k < cells * cells; k++) {
      const v = 128 + (r() - .5) * 255 * (contrast || 1);
      d[k * 4] = d[k * 4 + 1] = d[k * 4 + 2] = clamp(v, 0, 255);
      d[k * 4 + 3] = 255;
    }
    nx.putImageData(im, 0, 0);
    o.globalAlpha = alpha;
    o.globalCompositeOperation = i === 0 ? 'source-over' : 'overlay';
    o.drawImage(n, 0, 0, W, H);
    cells *= 2; alpha *= .62;
  }
  return out;
}
```

### 3. Tangent-Space Normal Map Generation (Sobel Filter)
The procedural height maps are passed through a Sobel gradient convolution on the CPU to produce tangent-space normal maps `(nx, ny, nz)` mapped to `(R, G, B)`:
```javascript
function normalFromHeight(hc, strength) {
  // Gaussian blur pass to remove aliasing -> Sobel kernel evaluation -> output normal texture
}
```
This generates:
- **`texWall()`**: Board-formed charred concrete with horizontal seams and tie dimples.
- **`texFloor()`**: Wet slate flagstones with standing water puddles and specular micro-roughness.
- **`texWood()`**: Burned Japanese cypress (*Yakisugi* / charred cedar wood grain).

---

## Step 4: Procedural 3D World Construction

The 3D temple sanctuary is assembled programmatically using modular geometric structures:

1. **The Grand Sanmon Gate (山門):**
   - Massive cylindrical cedar columns (`CylinderGeometry`) with charred bark textures.
   - Tiered curved pagoda eaves (*irimoya-zukuri*) generated using extruded profiles.
   - Translucent paper shoji screens illuminated with interior warm point lights (`0xffb366`).
2. **Stone Lanterns (Tōrō / 燈籠):**
   - Hexagonal granite pedestals, light chambers (*hibukuro*), and flared roof caps (*kasa*).
   - Dynamic flickering point lights simulating candle flame variations using sine modulation with random frequency shifts.
3. **The Vermilion Moon (朱月):**
   - A glowing celestial sphere positioned at the horizon with an emissive red-orange shader and corona glow.
4. **Valley Mist & Ground Fog:**
   - Layered particle planes and exponential height fog (`scene.fog = new THREE.FogExp2(0x06080d, 0.018)`).

---

## Step 5: The Catmull-Rom 3D Camera Rig & Scroll Interpolation

The camera does not jump between sections; it travels smoothly along a continuous 3-dimensional spline.

### 1. Waypoint Definitions
```javascript
const CAM = [
  { p: [  0.0,  4.05,  13.6 ], t: [  0.0,  6.60, -18.0 ], fov: 36 }, /* 0: Hero */
  { p: [ -5.6,  2.35,  11.6 ], t: [  1.2,  5.60, -14.0 ], fov: 48 }, /* 1: Sanmon Gate */
  { p: [  1.2,  3.60,   2.2 ], t: [ -0.6,  7.50, -22.0 ], fov: 40 }, /* 2: Still Gardens */
  { p: [  5.2,  2.10,  -3.4 ], t: [ -2.6,  7.00, -20.0 ], fov: 46 }, /* 3: Sacred Craft */
  { p: [  0.0,  7.60, -16.0 ], t: [  0.0, 13.00, -40.0 ], fov: 42 }, /* 4: Afterlight */
  { p: [  0.0, 10.50, -20.0 ], t: [  0.0,  3.00, -34.0 ], fov: 46 }  /* 5: Footer */
];
```

### 2. Continuous Spline Interpolation
We create two 3D spline curves—one for camera **position** (`curveP`) and one for camera **lookAt target** (`curveT`):
```javascript
curveP = new THREE.CatmullRomCurve3(CAM.map(c => new THREE.Vector3(...c.p)), false, 'catmullrom', 0.42);
curveT = new THREE.CatmullRomCurve3(CAM.map(c => new THREE.Vector3(...c.t)), false, 'catmullrom', 0.42);
```

### 3. Smooth Damped Lerping in `requestAnimationFrame`
To ensure fluid, buttery movement regardless of scroll speed:
```javascript
const damp = (cur, to, rate, dt) => lerp(cur, to, 1 - Math.exp(-rate * dt));

function tick(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.1);
  RIG.smooth = damp(RIG.smooth, RIG.prog, 4.2, dt);
  
  // Sample position & target from Catmull-Rom spline
  const u = clamp(RIG.smooth / (CAM.length - 1), 0, 1);
  curveP.getPoint(u, _p);
  curveT.getPoint(u, _t);
  
  // Apply mouse parallax drift
  _p.x += RIG.mx * 0.62;
  _p.y += RIG.my * 0.34;
  
  camera.position.copy(_p);
  camera.lookAt(_t);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
```

---

## Step 6: Responsive Aspect-Ratio Compensation & Dolly Easing

A common issue in 3D websites is that a scene framed for a 16:9 desktop monitor gets severely cropped on vertical mobile screens (9:16).

To solve this, a custom **Aspect-Ratio Compensator** was engineered:
```javascript
function aspectFix() { 
  return clamp((1.62 - window.innerWidth / window.innerHeight) / 1.05, 0, 1); 
}

function fitAspect(p, t, fov) {
  const nf = aspectFix();
  if (nf <= 0) return fov;
  _d.subVectors(p, t).normalize();
  p.addScaledVector(_d, nf * 8.2); // Dolly back along view vector
  p.y += nf * 1.1;                 // Elevate camera slightly
  return fov * (1 + nf * 0.40);    // Widen field of view
}
```
This guarantees that the temple gates and mountain peaks remain perfectly composed across widescreen monitors, laptops, iPads, and mobile phones.

---

## Step 7: Foreground Parallax Cutout Compositing

To heighten the illusion of 3D depth, 2D transparent WebP cutouts (pine branches, maple leaves, stone lanterns, tall grass) are placed in the DOM:
- Assigned data attributes such as `data-fg-in="left"`, `data-fg-in="right"`, and `data-fg-in="up"`.
- Intercepted by an `IntersectionObserver` that transforms their positions with slight spring physics as the camera approaches each chapter.
- Japanese sakura and maple leaves include a CSS swaying animation (`@keyframes sway`) mimicking a gentle night breeze.

---

## Step 8: Procedural Web Audio API Zen Soundscape

In [`sound.js`](file:///d:/3d%20scrollable%20website/sound.js), an ambient soundscape is generated using pure mathematical sound synthesis:

### 1. The Japanese Ryo Pentatonic Scale (D Major Pentatonic)
Harmonious notes tuned specifically for meditative calm:
- `D3 (146.8 Hz)`, `F#3 (185.0 Hz)`, `A3 (220.0 Hz)`, `B3 (246.9 Hz)`
- `D4 (293.6 Hz)`, `E4 (329.6 Hz)`, `F#4 (370.0 Hz)`, `A4 (440.0 Hz)`
- `D5`, `E5`, `F#5`, `A5`, `D6`

### 2. Zen Singing Bowl (528 Hz Love/Transformation Frequency)
Generated with dual sine wave oscillators with slight detuning (±1.5 Hz) and exponential decay, creating the signature rich beating chime of a Tibetan/Zen meditation bell.

### 3. Bamboo Water Rocker (Shishi-odoshi / 鹿脅し)
A burst of shaped noise followed by a resonant hollow wooden click (`120 Hz` decaying in `45ms`).

### 4. Wind Chimes (Fūrin / 風鈴)
High-frequency bell tones (`1800 Hz - 3200 Hz`) triggering randomly in the breeze with delicate reverb.

---

## Step 9: Interactive UI, Smooth Reveals & Dynamic Cursor

1. **Magnetic Cursor (`.cur-dot`):** Tracks pointer coordinates with smooth velocity lag and expands when hovering over interactive links (`data-cursor`).
2. **Text Reveal Masks:** Headers and quotes are wrapped inside `.mask-line` divs with `overflow: hidden`, sliding upward into view on chapter entry.
3. **Sound Equalizer:** Animated animated bar graph icon in the navigation bar responding to sound playback state.

---

## Step 10: Performance Optimization & 60 FPS Polish

To ensure 60 FPS even on mid-tier mobile hardware:
- **Geometry Sharing:** Instanced meshes and shared materials for repeating lanterns and temple columns.
- **Canvas Texture Caching:** Procedural textures are drawn once to off-screen canvases at load time, converted to `THREE.CanvasTexture`, and uploaded to the GPU immediately.
- **Pixel Ratio Clamping:** `Math.min(window.devicePixelRatio, 2)` prevents 3x/4x mobile screens from choking the GPU rasterizer.
- **Hardware-Accelerated CSS:** Foreground parallax uses `transform: translate3d(...)` and `will-change: transform`.
- **Intersection Observers:** Off-screen sections are unhooked from layout queries when inactive.

---

## How to Run & Deploy

Since this project uses pure vanilla technologies without heavy build tooling:

### Running Locally:
1. Open the project folder in VS Code.
2. Launch with **Live Server** (or run `npx serve .` in PowerShell/Terminal).
3. Navigate to `http://localhost:5500` or `http://localhost:3000`.

### Deploying to GitHub Pages:
1. Push this repository to GitHub.
2. In GitHub repository settings, navigate to **Pages**.
3. Set Source to `Deploy from a branch` -> `main` -> `/ (root)` -> Click **Save**.
4. Your live 3D Japanese Zen sanctuary is deployed!

---

*Recreated with passion by Abhishek ([@abhitechdecoded](https://www.instagram.com/abhitechdecoded/))*
