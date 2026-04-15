import { CONFIG } from './config.js';

// --- HIGH FIDELITY SHADERS (INSPIRA UI FEEL) ---

const BASE_VS = `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
    uniform vec2 texelSize;
    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`;

const DISPLAY_FS = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
    uniform sampler2D uTexture;
    uniform vec2 texelSize;
    
    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        
        // SHADING (Gives the "Volume" look)
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;
        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);
        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);
        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        c *= diffuse;
        
        c *= 1.0;
        
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
    }
`;

const SPLAT_FS = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
`;

const ADVECTION_FS = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;
    void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
    }
`;

const DIVERGENCE_FS = `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
    }
`;

const CURL_FS = `
    precision mediump float;
    varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
    }
`;

const VORTICITY_FS = `
    precision highp float;
    varying vec2 vUv;
    varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        gl_FragColor = vec4(texture2D(uVelocity, vUv).xy + force * dt, 0.0, 1.0);
    }
`;

const PRESSURE_FS = `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL; varying highp vec2 vR; varying vec2 vT; varying vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float div = texture2D(uDivergence, vUv).x;
        gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
    }
`;

const GRADIENT_SUBTRACT_FS = `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL; varying highp vec2 vR; varying vec2 vT; varying vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel - vec2(R - L, T - B), 0.0, 1.0);
    }
