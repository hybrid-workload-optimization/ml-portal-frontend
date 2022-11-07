import request from '@/lib/request'
import { api, date } from '@/utils/common'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    providers: [],
    ruleList: [],
    selectedItem: {},
  },
  getters: {
    dataList(state) {
      return state.dataList
    },
    dataListSize(state) {
      return state.dataList.length
    },
    providers(state) {
      return state.providers
    },
    ruleList(state) {
      return state.ruleList
    },
    selectedItem(state) {
      return state.selectedItem
    },
  },
  mutations: {
    // state 데이터 초기화
    initState(state) {
      state.dataList = []
      state.providers = []
      state.ruleList = []
      state.selectedItem = {}
    },
    initDataList(state) {
      state.dataList = []
    },
    initProvider(state) {
      state.providers = []
    },
    changeDataList(state, payload) {
      const dataList = []
      payload.content.forEach(e => {
        let httpPort = 0
        let httpsPort = 0
        const item = {
          ...e,
          serviceType: e.serviceType,
          defaultYn: e.default ? 'Y' : 'N',
          externalIpStr:
            e.externalIp && e.externalIp.length ? e.externalIp.join(',') : '',
          ports:
            e.port && e.port.length
              ? e.port
                  .map(p => {
                    if (p.protocol === 'http') httpPort = p.port
                    if (p.protocol === 'https') httpsPort = p.port
                    return `${p.protocol}: ${p.port}`
                  })
                  .join(', ')
              : '',
          age: `${date.getDiffFromToday(e.createdAt)}`,
        }
        item.httpPort = httpPort
        item.httpsPort = httpsPort

        dataList.push(item)
      })
      state.dataList = dataList
    },
    changeProviders(state, payload) {
      state.providers = payload
    },
    initSeletedItem(state) {
      state.selectedItem = {}
      state.providers = []
    },
    setSeletedItem(state, payload) {
      state.selectedItem = payload
      state.providers.push(payload.name)
    },
  },
  actions: {
    // 리스트 정보 조회 요청
    async getList({ commit }, payload) {
      try {
        const param = {
          page: 1,
          size: 100,
          clusterIdx: payload.clusterIdx,
        }

        // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
        // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
        // common.js 참고
        const response = await api.getAllData(
          request.getIngressControllerListUsingGET,
          param,
        )
        // const response = await request.getIngressListUsingGET(payload)
        commit('changeDataList', response.data.result)
      } catch (error) {
        console.log(error)
      }
    },
    async getProviderList({ commit }, payload) {
      try {
        console.log(payload) // TODO 이거 이름 바꿔야 함
        const response = await request.getIngressControllerNamesUsingGET(
          payload,
        )
        commit('changeProviders', response.data.result)
        if (response.data.result && !response.data.result.length) {
          commit(
            'alert/openAlert',
            {
              title: '설치 가능한 Ingress Controller이 존재하지 않습니다.',
              type: 'warn',
            },
            { root: true },
          )
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 생성 요청
    async createItem({ commit }, payload) {
      try {
        await request.createIngressControllerUsingPOST(payload)
        commit(
          'alert/openAlert',
          { title: '리소스가 생성 되었습니다.', type: 'info' },
          { root: true },
        )
      } catch (error) {
        commit(
          'alert/openAlert',
          {
            title: '생성 실패했습니다.',
            type: 'error',
          },
          { root: true },
        )
      }
    },
    // 수정 요청
    async updateItem({ commit }, payload) {
      try {
        await request.updateIngressControllerUsingPUT(payload)
        commit(
          'alert/openAlert',
          { title: '리소스가 수정 되었습니다.', type: 'info' },
          { root: true },
        )
      } catch (error) {
        commit(
          'alert/openAlert',
          {
            title: '수정 실패했습니다.',
            type: 'error',
          },
          { root: true },
        )
      }
    },
    // 삭제 요청
    async deleteItem({ commit }, payload) {
      try {
        await request.removeIngressControllerUsingDELETE(payload)
        commit(
          'alert/openAlert',
          { title: '리소스가 삭제 되었습니다.', type: 'info' },
          { root: true },
        )
      } catch (error) {
        commit(
          'alert/openAlert',
          {
            title: '삭제 실패했습니다.',
            type: 'error',
          },
          { root: true },
        )
      }
    },
    async checkIsExistDefault({ commit }, payload) {
      try {
        const response = await request.isExistDefaultControllerUsingGET(payload)
        if (response.data.result) {
          commit(
            'alert/openAlert',
            {
              title: 'Default Ingress Controller는 이미 존재합니다.',
              type: 'warn',
            },
            { root: true },
          )
        }
        return response.data.result
      } catch (error) {
        commit(
          'alert/openAlert',
          {
            title: '다시 시도해 주시기 바랍니다.',
            type: 'error',
          },
          { root: true },
        )
        return true
      }
    },
  },
}

export default resource
