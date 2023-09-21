import axios from 'axios';

const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api';

// elements
const list = document.querySelector('.select-category-list');
const btnAllCtg = document.querySelector('.btn-all-categories');
const menu = document.querySelector('.main-img-menu');

list.addEventListener('click', onClick);
btnAllCtg.addEventListener('click', resetCategories);

async function onClick(evt) {
  if (!evt.target.classList.contains('js-select-category')) {
    return;
  }
  const btnSelectCtg = document.querySelectorAll('.js-select-category');
  btnSelectCtg.forEach(button => {
    if (button.classList.contains('btn-select-active')) {
      button.classList.remove('btn-select-active');
    }
  });
  btnAllCtg.classList.remove("active-all-cat-btn")
  evt.target.classList.add('btn-select-active');
  
  // backend request

      //  request for desktop
    if(window.matchMedia("(min-width: 1280px)").matches) {
    const resp = await axios.get(
      `${BASE_URL}/recipes?category=${evt.target.textContent}&limit=9`);
      try {
       menu.innerHTML = markupMenu(resp.data.results);
      } catch {
        err => console.log(err);
      }
       
      // request for tablet
  } else if(window.matchMedia("(min-width: 768px)").matches) {
    const resp = await axios.get(
    `${BASE_URL}/recipes?category=${evt.target.textContent}&limit=8`
  );
  try {
    menu.innerHTML = markupMenu(resp.data.results);
  } catch {
    err => console.log(err);
  }
  
    // request for mobile
  } else if(window.matchMedia("(min-width: 270px)").matches) {
    const resp = await axios.get(
    `${BASE_URL}/recipes?category=${evt.target.textContent}&limit=6`
  );
  try {
    menu.innerHTML = markupMenu(resp.data.results);
  } catch {
    err => console.log(err);
  }
  }
}  

async function resetCategories() {
  menu.innerHTML = '';
  const btnSelectCtg = document.querySelectorAll('.js-select-category');
  btnSelectCtg.forEach(button => {
    if (button.classList.contains('btn-select-active')) {
      button.classList.remove('btn-select-active');
      button.removeAttribute('disabled');
    }
  });
  const resp = await axios.get(`${BASE_URL}/recipes`);
  try {
    menu.insertAdjacentHTML('afterbegin', markupMenu(resp.data.results));
  } catch {
    err => console.log(err);
  }
}

async function addCategories() {
  const resp = await axios.get(`${BASE_URL}/categories`);
  try {
    list.innerHTML = renderMarkup(resp.data);
  } catch {
    err => console.log(err);
  }
}
addCategories();

///////////  MARKUP  ////////////////

function renderMarkup(data) {
  return data
    .map(
      ({ _id, name }) => `<li>
    <button class="btn-select-category js-select-category" data-id="${_id}" type="button">${name}</button>  
    </li>`
    )
    .join('');
}

function markupMenu(data) {
  return data
    .map(({ thumb, title, description, rating, _id: id }) => 
      `<div class="main-img-items">
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
                        <span class="main-rating-span">${Math.round(
                          rating
                        )}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M6.04894 1.42705C6.3483 0.505742 7.6517 0.505741 7.95106 1.42705L8.79611 4.02786C8.92999 4.43989 9.31394 4.71885 9.74717 4.71885H12.4818C13.4505 4.71885 13.8533 5.95846 13.0696 6.52786L10.8572 8.13525C10.5067 8.3899 10.3601 8.84127 10.494 9.25329L11.339 11.8541C11.6384 12.7754 10.5839 13.5415 9.80017 12.9721L7.58779 11.3647C7.2373 11.1101 6.7627 11.1101 6.41222 11.3647L4.19983 12.9721C3.41612 13.5415 2.36164 12.7754 2.66099 11.8541L3.50604 9.25329C3.63992 8.84127 3.49326 8.3899 3.14277 8.13525L0.930391 6.52787C0.146677 5.95846 0.549452 4.71885 1.51818 4.71885H4.25283C4.68606 4.71885 5.07001 4.43989 5.20389 4.02786L6.04894 1.42705Z" fill="#EEA10C"/>
</svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M6.04894 1.42705C6.3483 0.505742 7.6517 0.505741 7.95106 1.42705L8.79611 4.02786C8.92999 4.43989 9.31394 4.71885 9.74717 4.71885H12.4818C13.4505 4.71885 13.8533 5.95846 13.0696 6.52786L10.8572 8.13525C10.5067 8.3899 10.3601 8.84127 10.494 9.25329L11.339 11.8541C11.6384 12.7754 10.5839 13.5415 9.80017 12.9721L7.58779 11.3647C7.2373 11.1101 6.7627 11.1101 6.41222 11.3647L4.19983 12.9721C3.41612 13.5415 2.36164 12.7754 2.66099 11.8541L3.50604 9.25329C3.63992 8.84127 3.49326 8.3899 3.14277 8.13525L0.930391 6.52787C0.146677 5.95846 0.549452 4.71885 1.51818 4.71885H4.25283C4.68606 4.71885 5.07001 4.43989 5.20389 4.02786L6.04894 1.42705Z" fill="#EEA10C"/>
</svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M6.04894 1.42705C6.3483 0.505742 7.6517 0.505741 7.95106 1.42705L8.79611 4.02786C8.92999 4.43989 9.31394 4.71885 9.74717 4.71885H12.4818C13.4505 4.71885 13.8533 5.95846 13.0696 6.52786L10.8572 8.13525C10.5067 8.3899 10.3601 8.84127 10.494 9.25329L11.339 11.8541C11.6384 12.7754 10.5839 13.5415 9.80017 12.9721L7.58779 11.3647C7.2373 11.1101 6.7627 11.1101 6.41222 11.3647L4.19983 12.9721C3.41612 13.5415 2.36164 12.7754 2.66099 11.8541L3.50604 9.25329C3.63992 8.84127 3.49326 8.3899 3.14277 8.13525L0.930391 6.52787C0.146677 5.95846 0.549452 4.71885 1.51818 4.71885H4.25283C4.68606 4.71885 5.07001 4.43989 5.20389 4.02786L6.04894 1.42705Z" fill="#EEA10C"/>
</svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M6.04894 1.42705C6.3483 0.505742 7.6517 0.505741 7.95106 1.42705L8.79611 4.02786C8.92999 4.43989 9.31394 4.71885 9.74717 4.71885H12.4818C13.4505 4.71885 13.8533 5.95846 13.0696 6.52786L10.8572 8.13525C10.5067 8.3899 10.3601 8.84127 10.494 9.25329L11.339 11.8541C11.6384 12.7754 10.5839 13.5415 9.80017 12.9721L7.58779 11.3647C7.2373 11.1101 6.7627 11.1101 6.41222 11.3647L4.19983 12.9721C3.41612 13.5415 2.36164 12.7754 2.66099 11.8541L3.50604 9.25329C3.63992 8.84127 3.49326 8.3899 3.14277 8.13525L0.930391 6.52787C0.146677 5.95846 0.549452 4.71885 1.51818 4.71885H4.25283C4.68606 4.71885 5.07001 4.43989 5.20389 4.02786L6.04894 1.42705Z" fill="#EEA10C"/>
</svg>

                        <svg width="14" height="14">
                          <use href="./images/icons.svg#icon-star"></use>
                        </svg>
                        <svg width="14" height="14">
                          <use href="./images/icons.svg#icon-empty-star"></use>
                        </svg>
                      </div>
                      <button id="${id}" class="main-rating-btn">See recipe</button>
                    </div>
                  </div>
                </div>`
    ).join('');
}
