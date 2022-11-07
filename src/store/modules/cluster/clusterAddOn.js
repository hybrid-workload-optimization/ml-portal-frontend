import request from '@/lib/request'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
  },
  getters: {
    dataList(state) {
      return state.dataList
    },
  },
  mutations: {
    changeDateList(state, payload) {
      state.dataList = payload
    },
  },
  actions: {
    //  리스트 정보 조회 요청
    async getList({ commit }, param) {
      try {
        const response = await request.getAddonsUsingGET(param)
        console.log('getdatalist', response.data.result)
        commit('changeDateList', response.data.result)
      } catch (error) {
        console.error(error)
      }
    },
    async postInstall({ commit, dispatch }, param) {
      try {
        await request.installUsingPOST(param)
        commit(
          'alert/openAlert',
          { title: 'Install 되었습니다.', type: 'info' },
          { root: true },
        )

        const params = { clusterIdx: param.clusterIdx }
        dispatch('getList', params)
      } catch (error) {
        console.error(error)
        commit(
          'alert/openAlert',
          { title: 'Install 실패하였습니다.', type: 'error' },
          { root: true },
        )
      }
    },
    async deleteInstall({ commit, dispatch }, param) {
      try {
        await request.uninstallUsingDELETE(param)
        commit(
          'alert/openAlert',
          { title: 'Uninstall 되었습니다.', type: 'info' },
          { root: true },
        )

        const params = { clusterIdx: param.clusterIdx }
        dispatch('getList', params)
      } catch (error) {
        console.error(error)
        commit(
          'alert/openAlert',
          { title: 'Uninstall 실패하였습니다.', type: 'error' },
          { root: true },
        )
      }
    },
  },
}

export default resource
