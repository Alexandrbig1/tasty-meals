import axios from 'axios';
import debounce from 'lodash.debounce';

import Pagination from 'tui-pagination';
// import 'tui-pagination/dist/tui-pagination.css';

import { onSeeRecipeBtnClick } from './modal-recipe';

const btnEl = document.getElementById('btn'),
  divEl = document.getElementById('main-img-menu'),
  ratingEl = document.querySelector('.main-rating-span'),
  searchInput = document.querySelector('.main-search-input'),
  resetBtnEl = document.querySelector('.main-reset-btn'),
  timeEl = document.querySelector('.time-span'),
  areaFieldEl = document.querySelector('.area-span'),
  ingredientsFieldEl = document.querySelector('.ingredients-span'),
  wrapper = document.querySelector('.time-wrapper'),
  areaWrapper = document.querySelector('.main-area-wrap'),
  ingredientsWrapper = document.querySelector('.main-ingredients-wrap'),
  selectBtn = document.querySelector('.select-btn'),
  mainAreaBtn = document.querySelector('.main-area-wrapper'),
  mainIngredientsBtn = document.querySelector('.main-ingredients-wrapper'),
  selectedIconEl = document.querySelector('.selected-icon'),
  selectedAreaIconEl = document.querySelector('.selected-area-icon'),
  selectedIngredientsIconEl = document.querySelector(
    '.selected-ingredients-icon'
  ),
  timeOptionsEl = document.querySelector('.time-options'),
  areaOptionsEl = document.querySelector('.area-options'),
  ingredientsOptionsEl = document.querySelector('.ingredients-options'),
  mainHeartBtn = document.querySelector('.main-heart'),
  mainPagDotsEl = document.querySelector('.main-pagination'),
  mainNumberPagDotsEl = document.querySelectorAll(
    '.main-pagination-btn-numbers'
  ),
  mainPagBtnEl = document.querySelector('.main-pagination-btn'),
  startBtn = document.querySelector('#startBtn'),
  endBtn = document.querySelector('#endBtn'),
  prevNext = document.querySelectorAll('.prevNext'),
  numbers = document.querySelectorAll('.pag-link'),
  loaderEl = document.querySelector('.loader');

const favorites = [];

let ratingStar = 0;

// FUNCTION TO GIVE A LIMIT OF MEALS
function setLimitMeals() {
  let limit = 0;
  if (window.innerWidth < 768) {
    limit = 6;
    return limit;
  } else if (window.innerWidth < 1280) {
    limit = 8;
    return limit;
  } else {
    limit = 9;
    return limit;
  }
}

// LOADER

// function showLoader() {
//   loaderEl.style.display = 'block';
// }

// function hideLoader() {
//   loaderEl.style.display = 'none';
// }

getRandomMeal();

async function getRandomMeal() {
  const limit = setLimitMeals();
  divEl.innerHTML = '';
  // showLoader();

  const response = await fetch(
    `https://tasty-treats-backend.p.goit.global/api/recipes?page=1&limit=${limit}`
  );
  const data = await response.json();

  // console.log(res);

  const dataRecipes = data.results;
  addMealToSearchArea(dataRecipes);
  addMealToDOM(dataRecipes);
  addTimeToField(dataRecipes);
  // addAreaToField(dataRecipes);
  // addIngredientsToField(dataRecipes);

  // hideLoader();
}

function addMealToSearchArea(recipes) {
  timeEl.innerText = 'Select';
  areaFieldEl.innerText = 'Select';
  ingredientsFieldEl.innerText = 'Select';
}

// FUNCTION TO CONVERT NUMBERS TO AN INTEGER
function formatNumber(number) {
  if (number % 1 === 0) {
    return Math.floor(number);
  } else {
    return number;
  }
}

