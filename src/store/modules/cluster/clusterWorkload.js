// import { api } from '@/utils/common'
import request from '@/lib/request'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {},
  },
  getters: {
    dataList(state) {
      return state.dataList
    },
    dataListSize(state) {
      return state.dataList.length
    },
    detailInfo(state) {
      return state.detailInfo
    },
  },
  mutations: {
    // state 데이터 초기화
    // List
    initDataList(state) {
      state.dataList = []
    },
    // List 데이터 설정
    setDataList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = result
      state.dataList = dataList
    },
    setDetailInfo(state, payload) {
      state.detailInfo = {}

      const { data } = payload
      const { result } = data
      state.detailInfo = result
    },
  },
  actions: {
    // 목록 정보 조회 요청
    async getDataList({ commit }, payload) {
      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      console.log(payload)
      // const param = {
      //   page: 1,
      //   size: 100,
      //   ...payload,
      // }

      const response = await request.getListUsingPOST(payload)
      // const response = await api.getAllData(request.getListUsingPOST, param)
      console.log(response)
      commit('setDataList', response)
    },
    // Pod 상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      try {
        console.log(payload)
        const response = await request.getDetailUsingPOST(payload)
        // const pvcResponse = await request.getPodPersistentVolumeClaimUsingGET({
        //   podName: payload.podName,
        // })
        console.log(response)
        await commit('setDetailInfo', response)
      } catch (error) {
        console.error(error)
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    // Workload 생성 요청
    async createWorkload(context, payload) {
      console.log(payload)
      const response = await request.applyUsingPOST_1(payload)
      console.log(response)
      return response
    },
  },
}

export default resource
