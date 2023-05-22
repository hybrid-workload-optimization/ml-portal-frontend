const resource = {
  namespaced: true,
  state: {
    firstItems: [],
    firstValue: '',
  },
  getters: {
    firstItems(state) {
      return state.firstItems
    },
    firstValue(state) {
      return state.firstValue
    },
  },
  mutations: {
    initMultiSelectState(state) {
      state.firstItems = []
      state.firstValue = ''
      const firstItem = sessionStorage.getItem('firstVal')
      if (firstItem) {
        state.firstValue = firstItem
      }
    },
    initFirstState(state) {
      state.firstItems = []
      state.firstValue = ''
      state.firstItems.push({ id: 0, text: 'All', value: '' })
    },
    setFirstValue(state, payload) {
      state.firstValue = payload
      sessionStorage.setItem('firstVal', payload)
    },
    changeFirstItems(state, payload) {
      const { data } = payload
      const items = []
      items.push({ id: 0, text: 'All', value: '' })
      data.result.forEach(e => {
        items.push({ id: e.id, text: e.text, value: e.value })
      })
      state.firstItems = items
      const firstItem = sessionStorage.getItem('firstVal')
      if (firstItem) {
        state.firstValue = firstItem
      }
    },
  },
  actions: {
    async requestGetFirstItems({ commit }, payload) {
      commit('initFirstState')

      const { requestFunc } = payload
      const { parameters } = payload
      // const { valueKey } = payload
      // let param = {}
      // if (valueKey && parameters) {
      //   parameters[valueKey] = state.secondValue
      //   param = parameters
      // } else if (valueKey && !parameters) {
      //   param[valueKey] = state.secondValue
      // }
      const response = await requestFunc(parameters)
      commit('changeFirstItems', response)
    },
  },
}

export default resource
