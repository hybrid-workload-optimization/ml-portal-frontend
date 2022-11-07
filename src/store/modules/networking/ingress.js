import request from '@/lib/request'
import { api, date } from '@/utils/common'
import moment from 'moment'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      id: null,
      name: '',
      namespace: '',
      ingreessClassName: '',
      ruleList: [],
      createdAt: '',
      projectIdx: null,
    },
    ruleList: [],
    selectedItem: {},
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
    ruleList(state) {
      return state.ruleList
    },
  },
  mutations: {
    // state 데이터 초기화
    initIngressState(state) {
      state.dataList = []
      state.detailInfo = {
        id: null,
        name: '',
        namespace: '',
        ingreessClassName: '',
        ruleList: [],
        createdAt: '',
        projectIdx: null,
      }
    },
    initIngressDataList(state) {
      state.dataList = []
    },

    changeDateList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = []
      result.content.forEach(e => {
        const item = {
          id: e.id,
          name: e.name,
          clusterName: e.clusterName,
          namespace: e.namespace,
          ingressClass: e.ingressClass,
          age: `${date.getDiffFromToday(e.createdAt)}`,
        }

        dataList.push(item)
      })
      state.dataList = dataList
    },

    changeDetailInfo(state, payload) {
      state.detailInfo = {}

      const { data } = payload
      const { result } = data
      if (result) {
        state.detailInfo.id = result.id
        state.detailInfo.title = `${result.clusterName} / ${result.name}`
        state.detailInfo.name = result.name
        state.detailInfo.namespace = result.namespace
        state.detailInfo.ingressClass = result.ingressClass
        state.detailInfo.clusterId = result.clusterId
        state.detailInfo.clusterIdx = result.clusterIdx
        state.detailInfo.createdAt = moment(result.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        state.ruleList = result.ruleList
        state.detailInfo.projectIdx = result.projectIdx
      }
    },
    setSeletedItem(state, payload) {
      state.selectedItem = payload
    },
  },
  actions: {
    // 리스트 정보 조회 요청
    async getList({ commit }, payload) {
      const param = {
        page: 1,
        size: 100,
        clusterIdx: payload.clusterIdx,
        namespaceIdx: payload.namespaceId,
      }

      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      const response = await api.getAllData(
        request.getIngressListUsingGET,
        param,
      )
      // const response = await request.getIngressListUsingGET(payload)
      commit('changeDateList', response)
    },
    //  상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      const response = await request.getIngressDetailUsingGET_1(payload)
      commit('changeDetailInfo', response)
    },
    // yaml 정보 조회 요청
    async getIngressYaml(context, payload) {
      const response = await request.getIngressYamlUsingGET(payload)
      return response
    },
    // 생성 요청
    async createIngress(context, payload) {
      const response = await request.registerIngressUsingPOST(payload)
      return response
    },
    // 수정 요청
    async updateIngress(context, payload) {
      const response = await request.updateIngressUsingPUT(payload)
      return response
    },
    // 삭제 요청
    async deleteIngress(context, payload) {
      const response = await request.deleteIngressUsingDELETE(payload)
      return response
    },
  },
}

export default resource
