const resource = {
  namespaced: true,
  state: {
    consoleText: '',
    consoleModal: {
      open: false,
    },
  },
  getters: {
    consoleText: state => {
      return state.consoleText
    },
    consoleModal: state => {
      return state.consoleModal
    },
  },
  mutations: {
    setConsoleText(state, payload) {
      state.consoleText = payload
    },
    updateConsoleModal(state, payload) {
      state.consoleModal = {
        ...state.consoleModal,
        ...payload,
      }
    },
  },
  actions: {},
}

export default resource
