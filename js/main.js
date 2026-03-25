import { CONFIG } from './config.js';
import { lerp, RevealObserver } from './utils.js';
import { WaveSystem } from './waves.js';
import { FluidSimulation } from './fluid.js';
import { SwarmSystem } from './swarm.js';
import { TypingSystem } from './systems/TypingSystem.js';

class App {
    constructor() {
        this.initNodes();
        this.initState();
        this.initSystems();
        this.initEvents();
        this.render();
    }

    initNodes() {
        this.nodes = {
            heroWrapper:     document.getElementById('hero-wrapper'),
            hero:            document.getElementById('hero'),
            heroInner:       document.getElementById('hero-inner'),
            profileImg:      document.getElementById('profileImg'),
            textLayer:       document.querySelector('.text-layer'),
            bgCanvas:        document.getElementById('bgCanvas'),
            brushCanvas:     document.getElementById('brushCanvas'),
            textFill:        document.querySelector('.text-fill'),
            experienceText:  document.getElementById('experience-text'),
            loreSection:     document.getElementById('lore-section'),
            pcAnimation:     document.getElementById('pc-animation'),
            typingCommand1:  document.getElementById('typing-command-1'),
            commandOutput1:  document.getElementById('command-output-1'),
            promptLine2:     document.getElementById('prompt-line-2'),
            typingCommand2:  document.getElementById('typing-command-2'),
            typingContent:   document.getElementById('typing-content'),
            scrollIndicator: document.getElementById('scroll-indicator'),
            initialScroll:   document.getElementById('scrollIcon'),
            swarmCanvas:     document.getElementById('swarmCanvas'),
        };
    }

    initState() {
        this.state = {
            scrollProgress: 0,
            loreProgress: 0,
            mouse: { x: 0, y: 0, prevX: 0, prevY: 0, onPage: false, pendingSplat: false },
            parallax: { imgCX: 0, imgCY: 0, imgTX: 0, imgTY: 0, qaCX: 0, qaCY: 0, qaTX: 0, qaTY: 0 }
        };
    }

    initSystems() {
        this.waves = new WaveSystem(this.nodes.bgCanvas);
        this.fluid = new FluidSimulation(this.nodes.brushCanvas);
        this.swarm = new SwarmSystem(this.nodes.swarmCanvas);
        this.typing = new TypingSystem(this.nodes, CONFIG.content.loreText, this.nodes.pcAnimation);
    }

    initEvents() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        document.addEventListener('mousemove', (e) => this.handleMouse(e));
        document.addEventListener('mouseleave', () => this.handleMouseLeave());
        
