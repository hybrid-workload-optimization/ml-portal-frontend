import request from '@/lib/request'

const resource = {
  namespaced: true,
  state: {
    monitoringPath: '',
  },
  getters: {},
  mutations: {
    setMonitoringPath(state, payload) {
      state.monitoringPath = payload
    },
  },
  actions: {
    async getMonitoringPath({ commit }, params) {
      const { data } = await request.getGrafanNodeExporterUrlUsingGET(params)

      commit('setMonitoringPath', data.result)
    },
  },
}

export default resource
