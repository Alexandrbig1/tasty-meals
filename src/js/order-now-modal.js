const refs = {
  orderNowBtn: document.querySelector('.hero_btn-js'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
  modal: document.querySelector('[data-modal]'),
};

refs.orderNowBtn.addEventListener('click', handleModalOpen);
refs.closeModalBtn.addEventListener('click', handleModalClose);

function handleEsc(evt) {
  if (evt.key === 'Escape') {
    handleModalClose();
  }
}

function handleModalOpen() {
  refs.modal.classList.remove('is-hidden');
  document.addEventListener('keydown', handleEsc);
}

function handleModalClose() {
  refs.modal.classList.add('is-hidden');
  document.removeEventListener('keydown', handleEsc);
}

export { handleModalOpen }