(function() {
    const loader = document.getElementById('loader');
    const video  = document.getElementById('sig-video');

    if (!loader || !video) return;

    video.playbackRate = 1.2;

    const lockScroll = (lock) => {
        const overflow = lock ? 'hidden' : '';
        const height = lock ? '100%' : '';
        document.body.style.overflow = overflow;
        document.documentElement.style.overflow = overflow;
        document.body.style.height = height;
        document.documentElement.style.height = height;
    };

    lockScroll(true);

    const canvas = document.createElement('canvas');
    canvas.id = 'sig-canvas';
    video.parentNode.insertBefore(canvas, video);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let rafId = null;
    let canvasReady = false;

    function initCanvas() {
        if (!canvasReady && video.videoWidth && video.videoHeight) {
            canvas.width  = Math.round(video.videoWidth  / 2);
            canvas.height = Math.round(video.videoHeight / 2);
            canvas.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
            canvasReady = true;
        }
    }

    function tick() {
        initCanvas();
        if (canvasReady && video.readyState >= 2) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            try {
                const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const d = img.data;
                for (let i = 0; i < d.length; i += 4) {
                    const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
                    if (lum > 230) {
                        // Hard cut: near-white → fully transparent
                        d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
                    } else if (lum > 130) {
                        // Transition zone: despill (darken RGB) + fade alpha
                        const scale = 1 - (lum - 130) / 100;
                        d[i]     = Math.round(d[i]     * scale);
                        d[i + 1] = Math.round(d[i + 1] * scale);
                        d[i + 2] = Math.round(d[i + 2] * scale);
                        d[i + 3] = Math.round(d[i + 3] * scale);
                    }
                }
                ctx.putImageData(img, 0, 0);
            } catch (e) { /* file:// CORS — skip pixel processing */ }
        }
        rafId = requestAnimationFrame(tick);
    }

    // Start immediately — don't wait for events
    tick();
    video.play().catch(() => {});

    function dismiss() {
        canvas.classList.add('mini-signature');
        loader.classList.add('loaded');
        lockScroll(false);
        setTimeout(() => { cancelAnimationFrame(rafId); rafId = null; }, 2000);
    }

    video.addEventListener('ended', dismiss, { once: true });
    setTimeout(dismiss, 8000);
})();
