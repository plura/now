import { createLightbox } from '../../src/assets/components/lightbox/lightbox.js';
import { el } from '../../src/assets/js/utils.js';

const images = [
  '../media/Desktop _ Laptop.png',
  '../media/iPad.png',
  '../media/Mockup.png',
  '../media/Smartphone.png',
];

// ── Open by index ──────────────────────────────────────────────────

const lb1 = createLightbox(images, 0, {
  onClose: i => console.log('closed at index', i),
});

const buttonsItems = document.querySelector('#lightbox-buttons .lightbox-items');
images.forEach((_, i) => {
  const btn = el('button', { class: 'trigger-btn', text: `Open image ${i + 1}` });
  btn.addEventListener('click', () => lb1.open(i));
  buttonsItems.appendChild(btn);
});

// ── With arrows + counter ─────────────────────────────────────────

const lb3 = createLightbox(images, 0, {
  arrows:  true,
  counter: true,
  onClose: i => console.log('closed at index', i),
});

const optionsItems = el('div', { class: 'lightbox-items' });
document.getElementById('lightbox-options').appendChild(optionsItems);

images.forEach((_, i) => {
  const btn = el('button', { class: 'trigger-btn', text: `Open image ${i + 1}` });
  btn.addEventListener('click', () => lb3.open(i));
  optionsItems.appendChild(btn);
});

// ── Embedded images ────────────────────────────────────────────────

const embedItems = document.querySelector('#lightbox-embedded .lightbox-items');
const embedImgs  = Array.from(embedItems.querySelectorAll('img'));

const lb2 = createLightbox(embedImgs.map(img => img.src), 0, {
  onClose: i => console.log('closed at index', i),
});

embedImgs.forEach((img, i) => img.addEventListener('click', () => lb2.open(i)));
