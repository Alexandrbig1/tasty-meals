import { toggleModal } from './order-now-modal';
const refs = {
  btnCart: document.querySelector('.js-shopping-cart'),
  btnBurger: document.querySelector('.js-burger-menu'),
  btnCloseModal: document.querySelector('.js-btn-close'),
  modal: document.querySelector('.header-back'),
  homeBtn: document.querySelector('.js-header-ref-home'),
  favorBtn: document.querySelector('.js-header-ref-favor'),
  navList: document.querySelector('.header-refs'),
};

refs.btnBurger.addEventListener('click', handlerClickerAdd);
refs.btnCloseModal.addEventListener('click', handlerClickerRemove);

function handlerClickerAdd() {
  refs.modal.classList.toggle('display-none');
  document.body.style.overflow = 'hidden';
}

function handlerClickerRemove() {
  refs.modal.classList.toggle('display-none');
  document.body.style.overflow = 'visible';
}

if (document.location.pathname === '/index.html') {
  refs.homeBtn.classList.add('header-active');
  // console.log("index")
}
if (document.location.pathname === '/favorite.html') {
  refs.favorBtn.classList.add('header-active');
  refs.homeBtn.classList.remove('header-active');
  console.log('favor');
}

refs.btnCart.addEventListener('click', toggleModal);