// ADD MEAL TO DOM
function addMealToDOM(recipes) {
  const markup = recipes
    .map(item => {
      const { description, rating, thumb, title, _id: id } = item;
      ratingStar = formatNumber(rating.toFixed(1));
      // showLoader();

      return `
      <li class="main-img-items">
                  <img class="main-img-img" src="${thumb}" alt="${title}" />
                  <div class="main-heart">
                    <button type="button" id="${id}" class="main-heart-btn">
  <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" >
  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M10.9939 4.70783C9.16115 2.5652 6.10493 1.98884 3.80863 3.95085C1.51234 5.91285 1.18905 9.19323 2.99234 11.5137C4.49166 13.443 9.02912 17.5121 10.5163 18.8291C10.6826 18.9764 10.7658 19.0501 10.8629 19.0791C10.9475 19.1043 11.0402 19.1043 11.1249 19.0791C11.2219 19.0501 11.3051 18.9764 11.4715 18.8291C12.9586 17.5121 17.4961 13.443 18.9954 11.5137C20.7987 9.19323 20.5149 5.89221 18.1791 3.95085C15.8434 2.00948 12.8266 2.5652 10.9939 4.70783Z" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</button>
                  </div>
                  <div class="main-img-text-wrap">
                    <h3 class="main-img-title">${title}</h3>
                    <p class="main-img-text">
                      ${description}
                    </p>
                    <div class="main-img-subtext-wrap">
                      <div class="main-rating-wrap">
                        <span class="main-rating-span">${ratingStar}</span>
                        <svg class="${
                          ratingStar >= 1 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 2 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 3 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 4 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 5 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>

                      </div>
                      <button id="${id}" class="main-rating-btn">See recipe</button>
                    </div>
                  </div>
                </li>
    `;
    })
    .join('');
  // hideLoader();

  divEl.insertAdjacentHTML('beforeend', markup);
}

divEl.addEventListener('click', e => {
  if (e.target.nodeName !== 'BUTTON') {
    return;
  }
  const btnHeart = e.target;
  btnHeart.classList.toggle('main-heart-btn-favorite');
  const heartId = e.target.id;
  localStorage.setItem('favorites', JSON.stringify(heartId));
});

// SELECTION === TIME / AREA / INGREDIENTS

// Add time to field
function addTimeToField(recipes) {
  let unit = [];
  let uniqueChar = recipes
    .map(({ time }) => {
      if (!unit.includes(time)) {
        unit.push(time);
      }
    })
    .join('');

  const markUp = unit
    .sort((a, b) => {
      return a - b;
    })
    .map(time => {
      if (time === '') {
        return;
      }
      return `<li class="time-select-hover">${time} min</li>`;
    })
    .join('');

  timeOptionsEl.insertAdjacentHTML('beforeend', markUp);
}

timeOptionsEl.addEventListener('click', e => {
  const timeText = e.target.innerText;
  if (e.target.nodeName !== 'LI') {
    return;
  }
  const timeNumber = timeText.split('').slice(0, 3).join('').trim();
  updateTime(timeText);
  getMealByTime(timeNumber);
});

// Function to update time field
function updateTime(selectedLi) {
  wrapper.classList.remove('active');

  selectBtn.firstElementChild.innerText = selectedLi;
  selectedIconEl.classList.remove('open-selected-menu');
}
// Add event to time field
selectBtn.addEventListener('click', () => {
  wrapper.classList.toggle('active');
  selectedIconEl.classList.toggle('open-selected-menu');
});

