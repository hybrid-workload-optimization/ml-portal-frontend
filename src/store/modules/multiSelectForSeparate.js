import MultiSelect from '@/assets/data/multiSelect'

const resource = {
  namespaced: true,
  state: {
    multiSelect: MultiSelect,
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
    },
    initFirstState(state) {
      state.firstItems = []
      state.firstValue = ''
      state.firstItems.push({ id: 0, text: 'All', value: '' })
    },
    initSecondState(state) {
      state.secondItems = []
      state.secondValue = ''
      state.secondItems.push({ id: 0, text: 'All', value: '' })
    },
    initThirdState(state) {
      state.thirdItems = []
      state.thirdValue = ''
      state.thirdItems.push({ id: 0, text: 'All', value: '' })
    },
    setFirstValue(state, payload) {
      state.firstValue = payload
    },
    setSecondValue(state, payload) {
      state.secondValue = payload
    },
    setThirdValue(state, payload) {
      state.thirdValue = payload
    },
    changeFirstItems(state, payload) {
      state.firstItems = []
      const { data } = payload
      const items = []

      items.push({ id: 0, text: 'All', value: '' })
      data.result.forEach(e => {
        items.push({ id: e.id, text: e.text, value: e.value })
      })
      state.firstItems = items
    },
    changeSecondItems(state, payload) {
      const { data } = payload
      const items = []

      items.push({ id: 0, text: 'All', value: '' })

      data.result.forEach(e => {
        items.push({ id: e.id, text: e.text, value: e.value })
      })
      state.secondItems = items
    },
    changeThirdItems(state, payload) {
      const { data } = payload
      const items = []

      items.push({ id: 0, text: 'All', value: '' })
      data.result.forEach(e => {
        items.push({ id: e.id, text: e.text, value: e.value })
      })
      state.thirdItems = items
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
    async requestGetSecondItems({ commit }, payload) {
      commit('initSecondState')
      commit('initThirdState')

      const { requestFunc } = payload

      const response = await requestFunc()
      commit('changeSecondItems', response)
    },
    async requestGetThirdItems({ commit }, payload) {
      commit('initThirdState')

      const { requestFunc } = payload

      const response = await requestFunc()
      commit('changeThirdItems', response)
    },
  },
}

export default resource
