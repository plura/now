import { initMasonry } from '../../src/assets/shared/behaviors/masonry.js';

const ratios = ['r-1-1', 'r-4-3', 'r-3-4', 'r-16-9'];
const COUNT  = 18;

document.querySelectorAll('.plura-masonry').forEach(container => {
  for (let i = 0; i < COUNT; i++) {
    const r = ratios[Math.floor(Math.random() * ratios.length)];
    const item = document.createElement('div');
    item.className = `item ${r}`;
    item.textContent = i + 1;
    container.appendChild(item);
  }
  // gap comes from --plura-masonry-gap in CSS; ResizeObserver handles width changes.
  initMasonry(container, {
    selector: '.item',
    columns:  Number(container.dataset.cols),
  });
});
