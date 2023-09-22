import { createButtons, addMealToDOM } from './markup/favorite-page.js';
import { onSeeRecipeBtnClick } from './modal-recipe';

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
const divEl = document.querySelector('.favorites-main-img-menu');
const containerImg = document.querySelector('.hero-favorites-container-image');
const containerButtons = document.querySelector(
  '.container-button-markup-wrapper'
);

allButton.addEventListener('click', handlerClick);
btnAllCategories.addEventListener('click', handlerResetCategories);
divEl.addEventListener('click', removeFavorite);
divEl.addEventListener('click', onSeeRecipeBtnClick);

function removeFavorite(evt) {
  const target = evt.target;
  const data = JSON.parse(localStorage.getItem(KEY)) ?? [];
  if (target.classList.contains('favorite-main-heart-btn')) {
    const res = data.filter(({ _id: id }) => id !== target.id);
    localStorage.setItem(KEY, JSON.stringify(res));
    list.innerHTML = addMealToDOM(res);
    const filterArray = res
      .map(recipe => recipe.category)
      .filter((el, idx, arr) => arr.indexOf(el) === idx);
    const markup = createButtons(filterArray);
    allButton.innerHTML = markup;
    if (!res.length) {
      containerButtons.classList.add('visually-hidden');
      textFavoritesWrapper.classList.remove('visually-hidden');
      if (window.innerWidth < 768) {
        containerImg.classList.add('visually-hidden');
      }
    }
    return;
  }
}

if (data.length) {
  containerImg.style.display = 'block';
  containerButtons.classList.remove('visually-hidden');

  // за допомогою меп створюю масив з категорій, а потім фільтром беру унікальні значення
  const filterArray = data
    .map(recipe => recipe.category)
    .filter((el, idx, arr) => arr.indexOf(el) === idx);

  const markup = createButtons(filterArray);
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
