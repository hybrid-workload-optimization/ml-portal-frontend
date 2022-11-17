import request from '@/lib/MLHPrequest'

const resource = {
  namespaced: true,
  state: {
    dataList: [], // list Data
    hpDataList: [], // hp List Data
    detailInfo: [], // detail Data
    detaiList: [], // detail List Data
  },

  getters: {
    dataList(state) {
      return state.dataList
    },
    hpDataList(state) {
      return state.hpDataList
    },
    dataListSize(state) {
      return state.dataList.size
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
      state.dataList = payload.data
    },

    // AUTO ML 조회 리스트
    getHPList(state, payload) {
      const hpDataList = []
      payload.data.items.forEach(e => {
        const item = {
          namespace: payload.data.namespace,
          name: e.name,
          status: payload.data.status,
          algorithm: e.algorithm,
          lr: e.parameter.lr,
          numLayers: e.parameter['num-layers'],
          optimizer: payload.data.optimizer,
          optimalTrial: e.metrics['Validation-accuracy'],
        }
        hpDataList.push(item)
      })
      state.hpDataList = hpDataList
    },

    // AUTO ML Detail
    getAllDetail(state, payload) {
      state.detailInfo = payload.data
    },

    // AUTO ML Detail
    getHPDetail(state, payload) {
      const detailList = []
      payload.data.items.forEach(e => {
        // TODO -> 최적화된 실험의 매트릭 계산후 세팅
        const value = e.metric['Validation-accuracy']
        const items = {
          name: e.name,
          status: e.status,
          successful: e.successful,
          running: e.running,
          failed: e.failed,
          metric: value,
          age: e.age,
        }
        detailList.push(items)
      })
      state.detailList = detailList
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
    async getList({ commit, dispatch }, payload) {
      const response = await request.doSuggestionListGET(payload)
      commit('getAllList', response)
      commit('getHPList', response)

      setTimeout(() => {
        dispatch('getList', payload)
      }, 300000)
    },

    // ML 상세 정보 조회 요청
    async getDetail({ commit, dispatch }, payload) {
      const response = await request.doSuggestionDetailGET(payload)
      commit('getAllDetail', response)
      commit('getHPDetail', response)

      setTimeout(() => {
        dispatch('getDetail', payload)
      }, 300000)

      return response
    },

    // New Deploy Experiments
    async createDepolyExperiments(context, payload) {
      const response = await request.createExperimentDeployPut(payload)
      console.log('response == ', response)
      return response
    },
  },
}

export default resource
