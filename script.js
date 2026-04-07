// ===============================
// HERO PARTICLE ANIMATION
// ===============================
// ЗАМЕНА ПУТИ К ИЗОБРАЖЕНИЮ HERO:
// Просто положите новый файл в assets/images и поменяйте путь ниже при необходимости.
const HERO_IMAGE_PATH = 'assets/images/hero-reference.jpg';

// Если нужен отдельный графический элемент времени, подключайте assets/images/time-reference.jpg в HTML/CSS.
const TIME_IMAGE_PATH = 'assets/images/time-reference.jpg';

(() => {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const img = new Image();

  let particles = [];
  const pointer = { x: -9999, y: -9999, active: false };
  let rafId = null;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const particleGap = isMobile ? 8 : 5;
  const repelRadius = isMobile ? 46 : 72;
  const repelForce = isMobile ? 0.62 : 0.92;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Если изображение не загружено, создаём fallback форму.
    if (img.complete && img.naturalWidth) {
      createParticlesFromImage();
    } else {
      createFallbackParticles();
    }
  }

  function createParticlesFromImage() {
    const off = document.createElement('canvas');
    const offCtx = off.getContext('2d');

    const maxW = canvas.width * (isMobile ? 0.78 : 0.52);
    const scale = Math.min(maxW / img.naturalWidth, canvas.height * 0.68 / img.naturalHeight);
    const w = Math.floor(img.naturalWidth * scale);
    const h = Math.floor(img.naturalHeight * scale);

    off.width = w;
    off.height = h;
    offCtx.drawImage(img, 0, 0, w, h);

    const data = offCtx.getImageData(0, 0, w, h).data;
    particles = [];

    const offsetX = (canvas.width - w) / 2;
    const offsetY = (canvas.height - h) / 2;

    for (let y = 0; y < h; y += particleGap) {
      for (let x = 0; x < w; x += particleGap) {
        const idx = (y * w + x) * 4;
        const alpha = data[idx + 3];
        if (alpha > 120) {
          const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          particles.push({
            x: offsetX + x + (Math.random() - 0.5) * 2,
            y: offsetY + y + (Math.random() - 0.5) * 2,
            tx: offsetX + x,
            ty: offsetY + y,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.4 + 0.3,
            shade: 160 + Math.floor((brightness / 255) * 90),
          });
        }
      }
    }
  }

  function createFallbackParticles() {
    // Абстрактная спокойная форма (эллипс + тонкий вертикальный акцент), если hero-reference.jpg отсутствует.
    particles = [];

    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.5;
    const rx = canvas.width * (isMobile ? 0.2 : 0.16);
    const ry = canvas.height * (isMobile ? 0.19 : 0.22);
    const vertical = canvas.height * 0.24;

    for (let y = -ry; y <= ry; y += particleGap) {
      for (let x = -rx; x <= rx; x += particleGap) {
        const ellipse = (x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1;
        const stem = Math.abs(x) < particleGap * 1.2 && y < vertical && y > -vertical;

        if (ellipse || stem) {
          const tx = centerX + x;
          const ty = centerY + y;
          particles.push({
            x: tx + (Math.random() - 0.5) * 10,
            y: ty + (Math.random() - 0.5) * 10,
            tx,
            ty,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.4 + 0.35,
            shade: 172 + Math.floor(Math.random() * 50),
          });
        }
      }
    }
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      const dx = p.tx - p.x;
      const dy = p.ty - p.y;

      p.vx += dx * 0.018;
      p.vy += dy * 0.018;

      const mx = p.x - pointer.x;
      const my = p.y - pointer.y;
      const dist = Math.hypot(mx, my);
      if (pointer.active && dist < repelRadius) {
        const force = (1 - dist / repelRadius) * repelForce;
        const angle = Math.atan2(my, mx);
        p.vx += Math.cos(angle) * force;
        p.vy += Math.sin(angle) * force;
      }

      p.vx *= 0.92;
      p.vy *= 0.92;
      p.x += p.vx;
      p.y += p.vy;

      ctx.fillStyle = `rgba(${p.shade}, ${p.shade}, ${p.shade}, 0.72)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(update);
  }

  // Пробуем загрузить изображение; если файла нет, остаёмся на fallback-форме.
  img.onload = () => {
    createParticlesFromImage();
  };
  img.onerror = () => {
    createFallbackParticles();
  };
  img.src = HERO_IMAGE_PATH;

  resize();
  if (rafId) cancelAnimationFrame(rafId);
  update();

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  });
  window.addEventListener('mouseleave', () => {
    pointer.active = false;
    pointer.x = -9999;
    pointer.y = -9999;
  });
  window.addEventListener(
    'touchmove',
    (e) => {
      if (!e.touches[0]) return;
      pointer.x = e.touches[0].clientX;
      pointer.y = e.touches[0].clientY;
      pointer.active = true;
    },
    { passive: true }
  );
  window.addEventListener('touchend', () => {
    pointer.active = false;
  });
})();

// ===============================
// GALLERY LIGHTBOX
// ===============================
(() => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const items = document.querySelectorAll('.gallery-item');

  if (!lightbox || !lightboxImage || !closeBtn) return;

  const open = (src, caption) => {
    lightboxImage.src = src;
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.style.overflow = '';
  };

  items.forEach((item) => {
    const image = item.querySelector('img');
    image?.addEventListener('error', () => {
      // Если gallery-файлы не добавлены, оставляем рабочий аккуратный placeholder.
      item.classList.add('gallery-item--placeholder');
      image.alt = 'Плейсхолдер: добавьте изображение в assets/images';
    });

    item.addEventListener('click', () => {
      if (item.classList.contains('gallery-item--placeholder')) return;
      open(item.dataset.image, item.dataset.caption);
    });
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

document.getElementById('year').textContent = new Date().getFullYear();

document.querySelector('.contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  if (!btn) return;
  const original = btn.textContent;
  btn.textContent = 'Спасибо, сообщение отправлено';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    e.target.reset();
  }, 2200);
});
