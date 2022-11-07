import request from '@/lib/request'
import { api, date } from '@/utils/common'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      id: null,
      clusterId: '',
      name: '',
      namespace: '',
      uid: '',
      cpu: '',
      images: [],
      annotation: [],
      label: {},
      createdAt: '',
      clusterName: '',
      projectIdx: '',
      // yaml: '',
    },
    resourceInfo: {
      node: '',
      status: 0,
      ip: '',
      qosClass: '',
      restart: 0,
    },
    ownerInfo: {
      name: '',
      type: '',
      // pod: '',
      image: '',
      // createdAt: '',
    },
    conditions: [],
    pvcList: [],
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
    ownerInfo(state) {
      return state.ownerInfo
    },
    conditionList(state) {
      return state.conditions
    },
    pvcList(state) {
      return state.pvcList
    },
  },
  mutations: {
    // state 데이터 초기화
    initPodState(state) {
      state.dataList = []
      state.detailInfo = {
        id: null,
        name: '',
        namespace: '',
        uid: '',
        cpu: '',
        images: [],
        annotation: [],
        label: {},
        createdAt: '',
        clusterId: '',
        clusterName: '',
        projectIdx: '',
        yaml: '',
      }
      state.resourceInfo = {
        node: '',
        status: 0,
        ip: '',
        qosClass: '',
        restart: 0,
      }
      state.ownerInfo = {
        name: '',
        type: '',
        pod: '',
        image: '',
        createdAt: '',
      }
      state.conditions = []
      state.pvcList = []
    },
    initPodDataList(state) {
      state.dataList = []
    },
    changeDateList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = []
      result.content.forEach(e => {
        const item = {
          ...e,
          age: `${date.getDiffFromToday(e.createdAt)}`,
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

    // [스테이트풀셋 상세 정보] 객체 생성
    changeDetailInfo(state, payload) {
      state.detailInfo = {}

      const { data } = payload
      const { result } = data
      if (result) {
        state.detailInfo.id = result.id
        state.detailInfo.name = result.name
        state.detailInfo.namespace = result.namespace
        state.detailInfo.uid = result.uid
        state.detailInfo.cpu = result.cpu
        state.detailInfo.memory = result.memory
        state.detailInfo.label = result.label
        state.detailInfo.createdAt = result.createdAt
        state.detailInfo.running = result.runningReplicas
        state.detailInfo.clusterId = result.clusterId
        state.detailInfo.images = result.images
        state.detailInfo.clusterName = result.clusterName
        state.detailInfo.projectIdx = result.projectIdx
        // state.detailInfo.yaml = result.yaml

        if (result.annotation) {
          state.detailInfo.annotation = []
          for (const [key, value] of Object.entries(result.annotation)) {
            state.detailInfo.annotation.push(`${key}:${value}`)
          }
        }

        state.resourceInfo = {
          node: result.node,
          status: result.status,
          ip: result.ip,
          qosClass: result.qosClass,
          restart: result.restart,
        }
        // state.conditions = result.condition
        state.conditions = result.condition

        state.ownerInfo.name = result.ownerName
        state.ownerInfo.type = result.ownerKind
        state.ownerInfo.image =
          result.images && result.images.length ? result.images.join(', ') : ''

        state.pvcList = result.pvcList
      }
    },
    // changeOwnerInfo(state, payload) {
    //   const { data } = payload
    //   const { result } = data
    //   if (result) {
    //     state.ownerInfo = {
    //       ...result,
    //       age: `${date.getDiffFromToday(result.createdAt)}`,
    //     }
    //   }
    // },
    changePvcList(state, payload) {
      const { data } = payload
      const { result } = data
      if (result) {
        state.pvcList = result
      } else {
        state.pvcList = []
      }
    },
  },
  actions: {
    async getList({ commit }, payload) {
      const param = {
        page: 1,
        size: 100,
        ...payload,
      }
      try {
        commit('initPodDataList')
        const response = await api.getAllData(
          request.getPodListUsingGET_1,
          param,
        )
        commit('changeDateList', response)
      } catch (error) {
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    // Pod 상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      try {
        const response = await request.getPodDetailUsingGET_1(payload)
        // const pvcResponse = await request.getPodPersistentVolumeClaimUsingGET({
        //   podName: payload.podName,
        // })
        await commit('changeDetailInfo', response)
        // await commit('changePvcList', pvcResponse)
      } catch (error) {
        console.error(error)
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    async getOwnerInfo({ commit }, { data }) {
      // 2022.05.09 Pod API 변경에 따라 사용x
      try {
        const { result } = data
        const params = {
          podName: result.podName,
          resourceType: result.ownerKind,
        }

        const ownerInfo = await request.getPodOwnerInfoUsingGET(params)
        commit('changeOwnerInfo', ownerInfo)
      } catch (error) {
        console.error(error)
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    // Pod yaml 정보 조회 요청
    async getPodYaml(context, payload) {
      const response = await request.getPodYamlUsingPOST(payload)
      return response
    },
    // Pod 생성 요청
    async createPod(context, payload) {
      const response = await request.createPodUsingPOST_1(payload)
      return response
    },
    // Pod 수정 요청
    async updatePod(context, payload) {
      const response = await request.updatePodUsingPUT(payload)
      return response
    },
    // Pod 삭제 요청
    async deletePod(context, payload) {
      const response = await request.deletePodUsingDELETE_1(payload)
      return response
    },
  },
}

export default resource
