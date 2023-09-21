const refs = {
  orderNowBtn: document.querySelector('.hero_btn-js'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
  modal: document.querySelector('[data-modal]'),
};

refs.orderNowBtn.addEventListener('click', toggleModal);
refs.closeModalBtn.addEventListener('click', toggleModal);
document.addEventListener('keydown', function (evt) {
  if (evt.key === 'Escape') {
    toggleModal();
  }
});

function toggleModal() {
  refs.modal.classList.toggle('is-hidden');
}

export { toggleModal}