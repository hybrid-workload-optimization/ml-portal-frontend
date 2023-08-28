import request from '@/lib/request'

const resource = {
  namespaced: true,
  state: {
    errorMessage: null,
  },
  getters: {
    errorMessage(state) {
      return state.errorMessage
    },
  },
  mutations: {},
  actions: {
    async getWorklistYaml(state, payload) {
      const { data } = await request.getYamlUsingPOST(payload)
      return data.result
    },
  },
}

export default resource
