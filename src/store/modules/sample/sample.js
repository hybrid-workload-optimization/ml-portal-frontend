import request from '@/lib/request'
import Clusters from '@/assets/data/clusters'

const resource = {
  namespaced: true,
  state: {
    // data
    clusters: Clusters,
    projects: {
      name: null,
      description: null,
    },
  },
  getters: {
    // computed
    getClusters: state => {
      return state.clusters
    },
    projectInfo: state => {
      return state.projects
    },
  },
  mutations: {
    setProjectInfo(state, payload) {
      state.projects.name = payload.name
      state.projects.description = payload.description
    },
    updateClusterList(state, payload) {
      state.clusters = payload
    },
  },
  actions: {
    getProjectInfo({ commit }, payload) {
      request.getCluterListUsingGET(payload).then(res => {
        commit('setProjectInfo', res.result)
      })
    },
    async updateProjectInfo({ dispatch }, payload) {
      /* API 사용 예시 */
      await dispatch('promiseUpdateProjectInfo', payload)
    },
    promiseUpdateProjectInfo: ({ commit }, payload) => {
      return new Promise((resolve, reject) => {
        try {
          request.registryUsingPOST(payload).then(res => {
            commit('setProjectInfo', res.result)
            resolve()
          })
        } catch (error) {
          reject()
        }
      })
    },
    // async fetchClustList({ commit }) {
    //   const response = request.getCluterListUsingGET()
    //   await commit('updateClusterList', response.result)
    // },
  },
}

export default resource
