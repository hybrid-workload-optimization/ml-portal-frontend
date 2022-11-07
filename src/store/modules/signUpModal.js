const resource = {
  state: {
    isOpenModal: false,
  },
  getters: {
    isOpenModal(state) {
      return state.isOpenModal
    },
  },
  mutation: {
    openModal(state) {
      state.isOpenModal = true
    },
    closeModal(state) {
      state.isOpenModal = false
    },
  },
}

export default resource
