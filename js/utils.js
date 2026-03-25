/**
 * Utility functions and shared helpers
 */

export const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

export function hsvToRgb(h, s, v) {
    h /= 60;
    const i = Math.floor(h) % 6;
    const f = h - Math.floor(h);
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    return [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][i];
}

/**
 * Handles element revealing on scroll
 */
export class RevealObserver {
    constructor(selector, className = 'visible', threshold = 0.1) {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold });

        document.querySelectorAll(selector).forEach(el => this.observer.observe(el));
    }
}
