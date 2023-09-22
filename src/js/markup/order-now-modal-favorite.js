const refs = {
  closeModalBtn: document.querySelector('[data-modal-close]'),
  modal: document.querySelector('[data-modal]'),
};
refs.closeModalBtn.addEventListener('click', toggleModal);
document.addEventListener('keydown', function (evt) {
  if (evt.key === 'Escape') {
    toggleModal();
  }
});

function toggleModal() {
  refs.modal.classList.toggle('is-hidden');
}

export { toggleModal };
