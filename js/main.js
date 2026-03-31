import { CONFIG } from './config.js';
import { lerp, RevealObserver } from './utils.js';
import { WaveSystem } from './waves.js';
import { FluidSimulation } from './fluid.js';
import { AboutSystem } from './about.js';
import { SkillsReveal } from './skills.js';

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
            heroWrapper:  document.getElementById('hero-wrapper'),
            hero:         document.getElementById('hero'),
            heroInner:    document.getElementById('hero-inner'),
            profileImg:   document.getElementById('profileImg'),
            textLayer:    document.querySelector('.text-layer'),
            bgCanvas:     document.getElementById('bgCanvas'),
            brushCanvas:  document.getElementById('brushCanvas'),
            aboutFluidCanvas: document.getElementById('aboutFluidCanvas'),
            aboutSection: document.getElementById('about-section'),
            aboutScroll:  document.querySelector('.about-scroll-icon'),
            initialScroll: document.getElementById('scrollIcon'),
        };
    }

    initState() {
        this.state = {
            scrollProgress: 0,
            aboutProgress:  0,
            aboutInitialized: false,
            mouse: { x: 0, y: 0, prevX: 0, prevY: 0, onPage: false, pendingSplat: false },
            parallax: { imgCX: 0, imgCY: 0, imgTX: 0, imgTY: 0, qaCX: 0, qaCY: 0, qaTX: 0, qaTY: 0 }
        };
    }

    initSystems() {
        this.waves  = new WaveSystem(this.nodes.bgCanvas);
        
        // Fluido para o texto QA (Hero)
        this.fluid  = new FluidSimulation(this.nodes.brushCanvas, { drawText: true, fluidColor: [0.3, 0.65, 1.0], colorBrightness: 0.03 });
        
        // Fluido para o background do About Me (Modo Rainbow como o site)
        const aboutCanvas = document.getElementById('aboutFluidCanvas');
        if (aboutCanvas) {
            this.aboutFluid = new FluidSimulation(aboutCanvas, {
                drawText: false,
                fluidColor: [0.3, 0.65, 1.0], // Azul claro
                opacityMultiplier: 1.0,
                colorBrightness: 0.03
            });
        }

        this.about  = new AboutSystem();
        this.skills = new SkillsReveal();
    }

    initEvents() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        document.addEventListener('mousemove', (e) => this.handleMouse(e));
        document.addEventListener('mouseleave', () => this.handleMouseLeave());
        window.addEventListener('resize', () => {
            if (this.fluid) this.fluid.resize();
            if (this.aboutFluid) this.aboutFluid.resize();
        });
    }

    handleScroll() {
        const h      = window.innerHeight;
        const scrollY = window.scrollY;
        const { scroll: cfg } = CONFIG;

        this.state.scrollProgress = Math.min(scrollY / h, 1.0);

        // About Me fades in; no fade-out — it stays visible
        const aboutStart = h * cfg.aboutStartFactor;
        const aboutEnd   = h * cfg.aboutEndFactor;
        this.state.aboutProgress = Math.max(0, Math.min(
            (scrollY - aboutStart) / (aboutEnd - aboutStart), 1.0
        ));

        // Hero un-sticks after scrolling past lockThreshold
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

        parallax.imgTX = (window.innerWidth  / 2 - e.pageX) / CONFIG.parallax.moveFactor;
        parallax.imgTY = Math.max(0, (window.innerHeight / 2 - e.pageY) / CONFIG.parallax.moveFactor);
        parallax.qaTX  = -(window.innerWidth  / 2 - e.pageX) / CONFIG.parallax.qaMoveFactor;
        parallax.qaTY  = -(window.innerHeight / 2 - e.pageY) / CONFIG.parallax.qaMoveFactor;

        mouse.prevX = mouse.x; mouse.prevY = mouse.y;
        mouse.x = e.clientX;   mouse.y = e.clientY;
        mouse.onPage = true;
        mouse.pendingSplat = true;
    }

    handleMouseLeave() {
        this.state.mouse.onPage = false;
        this.state.parallax.imgTX = 0; this.state.parallax.imgTY = 0;
        this.state.parallax.qaTX  = 0; this.state.parallax.qaTY  = 0;
    }

    updateParallax() {
        const { parallax } = this.state;
        const L = CONFIG.parallax.lerp;

        parallax.imgCX = lerp(parallax.imgCX, parallax.imgTX, L);
        parallax.imgCY = lerp(parallax.imgCY, parallax.imgTY, L);
        this.nodes.profileImg.style.transform =
            `translate(${parallax.imgCX}px, ${parallax.imgCY}px)`;

        parallax.qaCX = lerp(parallax.qaCX, parallax.qaTX, L);
        parallax.qaCY = lerp(parallax.qaCY, parallax.qaTY, L);
        this.nodes.textLayer.style.transform =
            `translate(${parallax.qaCX}px, ${parallax.qaCY}px)`;
    }

    updateScrollEffects() {
        const p  = this.state.scrollProgress;
        const ap = this.state.aboutProgress;
        const { scaleMin, borderMax } = CONFIG.scroll;

        // Hero inner: zoom-out + border-radius + fade
        const scale   = 1.0 - (1.0 - scaleMin) * p;
        const radius  = borderMax * p;
        const opacity = Math.pow(1.0 - p, 1.5);

        this.nodes.heroInner.style.transform    = `scale(${scale.toFixed(4)})`;
        this.nodes.heroInner.style.borderRadius = `${radius.toFixed(2)}px`;
        this.nodes.heroInner.style.opacity      = opacity.toFixed(4);
        this.nodes.heroInner.style.pointerEvents = (p > 0.9) ? 'none' : 'auto';

        // Initial scroll icon fades out quickly
        if (this.nodes.initialScroll) {
            const iconOpacity = Math.max(0, 1.0 - (p / 0.05));
            this.nodes.initialScroll.style.opacity      = iconOpacity.toFixed(4);
            this.nodes.initialScroll.style.pointerEvents = (iconOpacity > 0) ? 'auto' : 'none';
        }

        // About Me: fade in, no fade-out
        if (this.nodes.aboutSection) {
            const aboutOpacity = ap.toFixed(4);
            this.nodes.aboutSection.style.opacity      = aboutOpacity;
            this.nodes.aboutSection.style.pointerEvents = ap > 0.05 ? 'auto' : 'none';
            
            // Sincroniza o fluido do background
            if (this.nodes.aboutFluidCanvas) {
                this.nodes.aboutFluidCanvas.style.opacity = ap.toFixed(4);
            }

            // Splash inicial assim que o about section se torna visível
            if (ap > 0.05 && !this.state.aboutInitialized && this.aboutFluid) {
                this.state.aboutInitialized = true;
                this.aboutFluid.addMultipleSplats(3);
            }
            
            if (this.nodes.aboutScroll) {
                const scrollY = window.scrollY;
                const h = window.innerHeight;
                const { scroll: cfg } = CONFIG;
                
                // O lock começa em aboutEndFactor (1.4h) e termina em lockThresholdFactor (2.0h)
                const lockStart = h * cfg.aboutEndFactor;
                const lockEnd   = h * cfg.lockThresholdFactor;
                
                let iconOpacity = 0;
                
                if (scrollY > lockStart) {
                    // Estamos na fase de LOCK
                    const lockProgress = Math.min((scrollY - lockStart) / (lockEnd - lockStart), 1.0);
                    
                    // Surge rápido no início do lock (primeiros 20% do lock)
                    // e some suave no final do lock (últimos 20% do lock)
                    if (lockProgress < 0.2) {
                        iconOpacity = lockProgress / 0.2;
                    } else if (lockProgress > 0.8) {
                        iconOpacity = 1.0 - (lockProgress - 0.8) / 0.2;
                    } else {
                        iconOpacity = 1.0;
                    }
                }
                
                this.nodes.aboutScroll.style.opacity = iconOpacity.toFixed(4);
            }
        }
    }

    updateFluid() {
        const { mouse } = this.state;
        if (mouse.pendingSplat && mouse.onPage) {
            mouse.pendingSplat = false;
            const dx    = mouse.x - mouse.prevX;
            const dy    = mouse.y - mouse.prevY;
            const speed = Math.sqrt(dx * dx + dy * dy);
            
            this.fluid.update(mouse.x, mouse.y, dx, dy, speed);
            if (this.aboutFluid) this.aboutFluid.update(mouse.x, mouse.y, dx, dy, speed);
        } else {
            this.fluid.update(0, 0, 0, 0, 0);
            if (this.aboutFluid) this.aboutFluid.update(0, 0, 0, 0, 0);
        }
    }

    render(t = 0) {
        this.updateScrollEffects();
        this.updateParallax();
        this.updateFluid();
        this.waves.draw(t);
        this.fluid.render();
        if (this.aboutFluid) this.aboutFluid.render();
        if (this.about) this.about.update(this.state.aboutProgress);

        requestAnimationFrame((t) => this.render(t));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();

    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration:        1.3,
            easing:          t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel:     true,
            wheelMultiplier: 1,
        });

        function lenisRaf(time) {
            lenis.raf(time);
            requestAnimationFrame(lenisRaf);
        }
        requestAnimationFrame(lenisRaf);
    }
});
