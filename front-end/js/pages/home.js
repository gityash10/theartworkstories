const floatingArt = [...document.querySelectorAll('[data-speed]')];
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  window.requestAnimationFrame(() => {
    const scroll = window.scrollY;
    floatingArt.forEach((element) => {
      const speed = Number(element.dataset.speed);
      element.style.translate = `0 ${scroll * speed}px`;
    });
    ticking = false;
  });
  ticking = true;
}, { passive: true });

window.setTimeout(() => document.body.classList.add('intro-complete'), 4300);
