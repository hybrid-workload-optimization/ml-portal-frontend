import request from '@/lib/request'
import { date } from '@/utils/common'
import moment from 'moment'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      id: null,
      name: '',
      uid: '',
      createdAt: '',
      clusterIdx: 0,
      clusterId: 0,
      annotation: '',
      label: '',
    },
    resourceInfo: {
      status: '',
    },
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
    resourceInfo(state) {
      return state.resourceInfo
    },
  },
  mutations: {
    initClusterNamespaceListState(state) {
      state.dataList = []
      state.detailInfo = {
        id: null,
        name: '',
        uid: '',
        createdAt: '',
        clusterIdx: 0,
        clusterId: 0,
        status: '',
        annotation: '',
        label: '',
      }
    },
    initClusterNamespaceDataList(state) {
      state.dataList = []
    },

    // [리스트 정보] 객체 생성
    changeDateList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = []
      result.forEach(e => {
        const item = {
          uid: e.uid,
          name: e.name,
          label: '',
          status: e.status,
          createdAt: `${date.getDiffFromToday(e.createdAt)}`,
        }
        if (e.label) {
          for (const [key, value] of Object.entries(e.label)) {
            item.label += `${key}:${value} `
          }
        }
        dataList.push(item)
      })
      state.dataList = dataList
    },

    //
    changeDetailInfo(state, payload) {
      state.detailInfo = {}

      const { data } = payload
      const { result } = data
      if (result) {
        state.detailInfo.id = result.id
        state.detailInfo.name = result.name
        state.detailInfo.uid = result.uid
        state.detailInfo.status = result.status
        state.detailInfo.createdAt = moment(result.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        state.detailInfo.clusterIdx = result.clusterIdx
        state.detailInfo.clusterId = result.clusterId
        if (result.annotation) {
          state.detailInfo.annotation = []
          for (const [key, value] of Object.entries(result.annotation)) {
            state.detailInfo.annotation.push(`${key}:${value}`)
          }
        }
        if (result.label) {
          state.detailInfo.label = []
          for (const [key, value] of Object.entries(result.label)) {
            state.detailInfo.label.push(`${key}:${value}`)
          }
        }
        state.resourceInfo = {
          status: result.status,
        }
      }
    },
  },
  actions: {
    //  리스트 정보 조회 요청
    async getList({ commit }, param) {
      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      const response = await request.getNamespaceListUsingGET(param)
      // const response = await request.getClusterNamespaceListUsingGET(payload)
      console.log('getdatalist', response)
      commit('changeDateList', response)
    },
    //  상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      const response = await request.getClusterNamespaceDetailUsingGET_1(
        payload,
      )
      commit('changeDetailInfo', response)
    },
    //  상세 정보 조회 요청
    async getDetailV2({ commit }, payload) {
      const response = await request.getNamespaceDetailUsingGET(payload)
      commit('changeDetailInfo', response)
    },
    //  yaml 정보 조회 요청
    async getClusterNamespaceYaml(context, payload) {
      const response = await request.getNamespaceYamlUsingGET(payload)
      return response
    },
    //  생성 요청
    async createClusterNamespace(context, payload) {
      console.log(payload)

      const response = await request.registerClusterNamespaceUsingPOST(payload)
      return response
    },
    //  수정 요청
    async updateClusterNamespace(context, payload) {
      const response = await request.updateClusterNamespaceUsingPUT(payload)
      return response
    },
    // 삭제 요청
    async deleteClusterNamespace(context, payload) {
      const response = await request.deleteClusterNamespaceUsingDELETE(payload)
      return response
    },
  },
}

export default resource
