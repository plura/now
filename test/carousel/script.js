import { createCarousel } from '../../src/assets/components/carousel/carousel.js';
import { el } from '../../src/assets/js/utils.js';

const { projects, categories, tags } = await fetch('../../src/data/projects.json').then(r => r.json());

function items() {
  return projects.map(project =>
    el('div', { class: 'plura-carousel-item' },
      el('span', { class: 'slide-category', text: categories[project.category] ?? project.category }),
      el('h2',   { class: 'slide-title',    text: project.title }),
      el('p',    { class: 'slide-desc',     text: project.summary ?? '' }),
      el('div',  { class: 'slide-tags' },
        ...project.tags.map(tag => el('span', { class: 'slide-tag', text: tags[tag] ?? tag }))
      )
    )
  );
}

const sizes = ['slide--sm', 'slide--md', 'slide--lg', 'slide--md', 'slide--sm', 'slide--lg', 'slide--md', 'slide--sm', 'slide--lg', 'slide--sm', 'slide--md', 'slide--lg'];

function itemsAuto() {
  return items().map((slide, i) => {
    slide.classList.add(sizes[i % sizes.length]);
    return slide;
  });
}

function itemsEmpty(count) { return Array.from({ length: count }, () => el('div')); }

function onEnter(index, slideEl) {
  if (slideEl.querySelector('.on-enter-content')) return;
  slideEl.appendChild(el('div', { class: 'on-enter-content', text: `Slide ${index + 1} — loaded on enter` }));
}

createCarousel(document.getElementById('carousel-host'),                  { items: items(), id: 'carousel1',  type: 'cover' });
createCarousel(document.getElementById('carousel-host-slide'),            { items: items(), id: 'carousel2',  type: 'slide', dots: true });
createCarousel(document.getElementById('carousel-host-fade'),             { items: items(), id: 'carousel3',  type: 'fade' });
createCarousel(document.getElementById('carousel-host-dots'),             { items: items(), id: 'carousel4',  dots: true });
createCarousel(document.getElementById('carousel-host-dots-progressive'), { items: items(), id: 'carousel5',  dots: true, dotsStyle: 'scroll' });
createCarousel(document.getElementById('carousel-host-autoplay'),         { items: items(), id: 'carousel6',  type: 'fade', autoplay: 2000 });
createCarousel(document.getElementById('carousel-host-loop'),             { items: items(), id: 'carousel7',  type: 'cover', loop: true, dots: true });
createCarousel(document.getElementById('carousel-host-counter'),          { items: items(), id: 'carousel8',  type: 'cover', counter: true });
createCarousel(document.getElementById('carousel-host-index'),            { items: items(),        id: 'carousel9',  type: 'slide', index: 10, dots: true });
createCarousel(document.getElementById('carousel-host-on-enter'),         { items: itemsEmpty(10), id: 'carousel10', type: 'cover', dots: true, on: { enter: onEnter } });
createCarousel(document.getElementById('carousel-host-multi'),            { items: items(),        id: 'carousel11', type: 'slide', perView: 3, dots: true, className: 'is-multi' });
createCarousel(document.getElementById('carousel-host-multi2'),           { items: items(),        id: 'carousel12', type: 'slide', perView: 3, perGroup: 3, dots: true, className: 'is-multi' });
createCarousel(document.getElementById('carousel-host-multi3'),           { items: items(),        id: 'carousel13', type: 'slide', perView: 3, perGroup: 3, gap: 30, dots: true, className: 'is-multi' });
createCarousel(document.getElementById('carousel-host-center'),           { items: items(),        id: 'carousel14', type: 'slide', perView: 3, center: true, gap: 30, dots: true, className: 'is-multi' });
createCarousel(document.getElementById('carousel-host-auto'),             { items: itemsAuto(),    id: 'carousel15', type: 'slide', perView: 'auto', gap: 16, dots: true, className: 'is-auto' });
createCarousel(document.getElementById('carousel-host-auto-center'),      { items: itemsAuto(),    id: 'carousel16', type: 'slide', perView: 'auto', center: true, gap: 16, dots: true, className: 'is-auto' });
