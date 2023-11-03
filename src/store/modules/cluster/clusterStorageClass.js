import request from '@/lib/request'
import moment from 'moment'
import { date } from '@/utils/common'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      id: null,
      name: '',
      uid: '',
      provisioner: '',
      type: '',
      createdAt: '',
      annotation: '',
      label: '',
    },
    resourceInfo: {
      provisioner: '',
      type: '',
    },
    pvList: [],
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
    pvList(state) {
      return state.pvList
    },
  },
  mutations: {
    initClusterStorageClassListState(state) {
      state.dataList = []
      state.detailInfo = {
        id: null,
        name: '',
        provider: '',
        label: '',
        createdAt: '',
        clusterIdx: 0,
      }
    },
    initClusterStorageClassDataList(state) {
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
          provider: e.provisioner,
          type: e.type,
          createdAt: `${date.getDiffFromToday(e.createdAt)}`,
        }
        if (e.label) {
          for (const [key, value] of Object.entries(e.label)) {
            item.label += `${key}:${value}`
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
      console.log(result)
      if (result) {
        state.detailInfo.id = result.id
        state.detailInfo.name = result.name
        state.detailInfo.uid = result.uid
        state.detailInfo.provisioner = result.provider
        state.detailInfo.type = result.type
        state.detailInfo.createdAt = moment(result.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        state.detailInfo.clusterIdx = result.clusterIdx
        state.detailInfo.clusterId = result.clusterId
        state.detailInfo.annotation = result.annotation
        if (result.label) {
          state.detailInfo.label = []
          for (const [key, value] of Object.entries(result.label)) {
            state.detailInfo.label.push(`${key}:${value}`)
          }
        }
        state.resourceInfo = {
          provider: result.provider,
          type: result.type,
        }
        state.pvList = result.pvList
      }
    },
  },
  actions: {
    //  리스트 정보 조회 요청
    async getList({ commit }, param) {
      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      const response = await request.getStorageClassListUsingGET(param)
      commit('changeDateList', response)
    },
    //  상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      const response = await request.getStorageClassDetailUsingGET(payload)
      commit('changeDetailInfo', response)
    },
    //  yaml 정보 조회 요청
    async getClusterStorageClassYaml(context, payload) {
      const response = await request.getClusterStorageClassYamlUsingGET(payload)
      return response
    },
    //  생성 요청
    async createClusterStorageClass(context, payload) {
      const response = await request.registerClusterStorageClassUsingPOST(
        payload,
      )
      return response
    },
    //  수정 요청
    async updateClusterStorageClass(context, payload) {
      const response = await request.updateClusterStorageClassUsingPUT(payload)
      return response
    },
    // 삭제 요청
    async deleteClusterStorageClass(context, payload) {
      const response = await request.deleteClusterStorageClassUsingDELETE(
        payload,
      )
      return response
    },
  },
}

export default resource
