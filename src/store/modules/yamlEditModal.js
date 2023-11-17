import request from '@/lib/request'
import { getNowDate } from '@/lib/date'

const resource = {
  namespaced: true,
  state: {
    title: '',
    editType: 'create', // 에디터 타입(create, update)
    content: '',
    originContent: '',
    isOpenModal: false,
    readOnlyKeys: [],
    resourceType: '',
    yamlHistory: [], // 이전 yaml 작성 기록
    selectDate: '', // editType이 update일 경우 헤더 셀렉트박스에 선택된 날짜
    errorMsg: '', // 에러 메세지
    applyDate: '', // workload list에서 watch로 감시하다가 값 변경 시 리스트 업데이트 시킴
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
    applyDate(state) {
      return state.applyDate
    },
  },
  mutations: {
    initModalContent(state) {
      state.title = ''
      state.editType = 'create'
      state.content = ''
      state.originContent = ''
      state.isOpenModal = false
      // state.firstSelectVal = ''
      state.readOnlyKeys = []
      state.resourceType = ''
    },
    changeContent(state, payload) {
      state.content = payload
    },
    openModal(state, payload) {
      state.editType = ''
      state.content = ''
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
      state.readOnlyKeys = []
      state.resourceType = ''
      state.errorMsg = ''
      state.yamlHistory = []
      state.selectDate = ''
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
    setApplyDate(state) {
      console.log('update ApplyDate')
      state.applyDate = getNowDate()
    },
  },
  actions: {
    // 헤더 상단 날짜 셀렉트 박스
    changeYamlDate({ commit }, createAt) {
      commit('setYamlContent', createAt)
    },
    setError({ commit }, errMsg) {
      commit('setErrorMsg', errMsg)
    },
    /** Yaml 생성 수정 함수 () => boolean
     * Boolean 타입을 리턴해줘야 성공, 실패 alert창을 보여줄 수 있음
     * */
    async applyYaml({ commit }, payload) {
      console.log('applyYaml Parameters: ', payload)
      try {
        const { data } = await request.applyUsingPOST_2(payload)
        console.log('apply Yaml Result: ', data)
        // Yaml 생성 완료
        if (data?.result?.success) {
          commit('setApplyDate') // 생성 완료 시 applyDate 초기화
          commit('closeModal')
          return true
        }
        if (data?.result?.errorMessage)
          // HTTP 200: 응답 시 에러 메시지 표시
          commit('setErrorMsg', data?.result?.errorMessage)
        throw Error(data)
      } catch (err) {
        // HTTP 500: 응답 시 에러 메시지 표시
        if (err?.response?.data?.detail)
          commit('setErrorMsg', err?.response?.data?.detail)
        console.error(err.response)
        return false
      }
    },
    /**
     * 야물조회 후 모달 열기
     * @param {*} params
     * { "clusterIdx": 0, "kind": "string", "name": "string", "namespace": "string" }
     */
    async openGetYaml({ commit }, params) {
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
    // async deleteYaml({ commit }, yamlIdx) {
    //   try {
    //     const { data } = await request.deleteYamlUsingDELETE(yamlIdx)
    //   } catch (err) {
    //     console.error(err);
    //   }
    // },
  },
}

export default resource
