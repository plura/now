import { createGallery } from '../../src/assets/shared/components/gallery/gallery.js';

const mediaImages = await fetch('../media/images.json').then(r => r.json());
const images = mediaImages.map(name => `../media/${name}`);

// ── Basic ──────────────────────────────────────────────────────────

createGallery(document.getElementById('gallery-basic'), images, 'carousel');

// ── With arrows ────────────────────────────────────────────────────

createGallery(document.getElementById('gallery-arrows'), images, 'carousel', {
  carousel: { arrows: true },
});

// ── Lightbox counter + indicators ─────────────────────────────────

createGallery(document.getElementById('gallery-counter'), images, 'carousel', {
  lightbox: { counter: true, indicators: true },
});
