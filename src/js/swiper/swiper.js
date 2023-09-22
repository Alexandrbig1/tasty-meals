import axios from 'axios';
import Swiper from 'swiper';
import 'swiper';
const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api';
const events = document.querySelector('.swiper-wrapper');
function renderEvents(data) {
  return data
    .map(
      ({
        cook: { imgWebpUrl, name: cook },
        topic: { name, area, previewWebpUrl, imgWebpUrl: imgDish },
      }) => `        
      
  <!-- Slides -->
  <div class="swiper-slide">
    <div class="slide-wrapper">
      <div class="block-cook">
        <img
          src="${imgWebpUrl}"
          alt="${cook}"
        />
      </div>
      <div class="block-dish">
        <img
          src="${previewWebpUrl}"
          alt="${name}"
        />
        <div class="block-dish-ellipse"></div>
        <h3 class="block-dish-descr">${name}</h3>
        <p class="block-dish-area">${area}</p>
      </div>
      <div class="block-dish-image">
        <img
          src="${imgDish}"
          alt="${name}"
        />
      </div>
    </div>
  </div>
  
  </div>
  `
    )
    .join('');
}
async function renderSlider() {
  const resp = await axios.get(`${BASE_URL}/events`);
  events.innerHTML = renderEvents(resp.data);
  const swiper = new Swiper('.slider-events', {
    // direction: 'horizontal',
    // loop: true,
    // mousewheel: true,
    // autoplay: true,
    // slidesPerView: 0.69,
    // spaceBetween: 8,
    // breakpoints: {
    //   768: {
    //     slidesPerView: 0.8,
    //     spaceBetween: 16,
    //   },
    //   1280: {
    //     slidesPerView: 0.8,
    //     spaceBetween: 16,
    //   },
    // },
    // pagination: {
    //   el: '.swiper-pagination',
    //   clickable: true,
    // },
  });
}
renderSlider();
