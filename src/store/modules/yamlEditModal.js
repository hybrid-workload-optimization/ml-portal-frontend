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
    changeFirstSelectVal(state, payload) {
      state.firstSelectVal = payload
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
    },
    initFirstSelectState(state) {
      state.firstSelectItems = []
      state.firstSelectVal = ''
    },
    changeFirstSeletItems(state, payload) {
      state.firstSelectItems = []
      const { data } = payload
      const items = []

      data.result.forEach(e => {
        items.push({ id: e.id, text: e.text, value: e.value })
      })
      state.firstSelectItems = items
    },
    setErrorMsg(state, errMsg) {
      state.errorMsg = errMsg
    },
  },
  actions: {
    async requestGetFirstSelectItems({ commit }, payload) {
      commit('initFirstSelectState')

      const { requestFunc } = payload
      const response = await requestFunc()
      commit('changeFirstSeletItems', response)
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
  },
}

export default resource
