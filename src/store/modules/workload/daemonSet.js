import request from '@/lib/request'
import { api, date } from '@/utils/common'
import moment from 'moment'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      daemonSetIdx: null,
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
      podSize: 0,
      projectIdx: '',
      // yaml: '',
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
    initDaemonSetState(state) {
      state.dataList = []
      state.detailInfo = {
        daemonSetIdx: null,
        name: '',
        namespace: '',
        uid: '',
        image: '',
        annotation: [],
        label: [],
        createdAt: '',
        runningPod: 0,
        desiredPod: 0,
        clusterIdx: '',
        clusterName: '',
        projectIdx: '',
      }
    },
    initDaemonSetDataList(state) {
      state.dataList = []
    },

    // [Daemon Set 리스트 정보] 객체 생성
    changeList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = []
      result.content.forEach(e => {
        console.log('e', e)
        const item = {
          daemonSetIdx: e.daemonSetIdx,
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

    // [Daemon Set 상세 정보] 객체 생성
    changeDetailInfo(state, payload) {
      state.detailInfo = {}

      const { data } = payload
      const { result } = data
      console.log('result === ', result)
      if (result) {
        state.detailInfo.daemonSetIdx = result.daemonSetIdx
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

        state.detailInfo.createdAt = moment(result.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        state.detailInfo.runningPod = result.runningPod
        state.detailInfo.desiredPod = result.desiredPod
        state.detailInfo.clusterIdx = result.clusterIdx
        state.detailInfo.clusterName = result.clusterName
        // state.detailInfo.yaml = result.yaml

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
        state.detailInfo.podSize = podList.length
      }
    },
  },

  actions: {
    // Daemon Set 리스트 정보 조회 요청
    async getList({ commit }, payload) {
      const param = {
        page: 1,
        size: 100,
        sort: 'desc',
        property: 'daemonSetIdx',
        clusterIdx: payload.clusterIdx,
        namespaceIdx: payload.namespaceIdx,
      }

      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      const response = await api.getAllData(
        request.getDaemonSetListUsingGET,
        param,
      )

      commit('changeList', response)
    },

    // Daemon Set 상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      console.log('getDetail', payload)
      const response = await request.getDaemonSetUsingGET(payload)
      commit('changeDetailInfo', response)
    },
    async getDetailNew({ commit }, payload) {
      console.log('getDetail', payload)
      const response = await request.getDetailUsingPOST(payload)
      console.log(response)
      commit('changeDetailInfo', response)
    },

    // Daemon Set yaml 정보 조회 요청
    async getYaml(context, payload) {
      const response = await request.getDaemonSetYamlUsingGET(payload)
      return response
    },

    // Daemon Set 생성 요청
    async createDaemonSet(context, payload) {
      const response = await request.registerDaemonSetUsingPOST(payload)
      return response
    },

    // Daemon Set 수정 요청
    async updateDaemonSet(context, payload) {
      const response = await request.updateDaemonSetUsingPUT(payload)
      return response
    },

    // Daemon Set 삭제 요청
    async deleteDaemonSet(context, payload) {
      const response = await request.deleteDaemonSetUsingDELETE(payload)
      return response
    },
  },
}

export default resource
