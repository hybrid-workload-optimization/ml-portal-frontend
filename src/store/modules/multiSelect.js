const resource = {
  namespaced: true,
  state: {
    firstItems: [],
    secondItems: [],
    thirdItems: [],
    firstValue: '',
    secondValue: '',
    thirdValue: '',
  },
  getters: {
    firstItems(state) {
      return state.firstItems
    },
    secondItems(state) {
      return state.secondItems
    },
    thirdItems(state) {
      return state.thirdItems
    },
    firstValue(state) {
      return state.firstValue
    },
    secondValue(state) {
      return state.secondValue
    },
    thirdValue(state) {
      return state.thirdValue
    },
  },
  mutations: {
    initMultiSelectState(state) {
      state.firstItems = []
      state.firstValue = ''
      state.secondItems = []
      state.secondValue = ''
      state.thirdItems = []
      state.thirdValue = ''
      const firstItem = sessionStorage.getItem('firstVal')
      if (firstItem) {
        state.firstValue = firstItem
      }
      const secondItem = sessionStorage.getItem('secondVal')
      if (secondItem) {
        state.secondValue = secondItem
      }
      const thirdItem = sessionStorage.getItem('thirdVal')
      if (thirdItem) {
        state.thirdValue = thirdItem
      }
    },
    initFirstState(state) {
      state.firstItems = []
      state.firstValue = ''
    },
    initSecondState(state) {
      state.secondItems = []
      state.secondValue = ''
    },
    initThirdState(state) {
      state.thirdItems = []
      state.thirdValue = ''
      state.thirdItems.push({ id: 0, text: 'All', value: '' })
    },
    setFirstValue(state, payload) {
      state.firstValue = payload
      sessionStorage.setItem('firstVal', payload)
    },
    setSecondValue(state, payload) {
      state.secondValue = payload
      sessionStorage.setItem('secondVal', payload)
    },
    setThirdValue(state, payload) {
      state.thirdValue = payload
      sessionStorage.setItem('thirdVal', payload)
    },
    changeFirstItems(state, payload) {
      state.firstItems = []
      const { data } = payload
      const items = []

      data.result.forEach(e => {
        items.push({ id: e.id, text: e.text, value: e.value })
      })
      state.firstItems = items
      const firstItem = sessionStorage.getItem('firstVal')
      if (firstItem) {
        state.firstValue = firstItem
      }
    },
    changeSecondItems(state, payload) {
      const { data } = payload
      const items = [...data.result]

      state.secondItems = items
      const secondItem = sessionStorage.getItem('secondVal')
      if (secondItem) {
        state.secondValue = secondItem
      }
    },
    changeThirdItems(state, payload) {
      const { data } = payload
      const items = []
      items.push({ id: 0, text: 'All', value: '' })
      data.result.forEach(e => {
        items.push({ id: e.id, text: e.text, value: e.value })
      })
      state.thirdItems = items

      const thirdItem = sessionStorage.getItem('thirdVal')
      if (thirdItem) {
        state.thirdValue = thirdItem
      }
    },
  },
  actions: {
    async requestGetFirstItems({ commit }, payload) {
      commit('initFirstState')
      commit('initSecondState')
      commit('initThirdState')

      const { requestFunc } = payload
      const response = await requestFunc()
      commit('changeFirstItems', response)
    },
    async requestGetSecondItems({ state, commit }, payload) {
      commit('initSecondState')
      commit('initThirdState')

      const { requestFunc } = payload
      const { parameters } = payload
      const { valueKey } = payload

      let param = {}
      if (valueKey && parameters) {
        parameters[valueKey] = state.firstValue
        param = parameters
      } else if (valueKey && !parameters) {
        param[valueKey] = state.firstValue
      }

      const response = await requestFunc(param)
      commit('changeSecondItems', response)
    },
    async requestGetThirdItems({ state, commit }, payload) {
      commit('initThirdState')

      const { requestFunc } = payload
      const { parameters } = payload
      const { valueKey } = payload

      let param = {}
      if (valueKey && parameters) {
        parameters[valueKey] = state.secondValue
        param = parameters
      } else if (valueKey && !parameters) {
        param[valueKey] = state.secondValue
      }
      const response = await requestFunc(param)
      commit('changeThirdItems', response)
    },
  },
}

export default resource
