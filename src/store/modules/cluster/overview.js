import request from '@/lib/request'

const resource = {
  state: {
    data: [],
  },
  getters: {
    data(state) {
      return state.data
    },
  },
  mutations: {
    // state 데이터 초기화
    initData(state) {
      state.data = []
    },
    // List 데이터 설정
    setData(state, payload) {
      const { data } = payload
      const { result } = data

      state.dataList = result
    },
  },
  actions: {
    // 목록 정보 조회 요청
    async getData({ commit }, payload) {
      console.log(payload)
      const response = await request.getOverviewUsingGET(payload)
      console.log(response)
      commit('setData', response)
    },
  },
}

export default resource
