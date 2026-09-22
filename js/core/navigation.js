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