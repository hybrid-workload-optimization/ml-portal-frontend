import request from '@/lib/request'

const resource = {
  namespaced: true,
  state: {
    title: '',
    editType: 'create', // 에디터 타입(create, update)
    content: '',
    originContent: '',
    isOpenModal: false,
    firstSelectVal: '',
    firstSelectItems: [],
    readOnlyKeys: [],
    resourceType: '',
    errorMsg: '',
    yamlHistory: [],
    selectDate: '',
  },
  getters: {
    resourceType(state) {
      return state.resourceType
    },
    title(state) {
      return state.title
    },
    yamlContent(state) {
      return state.content
    },
    orginYamlContent(state) {
      return state.originContent
    },
    isOpenModal(state) {
      return state.isOpenModal
    },
    firstSelectVal(state) {
      return state.firstSelectVal
    },
    firstSelectItems(state) {
      return state.firstSelectItems
    },
    editType(state) {
      return state.editType
    },
    readOnlyKeys(state) {
      return state.readOnlyKeys
    },
    errorMsg(state) {
      return state.errorMsg
    },
    selectDate(state) {
      return state.selectDate
    },
    yamlHistory(state) {
      return state.yamlHistory
    },
  },
  mutations: {
    initModalContent(state) {
      state.title = ''
      state.editType = 'create'
      state.content = ''
      state.originContent = ''
      state.isOpenModal = false
      state.firstSelectVal = ''
      state.firstSelectItems = []
      state.readOnlyKeys = []
      state.resourceType = ''
    },
    changeContent(state, payload) {
      state.content = payload
    },
    openModal(state, payload) {
      state.editType = ''
      state.content = ''
      state.firstSelectVal = ''
      state.firstSelectItems = []
      state.readOnlyKeys = []
      state.originContent = ''
      state.title = ''
      state.resourceType = ''
      state.errorMsg = ''

      const { isEncoding } = payload
      const { content } = payload
      const { editType } = payload
      const { readOnlyKeys } = payload
      const { title } = payload
      const { resourceType } = payload

      state.title = title
      state.editType = editType
      state.resourceType = resourceType
      state.isOpenModal = true
      if (isEncoding) {
        const decodedText = Buffer.from(content, 'base64').toString('utf8')
        state.content = decodedText
        state.originContent = decodedText
      } else {
        state.content = content
        state.originContent = content
      }
      if (readOnlyKeys) {
        state.readOnlyKeys = readOnlyKeys
      }
    },
    closeModal(state) {
      state.title = ''
      state.editType = 'create'
      state.content = ''
      state.originContent = ''
      state.isOpenModal = false
      state.firstSelectVal = ''
      state.firstSelectItems = []
      state.readOnlyKeys = []
      state.resourceType = ''
      state.errorMsg = ''
      state.yamlHistory = []
      state.selectDate = ''
    },
    initFirstSelectState(state) {
      state.firstSelectItems = []
      state.firstSelectVal = ''
    },
    setErrorMsg(state, errMsg) {
      state.errorMsg = errMsg
    },
    setHistory(state, history) {
      state.yamlHistory = history
      state.selectDate = history[0].createAt // 최상단 요소 날짜 설정
    },
    setYamlContent(state, createAt) {
      const target = state.yamlHistory.find(yml => yml.createAt === createAt)
      if (target) {
        state.selectDate = createAt
        const decodedText = Buffer.from(target.yaml, 'base64').toString('utf8')
        state.content = decodedText
        state.originContent = decodedText
      } else {
        console.error('Not Found Yaml History')
      }
    },
  },
  actions: {
    // 헤더 상단 날짜 셀렉트 박스
    changeYaml({ commit }, createAt) {
      commit('setYamlContent', createAt)
    },
    async applyYaml({ commit }, payload) {
      console.log('applyYaml Parameters: ', payload)
      try {
        const { data } = await request.applyUsingPOST_2(payload)
        console.log('apply Yaml Result: ', data)
        // Yaml 생성 완료
        if (data?.result?.success) {
          commit('closeModal')
          return true
        }
        if (data?.result?.errorMessage)
          commit('setErrorMsg', data?.result?.errorMessage)
        throw Error(data)
      } catch (err) {
        console.error(err)
        return false
      }
    },
    /**
     * 야물조회 후 모달 열기
     * @param {*} params
     * {
          "clusterIdx": 0,
          "kind": "string",
          "name": "string",
          "namespace": "string"
        }
     */
    async getYaml({ commit }, params) {
      try {
        const { data } = await request.getYamlUsingPOST_1(params)
        // 최신 날짜 순으로 정렬
        const yamlDatas = data.result.sort(
          (a, b) => new Date(b.createAt) - new Date(a.createAt),
        )
        commit('setHistory', yamlDatas)
        commit('openModal', {
          editType: 'update',
          content: yamlDatas[0]?.yaml || [],
          isEncoding: true,
          readOnlyKeys: ['kind', 'metadata.name', 'metadata.namespace'],
          title: `Edit ${
            yamlDatas[0]?.kind?.charAt(0).toUpperCase() +
            yamlDatas[0]?.kind?.slice(1)
          }`,
        })
      } catch (err) {
        console.error(err)
      }
    },
    // async deleteYaml({ commit }, payload) {},
  },
}

export default resource