        new RevealObserver('.timeline-item, .skills-block, .education-block');
    }

    handleScroll() {
        const h = window.innerHeight;
        const scrollY = window.scrollY;
        const { scroll: cfg } = CONFIG;

        this.state.scrollProgress = Math.min(scrollY / h, 1.0);
        
        const fillStart = h * cfg.fillStartFactor;
        const fillEnd = h * cfg.fillEndFactor;
        const fillProgress = Math.max(0, Math.min((scrollY - fillStart) / (fillEnd - fillStart), 1.0));
        
        if (this.nodes.textFill) {
            this.nodes.textFill.style.width = `${(fillProgress * 100).toFixed(2)}%`;
        }

        const loreStart = h * cfg.loreStartFactor;
        const loreEnd = h * cfg.loreEndFactor;
        this.state.loreProgress = Math.max(0, Math.min((scrollY - loreStart) / (loreEnd - loreStart), 1.0));

        const lockThreshold = h * cfg.lockThresholdFactor;
        if (scrollY > lockThreshold) {
            this.nodes.hero.style.position = 'absolute';
            this.nodes.hero.style.top = `${lockThreshold}px`;
        } else {
            this.nodes.hero.style.position = 'fixed';
            this.nodes.hero.style.top = '0';
        }
    }

    handleMouse(e) {
        const { mouse, parallax } = this.state;
        
        if (this.swarm) this.swarm.updateMouse(e.clientX, e.clientY);

        parallax.imgTX = (window.innerWidth / 2 - e.pageX) / CONFIG.parallax.moveFactor;
        parallax.imgTY = Math.max(0, (window.innerHeight / 2 - e.pageY) / CONFIG.parallax.moveFactor);
        parallax.qaTX = -(window.innerWidth / 2 - e.pageX) / CONFIG.parallax.qaMoveFactor;
        parallax.qaTY = -(window.innerHeight / 2 - e.pageY) / CONFIG.parallax.qaMoveFactor;

        mouse.prevX = mouse.x; mouse.prevY = mouse.y;
        mouse.x = e.clientX; mouse.y = e.clientY;
        mouse.onPage = true;
        mouse.pendingSplat = true;
    }

    handleMouseLeave() {
        this.state.mouse.onPage = false;
        this.state.parallax.imgTX = 0; this.state.parallax.imgTY = 0;
        this.state.parallax.qaTX = 0;  this.state.parallax.qaTY = 0;
    }

    updateParallax() {
        const { parallax } = this.state;
        const L = CONFIG.parallax.lerp;
        
        parallax.imgCX = lerp(parallax.imgCX, parallax.imgTX, L);
        parallax.imgCY = lerp(parallax.imgCY, parallax.imgTY, L);
        this.nodes.profileImg.style.transform = `translate(${parallax.imgCX}px, ${parallax.imgCY}px)`;

        parallax.qaCX = lerp(parallax.qaCX, parallax.qaTX, L);
        parallax.qaCY = lerp(parallax.qaCY, parallax.qaTY, L);
        this.nodes.textLayer.style.transform = `translate(${parallax.qaCX}px, ${parallax.qaCY}px)`;
    }

    updateScrollEffects() {
        const p = this.state.scrollProgress;
        const lp = this.state.loreProgress || 0;
        const { scaleMin, borderMax } = CONFIG.scroll;
        
        const scale = 1.0 - (1.0 - scaleMin) * p;
        const radius = borderMax * p;
        const opacity = Math.pow(1.0 - p, 1.5);
        
        this.nodes.heroInner.style.transform = `scale(${scale.toFixed(4)})`;
        this.nodes.heroInner.style.borderRadius = `${radius.toFixed(2)}px`;
        this.nodes.heroInner.style.opacity = opacity.toFixed(4);
        this.nodes.heroInner.style.pointerEvents = (p > 0.9) ? 'none' : 'auto';
        
        if (this.nodes.initialScroll) {
            const initialOpacity = Math.max(0, 1.0 - (p / 0.05));
            this.nodes.initialScroll.style.opacity = initialOpacity.toFixed(4);
            this.nodes.initialScroll.style.pointerEvents = (initialOpacity > 0) ? 'auto' : 'none';
        }

        if (this.nodes.experienceText) {
            const topPos = 50 - (44 * lp);
            const fontSize = 8 - (4.5 * lp);
            this.nodes.experienceText.style.top = `${topPos}%`;
            this.nodes.experienceText.style.fontSize = `${fontSize}vw`;
        }

        if (this.nodes.loreSection) {
            this.nodes.loreSection.style.opacity = lp.toFixed(4);
            const loreTop = 62 - (2 * lp);
            this.nodes.loreSection.style.top = `${loreTop}%`;

            if (lp > 0.3) {
                this.typing.start();
            }
        }

        if (this.nodes.scrollIndicator) {
            const h = window.innerHeight;
            const scrollY = window.scrollY;
            const lockThreshold = h * CONFIG.scroll.lockThresholdFactor;
            const iconAppearStart = h * CONFIG.scroll.loreEndFactor;
            
            let iconOpacity = 0;
            if (lp >= 1.0 && scrollY >= iconAppearStart) {
                iconOpacity = Math.min(1.0, (scrollY - iconAppearStart) / (h * 0.4));
            }
            
            if (scrollY > lockThreshold) {
                const fadeOut = Math.max(0, 1.0 - (scrollY - lockThreshold) / (h * 0.2));
                iconOpacity *= fadeOut;
            }
            
            this.nodes.scrollIndicator.style.opacity = iconOpacity.toFixed(4);
            this.nodes.scrollIndicator.style.pointerEvents = (iconOpacity > 0.1) ? 'auto' : 'none';
        }
    }

    updateFluid() {
        const { mouse } = this.state;
        if (mouse.pendingSplat && mouse.onPage) {
            mouse.pendingSplat = false;
            const dx = mouse.x - mouse.prevX;
            const dy = mouse.y - mouse.prevY;
            const speed = Math.sqrt(dx * dx + dy * dy);
            this.fluid.update(mouse.x, mouse.y, dx, dy, speed);
        } else {
            this.fluid.update(0, 0, 0, 0, 0);
        }
    }

    render(t = 0) {
        this.updateScrollEffects();
        this.updateParallax();
        this.updateFluid();
        if (this.swarm) this.swarm.draw();
        
        this.waves.draw(t);
        this.fluid.render();
        
        requestAnimationFrame((t) => this.render(t));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
