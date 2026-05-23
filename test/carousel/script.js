import { createCarousel } from '../../src/assets/components/carousel/carousel.js';

const { projects, categories, tags } = await fetch('../../src/data/projects.json').then(r => r.json());

function buildSlide(project) {
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
}

const items = projects.map(buildSlide);

createCarousel(document.getElementById('carousel-host'), { items, id: 'carousel1', type: 'cover' });
createCarousel(document.getElementById('carousel-host-slide'), { items: projects.map(buildSlide), id: 'carousel5', type: 'slide', dots: true });
createCarousel(document.getElementById('carousel-host-fade'), { items: projects.map(buildSlide), id: 'carousel2', type: 'fade' });
createCarousel(document.getElementById('carousel-host-dots'), { items: projects.map(buildSlide), id: 'carousel3', dots: true });
createCarousel(document.getElementById('carousel-host-dots-progressive'), { items: projects.map(buildSlide), id: 'carousel4', dots: true, dotsStyle: 'scroll' });
createCarousel(document.getElementById('carousel-host-autoplay'), { items: projects.map(buildSlide), id: 'carousel6', type: 'fade', autoplay: 2000 });
createCarousel(document.getElementById('carousel-host-loop'), { items: projects.map(buildSlide), id: 'carousel7', type: 'cover', loop: true, dots: true });
createCarousel(document.getElementById('carousel-host-counter'), { items: projects.map(buildSlide), id: 'carousel8', type: 'cover', counter: true });
createCarousel(document.getElementById('carousel-host-multi'), { items: projects.map(buildSlide), id: 'carousel9', type: 'slide', perView: 3, dots: true, className: 'is-multi' });
createCarousel(document.getElementById('carousel-host-multi2'), { items: projects.map(buildSlide), id: 'carousel10', type: 'slide', perView: 3, perGroup: 3, dots: true, className: 'is-multi' });
createCarousel(document.getElementById('carousel-host-multi3'), { items: projects.map(buildSlide), id: 'carousel11', type: 'slide', perView: 3, perGroup: 3, gap: 12, dots: true, className: 'is-multi' });
