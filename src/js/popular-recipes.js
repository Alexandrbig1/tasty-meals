import axios from 'axios';
import { onSeeRecipeBtnClick } from './modal-recipe';
import { createModalReceiptMarkup } from './modal-recipe';

const BASE_URL =
  'https://tasty-treats-backend.p.goit.global/api/recipes/popular';

const popularRecipesList = document.querySelector('.js-popular-recipes-list');

const getPopularRecipe = async () => {
  const response = await axios.get(`${BASE_URL}`);
  // console.log (response.data)
  return response.data;
};

getPopularRecipe().then(data => {
  if (data.length === 0) {
    // console.log(`Error`)
    return;
  }
  popularRecipesList.insertAdjacentHTML('beforeend', createMarkupPopularRecipies(data));
});

// Click and open modal //
popularRecipesList.addEventListener('click', onSeeRecipeBtnClick);

// Markup //
function createMarkupPopularRecipies(arr) {
  return arr
    .map(
      ({ _id, title, description, preview }) =>
        `<li class="popular-recipes-item js-popular-recipes-item">
        <img id="${_id}"
            class="popular-recipes-img"
            src="${preview}"
            alt="${title}"/>
        <div class="popular-recepices-text">
            <h3 class="popular-recipes-subtitle">${title}</h3>
            <p class="popular-recipes-description">${description}</p>
            </div>
    </li>`
    )
    .join('');
}
