const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const searchTrigger = document.querySelector('.search-button');
const navSearch = document.querySelector('.nav-search');
const searchInput = document.querySelector('#search-input');
const closeSearch = () => {
  navSearch.classList.remove('is-open');
  searchTrigger.setAttribute('aria-expanded', 'false');
  searchTrigger.setAttribute('aria-label', 'Open search');
};
searchTrigger?.addEventListener('click', () => {
  const isOpen = navSearch.classList.toggle('is-open');
  if (!isOpen) return closeSearch();
  searchTrigger.setAttribute('aria-expanded', 'true');
  searchTrigger.setAttribute('aria-label', 'Close search');
  searchInput.focus();
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && navSearch?.classList.contains('is-open')) closeSearch(); });

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

// Give the opening collage time to orbit and settle before revealing the story.
window.setTimeout(() => document.body.classList.add('intro-complete'), 4300);
