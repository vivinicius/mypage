# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Victor Ferreira (QA professional). A pure static site — no build step, no dependencies, no package manager.

**To preview:** Open `index.html` directly in a browser.

## Architecture

The site is structured as ES modules loaded from `index.html`:

- `index.html` — single-page structure with two main regions: `#hero-wrapper` (sticky, scroll-animated hero) and `#content-area` (resume: timeline, skills, education, footer)
- `css/style.css` — imports the other CSS files
- `css/global.css`, `css/hero.css`, `css/content.css`, `css/terminal.css` — split by section
- `js/config.js` — central `CONFIG` object for all tunable constants (fluid sim params, parallax factors, scroll thresholds)
- `js/main.js` — `App` class orchestrating all systems; owns the `requestAnimationFrame` loop
- `js/utils.js` — shared helpers (e.g. `lerp`)
- `js/loader.js` — standalone IIFE (loaded with `defer`, not a module) that animates the signature loading screen before the main app starts
- `js/systems/TypingSystem.js` — fires once when scroll reaches 30% lore progress; types out two fake terminal commands then the bio text

### Visual Systems (`js/`)

Four systems are instantiated in `App.initSystems()` and driven by the single RAF loop in `App.render()`:

| File | Class | Canvas | What it does |
|---|---|---|---|
| `waves.js` | `WaveSystem` | `#bgCanvas` | Animated wave background behind the hero inner panel |
| `fluid.js` | `FluidSimulation` | `#brushCanvas` | WebGL fluid sim over the "QA" text; mouse movement creates ink splats via `destination-out` |
| `swarm.js` | `SwarmSystem` | `#swarmCanvas` | Particle swarm that reacts to cursor position |
| `systems/TypingSystem.js` | `TypingSystem` | — | Fake terminal typing animation in `#lore-terminal` |

### Scroll Animation System

`App.handleScroll()` drives four effects keyed to scroll position (all relative to `window.innerHeight`):

1. **Hero zoom-out** (`0` → `1×h`): `#hero-inner` scales from 1.0 → `CONFIG.scroll.scaleMin` with increasing border-radius
2. **"ABOUT ME" text fill** (`0.4h` → `1.2h`): `.text-fill` width expands left-to-right
3. **Lore terminal** (`0.8h` → `1.6h`): `#lore-terminal` fades in; `TypingSystem.start()` fires at 30% progress
4. **Hero un-sticks** (after `2.2h`): `#hero` switches from `position: fixed` to `position: absolute`

### CSS Z-index Layering (hero section)

`#swarmCanvas` → lowest | `#bgCanvas` → behind "QA" text | `.text-layer` (QA + `#brushCanvas`) → mid | `.profile-img` → above | `nav` → top
