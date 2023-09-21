import { createButtons, addMealToDOM } from './markup/common';

const KEY = 'favourite-items';
const allButton = document.querySelector('.hero-favorite-buttons');
const btnAllCategories = document.querySelector(
  '.js-hero-favorite-all-categories-listener'
);
const data = JSON.parse(localStorage.getItem(KEY)) ?? [];
const list = document.querySelector('.hero-favorite-cards');
const textFavoritesWrapper = document.querySelector(
  '.hero-favorites-content-wrapper'
);

allButton.addEventListener('click', handlerClick);
btnAllCategories.addEventListener('click', handlerResetCategories);

if (data.length) {
  console.log(data);

  // за допомогою меп створюю масив з категорій, а потім фільтром беру унікальні значення
  const filterArray = data
    .map(recipe => recipe.category)
    .filter((el, idx, arr) => arr.indexOf(el) === idx);
  console.log(filterArray);

  const markup = createButtons(filterArray);
  console.log(markup);
  allButton.innerHTML = markup;
  list.innerHTML = addMealToDOM(data);
  textFavoritesWrapper.classList.add('visually-hidden');
}

function handlerClick(evt) {
  // перевірка, чи активною є кнопка
  if (!evt.target.classList.contains('js-select-category')) {
    return;
  }

  // якщо кнопка є не активною, то прибираємо клас з активної кнопки і ставимо на поточну
  const btnSelectCtg = document.querySelectorAll('.js-select-category');
  btnSelectCtg.forEach(button => {
    if (button.classList.contains('hero-favorite-btn-active')) {
      button.classList.remove('hero-favorite-btn-active');
    }
  });
  evt.target.classList.add('hero-favorite-btn-active');
  btnAllCategories.classList.remove('hero-favorite-btn-active');

  // фільтрація за категорією поточної кнопки і відмальовка
  let filterArray = [];
  filterArray = data.filter(
    ({ category }) => category === evt.target.textContent
  );
  console.log(filterArray);
  list.innerHTML = addMealToDOM(filterArray);
}

function handlerResetCategories() {
  // при натисканні на кнопку all categories знімається стан активної кнопки
  // з усіх інших і відбувається поновна відмальовка всих категорій
  const btnSelectCtg = document.querySelectorAll('.js-select-category');
  btnSelectCtg.forEach(button => {
    if (button.classList.contains('hero-favorite-btn-active')) {
      button.classList.remove('hero-favorite-btn-active');
    }
  });
  btnAllCategories.classList.add('hero-favorite-btn-active');
  list.innerHTML = addMealToDOM(data);
}
