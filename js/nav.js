// js/nav.js — Side navigation active state & smooth scroll

const items        = Array.from(document.querySelectorAll('.snav-item'));
const skillsSection = document.getElementById('skills-section');

function setActive(section) {
    items.forEach(item => item.classList.toggle('active', item.dataset.section === section));
}

function updateActive() {
    const scrollY = window.scrollY;
    const vh      = window.innerHeight;
    const skillsTop = skillsSection?.offsetTop ?? Infinity;

    if (scrollY >= skillsTop - vh * 0.5) {
        setActive('board');
    } else if (scrollY >= vh * 0.4) {
        setActive('about');
    } else {
        setActive('hero');
    }
}

items.forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        const vh  = window.innerHeight;
        let   top = 0;

        if (item.dataset.section === 'about') {
            top = vh * 1.4;
        } else if (item.dataset.section === 'board') {
            top = skillsSection?.offsetTop ?? 0;
        }

        window.scrollTo({ top, behavior: 'smooth' });
    });
});

window.addEventListener('scroll', updateActive, { passive: true });
updateActive();