`;

export class FluidSimulation {
    constructor(canvas, options = {}) {
        this.options = {
            drawText: options.drawText ?? false,
            text: options.text ?? 'QA',
            fluidColor: options.fluidColor ?? null,
            opacityMultiplier: options.opacityMultiplier ?? 1.0,
            colorBrightness: options.colorBrightness ?? 0.2
        };

        if (this.options.drawText) {
            // Modo texto (QA): WebGL em canvas offscreen, compositing via 2D canvas
            this.canvas2D = canvas;
            this.ctx2D    = canvas.getContext('2d');
            this.simCanvas = document.createElement('canvas');
            const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: true };
            this.gl = this.simCanvas.getContext('webgl2', params) || this.simCanvas.getContext('webgl', params);
        } else {
            // Modo direto (About Me): WebGL renderiza direto no canvas visível
            this.canvas2D  = canvas;
            this.ctx2D     = null;
            this.simCanvas = canvas;
            const params = { alpha: true, depth: false, stencil: false, antialias: false };
            this.gl = canvas.getContext('webgl2', params) || canvas.getContext('webgl', params);
        }

        this.colorTimer = Math.random() * 10;
        this.fontsLoaded = false;
        this.init();
    }

    init() {
        const gl = this.gl;
        this.ext = this.getExtensions();
        
        this.pSplat      = this.createProgram(BASE_VS, SPLAT_FS);
        this.pAdvect     = this.createProgram(BASE_VS, ADVECTION_FS);
        this.pDisplay    = this.createProgram(BASE_VS, DISPLAY_FS);
        this.pDivergence = this.createProgram(BASE_VS, DIVERGENCE_FS);
        this.pCurl       = this.createProgram(BASE_VS, CURL_FS);
        this.pVorticity  = this.createProgram(BASE_VS, VORTICITY_FS);
        this.pPressure   = this.createProgram(BASE_VS, PRESSURE_FS);
        this.pGradSub    = this.createProgram(BASE_VS, GRADIENT_SUBTRACT_FS);

        this.quadBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        this.initFBOs();
        this.resize();
        if (this.options.drawText) this.setupFonts();
    }

    getExtensions() {
        const gl = this.gl;
        const isWebGL2 = !!gl.clearBufferfv;
        let halfFloatTexType;
        if (isWebGL2) {
            gl.getExtension('EXT_color_buffer_float');
            halfFloatTexType = gl.HALF_FLOAT;
        } else {
            halfFloatTexType = gl.getExtension('OES_texture_half_float')?.HALF_FLOAT_OES;
        }
        return { halfFloatTexType, internalFormat: isWebGL2 ? gl.RGBA16F : gl.RGBA, format: gl.RGBA };
    }

    createProgram(vsSrc, fsSrc) {
        const gl = this.gl;
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vsSrc.trim()); gl.compileShader(vs);
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fsSrc.trim()); gl.compileShader(fs);
        const prog = gl.createProgram();
        gl.attachShader(prog, vs); gl.attachShader(prog, fs);
        gl.bindAttribLocation(prog, 0, 'aPosition');
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
        const SIM = CONFIG.simResolution, DYE = CONFIG.dyeResolution;
        this.velFBO = this.createDoubleFBO(SIM, SIM);
        this.dyeFBO = this.createDoubleFBO(DYE, DYE);
        this.divFBO = this.createFBO(SIM, SIM);
        this.prsFBO = this.createDoubleFBO(SIM, SIM);
        this.crlFBO = this.createFBO(SIM, SIM);
    }

    createFBO(w, h) {
        const gl = this.gl;
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.ext.internalFormat, w, h, 0, this.ext.format, this.ext.halfFloatTexType, null);
        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        return { tex, fb, w, h };
    }

    createDoubleFBO(w, h) {
        let a = this.createFBO(w, h), b = this.createFBO(w, h);
        return { get read() { return a; }, get write() { return b; }, swap() { [a, b] = [b, a]; } };
    }

    resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.canvas2D.width = this.simCanvas.width = w;
        this.canvas2D.height = this.simCanvas.height = h;
    }

    setupFonts() {
        document.fonts.ready.then(() => {
            this.fontsLoaded = true;
            this.measureQAPosition();
        });
    }

    measureQAPosition() {
        const h1 = document.querySelector('.bg-text'); if (!h1) return;
        const rect = h1.getBoundingClientRect();
        const boxCY = rect.top + rect.height / 2;
        const fs = this.canvas2D.height * 1.11;
        this.ctx2D.font = `400 ${fs}px 'DM Serif Display', serif`;
        const m = this.ctx2D.measureText(this.options.text);
        const inkOffset = (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
        this.qaBaselineY = boxCY + inkOffset + this.canvas2D.height * CONFIG.textOffsetY;
    }

    blit(target) {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null);
        gl.viewport(0, 0, target ? target.w : this.simCanvas.width, target ? target.h : this.simCanvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    addMultipleSplats(count) {
        const gl = this.gl;
        gl.useProgram(this.pSplat.prog);
        gl.uniform1f(this.pSplat.uniforms.aspectRatio, this.simCanvas.width / this.simCanvas.height);
        gl.uniform1f(this.pSplat.uniforms.radius, CONFIG.splatRadius / 100.0);

        for (let i = 0; i < count; i++) {
            const color = this.options.fluidColor || this.generateColor();
            const x  = Math.random();
            const y  = Math.random();
            const vx = (Math.random() - 0.5) * CONFIG.splatForce;
            const vy = (Math.random() - 0.5) * CONFIG.splatForce;

            gl.uniform2f(this.pSplat.uniforms.point, x, y);

            gl.uniform3f(this.pSplat.uniforms.color, vx, vy, 0);
            gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.velFBO.read.tex);
            gl.uniform1i(this.pSplat.uniforms.uTarget, 0);
            this.blit(this.velFBO.write); this.velFBO.swap();

            gl.uniform3f(this.pSplat.uniforms.color, ...color);
            gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.dyeFBO.read.tex);
            gl.uniform1i(this.pSplat.uniforms.uTarget, 0);
            this.blit(this.dyeFBO.write); this.dyeFBO.swap();
        }
    }

    generateColor() {
        this.colorTimer += 0.01;
        const h = (this.colorTimer % 1.0);
        const s = 0.8, v = 1.0;
        let r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6); f = h * 6 - i;
        p = v * (1 - s); q = v * (1 - f * s); t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        const b2 = this.options.colorBrightness;
        return [r * b2, g * b2, b * b2];
    }

    update(mX, mY, dx, dy, speed) {
        const gl = this.gl, SIM = CONFIG.simResolution, DYE = CONFIG.dyeResolution, dt = 0.016;
        const rect = this.canvas2D.getBoundingClientRect();
        const normX = (mX - rect.left) / this.simCanvas.width, normY = 1.0 - (mY - rect.top) / this.simCanvas.height;

        if (speed > CONFIG.velocityThreshold) {
            const splatColor = this.options.fluidColor || this.generateColor();
            const v = [(dx / this.simCanvas.width) * CONFIG.splatForce, -(dy / this.simCanvas.height) * CONFIG.splatForce, 0];
            
            gl.useProgram(this.pSplat.prog);
            gl.uniform1f(this.pSplat.uniforms.aspectRatio, this.simCanvas.width / this.simCanvas.height);
            gl.uniform2f(this.pSplat.uniforms.point, normX, normY);
            gl.uniform1f(this.pSplat.uniforms.radius, CONFIG.splatRadius / 100.0);
            
            // Velocity splat
            gl.uniform3f(this.pSplat.uniforms.color, v[0], v[1], 0);
            gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.velFBO.read.tex);
            gl.uniform1i(this.pSplat.uniforms.uTarget, 0);
            this.blit(this.velFBO.write); this.velFBO.swap();
            
            // Dye splat
            gl.uniform3f(this.pSplat.uniforms.color, ...splatColor);
            gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.dyeFBO.read.tex);
            gl.uniform1i(this.pSplat.uniforms.uTarget, 0);
            this.blit(this.dyeFBO.write); this.dyeFBO.swap();
        }

        // Curl & Vorticity
        gl.useProgram(this.pCurl.prog);
        gl.uniform2f(this.pCurl.uniforms.texelSize, 1/SIM, 1/SIM);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.velFBO.read.tex);
        this.blit(this.crlFBO);

        gl.useProgram(this.pVorticity.prog);
        gl.uniform2f(this.pVorticity.uniforms.texelSize, 1/SIM, 1/SIM);
        gl.uniform1f(this.pVorticity.uniforms.curl, CONFIG.curl);
        gl.uniform1f(this.pVorticity.uniforms.dt, dt);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.velFBO.read.tex);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.crlFBO.tex);
        gl.uniform1i(this.pVorticity.uniforms.uVelocity, 0);
        gl.uniform1i(this.pVorticity.uniforms.uCurl, 1);
        this.blit(this.velFBO.write); this.velFBO.swap();

        // Advection
        gl.useProgram(this.pAdvect.prog);
        gl.uniform2f(this.pAdvect.uniforms.texelSize, 1/SIM, 1/SIM);
        gl.uniform1f(this.pAdvect.uniforms.dt, dt);
        gl.uniform1f(this.pAdvect.uniforms.dissipation, CONFIG.velocityDissipation);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.velFBO.read.tex);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.velFBO.read.tex);
        gl.uniform1i(this.pAdvect.uniforms.uVelocity, 0);
        gl.uniform1i(this.pAdvect.uniforms.uSource, 1);
        this.blit(this.velFBO.write); this.velFBO.swap();

        gl.uniform2f(this.pAdvect.uniforms.texelSize, 1/SIM, 1/SIM);
        gl.uniform1f(this.pAdvect.uniforms.dissipation, CONFIG.densityDissipation);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.velFBO.read.tex);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.dyeFBO.read.tex);
        gl.uniform1i(this.pAdvect.uniforms.uVelocity, 0);
        gl.uniform1i(this.pAdvect.uniforms.uSource, 1);
        this.blit(this.dyeFBO.write); this.dyeFBO.swap();

        // Pressure Solver
        gl.useProgram(this.pDivergence.prog);
        gl.uniform2f(this.pDivergence.uniforms.texelSize, 1/SIM, 1/SIM);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.velFBO.read.tex);
        this.blit(this.divFBO);

        gl.useProgram(this.pPressure.prog);
        gl.uniform2f(this.pPressure.uniforms.texelSize, 1/SIM, 1/SIM);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.divFBO.tex);
        gl.uniform1i(this.pPressure.uniforms.uDivergence, 0);
        for(let i=0; i<20; i++){
            gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.prsFBO.read.tex);
            gl.uniform1i(this.pPressure.uniforms.uPressure, 1);
            this.blit(this.prsFBO.write); this.prsFBO.swap();
        }

        gl.useProgram(this.pGradSub.prog);
        gl.uniform2f(this.pGradSub.uniforms.texelSize, 1/SIM, 1/SIM);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.prsFBO.read.tex);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.velFBO.read.tex);
        gl.uniform1i(this.pGradSub.uniforms.uPressure, 0);
        gl.uniform1i(this.pGradSub.uniforms.uVelocity, 1);
        this.blit(this.velFBO.write); this.velFBO.swap();
    }

    render() {
        const gl = this.gl, { width: W, height: H } = this.simCanvas;
        gl.useProgram(this.pDisplay.prog);
        gl.uniform2f(this.pDisplay.uniforms.texelSize, 1/W, 1/H);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.dyeFBO.read.tex);
        gl.uniform1i(this.pDisplay.uniforms.uTexture, 0);
        this.blit(null);

        if (this.options.drawText && this.fontsLoaded) {
            // Compositing: preenche o texto QA com o fluid
            const fs = H * 1.11, baselineY = this.qaBaselineY ?? H * 0.5 + fs * 0.35;
            this.ctx2D.clearRect(0, 0, W, H);
            this.ctx2D.globalCompositeOperation = 'source-over';
            this.ctx2D.fillStyle = '#000';
            this.ctx2D.font = `400 ${fs}px 'DM Serif Display', serif`;
            this.ctx2D.textAlign = 'center';
            this.ctx2D.textBaseline = 'alphabetic';
            this.ctx2D.fillText(this.options.text, W/2, baselineY);
            this.ctx2D.globalCompositeOperation = 'source-atop';
            this.ctx2D.drawImage(this.simCanvas, 0, 0);
        }
        // Modo direto: blit(null) já renderizou diretamente no canvas visível
    }
}
