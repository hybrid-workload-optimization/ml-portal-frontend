import request from '@/lib/request'
import { api } from '@/utils/common'

const resource = {
  namespaced: true,
  state: {
    // ml 변수 선언 시작
    dataList: [],
    detailInfo: {},
    clusters: [],
    clusterSize: 0,

    mlStep: '',
    jobCount: '',
    deploymentCount: '',
    cronJobCount: '',
    daemonSetCount: '',
    replicaSetCount: '',

    newMLName: '',
    newDescription: '',
    newMLStepCode: '',
    newMLYaml: '',

    isOpenEditScaleModal: false,
    isOpenDeleteResourceModal: false,
    // ml 변수 선언 끝
  },

  getters: {
    clusters(state) {
      return state.clusters
    },
    dataList(state) {
      return state.dataList
    },
    dataListSize(state) {
      return state.dataList.length.toString()
    },
    detailInfo(state) {
      return state.detailInfo
    },
    isOpenEditScaleModal(state) {
      return state.isOpenEditScaleModal
    },
    isOpenDeleteResourceModal(state) {
      return state.isOpenDeleteResourceModal
    },
  },

  mutations: {
    initMLInfo(state) {
      state.newWMLName = null
      state.newDescription = ''
      state.newMLStepCode = null
      state.newMLYaml = null
    },

    // ML 조회 리스트
    getMLList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = []
      result.content.forEach(e => {
        const item = {
          id: e.id,
          mlId: e.mlId,
          name: e.name,
          description: e.description,
          mlStep: e.mlStep,
          status: e.status,
          resource: e.resourceCount,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
          userId: e.userId,
        }
        dataList.push(item)
      })
      state.dataList = dataList
    },

    // ML 데이터 조회
    // TODO -> 추후 세분화 작업
    getMLDetail(state, payload) {
      state.detailInfo = {}
      const { data } = payload
      const { result } = data

      if (result) {
        state.detailInfo.id = result.id
        state.detailInfo.mlId = result.mlId
        state.detailInfo.name = result.name
        state.detailInfo.description = result.description
        state.detailInfo.mlStepCode = result.mlStepCode
        state.detailInfo.status = result.status
        state.detailInfo.projectPmEmail = result.projectPmEmail
        state.detailInfo.createdAt = result.createdAt
        state.detailInfo.updatedAt = result.updatedAt
        state.detailInfo.userId = result.userId

        state.detailInfo.activeCount = result.activeCount
        state.detailInfo.succeededCount = result.succeededCount
        state.detailInfo.failedCount = result.failedCount

        state.detailInfo.clusters = result.clusters
        state.detailInfo.clusterSize = result.clusters.length.toString()

        state.detailInfo.mlStep = result.mlStep
        state.detailInfo.jobCount = result.jobCount
        state.detailInfo.deploymentCount = result.deploymentCount
        state.detailInfo.cronJobCount = result.cronJobCount
        state.detailInfo.daemonSetCount = result.daemonSetCount
        state.detailInfo.replicaSetCount = result.replicaSetCount

        state.detailInfo.resources = result.resources

        state.detailInfo.promethusUrl = result.promethusUrl
        state.detailInfo.grafanaUrl = result.grafanaUrl
        state.detailInfo.monitoringUrl = result.monitoringUrl
      }
    },

    // 클러스터 값이 바뀌면 호출
    initClusters(state) {
      state.detailInfo.clusters[0].status = null
    },

    getResourceList(state, param) {
      const resources = []
      state.detailInfo.resources.forEach(e => {
        if (e.id !== param) {
          const item = {
            createdAt: e.createdAt,
            id: e.id,
            kind: e.kind,
            name: e.name,
            pod: e.pod,
            resourceId: e.resourceId,
            runningPodCount: e.runningPodCount,
            status: e.status,
            totalPodCount: e.totalPodCount,
            uid: e.uid,
            updatedAt: e.updatedAt,
            yaml: e.yaml,
          }

          resources.push(item)
        }
      })
      state.detailInfo.resources = []
      state.detailInfo.resources = resources
    },

    openEditScaleModal(state) {
      state.isOpenEditScaleModal = true
    },
    closeEditScaleModal(state) {
      state.isOpenEditScaleModal = false
    },
    openDeleteResourceModal(state) {
      state.isOpenDeleteResourceModal = true
    },
    closeDeleteResourceModal(state) {
      state.isOpenDeleteResourceModal = false
    },
    // ML 데이터 처리 끝
  },

  actions: {
    // 머신러닝 api 호출 시작
    async getList({ commit }, payload) {
      const param = {
        userId: payload.userId,
        name: payload.projectName,
        pageRequest: {
          page: 1,
          size: 100,
        },
      }

      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      const response = await api.getAllData(request.getMlListUsingPOST, param)
      // const response = await request.getStatefulSetListUsingGET(payload)
      commit('getMLList', response)
    },

    // ML 상세 정보 조회 요청
    async getDetail({ commit, dispatch }, payload) {
      const response = await request.getMlDetailUsingGET(payload)
      commit('getMLDetail', response)

      // 응답값의 status가 Pending일때 1분마다 재호출 하여 cluster status 변화 적용
      setTimeout(() => {
        if (this.state.ml.detailInfo.status === 'Pending') {
          dispatch('getDetail', payload)
        }
      }, 30000)

      return response
    },

    // ML 신규 생성 요청
    async createML(context, payload) {
      const response = await request.createUsingPOST(payload)
      return response
    },
    // ML Resource 삭제 요청
    // ML Detail 에서 Resource List에 있는 delete 버튼 클릭시 호출
    async deleteMLResource(context, payload) {
      const response = await request.deleteResourceUsingDELETE(payload)
      return response
    },
    // ML Cluster Scale 조정 요청
    async updateClusterScale(context, payload) {
      // const response = await request.scaleUsingPOST(payload)
      console.log(payload)

      const response = await request.scaleUsingPOST_1({
        ...payload,
        header: {},
      })
      return response
    },

    // ML 삭제 요청
    async deleteML(context, payload) {
      const response = await request.deleteUsingDELETE_2(payload)
      return response
    },
    // 머신러닝 api 호출 끝
  },
}

export default resource
