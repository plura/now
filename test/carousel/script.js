import { createCarousel } from '../../src/assets/components/carousel/carousel.js';

const { projects, categories, tags } = await fetch('../../src/data/projects.json').then(r => r.json());

function items() {
  return projects.map(project => {
    const slide = document.createElement('div');
    slide.className = 'slide';

    slide.innerHTML = `
      <span class="slide-category">${categories[project.category] ?? project.category}</span>
      <h2 class="slide-title">${project.title}</h2>
      <p class="slide-desc">${project.summary ?? ''}</p>
      <div class="slide-tags">
        ${project.tags.map(tag => `<span class="slide-tag">${tags[tag] ?? tag}</span>`).join('')}
      </div>
    `;

    return slide;
  });
}

const sizes = ['slide--sm', 'slide--md', 'slide--lg', 'slide--md', 'slide--sm', 'slide--lg', 'slide--md', 'slide--sm', 'slide--lg', 'slide--sm', 'slide--md', 'slide--lg'];

function itemsAuto() {
  return items().map((slide, i) => {
    slide.classList.add(sizes[i % sizes.length]);
    return slide;
  });
}

createCarousel(document.getElementById('carousel-host'),                  { items: items(), id: 'carousel1',  type: 'cover' });
createCarousel(document.getElementById('carousel-host-slide'),            { items: items(), id: 'carousel2',  type: 'slide', dots: true });
createCarousel(document.getElementById('carousel-host-fade'),             { items: items(), id: 'carousel3',  type: 'fade' });
createCarousel(document.getElementById('carousel-host-dots'),             { items: items(), id: 'carousel4',  dots: true });
createCarousel(document.getElementById('carousel-host-dots-progressive'), { items: items(), id: 'carousel5',  dots: true, dotsStyle: 'scroll' });
createCarousel(document.getElementById('carousel-host-autoplay'),         { items: items(), id: 'carousel6',  type: 'fade', autoplay: 2000 });
createCarousel(document.getElementById('carousel-host-loop'),             { items: items(), id: 'carousel7',  type: 'cover', loop: true, dots: true });
createCarousel(document.getElementById('carousel-host-counter'),          { items: items(), id: 'carousel8',  type: 'cover', counter: true });
createCarousel(document.getElementById('carousel-host-index'),            { items: items(), id: 'carousel9',  type: 'slide', index: 10, dots: true });
createCarousel(document.getElementById('carousel-host-multi'),            { items: items(), id: 'carousel10', type: 'slide', perView: 3, dots: true, className: 'is-multi' });
createCarousel(document.getElementById('carousel-host-multi2'),           { items: items(), id: 'carousel11', type: 'slide', perView: 3, perGroup: 3, dots: true, className: 'is-multi' });
createCarousel(document.getElementById('carousel-host-multi3'),           { items: items(), id: 'carousel12', type: 'slide', perView: 3, perGroup: 3, gap: 30, dots: true, className: 'is-multi' });
createCarousel(document.getElementById('carousel-host-center'),           { items: items(),     id: 'carousel13', type: 'slide', perView: 3, center: true, gap: 30, dots: true, className: 'is-multi' });
createCarousel(document.getElementById('carousel-host-auto'),             { items: itemsAuto(), id: 'carousel14', type: 'slide', perView: 'auto', gap: 16, dots: true, className: 'is-auto' });
createCarousel(document.getElementById('carousel-host-auto-center'),      { items: itemsAuto(), id: 'carousel15', type: 'slide', perView: 'auto', center: true, gap: 16, dots: true, className: 'is-auto' });
