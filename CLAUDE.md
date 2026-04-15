# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Victor Ferreira (QA professional). A pure static site — no build step, no dependencies, no package manager.

**To preview:** Open `index.html` directly in a browser.

## External Dependencies (CDN)

Loaded in `index.html` — no npm/bundle step involved:
- **Lenis** `1.3.20` — smooth scroll; initialized in `main.js` after `DOMContentLoaded`
- **GSAP** `3.12.5` — used by `about.js` for scroll-scrubbed timeline animations

## Architecture

The site is structured as ES modules loaded from `index.html`:

- `index.html` — single-page layout; hero section + about section + skills board + content area
- `css/style.css` — imports the other CSS files
- `css/global.css`, `css/hero.css`, `css/content.css`, `css/terminal.css`, `css/about.css`, `css/board.css`, `css/skills.css` — split by section
- `js/config.js` — central `CONFIG` object for all tunable constants (fluid sim params, parallax factors, scroll thresholds)
- `js/main.js` — `App` class orchestrating all systems; owns the `requestAnimationFrame` loop
- `js/utils.js` — shared helpers (`lerp`, `RevealObserver`)
- `js/loader.js` — standalone IIFE (loaded with `defer`, not a module) that animates the signature loading screen before the main app starts
- `js/board.js` — loaded as a separate `type="module"`; handles the Jira-style skills board (tab switching, card modal, column width expansion)

### Visual Systems (`js/`)

Systems instantiated in `App.initSystems()` and driven by the single RAF loop in `App.render()`:

| File | Class | Canvas | What it does |
|---|---|---|---|
| `waves.js` | `WaveSystem` | `#bgCanvas` | Animated wave background behind the hero inner panel |
| `fluid.js` | `FluidSimulation` | `#brushCanvas` | WebGL fluid sim over the "QA" text; mouse splats via `destination-out`. Also used for `#aboutFluidCanvas` (global background) |
| `about.js` | `AboutSystem` | — | GSAP paused timeline scrubbed by `aboutProgress`; animates heading lines, body paragraphs, and stat cards |
| `skills.js` | `SkillsReveal` | — | Manual CSS pinning for the skills board section; board slides in from the right as the section enters the viewport |

`swarm.js` and `systems/TypingSystem.js` exist in the repo but are **not currently imported** by `main.js`.

### Scroll Animation System

`App.handleScroll()` computes two progress values keyed to scroll position (all relative to `window.innerHeight`):

- **`scrollProgress`** (`0` → `1`): drives hero zoom-out — `#hero-inner` scales from 1.0 → `CONFIG.scroll.scaleMin` with increasing border-radius and opacity fade
- **`aboutProgress`** (`aboutStartFactor` → `aboutEndFactor`): drives `AboutSystem` GSAP timeline and `#about-section` opacity; default window is `0.6h` → `1.4h`
- **Hero un-sticks** (after `lockThresholdFactor × h`, default `2.0h`): `#hero` switches from `position: fixed` to `position: absolute`

### Scroll-driven Sections Order

1. **Hero** (fixed, zooms out as user scrolls)
2. **About Me** (`#about-section`) — fades in, GSAP animates content; fluid background (`#aboutFluidCanvas`) fades in after hero is 50% shrunk
3. **Skills Board** (`#skills-section`) — `SkillsReveal` manually pins the board while the section scrolls; board slides in from the right on reveal
4. **Content area** — timeline, education, footer (static HTML)

### CSS Z-index Layering (hero section)

`#swarmCanvas` → lowest | `#bgCanvas` → behind "QA" text | `.text-layer` (QA + `#brushCanvas`) → mid | `.profile-img` → above | `nav` → top

### Jira Board (`js/board.js`)

Not an ES module import of `main.js` — loaded independently via `<script type="module">`. Manages:
- Tab switching between board panels (`panel-skills`, `panel-experiencia`, `panel-formacao`, `panel-extras`)
- Column width auto-expansion when cards overflow available height (flex-wrap trick)
- Card detail modal (`#card-modal-overlay`) populated from `.board-card` DOM attributes
