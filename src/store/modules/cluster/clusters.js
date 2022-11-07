import Clusters from '@/assets/data/clusters'

const basic = 'clusters'

export const ADD_CLUSTER = `${basic}/addCluster`
export const REMOVE_CLUSTER = `${basic}/removeCluster`

const tag = '[Store_Cluster]'

const resource = {
  namespaced: true,
  state: {
    // data
    clusters: Clusters,
  },
  getters: {
    getClusters(state) {
      return state.clusters
    },
  },
  mutations: {
    addCluster(state, { payload }) {
      console.log(tag, 'ADD_CLUSTER')

      payload.selectedIds.forEach(cluster => {
        const index = state.clusters.group.findIndex(el => el.id === cluster.id)
        state.clusters.group[index].isAdded = true
      })
    },
    removeCluster(state, { payload }) {
      console.log(tag, 'REMOVE_CLUSTER')
      payload.selectedIds.forEach(cluster => {
        const index = state.clusters.group.findIndex(el => el.id === cluster.id)
        state.clusters.group[index].isAdded = false
      })
    },
  },
  actions: {
    // async, call mutations
    // getters: {…}, state: {…}, rootState: {…}, rootGetters: {…}, dispatch: ƒ, commit: ƒ
    // 비구조화 할당으로 매개변수 받기 가능  { state, commit }
    // 다른 모듈의 state 사용시 rootState를 통해서
    async actionTest({ commit, dispatch }) {
      commit('removeCluster')
      await dispatch('promiseChange')
    },
    promiseChange: ({ commit }) => {
      return new Promise((resolve, reject) => {
        try {
          commit('removeCluster')
          resolve()
        } catch (error) {
          reject()
        }
      })
    },
  },
}

export default resource
