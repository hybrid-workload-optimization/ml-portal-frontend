import request from '@/lib/request'

const resource = {
  namespaced: true,
  state: {
    nodeState: {
      projectCount: 0,
      clusterCount: 0,
      nodeCount: 0,
      masterCount: 0,
      workerCount: 0,
      masterReadyCount: 0,
      workerReadyCount: 0,
      totalUtilization: 0,
      masterUtilization: 0,
      workerUtilization: 0,
      restartWithinTenMinutes: 0,
      nodeUtilizationState: '',
    },
    nodeData: [
      { name: 'Power on', value: 0 },
      { name: 'Power off', value: 0 },
    ],
    masterData: [
      { name: 'Power on', value: 0 },
      { name: 'Power off', value: 0 },
    ],
    workerData: [
      { name: 'Power on', value: 0 },
      { name: 'Power off', value: 0 },
    ],
    nodeList: [],
    dashboardData: {
      clusterCount: 0,
      clusterSummaryList: [],
      controlPlaneCount: 0,
      controlPlaneReadyCount: 0,
      controlPlaneUtilization: 0,
      nodeCount: 0,
      nodeUtilizationState: 'Good',
      restartWithinTenMinutes: 0,
      totalUtilization: 0,
      workerCount: 0,
      workerReadyCount: 0,
      workerUtilization: 0,
      workloadCount: 0,
    },
    selectItem: null,
  },
  getters: {
    nodeState(state) {
      return state.nodeState
    },
    nodeData(state) {
      const powerOn =
        state.nodeState.masterReadyCount + state.nodeState.workerReadyCount
      const powerOff =
        state.nodeState.nodeCount -
        (state.nodeState.masterReadyCount + state.nodeState.workerReadyCount)

      const data = [
        {
          name: 'Power on',
          value: powerOn,
        },
        {
          name: 'Power off',
          value: powerOff,
        },
      ]
      return data
    },
    masterData(state) {
      const powerOn = state.nodeState.masterReadyCount
      const powerOff =
        state.nodeState.masterCount - state.nodeState.masterReadyCount

      const data = [
        {
          name: 'Power on',
          value: powerOn,
        },
        {
          name: 'Power off',
          value: powerOff,
        },
      ]
      return data
    },
    workerData(state) {
      const powerOn = state.nodeState.workerReadyCount
      const powerOff =
        state.nodeState.workerCount - state.nodeState.workerReadyCount

      const data = [
        {
          name: 'Power on',
          value: powerOn,
        },
        {
          name: 'Power off',
          value: powerOff,
        },
      ]
      return data
    },
    nodeList(state) {
      return state.nodeList
    },
    dashboardData(state) {
      return state.dashboardData
    },
    selectItem(state) {
      return state.selectItem
    },
  },
  mutations: {
    //   state 데이터 초기화
    initNodeState(state) {
      state.nodeState = {
        projectCount: 0,
        clusterCount: 0,
        nodeCount: 0,
        masterCount: 0,
        workerCount: 0,
        masterReadyCount: 0,
        workerReadyCount: 0,
        totalUtilization: 0,
        masterUtilization: 0,
        workerUtilization: 0,
        restartWithinTenMinutes: 0,
        nodeUtilizationState: '',
      }
      state.nodeList = []
    },

    // 노드 상태 데이터 생성
    changeNodeStatus(state, payload) {
      const { data } = payload
      const { result } = data
      if (result) {
        state.nodeState.projectCount = result.projectCount
        state.nodeState.clusterCount = result.clusterCount
        state.nodeState.nodeCount = result.nodeCount
        state.nodeState.masterCount = result.masterCount
        state.nodeState.workerCount = result.workerCount
        state.nodeState.masterReadyCount = result.masterReadyCount
        state.nodeState.workerReadyCount = result.workerReadyCount
        state.nodeState.totalUtilization = result.totalUtilization
        state.nodeState.masterUtilization = result.masterUtilization
        state.nodeState.workerUtilization = result.workerUtilization
        state.nodeState.restartWithinTenMinutes = result.restartWithinTenMinutes
        state.nodeState.nodeUtilizationState = result.nodeUtilizationState
      }
    },
    changeNodeList(state, payload) {
      const { data } = payload
      const { result } = data
      if (result) {
        const dataList = []
        result.forEach(e => {
          const item = {
            id: e.id,
            name: e.name,
            ip: e.ip,
            projectName: e.projectName,
            status: e.status,
            k8sVersion: e.k8sVersion,
            allocatedCpu: e.allocatedCpu,
            allocatedMemory: Math.round(e.allocatedMemory / 1024),
            clusterName: e.clusterName,
            clusterIdx: e.clusterIdx,
            role: e.role.length ? e.role.join(', ') : '',
            podStatus: e.podStatus,
            cpu: Math.round(e.detailChart.cpuRequestsFraction),
            memory: Math.round(e.detailChart.memoryRequestsFraction),
          }
          dataList.push(item)
        })

        state.nodeList = dataList
      }
    },
    changeDashboardData(state, payload) {
      const { data } = payload
      const { result } = data || {}
      state.dashboardData = result
    },
    changeSelectItem(state, payload) {
      state.selectItem = payload
    },
  },
  actions: {
    // 노드 상태 정보 조회 요청
    async getNodeState({ commit }, payload) {
      const response = await request.getNodeStateUsingGET(payload)
      commit('changeNodeStatus', response)
    },

    // 노드 리스트 조회 요청
    async getNodeList({ commit }, payload) {
      const response = await request.getNodeListUsingGET(payload)
      commit('changeNodeList', response)
    },
    // 노드 리스트 조회 요청
    async getDashboardData({ commit }, payload) {
      const response = await request.getDashboardGeneralUsingGET(payload)
      commit('changeDashboardData', response)
    },
    // 대시보드 셀렉트 박스 값 저장
    setSelectItem({ commit }, payload) {
      commit('changeSelectItem', payload)
    },
  },
}

export default resource
