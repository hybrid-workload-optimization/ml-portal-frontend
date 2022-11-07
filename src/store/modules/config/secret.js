import request from '@/lib/request'
import { api, date } from '@/utils/common'
import moment from 'moment'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      secretIdx: null,
      name: null,
      namespace: null,
      uid: null,
      createdAt: null,
      label: null,
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
    initSecretState(state) {
      state.dataList = []
      state.detailInfo = {
        secretIdx: null,
        name: '',
        namespace: null,
        uid: null,
        createdAt: null,
        label: null,
        clusterName: '',
        projectIdx: null,
      }
    },

    initSecretList(state) {
      state.dataList = []
    },

    // [Secret 리스트 정보] 객체 생성
    changeList(state, payload) {
      const { data } = payload

      const { result } = data
      const dataList = []
      result.content.forEach(e => {
        console.log('e', e)
        const item = {
          secretIdx: e.id,
          name: e.name,
          namespace: e.namespace,
          label: '',
          age: `${date.getDiffFromToday(e.age)}`,
        }

        if (e.label) {
          e.label = JSON.parse(e.label)
          let count = 0
          for (const [key, value] of Object.entries(e.label)) {
            if (count >= 1) {
              item.label += ', '
            }
            item.label += `${key}:${value}`
            count += 1
          }
        }

        dataList.push(item)
      })
      state.dataList = dataList
    },

    // [Secret 상세 정보] 객체 생성
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
        if (result.label) {
          result.label = JSON.parse(result.label)
          state.detailInfo.label = []
          for (const [key, value] of Object.entries(result.label)) {
            state.detailInfo.label.push(`${key}:${value}`)
          }
        }
        state.detailInfo.clusterName = result.clusterName
        state.detailInfo.projectIdx = result.projectIdx
      }
    },
  },

  actions: {
    // Secret 리스트 정보 조회 요청
    async getList({ commit }, payload) {
      const param = {
        page: 1,
        size: 100,
        sort: 'desc',
        property: 'secretIdx',
        clusterIdx: payload.clusterIdx,
        namespaceIdx: payload.namespaceIdx,
      }

      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      const response = await api.getAllData(
        request.getSecretListUsingGET,
        param,
      )

      commit('changeList', response)
    },

    // Secret 상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      const response = await request.getSecretUsingGET(payload)
      commit('changeDetailInfo', response)
    },

    // Secret yaml 정보 조회 요청
    async getYaml(context, payload) {
      const response = await request.getSecertYamlUsingGET(payload)
      return response
    },

    // Secret 생성 요청
    async createSecret(context, payload) {
      const response = await request.registerSecretUsingPOST(payload)
      return response
    },

    // Secret 수정 요청
    async updateSecret(context, payload) {
      const response = await request.updateSecretUsingPUT(payload)
      return response
    },

    // Secret 삭제 요청
    async deleteSecret(context, payload) {
      const response = await request.deleteSecretUsingDELETE(payload)
      return response
    },
  },
}

export default resource
