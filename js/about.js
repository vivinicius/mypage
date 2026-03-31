// js/about.js — About Me animation system
// GSAP paused timeline scrubbed by scroll progress (aboutProgress 0→1)
// driven from main.js RAF loop.

export class AboutSystem {
    constructor() {
        this.section = document.getElementById('about-section');
        if (!this.section || typeof gsap === 'undefined') return;

        this.headingLines = Array.from(this.section.querySelectorAll('[data-about-line]'));
        this.bodyItems    = Array.from(this.section.querySelectorAll('[data-about-body]'));

        this._buildTimeline();
    }

    _buildTimeline() {
        this.tl = gsap.timeline({ paused: true });

        // Phase 1 — 3 headline lines slide up through overflow mask
        this.tl.from(this.headingLines, {
            yPercent: 115,
            duration: 0.48,
            stagger:  0.13,
            ease:     'power3.out'
        }, 0);

        // Phase 2 — body paragraphs (items 0-2): fade + slide up
        const paragraphs = this.bodyItems.slice(0, 3);
        this.tl.from(paragraphs, {
            opacity:  0,
            y:        18,
            duration: 0.38,
            stagger:  0.09,
            ease:     'power2.out'
        }, 0.30);

        // Phase 3 — stat cards (items 3-6): fade + slight scale up
        const cards = this.bodyItems.slice(3);
        this.tl.from(cards, {
            opacity:  0,
            y:        16,
            scale:    0.96,
            duration: 0.36,
            stagger:  0.08,
            ease:     'power2.out'
        }, 0.45);
    }

    // Called every RAF frame with aboutProgress in [0, 1]
    update(progress) {
        if (!this.tl) return;
        this.tl.progress(Math.max(0, Math.min(progress, 1)));
    }
}
