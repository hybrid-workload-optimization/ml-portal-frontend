import request from '@/lib/request'

const resource = {
  namespaced: true,
  state: {
    tools: {
      kubesprayVersions: [],
    },
    settings: [],
  },
  getters: {},
  mutations: {
    initData(state) {
      state.tools = {
        kubesprayVersions: [],
      }
      state.settings = []
    },
    changeTools(state, payload) {
      state.tools = payload
    },
    changeToolsAdvancedData(state, payload) {
      state.settings = payload
    },
  },
  actions: {
    async getTools({ commit }, payload) {
      try {
        const response = await request.getToolsUsingGET(payload.params)
        commit('changeTools', response.data.result)
      } catch (error) {
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    async getToolsAdvancedData({ commit }, payload) {
      try {
        const response = await request.getToolsAdvancedUsingGET(payload)
        commit('changeToolsAdvancedData', response.data.result)
      } catch (error) {
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    async updateTools(context, payload) {
      const response = await request.patchToolsUsingPATCH(payload)
      return response
    },
  },
}

export default resource
