import { api } from '@/utils/common'
import request from '@/lib/request'
import _ from 'lodash'
import {
  pubClusterInit,
  nodePoolInit,
  networkInit,
  makeClusterParameter,
} from './pubCluster'

const pubInitData = { ...pubClusterInit, ...nodePoolInit, ...networkInit }

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    dataDetail: {
      clusterIdx: null,
      clusterName: '',
      provider: '',
      providerVersion: '',
      status: '',
      problem: [],
      createdAt: '',
      masterCount: 0,
      workerCount: 0,
      pvCount: 0,
      storageClassCount: 0,
      clusterId: 0,
      provisioningType: '',
      provisioningStatus: '',
      provisioningLog: '',
      provisioningUser: '',
      projectIdx: '',
      isOpenEditScaleModal: false,
    },
    dataForm: {
      displayClusterName: '',
      projectIdx: null,
      clusterIdx: null,
      clusterName: '',
      provider: '',
      cspAccountUuid: '',
      description: '',
      provisioningType: '',
      kubeConfig: '',
      provisioningUser: '',
      nodes: [],
      originalNodes: [],
    },
    publicNewClusterForm: { ...pubInitData },
    vSphereForm: {
      kubernetesVersion: '',
      templateName: '',
      controlPlaneIp: '',
      // ipPool: {
      //   start: '',
      //   end: '',
      // },
      masterSpec: {},
      workerSpec: {},
    },
    templateList: [],
    monitoringAddOnData: {},
    timeoutList: [],
    monitoringIframeUrl: '',
    isShowEditModal: false,
  },
  getters: {
    dataList(state) {
      return state.dataList
    },
    dataListSize(state) {
      return state.dataList.length
    },
    dataDetail(state) {
      return state.dataDetail
    },
    dataForm(state) {
      return state.dataForm
    },
    monitoringAddOnData(state) {
      return state.monitoringAddOnData
    },
    provisioningStatus(state) {
      return state.dataDetail.provisioningStatus
    },
    publicNewClusterForm(state) {
      return state.publicNewClusterForm
    },
    privateVsphereNewClusterForm(state) {
      return state.vSphereForm
    },
    pubInitData() {
      return pubInitData
    },
    pubClusterInit() {
      return pubClusterInit
    },
    nodePoolInit() {
      return nodePoolInit
    },
    networkInit() {
      return networkInit
    },
    provider(state) {
      return state.dataForm.provider
    },
    templates(state) {
      return state.templateList
    },
    isOpenEditScaleModal(state) {
      return state.isOpenEditScaleModal
    },
  },
  mutations: {
    // state 데이터 초기화
    // List
    initDataList(state) {
      state.dataList = []
    },
    // Detail
    initDataDetail(state) {
      state.dataDetail = {
        clusterIdx: null,
        clusterId: 0,
        clusterName: '',
        provider: '',
        providerVersion: '',
        status: '',
        problem: [],
        createdAt: '',
        provisioningType: '',
        provisioningStatus: '',
        provisioningLog: '',
        provisioningUser: '',
        masterCount: 0,
        workerCount: 0,
        pvCount: 0,
        storageClassCount: 0,
        availableMasterPercent: 0,
        availableWorkerPercent: 0,
        namespaceCount: 0,
        podCount: 0,
        pvcCount: 0,
        monitoringServiceUrl: '',
        workJobIdx: null,
        projectIdx: '',
        cspAccountUuid: '',
      }
    },
    // Reg/Edit Form
    initDataForm(state) {
      state.dataForm = {
        clusterIdx: null,
        clusterName: '',
        provider: '',
        provisioningType: '',
        kubeConfig: '',
        description: '',
        provisioningUser: '',
        nodes: [],
        originalNodes: [],
        projectIdx: null,
        cspAccountUuid: '',
      }
    },
    // List 데이터 설정
    setDataList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = []
      result.content.forEach(e => {
        const item = {
          // img: 'icon_cloud.svg', // icon_vm-ware.svg
          ...e,
        }
        if (e.provider.toLowerCase() === 'kubernetes') {
          item.img = 'icon_k8s.svg'
        } else if (e.provider.toLowerCase() === 'vmware') {
          item.img = 'icon_vm-ware.svg'
        }
        // TODO -> provider 넘어오는 데이터 확인후 수정
        else if (e.provider.toLowerCase() === 'azure') {
          item.img = 'icon_azer.svg'
        } else if (e.provider.toLowerCase() === 'gcp') {
          item.img = 'icon_cloud.svg'
        } else if (e.provider.toLowerCase() === 'aws') {
          item.img = 'icon_eks.svg'
        } else if (e.provider.toLowerCase() === 'naver') {
          item.img = 'icon_naver.png'
        } else if (e.provider.toLowerCase() === 'vmware') {
          item.img = 'icon_vSphere.png'
        } else {
          item.img = 'icon_cloud.svg'
        }

        dataList.push(item)
      })
      state.dataList = dataList
      // right?
    },
    // Detail 데이터 설정
    setDataDetail(state, payload) {
      const { data } = payload
      const { result } = data
      console.log('result', result)
      if (result) {
        // main information
        state.dataDetail.clusterIdx = result.clusterIdx
        state.dataDetail.clusterName = result.clusterName
        state.dataDetail.provider = result.provider
        state.dataDetail.providerVersion = result.providerVersion
        state.dataDetail.description = result.description
        state.dataDetail.clusterId = result.clusterId
        state.dataDetail.createdAt = result.createdAt

        // status information
        state.dataDetail.status = result.status
        state.dataDetail.problem = result.problem || []

        // provisioning information
        state.dataDetail.provisioningType = result.provisioningType
        state.dataDetail.provisioningStatus = result.provisioningStatus
        state.dataDetail.provisioningLog = result.provisioningLog
        // ? result.provisioningLog.replace(/\n/gi, '<br/>')
        // : ''
        state.dataDetail.provisioningUser = result.provisioningUser

        // work job
        state.dataDetail.workJobIdx = result.workJobIdx
        state.dataDetail.projectIdx = result.projectIdx
      }
    },
    // Detail(요약정보) 설정
    setDataSummary(state, payload) {
      const { data } = payload
      const { result } = data
      console.log('setDataSummary result', result)
      if (result) {
        // summary information
        state.dataDetail.masterCount = result.masterCount
        state.dataDetail.workerCount = result.workerCount
        state.dataDetail.availableMasterPercent = result.availableMasterPercent
        state.dataDetail.availableWorkerPercent = result.availableWorkerPercent
        state.dataDetail.namespaceCount = result.namespaceCount
        state.dataDetail.podCount = result.podCount
        state.dataDetail.pvcCount = result.pvcCount
        state.dataDetail.pvCount = result.pvCount
        state.dataDetail.storageClassCount = result.storageClassCount
        state.dataDetail.monitoringServiceUrl = result.monitoringServiceUrl
      }
    },

    setDataFormClusterInfo(state, payload) {
      state.dataForm.projectIdx = payload.projectIdx
      state.dataForm.clusterIdx = payload.clusterIdx
      state.dataForm.clusterName = payload.clusterName
      state.dataForm.provider = payload.provider
      state.dataForm.cspAccountUuid = payload.cspAccountUuid
      state.dataForm.description = payload.description
    },
    setDataFormKubespray(state, payload) {
      state.dataForm.provisioningType = 'KUBESPRAY'
      state.dataForm.provisioningUser = payload.provisioningUser
      state.dataForm.nodes = payload.nodes
      state.dataForm.originalNodes = payload.originalNodes
    },
    initDataFormKubespray(state) {
      state.dataForm.provisioningUser = ''
      state.dataForm.nodes = []
      state.dataForm.originalNodes = []
    },
    setDataFormKubeConfig(state, payload) {
      state.dataForm.projectIdx = payload.projectIdx
      state.dataForm.provisioningType = 'KUBECONFIG'
      state.dataForm.kubeConfig = payload.kubeConfig
    },
    initDataFormKubeConfig(state) {
      state.dataForm.kubeConfig = ''
    },
    setMonitoringAddOn(state, payload) {
      const { data } = payload
      const { result } = data
      state.monitoringAddOnData = result || {}
    },
    setClusterListStatus(state, data) {
      const { result } = data
      const idx = state.dataList.findIndex(item => {
        if (item.clusterIdx === result.clusterIdx) {
          return item
        }
        return false
      })
      state.dataList[idx].status = result.status
      state.dataList[idx].nodeCount = result.nodeCount
    },
    setClusterStatus(state, payload) {
      state.dataDetail.status = payload.status
      state.dataDetail.provisioningStatus = payload.status
        ? payload.status.toUpperCase()
        : ''
      state.dataDetail.nodeCount = payload.nodeCount
    },
    removeItem(state, payload) {
      const idx = state.dataList.findIndex(item => item.clusterIdx === payload)
      state.dataList.splice(idx, 1)
    },
    addTimeoutIdx(state, index) {
      state.timeoutList.push(index)
    },
    initTimeoutList(state) {
      state.timeoutList = []
    },
    setInitTargetData(state, payload) {
      if (payload === undefined) {
        // 전체 초기화
        state.publicNewClusterForm = _.cloneDeep(pubInitData)
        state.publicNewClusterForm.cloudType = state.dataForm.provider
      } else {
        // 단계별 초기화
        const keys = Object.keys(payload)
        keys.forEach(key => {
          state.publicNewClusterForm[key] = _.cloneDeep(payload[key])
        })
      }
    },
    setPublicNewClusterForm(state, payload) {
      if (payload) {
        state.publicNewClusterForm = payload
      }
    },
    setPrivateVsphereNewClusterForm(state, payload) {
      if (payload) {
        state.vSphereForm = payload
      }
    },
    setTemplateList(state, payload) {
      if (payload) {
        state.templateList = payload
      }
    },
    setMonitoringIframeUrl(state, payload) {
      state.monitoringIframeUrl = payload || null
    },
    changeShowEditModal: (state, payload) => {
      state.isShowEditModal = payload
    },
    openEditScaleModal(state) {
      state.isOpenEditScaleModal = true
    },
    closeEditScaleModal(state) {
      state.isOpenEditScaleModal = false
    },
  },
  actions: {
    // 목록 정보 조회 요청
    async getDataList({ commit }) {
      const param = {
        page: 1,
        size: 100,
        sort: 'desc',
        property: 'clusterIdx',
      }

      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      const response = await api.getAllData(
        request.getCluterListUsingGET,
        param,
      )
      commit('setDataList', response)
    },
    // 상세 정보 조회 요청
    async getDataDetail({ commit }, payload) {
      try {
        const response = await request.getClusterUsingGET(payload)
        commit('setDataDetail', response)
        return true
      } catch (error) {
        commit(
          'alert/openAlert',
          {
            title: error.response.data.detail,
            type: 'error',
          },
          { root: true },
        )
        return false
      }
    },
    // 상세 요약 정보 조회 요청
    async getDataSummary({ commit }, payload) {
      const response = await request.getClusterSummaryUsingGET(payload)
      commit('setDataSummary', response)
    },
    // 상세 정보 조회 요청 - 수정
    async getDataForm({ commit }, payload) {
      const response = await request.getClusterUsingGET(payload)
      const { provider } = response.data.result
      const { provisioningType } = response.data.result
      const { result } = response.data

      commit('setDataFormClusterInfo', result)

      if (provider === 'Kubernetes') {
        if (provisioningType === 'KUBESPRAY') {
          commit('setDataFormKubespray', result)
        } else if (provisioningType === 'KUBECONFIG') {
          commit('setDataFormKubeConfig', result)
        }
      }

      return response
    },
    // 등록 요청
    async createData(context, payload) {
      const response = await request.registerClusterUsingPOST(payload)
      return response
    },
    // 수정 요청
    async updateData(context, payload) {
      const response = await request.updateClusterUsingPUT(payload)
      return response
    },
    // 삭제 요청
    async deleteData(context, payload) {
      const response = await request.deleteClusterUsingDELETE(payload)
      return response
    },
    // (Cluster) 이름 중복 확인
    async checkName(context, payload) {
      const response = await request.isClusterDuplicationUsingGET(payload)
      return response
    },
    // (Kube Config) 연결 확인
    async checkConnection(context, payload) {
      const response = await request.isClusterConnectionUsingPOST(payload)
      return response
    },
    async getClusterMonotoring({ commit }, payload) {
      try {
        const response = await request.getClusterMonitoringAddonUsingGET(
          payload,
        )
        commit('setMonitoringAddOn', response)
      } catch (error) {
        console.log(error)
      }
    },
    async installMonitoringAddOn({ dispatch }, payload) {
      try {
        const response = await request.installUsingPOST(payload)
        if (response.data.result) {
          const params = { clusterIdx: payload.clusterIdx }
          dispatch('getClusterMonotoring', params)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getDataStatus({ commit, dispatch }, payload) {
      const { params, type } = payload
      try {
        const { data } = await request.getClusterStatusUsingGET(params)
        // 1분마다 재호출
        console.log(data.result.status)
        if (
          data.result.status !== 'Deploying' &&
          data.result.status !== 'Waiting' &&
          data.result.status !== 'Deleting' &&
          data.result.status !== 'Scale out' &&
          data.result.status !== 'Scale in'
        ) {
          if (data.result.status === 'deleted') {
            if (type === 'detail') {
              commit('setClusterStatus', data.result)
            } else {
              dispatch('getDataList')
            }

            commit(
              'alert/openAlert',
              { title: 'Cluster has been deleted.', type: 'info' },
              { root: true },
            )
          } else if (data.result.status === 'Healthy') {
            if (type === 'detail') {
              commit(
                'alert/openAlert',
                {
                  title: 'Cluster deployment is complete.',
                  type: 'info',
                },
                { root: true },
              )
              dispatch('getDataDetail', { clusterIdx: params.clusterIdx })
            } else {
              commit('setClusterListStatus', data)
            }
          }
        } else {
          const index = setTimeout(() => {
            dispatch('getDataStatus', payload)
          }, 10000)
          console.log(index)
          commit('addTimeoutIdx', index)
        }
      } catch (error) {
        // 이미 삭제가 완료된 데이터
        if (type === 'detail') {
          dispatch('setClusterStatus', {
            status: 'deleted',
            provisioningStatus: 'DELETED',
          })
        } else {
          dispatch('getDataList')
        }
        // commit(
        //   'alert/openAlert',
        //   {
        //     title: '데이터를 가져오는데 실패했습니다.',
        //     type: 'error',
        //   },
        //   { root: true },
        // )
      }
    },
    async createPublicCluster({ commit, state }) {
      // TODO 임시(리팩토링 필요)
      let params = {
        callbackUrl: '',
        cloudProvider: state.dataForm.provider,
      }
      const povisioningParam = makeClusterParameter(state)

      params = { ...params, povisioningParam }
      const { data } = await request.provisioningClusterUsingPOST({
        ...params,
        header: {},
      })
      if (data.result) {
        commit(
          'alert/openAlert',
          {
            title: 'Cluster creation requested.',
            type: 'info',
          },
          { root: true },
        )
        return true
      }
      return false
    },
    async getTemplateList({ commit }, payload) {
      const { data } = await request.getTemplatesUsingGET(payload)
      if (data.result) {
        commit('setTemplateList', data.result)
      } else {
        commit('setTemplateList', null)
      }
    },
    async createPrivateVsphereCluster({ commit, state }) {
      // TODO 임시(리팩토링 필요)
      let params = {
        callbackUrl: '',
        cloudProvider: state.dataForm.provider,
      }

      const povisioningParam = {
        projectIdx: state.dataForm.projectIdx,
        clusterName: state.dataForm.clusterName,
        clusterDesc: state.dataForm.description,
        kubernetesVersion: state.vSphereForm.kubernetesVersion,
        templateName: state.vSphereForm.templateName,
        controlPlaneIp: state.vSphereForm.controlPlaneIp,
        // ipPool: {
        //   start: state.vSphereForm.ipPool.start,
        //   end: state.vSphereForm.ipPool.end,
        // },
        masterSpec: !state.vSphereForm.masterSpec
          ? null
          : {
              cpu: Number(state.vSphereForm.masterSpec.cpu),
              memory: Number(state.vSphereForm.masterSpec.memory),
              storage: Number(state.vSphereForm.masterSpec.storage),
              nodeCount: Number(state.vSphereForm.masterSpec.nodeCount),
            },
        workerSpec: {
          cpu: Number(state.vSphereForm.workerSpec.cpu),
          memory: Number(state.vSphereForm.workerSpec.memory),
          storage: Number(state.vSphereForm.workerSpec.storage),
          nodeCount: Number(state.vSphereForm.workerSpec.nodeCount),
        },
      }

      params = { ...params, povisioningParam }

      const { data } = await request.provisioningClusterUsingPOST({
        ...params,
        header: {},
      })
      if (data.result) {
        commit(
          'alert/openAlert',
          {
            title: 'Cluster creation requested.',
            type: 'info',
          },
          { root: true },
        )
        return true
      }
      return false
    },
    async getMonitoringData({ commit }, payload) {
      const { data } = await request.getGrafanIframeUrlUsingGET(payload)
      if (data.result) {
        commit('setMonitoringIframeUrl', data.result)
      } else {
        commit('setMonitoringIframeUrl', null)
      }
    },
  },
}

export default resource
