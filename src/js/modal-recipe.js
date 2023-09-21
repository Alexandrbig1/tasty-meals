import axios from 'axios';
const refs = {
  btnTest: document.querySelector('.test-click-btn'),
  modalWindow: document.querySelector('.modal-receipt'),
  modalReceiptBackdrop: document.querySelector('.modal-receipt-backdrop'),
};
let arrayFavourites = [];
const fetchWholeReceipt = async id => {
  const response = await axios.get(
    `https://tasty-treats-backend.p.goit.global/api/recipes/${id}`
  );
  return response.data;
};
// refs.btnTest.addEventListener('click', onSeeRecipeBtnClick)
export function onSeeRecipeBtnClick(event) {
  if (event.target.nodeName !== 'BUTTON' && event.target.nodeName !== 'IMG') {
    return;
  }
refs.modalWindow.innerHTML = ''
  refs.modalReceiptBackdrop.classList.remove('is-hidden');
  window.addEventListener('keydown', onEscKeyPress);
  function onEscKeyPress(event) {
    if (event.code === 'Escape') {
      refs.modalReceiptBackdrop.classList.add('is-hidden');
      window.removeEventListener('keydown', onEscKeyPress);
    }
  }
  refs.modalReceiptBackdrop.addEventListener('click', onBackdropClick);
  function onBackdropClick(event) {
    if (event.target === event.currentTarget) {
      refs.modalReceiptBackdrop.classList.add('is-hidden');
      window.removeEventListener('keydown', onEscKeyPress);
    }
  }
  fetchWholeReceipt(event.target.id).then(data => {
    if (data.length === 0) {
      console.log(`Error`);
      return;
    }
    refs.modalWindow.innerHTML = createModalReceiptMarkup(data);
    function renderVideo({ youtube, thumb, title }) {
      if (youtube) {
        return `<div class="modal-recipe-video-wrapper">
  <img
    class="modal-recipe-video-preview"
    src="${thumb}"
    alt="${title}"
  />
  <a
    href="${youtube}"
    target="_blank"
    rel="noreferrer noopener"
  >
    <svg
      class="modal-recipe-video-icon"
      width="32"
      height="32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.053 8.56a3.707 3.707 0 0 0-2.587-2.667C25.173 5.333 16 5.333 16 5.333s-9.173 0-11.466.614a3.707 3.707 0 0 0-2.587 2.666 38.667 38.667 0 0 0-.613 7.054c-.015 2.382.19 4.761.613 7.106a3.707 3.707 0 0 0 2.587 2.56c2.293.614 11.466.614 11.466.614s9.174 0 11.467-.614a3.706 3.706 0 0 0 2.587-2.666c.416-2.31.622-4.653.613-7a38.661 38.661 0 0 0-.613-7.107Z"
        stroke="#F8F8F8"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="m13 20.027 7.667-4.36L13 11.307v8.72Z"
        stroke="#F8F8F8"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </a>
</div>`;
      }
      return `<div class="modal-receipt-thumb-wrapper"><img class="mobile-recipe-img" src="${thumb}" alt="${title}" /><div/>`;
    }
    function renderIngridients(ingridients) {
      return ingridients
        .map(
          ({ measure, name }) => `
    <div class="ingridient-wrapper"><div class="modal-receipt-ingr-name">${name}</div><div class="modal-receipt-ingr-measure">${measure}</div></div>`
        )
        .join('');
    }
    function renderTags(tags) {
      return tags
        .map(
          tag => `
      <button class="modal-receipt-tag-btn" type="button"> #${tag}</button>
    `
        )
        .join('');
    }
    function createModalReceiptMarkup({ title, instructions, rating, time }) {
      const markup = `<button class="modal-receipt-close-btn" type="button" data-modal-close>
<svg width="20" height="20" viewBox="0 0 20 20" fill="red" xmlns="http://www.w3.org/2000/svg">
<path d="M15 5L5 15" stroke="#050505" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 5L15 15" stroke="#050505" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg> </button> ${renderVideo(data)}
 <h1 class="modal-receipt-title">${title}</h1>
<div class="modal-receipt-rating-time-wrapper">
  <div class="modal-receipt-rating-stars-wrapper">
  <p class="modal-recipe-rating-number">${Math.round(
    rating
  )}</p></div>${renderRatingStarts(Math.round(rating))}
  <div class="modal-receipt-cooking-time-wrapper">
    <p class="modal-receipt-cooking-time">${time} min</p>
  </div>
</div>
    <div class="ingridients-table">${renderIngridients(data.ingredients)}</div>
    <div class="tags-btn-wrapper"> ${renderTags(data.tags)} </div>
    <p class="modal-receipt-process-description"> ${instructions} </p>
    <div class="modal-receipt-btn-wrapper">
      <button class="modal-receipt-add-to-favorite-btn" type="button">Add to favorite</button>
      <button class="modal-receipt-remove-from-favorite-btn is-hidden" type="button">Remove from favorite</button>
    </div>`;
      return markup;
    }
    const modalReceiptCloseBtn = document.querySelector(
      '.modal-receipt-close-btn'
    );
    modalReceiptCloseBtn.addEventListener('click', onModalCloseBtnClick);
    function onModalCloseBtnClick() {
      refs.modalReceiptBackdrop.classList.add('is-hidden');
    }
    function renderRatingStarts(rating) {
      let starsMarkup = '';
      const starOrange = `<div class="rating-stars-wrapper">
<svg class="rating-receipt-star.colored" width="14" height="13" fill="orange" xmlns="http://www.w3.org/2000/svg"><path d="M6.049.927c.3-.921 1.603-.921 1.902 0l.845 2.6a1 1 0 0 0 .951.692h2.735c.969 0 1.371 1.24.588 1.809l-2.213 1.607a1 1 0 0 0-.363 1.118l.845 2.601c.3.921-.755 1.688-1.539 1.118l-2.212-1.607a1 1 0 0 0-1.176 0L4.2 12.472c-.784.57-1.838-.197-1.539-1.118l.845-2.6a1 1 0 0 0-.363-1.119L.93 6.028c-.783-.57-.38-1.81.588-1.81h2.735a1 1 0 0 0 .95-.69l.846-2.6Z" fill=""/></svg> </div>`;
      console.log(starsMarkup);
      const starGrey = `<div class="rating-stars-wrapper">
<svg class="rating-receipt-star" width="14" height="13" fill="grey" xmlns="http://www.w3.org/2000/svg"><path d="M6.049.927c.3-.921 1.603-.921 1.902 0l.845 2.6a1 1 0 0 0 .951.692h2.735c.969 0 1.371 1.24.588 1.809l-2.213 1.607a1 1 0 0 0-.363 1.118l.845 2.601c.3.921-.755 1.688-1.539 1.118l-2.212-1.607a1 1 0 0 0-1.176 0L4.2 12.472c-.784.57-1.838-.197-1.539-1.118l.845-2.6a1 1 0 0 0-.363-1.119L.93 6.028c-.783-.57-.38-1.81.588-1.81h2.735a1 1 0 0 0 .95-.69l.846-2.6Z" fill=""/></svg> </div>`;
      for (let i = 1; i <= 5; i += 1) {
        starsMarkup += starOrange;
      }
      for (let i = 1; i <= 5 - rating; i += 1) {
        starsMarkup += starGrey;
      }
      return starsMarkup;
    }
    // Додавання до локального сховища
    const addToFavBtn = document.querySelector(
      '.modal-receipt-add-to-favorite-btn'
    );
    const removeFromFavBtn = document.querySelector(
      '.modal-receipt-remove-from-favorite-btn'
    );
    addToFavBtn.addEventListener('click', onAddToFavBtnClick);
    function onAddToFavBtnClick() {
       arrayFavourites.push(data);
      addToFavBtn.classList.add('is-hidden');
      removeFromFavBtn.classList.remove('is-hidden');
      console.log(arrayFavourites);
      localStorage.setItem('favourite-items', JSON.stringify(arrayFavourites));
      return arrayFavourites;
    }
                removeFromFavBtn.addEventListener('click', onRemoveFromFavBtnClick);
          function onRemoveFromFavBtnClick() {
     addToFavBtn.classList.remove('is-hidden')
            removeFromFavBtn.classList.add('is-hidden')
            console.log(arrayFavourites)
const indexFav = arrayFavourites.findIndex(element => element.title === data.title);
if (indexFav !== -1) {
  arrayFavourites.splice(indexFav, 1);
  localStorage.setItem("favourite-items", JSON.stringify(arrayFavourites))
            return arrayFavourites;
}
            
          }
  });
}
export { createModalReceiptMarkup };
export { arrayFavourites };
export { addToFavBtn };
export { onAddToFavBtnClick };