// Function to markup by choosing time
function getMealByTime(time) {
  const limit = setLimitMeals();
  fetch(
    `https://tasty-treats-backend.p.goit.global/api/recipes?page=1&limit=${limit}&time=${time}`
  )
    .then(res => res.json())
    .then(data => {
      const dataRecipes = data.results
        .map(item => {
          const { description, rating, thumb, title, _id: id } = item;
          ratingStar = formatNumber(rating.toFixed(1));

          return `
      <li class="main-img-items">
                  <img class="main-img-img" src="${thumb}" alt="${title}" />
                  <div class="main-heart">
                    <button type="button" id="${id}" class="main-heart-btn">
  <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" >
  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M10.9939 4.70783C9.16115 2.5652 6.10493 1.98884 3.80863 3.95085C1.51234 5.91285 1.18905 9.19323 2.99234 11.5137C4.49166 13.443 9.02912 17.5121 10.5163 18.8291C10.6826 18.9764 10.7658 19.0501 10.8629 19.0791C10.9475 19.1043 11.0402 19.1043 11.1249 19.0791C11.2219 19.0501 11.3051 18.9764 11.4715 18.8291C12.9586 17.5121 17.4961 13.443 18.9954 11.5137C20.7987 9.19323 20.5149 5.89221 18.1791 3.95085C15.8434 2.00948 12.8266 2.5652 10.9939 4.70783Z" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</button>
                  </div>
                  <div class="main-img-text-wrap">
                    <h3 class="main-img-title">${title}</h3>
                    <p class="main-img-text">
                      ${description}
                    </p>
                    <div class="main-img-subtext-wrap">
                      <div class="main-rating-wrap">
                        <span class="main-rating-span">${ratingStar}</span>
                        <svg class="${
                          ratingStar >= 1 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 2 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 3 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 4 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 5 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>

                      </div>
                      <button id="${id}" class="main-rating-btn">See recipe</button>
                    </div>
                  </div>
                </li>
    `;
        })
        .join('');

      divEl.innerHTML = dataRecipes;
    });
}

// AREA
getSelectedArea();
// Get area from api
async function getSelectedArea() {
  const res = await fetch(
    'https://tasty-treats-backend.p.goit.global/api/areas'
  );
  const data = await res.json();

  addSelectedArea(data);
}

// create markup for area
function addSelectedArea(area) {
  area.map(({ name, _id: id }) => {
    let li = `<li id="${id}" class="time-select-hover">${name}</li>`;
    areaOptionsEl.insertAdjacentHTML('beforeend', li);
  });
}

areaOptionsEl.addEventListener('click', e => {
  if (e.target.nodeName !== 'LI') {
    return;
  }
  const areaText = e.target.innerText;

  if (areaText === 'Unknown') {
    return;
  }
  updateArea(areaText);
  getMealByArea(areaText);
});

function updateArea(selectedLi) {
  areaWrapper.classList.remove('active');

  mainAreaBtn.firstElementChild.innerText = selectedLi;
  selectedAreaIconEl.classList.remove('open-selected-menu');
}
// Add event to area field
mainAreaBtn.addEventListener('click', () => {
  areaWrapper.classList.toggle('active');
  selectedAreaIconEl.classList.toggle('open-selected-menu');
});

// Function to get meal DOM by AREA
function getMealByArea(area) {
  const limit = setLimitMeals();

  fetch(
    `https://tasty-treats-backend.p.goit.global/api/recipes?page=1&limit=${limit}&area=${area}`
  )
    .then(res => res.json())
    .then(data => {
      const dataRecipes = data.results
        .map(item => {
          const { description, rating, thumb, title, _id: id } = item;
          ratingStar = formatNumber(rating.toFixed(1));

          return `
      <li class="main-img-items">
                  <img class="main-img-img" src="${thumb}" alt="${title}" />
                  <div class="main-heart">
                    <button type="button" id="${id}" class="main-heart-btn">
  <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" >
  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M10.9939 4.70783C9.16115 2.5652 6.10493 1.98884 3.80863 3.95085C1.51234 5.91285 1.18905 9.19323 2.99234 11.5137C4.49166 13.443 9.02912 17.5121 10.5163 18.8291C10.6826 18.9764 10.7658 19.0501 10.8629 19.0791C10.9475 19.1043 11.0402 19.1043 11.1249 19.0791C11.2219 19.0501 11.3051 18.9764 11.4715 18.8291C12.9586 17.5121 17.4961 13.443 18.9954 11.5137C20.7987 9.19323 20.5149 5.89221 18.1791 3.95085C15.8434 2.00948 12.8266 2.5652 10.9939 4.70783Z" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</button>
                  </div>
                  <div class="main-img-text-wrap">
                    <h3 class="main-img-title">${title}</h3>
                    <p class="main-img-text">
                      ${description}
                    </p>
                    <div class="main-img-subtext-wrap">
                      <div class="main-rating-wrap">
                        <span class="main-rating-span">${ratingStar}</span>
                        <svg class="${
                          ratingStar >= 1 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 2 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 3 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 4 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 5 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>

                      </div>
                      <button id="${id}" class="main-rating-btn">See recipe</button>
                    </div>
                  </div>
                </li>
    `;
        })
        .join('');

      divEl.innerHTML = dataRecipes;
    });
}

