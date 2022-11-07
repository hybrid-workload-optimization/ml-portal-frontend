const resource = {
  namespaced: true,
  state: {
    title: 'message title',
    showConfirm: false,
  },
  getters: {
    showConfirm: state => {
      return state.showConfirm
    },
    confrimTitle: state => {
      return state.title
    },
  },
  mutations: {
    openConfirm(state, payload) {
      state.showConfirm = true
      if (payload) {
        state.title = payload
      }
    },
    closeConfirm(state) {
      state.title = ''
      state.showConfirm = false
    },
  },
  actions: {},
}

export default resource
