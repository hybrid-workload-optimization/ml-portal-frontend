import request from '@/lib/request'

const resource = {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {
    changeYaml(state, payload) {
      const { data } = payload
      state.yaml = data.result
    },
  },
  actions: {
    async getWorklistYaml(state, payload) {
      const { data } = await request.getYamlUsingPOST(payload)
      return data.result
    },
  },
}

export default resource
