import { CodeMgmt } from '@/assets/data/codeMgmt'
// import _ from 'lodash'

const basic = 'codeMgmt'

const FILTER_CODE_GROUPS = `${basic}/filterCodeGroups`
const FILTER_CODE = `${basic}/filterCode`

// 공통
export const UPDATE_FORM = `${basic}/updateForm`

// 코드 그룹 타입
export const INIT_CODE_GROUPS = `${basic}/initCodeGroups`
export const MANAGING_CODE_GROUPS = `${basic}/managingCodeGroups`
export const ADDING_CODE_GROUPS = `${basic}/addingCodeGroups`
export const UPDATING_CODE_GROUP = `${basic}/updatingCodeGroups`
export const CANCEL_CODE_GROUPS = `${basic}/cancelCodeGroups`

// 코드 타입
export const INIT_CODE = `${basic}/initCode`
export const MANAGING_CODE = `${basic}/managingCode`
export const ADDING_CODE = `${basic}/addingCode`
export const UPDATING_CODE = `${basic}/updatingCode`
export const CANCEL_CODE = `${basic}/cancelCode`

const tag = '[Store_codeGroups]'

const resource = {
  namespaced: true,
  state: {
    // data
    isSelectedId: CodeMgmt[0].groupCode,
    isSelectedGroupCode: CodeMgmt[0].groupCode,

    codeGroups: CodeMgmt,
    codeGroupDetail: CodeMgmt[0],
    // 상태
    isCodeGroupManaging: true,
    isCodeGroupAdding: false,
    isCodeGroupUpdating: false,

    isCodeManaging: false,
    isCodeAdding: false,
    isCodeUpdating: false,
    isCodeRemove: false,
    codeFormValues: {},
  },
  getters: {
    getCodeGroups(state) {
      return state.codeGroups
    },
  },
  mutations: {
    // 코드 그룹 초기화
    initCodeGroups(state) {
      console.log(tag, 'INIT_CODE_GROUPS')

      state.isSelectedId = ''
      state.isSelectedGroupCode = ''
      state.codeGroups = CodeMgmt
      state.codeGroupDetail = { ...CodeMgmt[0] }
      state.isCodeGroupManaging = false
      state.isCodeGroupAdding = false
      state.isCodeGroupUpdating = false
      state.codeFormValues = {}
    },
    // 코드 초기화
    initCode(state) {
      console.log(tag, 'INIT_CODE')

      state.isSelectedId = ''
      state.isSelectedGroupCode = ''
      state.isCodeManaging = false
      state.isCodeAdding = false
      state.isCodeUpdating = false
      state.isCodeRemove = false
      state.codeFormValues = {}
    },

    // 코드 그룹 필터 > 코드 그룹 상세 정보 조회
    filterCodeGroups(state, payload) {
      console.log(tag, 'FILTER_CODE_GROUPS')
      const index = state.codeGroups.findIndex(
        item => item.groupCode === payload.groupCode,
      )

      state.codeGroupDetail = { ...state.codeGroups[index] }
    },

    // 코드 필터 > 코드 상세 정보 조회
    filterCode(state, payload) {
      console.log(tag, payload, 'FILTER_CODE')
      const codeGroup = state.codeGroups.find(
        item => item.groupCode === payload.groupCode,
      )

      const index = codeGroup.codeList.findIndex(
        item => item.commonCode === payload.commonCode,
      )

      console.log(codeGroup, index, 'codeGroup, index')
      state.codeGroupDetail = { ...codeGroup, code: codeGroup.codeList[index] }
    },

    // 코드 그룹 매니징 중
    managingCodeGroups(state, { payload }) {
      console.log(tag, 'MANAGING_CODE_GROUPS')
      this.commit(INIT_CODE)
      this.commit(INIT_CODE_GROUPS)
      state.isCodeGroupManaging = true
      state.isSelectedGroupCode = payload.groupCode
      state.isSelectedId = payload.groupCode
      this.commit(FILTER_CODE_GROUPS, payload)
    },
    // 코드 그룹 추가 중
    addingCodeGroups(state) {
      console.log(tag, 'ADD_CODE_GROUPS')
      state.isCodeGroupAdding = true
      state.isCodeGroupUpdating = false
      state.codeFormValues = {}
    },
    // 코드 그룹 수정 중
    updatingCodeGroups(state) {
      console.log(tag, 'UPDATING_CODE_GROUP')
      state.isCodeGroupAdding = false
      state.isCodeGroupUpdating = true
      state.codeFormValues = {
        ...state.codeGroupDetail,
      }
    },
    // 코드 그룹 취소
    cancelCodeGroups(state) {
      console.log(tag, 'CANCEL_CODE_GROUPS')
      state.isCodeGroupAdding = false
      state.isCodeGroupUpdating = false
      // this.commit(FILTER_CODE_GROUPS, { groupCode: state.isSelectedId })
    },

    // 코드 매니징 중
    managingCode(state, { payload }) {
      console.log(tag, 'MANAGING_CODE')
      this.commit(INIT_CODE)
      this.commit(INIT_CODE_GROUPS)
      state.isCodeManaging = true
      state.isSelectedGroupCode = payload.groupCode
      state.isSelectedId = payload.commonCode
      this.commit(FILTER_CODE, payload)
    },
    // 코드 추가 중
    addingCode(state) {
      console.log(tag, 'ADDING_CODE')
      state.isCodeAdding = true
      state.isCodeUpdating = false
      state.codeFormValues = {}
    },
    // 코드 그룹 수정 중
    updatingCode(state) {
      console.log(tag, 'UPDATING_CODE')
      state.isCodeAdding = false
      state.isCodeUpdating = true
      state.codeFormValues = {
        ...state.codeGroupDetail,
      }
    },
    // 코드 취소
    cancelCode(state) {
      console.log(tag, 'CANCEL_CODE')
      state.isCodeAdding = false
      state.isCodeUpdating = false
    },
    // 업데이트 코드 그룹 및 코드
    updateForm(state, { payload }) {
      console.log(tag, 'UPDATE_CODE')
      state.codeFormValues = {
        ...state.codeFormValues,
        [payload.name]: payload.value,
      }
    },
  },
  actions: {},
}

export default resource