// INGREDIENTS
// Get Ingredients from api
getSelectedIngredients();
// Get area from api
async function getSelectedIngredients() {
  const res = await fetch(
    'https://tasty-treats-backend.p.goit.global/api/ingredients'
  );
  const data = await res.json();

  addIngredientsToField(data);
}

let IngredientsId = '';
// create markup for area
function addIngredientsToField(ingr) {
  ingr.map(({ name, _id: id }) => {
    let li = `<li id="${id}" class="time-select-hover">${name}</li>`;
    ingredientsOptionsEl.insertAdjacentHTML('beforeend', li);
  });
}

ingredientsOptionsEl.addEventListener('click', e => {
  if (e.target.nodeName !== 'LI') {
    return;
  }

  const ingredients = e.target.innerText;
  const ingredientsId = e.target.id;
  updateIngredients(ingredients);
  getMealByIngredients(ingredientsId);
});

// Function to update ingredients field
function updateIngredients(selectedLi) {
  ingredientsWrapper.classList.remove('active');

  mainIngredientsBtn.firstElementChild.innerText = selectedLi;
  selectedIngredientsIconEl.classList.remove('open-selected-menu');
}

// Add event to ingredients field
mainIngredientsBtn.addEventListener('click', () => {
  ingredientsWrapper.classList.toggle('active');
  selectedIngredientsIconEl.classList.toggle('open-selected-menu');
});

// Function to get meal to DOM by INGREDIENT
function getMealByIngredients(ingr) {
  const limit = setLimitMeals();

  fetch(
    `https://tasty-treats-backend.p.goit.global/api/recipes?page=1&limit=${limit}&ingredient=${ingr}`
  )
    .then(res => res.json())
    .then(data => {
      const dataRecipes = data.results
        .map(item => {
          const { description, rating, thumb, title, _id: id } = item;
          ratingStar = formatNumber(rating.toFixed(1));

          return `
      <li class="main-img-items">
                  <img class="main-img-img" src="${thumb}" alt="${title}" />
                  <div class="main-heart">
                    <button type="button" id="${id}" class="main-heart-btn">
  <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" >
  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M10.9939 4.70783C9.16115 2.5652 6.10493 1.98884 3.80863 3.95085C1.51234 5.91285 1.18905 9.19323 2.99234 11.5137C4.49166 13.443 9.02912 17.5121 10.5163 18.8291C10.6826 18.9764 10.7658 19.0501 10.8629 19.0791C10.9475 19.1043 11.0402 19.1043 11.1249 19.0791C11.2219 19.0501 11.3051 18.9764 11.4715 18.8291C12.9586 17.5121 17.4961 13.443 18.9954 11.5137C20.7987 9.19323 20.5149 5.89221 18.1791 3.95085C15.8434 2.00948 12.8266 2.5652 10.9939 4.70783Z" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</button>
                  </div>
                  <div class="main-img-text-wrap">
                    <h3 class="main-img-title">${title}</h3>
                    <p class="main-img-text">
                      ${description}
                    </p>
                    <div class="main-img-subtext-wrap">
                      <div class="main-rating-wrap">
                        <span class="main-rating-span">${ratingStar}</span>
                        <svg class="${
                          ratingStar >= 1 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 2 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 3 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 4 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 5 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>

                      </div>
                      <button id="${id}" class="main-rating-btn">See recipe</button>
                    </div>
                  </div>
                </li>
    `;
        })
        .join('');

      divEl.innerHTML = dataRecipes;
    });
}

