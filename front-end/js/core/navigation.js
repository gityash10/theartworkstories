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

/*
 * Mobile menu: below 800px css/base/global.css hides the navigation links and
 * the account actions, and shows .menu-button — so that button has to open a
 * panel. Above the breakpoint the button is display:none and this is inert.
 */
const siteHeader = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = window.matchMedia('(max-width: 800px)');

const setMenuOpen = (open) => {
  if (!siteHeader || !menuButton) return;
  siteHeader.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};

menuButton?.addEventListener('click', () => {
  setMenuOpen(!siteHeader.classList.contains('is-open'));
});

/* Never leave the panel stuck open after a resize back to desktop. */
mobileMenu.addEventListener('change', (event) => { if (!event.matches) setMenuOpen(false); });

/* Following a link — in-page anchor or another page — closes the panel. */
document.querySelectorAll('.site-header a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !siteHeader?.classList.contains('is-open')) return;
  setMenuOpen(false);
  menuButton?.focus();
});