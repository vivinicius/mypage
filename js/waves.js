export class WaveSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.WAVE_COUNT = 11;
        this.waves = [];
        
        this.setupWaves();
        this.initEvents();
        this.resize();
    }

    setupWaves() {
        this.waves = Array.from({ length: this.WAVE_COUNT }, (_, i) => ({
            amp: 12 + 10 * Math.sin(i * 1.3),
            freq: 1.8 + 0.15 * i,
            speed: 0.00080 + i * 0.000012,
            phase: i * 0.55,
        }));
    }

    initEvents() {
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    draw(t) {
        const { width: W, height: H } = this.canvas;
        this.ctx.clearRect(0, 0, W, H);
        this.ctx.lineWidth = 1.0;

        for (let i = 0; i < this.WAVE_COUNT; i++) {
            const w = this.waves[i];
            const baseY = (H / 2) + ((H / 2) / (this.WAVE_COUNT - 1)) * i;
            const alpha = 0.28 + 0.08 * Math.abs(Math.sin(i * 0.7));

            this.ctx.strokeStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
            this.ctx.beginPath();

            for (let x = 0; x <= W; x += 3) {
                const y = baseY + w.amp * Math.sin((x / W) * w.freq * Math.PI * 2 + t * w.speed + w.phase);
                x === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y);
            }
            this.ctx.stroke();
        }
    }
}
