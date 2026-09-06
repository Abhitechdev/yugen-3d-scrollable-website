# Yūgen (幽玄) — 3D Scrollable Japanese Zen Experience

<div align="center">

![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=for-the-badge&logo=three.js)
![WebGL](https://img.shields.io/badge/WebGL-2.0-red?style=for-the-badge&logo=webgl)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Synthesizer-orange?style=for-the-badge)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Modern_Motion-1572B6?style=for-the-badge&logo=css3)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A five-chapter night walk through a Kyoto mountain temple.**  
*Charred cypress, lantern light, and a vermilion moon, rendered live in WebGL.*

**Reimagined & Engineered with devotion by [Abhishek (@abhitechdecoded)](https://www.instagram.com/abhitechdecoded/)**

[📖 How I Cloned This Website (Step-by-Step Guide)](./HOW_I_CLONED_THIS_WEBSITE.md) • [🚀 Quick Start](#-quick-start) • [✨ Key Features](#-features) • [🏛 Architecture](#-architecture)

---

</div>

## ⛩ Overview

**Yūgen (幽玄)** is an award-grade, interactive 3D scrollable website inspired by traditional Japanese Zen aesthetics and the digital masterpiece *"Kage"*. 

As you scroll, the camera glides along a continuous **Catmull-Rom 3D spline** through five sacred temple grounds under the night sky. Built entirely with **vanilla WebGL (Three.js)** and **Web Audio API**, the experience requires **zero heavy external 3D models**—all textures, architectural forms, lighting, and ambient soundscapes are procedurally generated in code at runtime.

---

## ✨ Features

- **🎮 Scroll-Driven 3D Camera Rig:**
  Smooth Catmull-Rom spline flight path traversing through 5 distinct spatial waypoints, synchronized with mouse parallax drift and inertia damping.
  
- **💎 Zero-Asset Procedural Textures:**
  Custom deterministic procedural engine using **Mulberry32 PRNG** and **FBM (Fractional Brownian Motion)** noise rendered onto in-memory 2D canvases to generate charred wood (*Yakisugi*), wet slate paving, and board-formed concrete.

- **⛰ Tangent-Space Normal Map Generation:**
  Runtime Sobel filter convolutions that transform procedural height-maps into dynamic 3D surface bump and normal maps.

- **🏮 Atmospheric Lighting & Night Mist:**
  Multi-light setup featuring dynamic lantern point lights with organic flicker modulation, volumetric fog, and an emissive vermilion moon (*Shugetsu*).

- **🎋 100% Procedural Web Audio Synthesizer:**
  Native Web Audio API soundscape requiring no audio files:
  - Japanese *Ryo* Major Pentatonic melodies (D, E, F#, A, B)
  - 528Hz pure harmonic Zen meditation singing bowl
  - *Shishi-odoshi* (bamboo water rocker) acoustic drops
  - *Fūrin* (glass wind chimes) chiming gently in the breeze
  
- **📱 Responsive Aspect-Ratio Compensation:**
  Smart camera matrix adapter that automatically dollies backwards and adjusts the Field of View on mobile and vertical screens, preventing geometric clipping.

- **🎨 Multi-Layer Cinematic Compositing:**
  Inverted radial vignette, film grain SVG shader overlay, magnetic cursor, and responsive foreground foliage depth cutouts.

---

## 🏛 Architecture

```
                                  [ User Scroll Input ]
                                            │
                                            ▼
                        ┌────────────────────────────────────────┐
                        │   Catmull-Rom 3D Spline Camera Rig     │
                        └───────────────────┬────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
     ┌─────────────────────────────┐                 ┌─────────────────────────────┐
     │      Three.js Scene         │                 │      DOM Overlay Engine     │
     │ ─────────────────────────── │                 │ ─────────────────────────── │
     │ • Procedural Temple Hall    │                 │ • 5-Chapter Semantic HTML   │
     │ • Stone Lanterns (Tōrō)     │                 │ • Parallax Foreground WebP  │
     │ • Charred Cypress Yakisugi  │                 │ • Magnetic Dynamic Cursor   │
     │ • Vermilion Moon & Mist     │                 │ • SVG Film Grain & Vignette │
     └─────────────────────────────┘                 └─────────────────────────────┘
                    │                                               │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
                        ┌────────────────────────────────────────┐
                        │   Web Audio API Zen Synthesizer        │
                        │   • Ryo Scale Pentatonic Notes         │
                        │   • 528Hz Zen Meditation Singing Bowl  │
                        │   • Shishi-odoshi Water Drops          │
                        │   • Furin Breeze Chimes                │
                        └────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
.
├── index.html                 # Main markup, semantic sections, and HUD
├── styles.css                 # Custom CSS, layout system, typography & animations
├── fonts.css                  # Typography styles
├── script.js                  # Three.js scene, procedural textures & camera rig
├── sound.js                   # Web Audio API procedural synthesizer
├── three.min.js               # Standalone Three.js library
├── HOW_I_CLONED_THIS_WEBSITE.md # In-depth technical step-by-step recreation guide
├── README.md                  # Project documentation & overview
├── images-assets/             # High-fidelity foreground cutouts
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
└── generated/                 # Preview cards & visual assets
```

---

## 🚀 Quick Start

This project is built with **zero external framework dependencies** (no npm install, no bundler needed).

### Method 1: VS Code Live Server (Recommended)
1. Open the folder in **VS Code**.
2. Right-click `index.html` and click **"Open with Live Server"**.
3. Experience the website at `http://127.0.0.1:5500`.

### Method 2: Python / Node.js Local Server
```bash
# Using Node.js npx
npx serve .

# Or using Python 3
python -m http.server 8080
```
Open `http://localhost:8080` in your web browser.

---

## 🎧 Audio Controls

- Click the **"SOUND: OFF / ON"** button in the top navigation bar to activate the Web Audio engine.
- The soundscape is interactive and dynamically harmonizes with your journey through the temple chapters.

---

## 🌐 Deploy to GitHub Pages

1. Fork or push this repository to your GitHub account.
2. In your repository, go to **Settings** > **Pages**.
3. Under **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main` / Folder: `/ (root)`
4. Click **Save**. Your site will be live within seconds!

---

## 👤 Creator & Credits

Created and recreated with love and dedication by **Abhishek**.

- 📸 **Instagram:** [@abhitechdecoded](https://www.instagram.com/abhitechdecoded/)
- 💻 **GitHub:** [@Abhitechdev](https://github.com/Abhitechdev)
-  вдохновлено: The digital artistry of *"Kage"* and Japanese architectural heritage.

---

## 📄 License

This project is licensed under the MIT License - feel free to use, modify, and learn from it.
