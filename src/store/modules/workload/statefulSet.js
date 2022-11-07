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
      uid: '',
      image: '',
      annotation: [],
      label: [],
      createdAt: '',
      running: 0,
      desired: 0,
      clusterIdx: '',
      projectIdx: '',
      resourceInfo: {},
      podState: {},
      clusterId: '',
      // yaml: '',
    },
    podList: [],
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
    podList(state) {
      return state.podList
    },
  },
  mutations: {
    // state 데이터 초기화
    initStatefulSetState(state) {
      state.dataList = []
      state.detailInfo = {
        id: null,
        name: '',
        namespace: '',
        uid: '',
        image: '',
        annotation: [],
        label: [],
        createdAt: '',
        running: 0,
        desired: 0,
        clusterIdx: '',
        resourceInfo: {},
        podState: {},
        projectIdx: '',
        clusterId: '',
        // yaml: '',
      }
    },
    initStatefulSetDataList(state) {
      state.dataList = []
    },

    // [스테이트풀셋 리스트 정보] 객체 생성
    changeDataList(state, payload) {
      state.dataList = []
      const { data } = payload
      const { result } = data
      const dataList = []

      result.content.forEach(e => {
        const item = {
          id: e.id,
          name: e.name,
          clusterName: e.clusterName,
          namespace: e.namespace,
          pod: `${e.readyReplicas}/${e.replicas}`,
          image: e.image,
          age: `${date.getDiffFromToday(e.age)}`,
          label: '',
        }
        if (e.label) {
          let count = 1
          for (const [key, value] of Object.entries(e.label)) {
            if (count > 1) {
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

    // [스테이트풀셋 상세 정보] 객체 생성
    changeDetailInfo(state, payload) {
      state.detailInfo = {}

      const { data } = payload
      const { result } = data
      if (result) {
        // console.log('result:', result)
        state.detailInfo.id = result.id
        state.detailInfo.title = `${result.clusterName} / ${result.name}`
        state.detailInfo.name = result.name
        state.detailInfo.namespace = result.namespace
        state.detailInfo.uid = result.uid
        state.detailInfo.projectIdx = result.projectIdx

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
        state.detailInfo.createdAt = moment(result.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        state.detailInfo.clusterIdx = result.clusterIdx
        state.detailInfo.resourceInfo = {
          image: result.image,
        }
        state.detailInfo.podState = {
          running: result.readyReplicas,
          desired: result.replicas,
        }
        state.detailInfo.clusterId = result.clusterId
        // state.detailInfo.yaml = result.yaml
      }
    },

    // [파드 리스트 정보] 객체 생성
    changePodList(state, payload) {
      state.podList = []
      const { data } = payload
      const { result } = data
      const podList = []

      result.forEach(e => {
        const item = {
          id: e.id,
          name: e.name,
          namespace: e.namespace,
          label: '',
          node: e.node,
          status: e.status,
          createdAt: moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        }
        if (e.label) {
          let count = 1
          for (const [key, value] of Object.entries(e.label)) {
            if (count > 1) {
              item.label += ', '
            }
            item.label += `${key}:${value}`
            count += 1
          }
        }

        podList.push(item)
      })
      state.podList = podList
    },
  },
  actions: {
    // 스테이트풀셋 리스트 정보 조회 요청
    async getList({ commit }, payload) {
      const param = {
        page: 1,
        size: 100,
        clusterIdx: payload.clusterIdx,
        namespaceIdx: payload.namespaceIdx,
      }

      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      const response = await api.getAllData(
        request.getStatefulSetListUsingGET,
        param,
      )
      // const response = await request.getStatefulSetListUsingGET(payload)
      commit('changeDataList', response)
    },
    // 스테이트풀셋 상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      const response = await request.getStatefulSetUsingGET(payload)
      commit('changeDetailInfo', response)
    },
    // 스테이트풀셋 yaml 정보 조회 요청
    async getStatefulSetYaml(context, payload) {
      const response = await request.getStaefulSetYamlUsingGET(payload)
      return response
    },
    // 스테이트풀셋 생성 요청
    async createStatefulSet(context, payload) {
      const response = await request.createStatefulSetUsingPOST(payload)
      return response
    },
    // 스테이트풀셋 수정 요청
    async updateStatefulSet(context, payload) {
      const response = await request.updateStatefulSetUsingPUT(payload)
      return response
    },
    // 스테이트풀셋 삭제 요청
    async deleteStatefulSet(context, payload) {
      const response = await request.deleteStatefulSetUsingDELETE(payload)
      return response
    },
    async getPodList({ commit }, payload) {
      const response = await request.getPodListByOwnerUsingPOST(payload)
      commit('changePodList', response)
    },
  },
}

export default resource
