import { CONFIG } from '../config.js';

export class TypingSystem {
    constructor(nodes, content, videoEl) {
        this.nodes = nodes;
        this.content = content;
        this.videoEl = videoEl;
        this.triggered = false;
        
        this.settings = CONFIG.content.typing;
    }

    start() {
        if (this.triggered) return;
        this.triggered = true;

        const cmd1 = "whoami";
        const res1 = "victor-ferreira (Automation Specialist)";
        const cmd2 = "cat about_me.txt";
        const text = this.content;

        const cmdMs = (cmd1.length + cmd2.length) * this.settings.cmdDelay + (this.settings.pauseDelay * 2);
        const charDelay = Math.max(1, Math.round((this.settings.totalDuration - cmdMs) / text.length));

        if (this.videoEl) {
            this.videoEl.currentTime = 0;
            this.videoEl.play();
            this.videoEl.classList.add('floating');
        }

        this.runSequence(cmd1, res1, cmd2, text, charDelay);
    }

    runSequence(cmd1, res1, cmd2, text, charDelay) {
        let i = 0;

        const typeCmd1 = () => {
            if (i < cmd1.length) {
                this.nodes.typingCommand1.innerHTML += cmd1.charAt(i++);
                setTimeout(typeCmd1, this.settings.cmdDelay);
            } else {
                setTimeout(() => {
                    this.nodes.commandOutput1.innerHTML = res1;
                    if (this.nodes.promptLine2) this.nodes.promptLine2.style.display = 'flex';
                    i = 0;
                    typeCmd2();
                }, this.settings.pauseDelay);
            }
        };

        const typeCmd2 = () => {
            if (i < cmd2.length) {
                this.nodes.typingCommand2.innerHTML += cmd2.charAt(i++);
                setTimeout(typeCmd2, this.settings.cmdDelay);
            } else {
                setTimeout(() => {
                    i = 0;
                    typeMainText();
                }, this.settings.pauseDelay);
            }
        };

        const typeMainText = () => {
            if (i < text.length) {
                const cursor = this.nodes.typingContent.querySelector('.cursor');
                cursor.insertAdjacentText('beforebegin', text.charAt(i++));
                setTimeout(typeMainText, charDelay);
            }
        };

        typeCmd1();
    }
}
