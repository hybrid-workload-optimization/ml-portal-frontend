const resource = {
  namespaced: true,
  state: {
    show: false,
  },
  getters: {},
  mutations: {
    showLoading(state) {
      state.show = true
    },
    closeLoading(state) {
      state.show = false
    },
  },
  actions: {},
}

export default resource