// FUNCTION TO CAPITALIZE FIRST LETTER OF STRING
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// SEARCH INPUT

searchInput.addEventListener('input', debounce(searchInputHandler, 300));

// SEARCH INPUT FETCH
function searchInputHandler() {
  const valueOnSearchEl = searchInput.value;
  const searchTextToLowerCase = valueOnSearchEl.toLowerCase().trim();
  // const mealsName = capitalizeFirstLetter(searchTextToLowerCase);
  const mealsName = searchTextToLowerCase;
  const limit = setLimitMeals();

  // Check for empty
  if (mealsName) {
    fetch(
      `https://tasty-treats-backend.p.goit.global/api/recipes?limit=${limit}`
    )
      .then(res => res.json())
      .then(data => {
        const searchCategory = data.results
          .map(item => {
            const { description, rating, thumb, title, _id: id } = item;
            ratingStar = formatNumber(rating.toFixed(1));

            const mealsToLowerCase = title.toLowerCase();
            const lol = mealsToLowerCase.includes(mealsName);
            if (!lol) {
              return;
            }

            return `
      <li class="main-img-items">
                  <img class="main-img-img" src="${thumb}" alt="${title}" />
                  <div class="main-heart">
                    <button type="button" id="${id}" class="main-heart-btn">
  <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" >
  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M10.9939 4.70783C9.16115 2.5652 6.10493 1.98884 3.80863 3.95085C1.51234 5.91285 1.18905 9.19323 2.99234 11.5137C4.49166 13.443 9.02912 17.5121 10.5163 18.8291C10.6826 18.9764 10.7658 19.0501 10.8629 19.0791C10.9475 19.1043 11.0402 19.1043 11.1249 19.0791C11.2219 19.0501 11.3051 18.9764 11.4715 18.8291C12.9586 17.5121 17.4961 13.443 18.9954 11.5137C20.7987 9.19323 20.5149 5.89221 18.1791 3.95085C15.8434 2.00948 12.8266 2.5652 10.9939 4.70783Z" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</button>
                  </div>
                  <div class="main-img-text-wrap">
                    <h3 class="main-img-title">${title}</h3>
                    <p class="main-img-text">
                      ${description}
                    </p>
                    <div class="main-img-subtext-wrap">
                      <div class="main-rating-wrap">
                        <span class="main-rating-span">${ratingStar}</span>
                        <svg class="${
                          ratingStar >= 1 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 2 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 3 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 4 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 5 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>

                      </div>
                      <button id="${id}" class="main-rating-btn">See recipe</button>
                    </div>
                  </div>
                </li>
    `;
          })
          .join('');
        // console.log(searchCategory);
        // if (searchCategory === '') {
        //   return alert(
        //     'We don`t found any food by your categories. Choose another one.'
        //   );
        // }
        divEl.innerHTML = searchCategory;
      });
  }

  // searchInput.value = '';
}

// RESET BUTTON
resetBtnEl.addEventListener('click', resetFilterHandler);

function resetFilterHandler() {
  getRandomMeal();
}

//
//

//

//

// Get Meal for pagination request
function getMealPagination(page) {
  const limit = setLimitMeals();
  fetch(
    `https://tasty-treats-backend.p.goit.global/api/recipes?page=${page}&limit=${limit}`
  )
    .then(res => res.json())
    .then(data => {
      const dataRecipes = data.results;

      paginationBtnHandler(dataRecipes);
    });
}

