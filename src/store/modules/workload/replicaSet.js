import request from '@/lib/request'
import { api, date } from '@/utils/common'
import moment from 'moment'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      replicaSetIdx: null,
      name: '',
      namespace: '',
      uid: '',
      image: '',
      annotation: [],
      label: [],
      createdAt: '',
      runningPod: 0,
      desiredPod: 0,
      podList: [],
      clusterId: '',
      projectIdx: '',
      clusterIdx: '',
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
    initReplicaSetState(state) {
      state.dataList = []
      state.detailInfo = {
        replicaSetIdx: null,
        name: '',
        namespace: '',
        uid: '',
        image: '',
        annotation: [],
        label: [],
        createdAt: '',
        runningPod: 0,
        desiredPod: 0,
        clusterId: '',
        clusterName: '',
        projectIdx: '',
        clusterIdx: '',
        // yaml: '',
      }
    },
    initReplicaSetDataList(state) {
      state.dataList = []
    },

    // [Replica Set 리스트 정보] 객체 생성
    changeList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = []
      result.content.forEach(e => {
        console.log('e', e)
        const item = {
          replicaSetIdx: e.replicaSetIdx,
          name: e.name,
          clusterName: e.clusterName,
          namespace: e.namespace,
          pod: `${e.runningPod}/${e.desiredPod}`,
          image: e.image,
          age: `${date.getDiffFromToday(e.age)}`,
          label: '',
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

    // [Replica Set 상세 정보] 객체 생성
    changeDetailInfo(state, payload) {
      state.detailInfo = {}

      const { data } = payload
      const { result } = data
      console.log('result', result)
      if (result) {
        state.detailInfo.replicaSetIdx = result.replicaSetIdx
        state.detailInfo.name = result.name
        state.detailInfo.namespace = result.namespace
        state.detailInfo.uid = result.uid
        state.detailInfo.image = result.image
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
        state.detailInfo.createdAt = result.createdAt
        state.detailInfo.runningPod = result.runningPod
        state.detailInfo.desiredPod = result.desiredPod
        state.detailInfo.clusterId = result.clusterId
        state.detailInfo.clusterIdx = result.clusterIdx
        state.detailInfo.clusterName = result.clusterName

        const podList = []
        if (result.pods) {
          result.pods.forEach(e => {
            console.log('e', e)
            const item = {
              name: e.name,
              namespace: e.namespace,
              node: e.node,
              status: e.status,
              createAt: `${date.getDiffFromToday(e.createdAt)}`,
              label: '',
            }
            if (e.label) {
              for (const [key, value] of Object.entries(e.label)) {
                item.label += `${key}:${value}`
              }
            }
            podList.push(item)
          })
        }
        state.detailInfo.podList = podList
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
    // Replica Set 리스트 정보 조회 요청
    async getList({ commit }, payload) {
      console.log('[payload]', payload)
      const param = {
        page: 1,
        size: 100,
        sort: 'desc',
        property: 'replicaSetIdx',
        clusterIdx: payload.clusterIdx,
        namespaceIdx: payload.namespaceIdx,
      }

      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      try {
        const response = await api.getAllData(
          request.getReplicaSetListUsingGET,
          param,
        )
        console.log('getList', response)
        commit('changeList', response)
      } catch (error) {
        console.error(error)
      }
    },
    // Replica Set 상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      console.log('getDetail', payload)
      const response = await request.getReplicaSetUsingGET(payload)
      commit('changeDetailInfo', response)
      console.log('response', response)
    },
    // Replica Set yaml 정보 조회 요청
    async getYaml(context, payload) {
      const response = await request.getReplicaSetYamlUsingGET(payload)
      return response
    },
    // Replica Set 생성 요청
    async createReplicaSet(context, payload) {
      const response = await request.registerReplicaSetUsingPOST(payload)
      return response
    },
    // Replica Set 수정 요청
    async updateReplicaSet(context, payload) {
      const response = await request.updateReplicaSetUsingPUT(payload)
      return response
    },
    // Replica Set 삭제 요청
    async deleteReplicaSet(context, payload) {
      const response = await request.deleteReplicaSetUsingDELETE(payload)
      return response
    },
    async getPodList({ commit }, payload) {
      const response = await request.getPodListByOwnerUsingPOST(payload)
      commit('changePodList', response)
    },
  },
}

export default resource
