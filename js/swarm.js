export class SwarmSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.count = 200;
        this.mx = -1000;
        this.my = -1000;
        this.proximity = 180;
        
        this.resize();
        this.init();
    }

    resize() {
        this.w = this.canvas.width = window.innerWidth;
        this.h = this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.count; i++) {
            this.particles.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                char: Math.random() > 0.5 ? '0' : '1',
                alpha: Math.random() * 0.2 + 0.1,
                size: 10,
                aligned: false,
                trail: []
            });
        }
    }

    updateMouse(x, y) {
        this.mx = x;
        this.my = y;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        
        this.ctx.font = '10px "JetBrains Mono", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.particles.forEach(p => {
            const dx = this.mx - p.x;
            const dy = this.my - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let brightness = 0;
            if (dist < this.proximity) {
                brightness = 1.0 - (dist / this.proximity);
                
                const targetVx = (dx / dist) * 1.5;
                const targetVy = (dy / dist) * 1.5;
                p.vx += (targetVx - p.vx) * 0.08;
                p.vy += (targetVy - p.vy) * 0.08;
                p.aligned = true;
                
                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > 8) p.trail.shift();
            } else {
                p.vx += (Math.random() - 0.5) * 0.1;
                p.vy += (Math.random() - 0.5) * 0.1;
                p.aligned = false;
                p.trail = [];
            }

            p.vx *= 0.98;
            p.vy *= 0.98;
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < -20) p.x = this.w + 20;
            if (p.x > this.w + 20) p.x = -20;
            if (p.y < -20) p.y = this.h + 20;
            if (p.y > this.h + 20) p.y = -20;

            if (p.aligned && p.trail.length > 1) {
                p.trail.forEach((t, i) => {
                    const trailAlpha = (i / p.trail.length) * 0.3 * brightness;
                    this.ctx.fillStyle = `rgba(48, 217, 144, ${trailAlpha})`;
                    this.ctx.fillText(p.char, t.x, t.y);
                });
            }

            const finalAlpha = Math.max(p.alpha, brightness * 0.8);
            this.ctx.fillStyle = `rgba(48, 217, 144, ${finalAlpha})`; 
            this.ctx.fillText(p.char, p.x, p.y);
        });
    }
}
