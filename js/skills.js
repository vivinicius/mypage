// js/skills.js — Skills Board manual pinning for a true "lock" effect

export class SkillsReveal {
    constructor() {
        this.section   = document.getElementById('skills-section');
        this.container = document.getElementById('skills-sticky');
        this.board     = document.getElementById('board-window');
        this.scrollIndicator = this.container?.querySelector('.board-scroll-icon');
        
        if (!this.section || !this.container || !this.board) return;

        this._update = this._update.bind(this);
        window.addEventListener('scroll', this._update, { passive: true });
        this._update();
    }

    _update() {
        const rect = this.section.getBoundingClientRect();
        const vh = window.innerHeight;
        const scrollable = this.section.offsetHeight - vh;
        const scrolled = Math.max(0, -rect.top);

        // ── 1. Visibilidade da Seção ──
        if (rect.top < vh * 1.5 && rect.bottom > -vh) {
            this.section.style.visibility = "visible";
        } else {
            this.section.style.visibility = "hidden";
        }

        // ── 2. O efeito de "Lock" (Manual Pinning) ──
        if (rect.top > 0) {
            this.container.style.position = 'absolute';
            this.container.style.top = '0';
        } else if (scrolled < scrollable) {
            this.container.style.position = 'fixed';
            this.container.style.top = '0';
            this.container.style.left = '0';
            this.container.style.width = '100%';
        } else {
            this.container.style.position = 'absolute';
            this.container.style.top = scrollable + 'px';
            this.container.style.left = '0';
        }

        // ── 3. Animação de Reveal ──
        // Revela 100% nos primeiros 60vh de scroll.
        const revealDuration = vh * 0.6;
        const progress = Math.min(scrolled / revealDuration, 1);
        
        this.board.style.opacity = progress.toFixed(3);
        const yOffset = (35 - (progress * 35)).toFixed(2);
        this.board.style.transform = `translateY(${yOffset}px)`;

        // ── 4. Scroll Indicator ──
        if (this.scrollIndicator) {
            let iconOpacity = 0;
            
            // O ícone só começa a aparecer DEPOIS que o board revelou (progress == 1)
            if (progress >= 1.0) {
                // Progresso dentro da fase de LOCK (do fim da revelação até o fim da seção)
                const lockScrolled = scrolled - revealDuration;
                const lockTotal    = scrollable - revealDuration;
                const lockProgress = Math.min(lockScrolled / lockTotal, 1.0);
                
                // Surge rápido no início do lock e some suave no final do lock
                if (lockProgress < 0.2) {
                    iconOpacity = lockProgress / 0.2;
                } else if (lockProgress > 0.8) {
                    iconOpacity = 1.0 - (lockProgress - 0.8) / 0.2;
                } else {
                    iconOpacity = 1.0;
                }
            }
            
            this.scrollIndicator.style.opacity = (iconOpacity * 0.6).toFixed(3); // 0.6 de brilho max
            this.scrollIndicator.style.pointerEvents = iconOpacity > 0.1 ? "auto" : "none";
        }

        // ── 5. Interatividade ──
        this.board.style.pointerEvents = progress > 0.5 ? "auto" : "none";
    }
}