// MarkUp on pagination
function paginationBtnHandler(recipes) {
  const markup = recipes
    .map(item => {
      const { description, rating, thumb, title, _id: id } = item;
      ratingStar = formatNumber(rating.toFixed(1));

      return `
      <li class="main-img-items">
                  <img class="main-img-img" src="${thumb}" alt="${title}" />
                  <div class="main-heart">
                    <button type="button" id="${id}" class="main-heart-btn">
  <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" >
  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M10.9939 4.70783C9.16115 2.5652 6.10493 1.98884 3.80863 3.95085C1.51234 5.91285 1.18905 9.19323 2.99234 11.5137C4.49166 13.443 9.02912 17.5121 10.5163 18.8291C10.6826 18.9764 10.7658 19.0501 10.8629 19.0791C10.9475 19.1043 11.0402 19.1043 11.1249 19.0791C11.2219 19.0501 11.3051 18.9764 11.4715 18.8291C12.9586 17.5121 17.4961 13.443 18.9954 11.5137C20.7987 9.19323 20.5149 5.89221 18.1791 3.95085C15.8434 2.00948 12.8266 2.5652 10.9939 4.70783Z" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</button>
                  </div>
                  <div class="main-img-text-wrap">
                    <h3 class="main-img-title">${title}</h3>
                    <p class="main-img-text">
                      ${description}
                    </p>
                    <div class="main-img-subtext-wrap">
                      <div class="main-rating-wrap">
                        <span class="main-rating-span">${ratingStar}</span>
                        <svg class="${
                          ratingStar >= 1 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 2 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 3 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 4 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>
                        <svg class="${
                          ratingStar >= 5 ? 'rating-star-fill' : 'rating-star'
                        }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12">
  <path d="M5.04894 1.42705C5.3483 0.505738 6.6517 0.50574 6.95106 1.42705L7.5716 3.33688C7.70547 3.7489 8.08943 4.02786 8.52265 4.02786H10.5308C11.4995 4.02786 11.9023 5.26748 11.1186 5.83688L9.49395 7.01722C9.14347 7.27187 8.99681 7.72323 9.13068 8.13525L9.75122 10.0451C10.0506 10.9664 8.9961 11.7325 8.21238 11.1631L6.58778 9.98278C6.2373 9.72813 5.7627 9.72814 5.41221 9.98278L3.78761 11.1631C3.0039 11.7325 1.94942 10.9664 2.24878 10.0451L2.86932 8.13526C3.00319 7.72323 2.85653 7.27186 2.50604 7.01722L0.881445 5.83688C0.0977311 5.26748 0.500508 4.02786 1.46923 4.02786H3.47735C3.91057 4.02786 4.29453 3.7489 4.4284 3.33688L5.04894 1.42705Z"/>
</svg>

                      </div>
                      <button id="${id}" class="main-rating-btn">See recipe</button>
                    </div>
                  </div>
                </li>
    `;
    })
    .join('');
  divEl.innerHTML = '';

  divEl.insertAdjacentHTML('beforeend', markup);
}

// ADD EVENT FOR HEART ICON FOR FAVORITES
divEl.addEventListener('click', onSeeRecipeBtnClick);

// PAGINATION
const options = {
  totalItems: 32,
  itemsPerPage: 1,
  visiblePages: window.innerWidth < 768 ? 2 : 3,
  page: 1,
  currentPage: 1,
  centerAlign: false,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<a href="#" class="tui-page-btn">{{page}}</a>',
    currentPage:
      '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" class="tui-page-btn tui-{{type}}">' +
      '<span class="tui-ico-{{type}}"></span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}"></span>' +
      '</span>',
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>',
  },
};

const pagination = new Pagination('pagination', options);
pagination.on('beforeMove', onBeforeMovePagination);

function onBeforeMovePagination(p) {
  const { page } = p;
  getMealPagination(page);
}
