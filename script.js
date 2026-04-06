// Мобильное меню
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Lightbox для галереи
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const closeButton = lightbox?.querySelector('.lightbox-close');
const galleryImages = document.querySelectorAll('.gallery-grid img');

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  lightboxImage.alt = '';
}

galleryImages.forEach((image) => {
  image.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

closeButton?.addEventListener('click', closeLightbox);

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

// Текущий год в футере
const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
