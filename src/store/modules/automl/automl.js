import request from '@/lib/MLHPrequest'

const resource = {
  namespaced: true,
  state: {
    dataList: [], // list Data
    hpDataList: [], // hp List Data
    detailInfo: [], // detail Data
    detailList: [], // detail List Data

    optimalTrialList: {},
  },

  getters: {
    dataList(state) {
      return state.dataList
    },
    hpDataList(state) {
      return state.hpDataList
    },
    dataListSize(state) {
      return state.hpDataList.length
    },
    detailInfo(state) {
      return state.detailInfo
    },
    detailList(state) {
      return state.detailList
    },
    detailListSize(state) {
      return state.detailInfo.size
    },
    optimalTrialList(state) {
      // console.log('test :: ', state.optimalTrialList)
      return state.optimalTrialList
    },
  },

  mutations: {
    // HP 생성 초기화
    // initCreateHP(state) {
    //   state.example = ''
    //   state.name = ''
    //   state.namespace = ''
    //   state.status = ''
    // },

    // AUTO ML response 리스트
    getAllList(state, payload) {
      state.dataList = []
      state.dataList = payload.data
    },

    // AUTO ML 조회 리스트
    getHPList(state, payload) {
      const hpDataList = []
      payload.data.items.forEach(e => {
        // metrics의 첫번째 값(최적화 값)을 출력해준다.
        const optimalTrialValue = `${Object.keys(e.metrics)[0]}:
        ${e.metrics[Object.keys(e.metrics)[0]]}`
        const item = {
          namespace: payload.data.namespace,
          name: e.name,
          status: e.status,
          algorithm: e.algorithm,
          lr: e.parameter.lr,
          numLayers: e.parameter['num-layers'],
          optimizer: e.parameter.optimizer,
          optimalTrial: optimalTrialValue,
        }
        hpDataList.push(item)
      })
      state.hpDataList = []
      state.hpDataList = hpDataList
    },

    // AUTO ML Detail
    getAllDetail(state, payload) {
      state.detailInfo = []
      state.detailInfo = payload.data
    },

    // AUTO ML Detail
    getHPDetail(state, payload) {
      const detailList = []
      // console.log('payload.data.items == ', payload.data.items)
      payload.data.items.forEach(e => {
        // metrics의 첫번째 값(최적화 값)을 출력해준다.
        const optimalTrialValue = `${Object.keys(e.metric)[0]}:
        ${e.metric[Object.keys(e.metric)[0]]}`
        const items = {
          name: e.name,
          status: e.status,
          successful: e.successful,
          running: e.running,
          failed: e.failed,
          metric: optimalTrialValue,
          age: e.age,
        }
        detailList.push(items)
      })
      state.detailList = []
      state.detailList = detailList
    },

    // Tool Tip Data 리스트
    getOptimalTrialList(state, payload) {
      const optimalTrialList = []
      payload.data.items.forEach(e => {
        const item = {
          validationAccuracy: e.metrics['Validation-accuracy'],
          trainAccuracy: e.metrics['Train-accuracy'],
          rmsse: e.metrics.RMSSE,

          lr: e.parameter.lr,
          numLayers: e.parameter['num-layers'],
          optimizer: e.parameter.optimizer,
        }

        optimalTrialList.push(item)
      })
      state.optimalTrialList = []
      state.optimalTrialList = optimalTrialList
    },

    // Tool Tip Data 리스트(Detail)
    getOptimalTrialListForDetail(state, payload) {
      const optimalTrialList = []
      payload.data.items.forEach(e => {
        const item = {
          validationAccuracy: e.metric['Validation-accuracy'],
          trainAccuracy: e.metric['Train-accuracy'],
          rmsse: e.metric.RMSSE,

          lr: e.paramter.lr,
          numLayers: e.paramter['num-layers'],
          optimizer: e.paramter.optimizer,
        }

        optimalTrialList.push(item)
      })
      state.optimalTrialList = []
      state.optimalTrialList = optimalTrialList
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
  },

  actions: {
    async getList({ commit }, payload) {
      const response = await request.doSuggestionListGET(payload)
      commit('getAllList', response)
      commit('getHPList', response)
      commit('getOptimalTrialList', response)

      // setTimeout(() => {
      //   dispatch('getList', payload)
      // }, 300000)
    },

    // ML 상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      const response = await request.doSuggestionDetailGET(payload)
      commit('getAllDetail', response)
      commit('getHPDetail', response)
      commit('getOptimalTrialListForDetail', response)

      // setTimeout(() => {
      //   dispatch('getDetail', payload)
      // }, 300000)

      return response
    },

    // New Deploy Experiments
    async createDepolyExperiments(context, payload) {
      const response = await request.createExperimentDeployPut(payload)
      console.log('create response == ', response)
      return response
    },

    // Namespace List
    async doNamespaceList(context, payload) {
      const response = await request.doNamespaceListGET(payload)
      return response.data.items
    },

    // Example Version List
    async doExampleVersionList(context, payload) {
      const response = await request.doExampleVersionListGET(payload)
      return response.data.items
    },

    // Algorithm List
    async doAlgorithm(context, payload) {
      const response = await request.doAlgorithmListGET(payload)
      return response.data.items
    },
  },
}

export default resource
