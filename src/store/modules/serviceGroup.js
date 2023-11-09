import request from '@/lib/request'

export const serviceGroupKey = 'serviceGroup'

const serviceGroup = {
  namespaced: true,
  state: {
    globalServiceGroup: localStorage.getItem(serviceGroupKey), // null or String
    serviceGroupList: [],
  },
  getters: {
    getGlobalServiceGroup(state) {
      return state.globalServiceGroup
    },
    getServiceGroupList(state) {
      return state.serviceGroupList
    },
  },
  mutations: {
    setServiceGroupList(state, sgList) {
      state.serviceGroupList = sgList
    },
    setGlobalServiceGroup(state, value) {
      localStorage.setItem(serviceGroupKey, value) // 글로벌 서비스그룹 로컬스토리지에 저장
      state.globalServiceGroup = value
    },
  },
  actions: {
    async initServiceGroup({ state, commit }) {
      // 서비스 그룹 목록 조회 및 글로벌 서비스 그룹 초기화
      const { data } = await request.getProjectsUsingGET()
      const sgList = data?.result || []
      commit('setServiceGroupList', sgList) // 서비스그룹 리스트 초기화
      if (state.globalServiceGroup === null) {
        // 스토리지에 저장된 서비스그룹이 없는 경우 리스트 최상위 서비스 그룹으로 초기화
        commit('setGlobalServiceGroup', sgList[0]?.value)
      }
    },
    // 글로벌 서비스 그룹 업데이트 이벤트
    updateGlobalServiceGroup({ commit }, value) {
      commit('setGlobalServiceGroup', value)
    },
  },
}

export default serviceGroup
