import { CONFIG } from './config.js';

const VS = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
    }
`;

const SPLAT_FS = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform vec2 uPoint;
    uniform vec3 uColor;
    uniform float uRadius;
    uniform float uAspect;
    void main() {
        vec2 d = vUv - uPoint;
        d.x *= uAspect;
        float s = exp(-dot(d, d) / uRadius);
        vec3 b = texture2D(uTarget, vUv).rgb;
        gl_FragColor = vec4(b + s * uColor, 1.0);
    }
`;

const ADVECT_FS = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform float uDissipation;
    void main() {
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vec2 pos = clamp(vUv - vel, 0.0, 1.0);
        gl_FragColor = uDissipation * texture2D(uSource, pos);
    }
`;

const DISPLAY_FS = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uDye;
    void main() {
        vec3 c = texture2D(uDye, vUv).rgb;
        float a = smoothstep(0.01, 0.06, max(max(c.r, c.g), c.b));
        gl_FragColor = vec4(c, a);
    }
`;

export class FluidSimulation {
    constructor(canvas2D) {
        this.canvas2D = canvas2D;
        this.ctx2D = canvas2D.getContext('2d');
        this.simCanvas = document.createElement('canvas');
        this.gl = this.simCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true });

        this.initWebGL();
        this.setupFonts();
        this.initEvents();
    }

    initWebGL() {
        const gl = this.gl;
        gl.getExtension('OES_texture_float');
        gl.getExtension('OES_texture_float_linear');

        this.pSplat = this.createProgram(SPLAT_FS);
        this.pAdvect = this.createProgram(ADVECT_FS);
        this.pDisplay = this.createProgram(DISPLAY_FS);

        this.quadBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

        this.initFBOs();
        this.resize();
    }

    setupFonts() {
        this.fontsLoaded = false;
        this.qaBaselineY = null;
        document.fonts.ready.then(() => {
            this.fontsLoaded = true;
            this.measureQAPosition();
        });
    }

    initEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            if (this.fontsLoaded) this.measureQAPosition();
        });
    }

    createProgram(fsSrc) {
        const gl = this.gl;
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, VS.trim());
        gl.compileShader(vs);

        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fsSrc.trim());
        gl.compileShader(fs);

        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);

        const uniforms = {};
        const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < n; i++) {
            const name = gl.getActiveUniform(prog, i).name;
            uniforms[name] = gl.getUniformLocation(prog, name);
        }
        return { prog, uniforms };
    }

    initFBOs() {
        const SIM_RES = CONFIG.simResolution;
        const DYE_RES = CONFIG.dyeResolution;
        this.velFBO = this.createDoubleFBO(SIM_RES, SIM_RES);
        this.dyeFBO = this.createDoubleFBO(DYE_RES, DYE_RES);
    }

    createDoubleFBO(w, h) {
        const gl = this.gl;
        const makeTarget = (w, h) => {
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.FLOAT, null);
            const fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
            return { tex, fb };
        };
        let a = makeTarget(w, h), b = makeTarget(w, h);
        return {
            get read()  { return a; },
            get write() { return b; },
            swap()      { [a, b] = [b, a]; },
        };
    }

    resize() {
        this.canvas2D.width = this.simCanvas.width = window.innerWidth;
        this.canvas2D.height = this.simCanvas.height = window.innerHeight;
    }

    measureQAPosition() {
        const h1 = document.querySelector('.bg-text');
        if (!h1) return;
        const rect = h1.getBoundingClientRect();
        const boxCY = rect.top + rect.height / 2;
        const fs = this.canvas2D.height * 1.11;
        this.ctx2D.font = `400 ${fs}px 'DM Serif Display', serif`;
        const m = this.ctx2D.measureText('QA');
        const inkOffsetAboveBaseline = (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
        const offsetPx = this.canvas2D.height * CONFIG.textOffsetY;
        this.qaBaselineY = boxCY + inkOffsetAboveBaseline + offsetPx;
    }

    splat(fbo, res, px, py, color, radius) {
        const gl = this.gl;
        gl.useProgram(this.pSplat.prog);
        this.bindQuad(this.pSplat);
        this.setTex(this.pSplat, 'uTarget', fbo.read.tex, 0);
        this.set2f(this.pSplat, 'uPoint',  px / this.simCanvas.width, 1.0 - py / this.simCanvas.height);
        this.set3f(this.pSplat, 'uColor',  ...color);
        this.set1f(this.pSplat, 'uRadius', radius);
        this.set1f(this.pSplat, 'uAspect', this.simCanvas.width / this.simCanvas.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.write.fb);
        gl.viewport(0, 0, res, res);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        fbo.swap();
    }

    advect(vel, src, dst, res, dissipation) {
        const gl = this.gl;
        gl.useProgram(this.pAdvect.prog);
        this.bindQuad(this.pAdvect);
        this.setTex(this.pAdvect, 'uVelocity', vel.read.tex, 0);
        this.setTex(this.pAdvect, 'uSource', src.read.tex, 1);
        this.set1f(this.pAdvect, 'uDissipation', dissipation);
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.write.fb);
        gl.viewport(0, 0, res, res);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        dst.swap();
    }

    bindQuad(p) {
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
        const loc = gl.getAttribLocation(p.prog, 'aPos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    set1f(p, n, v)       { this.gl.uniform1f(p.uniforms[n], v); }
    set2f(p, n, x, y)    { this.gl.uniform2f(p.uniforms[n], x, y); }
    set3f(p, n, x, y, z) { this.gl.uniform3f(p.uniforms[n], x, y, z); }
    setTex(p, n, tex, u) {
        this.gl.activeTexture(this.gl.TEXTURE0 + u);
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        this.gl.uniform1i(p.uniforms[n], u);
    }

    update(mX, mY, dx, dy, speed) {
        if (speed > CONFIG.velocityThreshold) {
            const vx = (dx / this.simCanvas.width) * CONFIG.splatForce;
            const vy = -(dy / this.simCanvas.height) * CONFIG.splatForce;
            this.splat(this.velFBO, CONFIG.simResolution, mX, mY, [vx, vy, 0], CONFIG.splatRadius * 0.4);
            this.splat(this.dyeFBO, CONFIG.dyeResolution, mX, mY, CONFIG.fluidColor, CONFIG.splatRadius);
        }
        this.advect(this.velFBO, this.velFBO, this.velFBO, CONFIG.simResolution, CONFIG.velocityDissipation);
        this.advect(this.velFBO, this.dyeFBO, this.dyeFBO, CONFIG.dyeResolution, CONFIG.densityDissipation);
    }

    render() {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.simCanvas.width, this.simCanvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.pDisplay.prog);
        this.bindQuad(this.pDisplay);
        this.setTex(this.pDisplay, 'uDye', this.dyeFBO.read.tex, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        if (this.fontsLoaded) {
            const { width: W, height: H } = this.canvas2D;
            const fontSize = H * 1.11;
            const baselineY = this.qaBaselineY ?? H * 0.5 + fontSize * 0.35;

            this.ctx2D.clearRect(0, 0, W, H);
            this.ctx2D.globalCompositeOperation = 'source-over';
            this.ctx2D.fillStyle = '#000';
            this.ctx2D.font = `400 ${fontSize}px 'DM Serif Display', serif`;
            this.ctx2D.textAlign = 'center';
            this.ctx2D.textBaseline = 'alphabetic';
            this.ctx2D.fillText('QA', W / 2, baselineY);

            this.ctx2D.globalCompositeOperation = 'source-atop';
            this.ctx2D.drawImage(this.simCanvas, 0, 0);
            this.ctx2D.globalCompositeOperation = 'source-over';
        }
    }
}
