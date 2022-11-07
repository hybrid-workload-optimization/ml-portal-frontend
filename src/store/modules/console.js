const resource = {
  namespaced: true,
  state: {
    consoleText: '',
  },
  getters: {
    consoleText: state => {
      return state.consoleText
    },
  },
  mutations: {
    setConsoleText(state, payload) {
      state.consoleText = payload
    },
  },
  actions: {},
}

export default resource
