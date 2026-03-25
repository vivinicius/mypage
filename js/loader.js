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

    function dismiss() {
        video.classList.add('mini-signature');
        loader.classList.add('loaded');
        lockScroll(false);
    }

    video.addEventListener('ended', dismiss, { once: true });
    setTimeout(dismiss, 8000);
})();
