import request from '@/lib/request'
import { date } from '@/utils/common'
import moment from 'moment'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      configMapIdx: null,
      name: null,
      namespace: null,
      uid: null,
      createdAt: null,
      clusterName: '',
      projectIdx: null,
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
  },

  mutations: {
    // state 데이터 초기화
    initConfigMapState(state) {
      state.dataList = []
      state.detailInfo = {
        configMapIdx: null,
        name: '',
        namespace: null,
        uid: null,
        status: null,
        accessType: [],
        storageClass: null,
        createdAt: null,
        clusterName: '',
        projectIdx: null,
      }
    },
    initConfigMapDataList(state) {
      state.dataList = []
    },

    // [Config Map 리스트 정보] 객체 생성
    changeList(state, payload) {
      const { data } = payload

      const { result } = data
      const dataList = []
      result.forEach(e => {
        const item = {
          configMapIdx: e.id,
          name: e.name,
          namespace: e.namespace,
          age: `${date.getDiffFromToday(e.age)}`,
        }

        dataList.push(item)
      })
      state.dataList = dataList
    },

    // [Config Map 상세 정보] 객체 생성
    changeDetailInfo(state, payload) {
      state.detailInfo = {}

      const { data } = payload
      const { result } = data

      if (result) {
        state.detailInfo.configMapIdx = result.configMapIdx
        state.detailInfo.name = result.name
        state.detailInfo.namespace = result.namespace
        state.detailInfo.uid = result.uid
        state.detailInfo.createdAt = moment(result.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        state.detailInfo.data = result.data
        state.detailInfo.clusterName = result.clusterName
        state.detailInfo.projectIdx = result.projectIdx
      }
    },
  },

  actions: {
    // Config Map 리스트 정보 조회 요청
    async getList({ commit }, payload) {
      const param = {
        clusterIdx: payload.clusterIdx,
        namespace: payload.namespace,
        name: payload.name,
        kind: payload.kind,
      }

      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      const response = await request.getConfigMapListUsingGET(param)

      commit('changeList', response)
    },

    // Config Map 상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      console.log('payload', payload)

      const response = await request.getConfigMapDetailUsingPOST(payload)
      commit('changeDetailInfo', response)
    },

    // Config Map yaml 정보 조회 요청
    async getYaml(context, payload) {
      const response = await request.getConfigMapYamlUsingGET(payload)
      return response
    },

    // Config Map 생성 요청
    async createConfigMap(context, payload) {
      const response = await request.registerConfigMapUsingPOST(payload)
      return response
    },

    // Config Map 수정 요청
    async updateConfigMap(context, payload) {
      const response = await request.updateConfigMapUsingPUT(payload)
      return response
    },

    // Config Map 삭제 요청
    async deleteConfigMap(context, payload) {
      const response = await request.deleteConfigMapUsingDELETE(payload)
      return response
    },
  },
}

export default resource
