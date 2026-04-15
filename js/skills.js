// js/skills.js — Skills Board manual pinning for a true "lock" effect

export class SkillsReveal {
    constructor() {
        this.section   = document.getElementById('skills-section');
        this.container = document.getElementById('skills-sticky');
        this.board     = document.getElementById('board-window');
        this.scrollIndicator = this.container?.querySelector('.board-scroll-icon');
        
        if (!this.section || !this.container || !this.board) return;

        this._cardsRevealed = false;
        this._hideAllCards();

        this._update = this._update.bind(this);
        window.addEventListener('scroll', this._update, { passive: true });
        this._update();
    }

    _hideAllCards() {
        document.querySelectorAll('.board-card').forEach(card => {
            card.style.transition = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateY(22px)';
        });
    }

    _revealActiveCards() {
        const panel = document.querySelector('.board-tab-panel.active');
        if (!panel) return;
        Array.from(panel.querySelectorAll('.board-card')).forEach((card, i) => {
            setTimeout(() => {
                card.style.transition = 'opacity 0.44s ease, transform 0.44s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 38);
        });
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
        // Começa a aparecer quando o topo da seção entra na tela (80% da vh)
        // e termina de centralizar exatamente quando dá o LOCK (rect.top == 0)
        const revealRange = vh * 0.8;
        const revealProgress = Math.max(0, Math.min((revealRange - rect.top) / revealRange, 1));
        
        this.board.style.opacity = revealProgress.toFixed(3);
        // Vem da direita (60vw) para o centro (0)
        const xOffset = (60 * (1 - revealProgress)).toFixed(2);
        this.board.style.transform = `translateX(${xOffset}vw)`;

        // ── 4. Scroll Indicator ──
        if (this.scrollIndicator) {
            let iconOpacity = 0;
            
            // O ícone só começa a aparecer DEPOIS que o board está 100% centralizado (lock ativo)
            if (revealProgress >= 1.0 && rect.top <= 0) {
                // Progresso dentro da fase de LOCK
                const lockProgress = Math.min(scrolled / scrollable, 1.0);
                
                if (lockProgress < 0.2) {
                    iconOpacity = lockProgress / 0.2;
                } else if (lockProgress > 0.8) {
                    iconOpacity = 1.0 - (lockProgress - 0.8) / 0.2;
                } else {
                    iconOpacity = 1.0;
                }
            }
            
            this.scrollIndicator.style.opacity = iconOpacity.toFixed(3);
            this.scrollIndicator.style.pointerEvents = iconOpacity > 0.1 ? "auto" : "none";
        }

        // ── 5. Interatividade ──
        this.board.style.pointerEvents = revealProgress > 0.8 ? "auto" : "none";

        // ── 6. Card Reveal ──
        if (revealProgress >= 0.55 && !this._cardsRevealed) {
            this._cardsRevealed = true;
            this._revealActiveCards();
        }
        if (revealProgress < 0.05 && this._cardsRevealed) {
            this._cardsRevealed = false;
            this._hideAllCards();
        }
    }
}
