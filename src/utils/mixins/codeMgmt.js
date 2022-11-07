import {
  ADDING_CODE_GROUPS,
  CANCEL_CODE_GROUPS,
  MANAGING_CODE_GROUPS,
  UPDATING_CODE_GROUP,
  MANAGING_CODE,
  ADDING_CODE,
  UPDATING_CODE,
  CANCEL_CODE,
  UPDATE_FORM,
} from '@/store/modules/setting/codeMgmt'
import { createNamespacedHelpers } from 'vuex'

const confirmMapUtils = createNamespacedHelpers('confirm')

const tag = '[MixIn_Mgmt]'
const CODE_GROUP = 'CODE_GROUP'

export const codeMgmt = {
  data() {
    return {
      panel: [],
      search: '',
      isOpen: false,
    }
  },
  computed: {
    // 코드 그룹 데이터 조회
    codeGroups() {
      return this.$store.state.codeMgmt.codeGroups
    },

    // 코드 그룹 항목 눌렀을 때  여부
    checkIsCodeGroupsManaging() {
      console.log(tag, 'checkIsCodeGroupsManaging')
      return this.$store.state.codeMgmt.isCodeGroupManaging
    },

    // 코드 그룹 데이터 세부 조회
    codeGroupDetail() {
      console.log(tag, 'codeGroupDetail')
      return this.$store.state.codeMgmt.codeGroupDetail
    },

    // 공통 코드 그룹 신규 등록 중인지 여부
    checkIsGroupCodeAdding() {
      console.log(tag, 'checkIsGroupCodeAdding')
      return this.$store.state.codeMgmt.isCodeGroupAdding
    },

    // 공통 코드 그룹 수정 중인지 여부
    checkIsGroupCodeUpdating() {
      console.log(tag, 'checkIsGroupCodeUpdating')
      return this.$store.state.codeMgmt.isCodeGroupUpdating
    },

    // 코드 데이터 세부 조회
    codeDetail() {
      console.log(tag, 'codeDetail')
      return this.$store.state.codeMgmt.codeGroupDetail?.codeList || []
    },

    // 공통 코드 신규 등록 중인지 여부
    checkIsCodeAdding() {
      console.log(tag, 'checkIsCodeAdding')
      return this.$store.state.codeMgmt.isCodeAdding
    },

    // 공통 코드 수정 중인지 여부
    checkIsCodeUpdating() {
      console.log(tag, 'checkIsCodeUpdating')
      return this.$store.state.codeMgmt.isCodeUpdating
    },

    // 코드 항목 눌렀을 때  여부
    checkIsCodeManaging() {
      console.log(tag, 'checkIsCodeManaging')
      return this.$store.state.codeMgmt.isCodeManaging
    },

    checkIsSelectedId() {
      console.log(tag, 'checkIsSelectedId')
      return this.$store.state.codeMgmt.isSelectedId
    },
  },
  methods: {
    ...confirmMapUtils.mapMutations(['openConfirm']),
    // 메뉴 검색 이벤트
    onChangeSearch(e) {
      console.log(tag, 'onChangeSearch')
      this.$emit('search', e.target.value)
    },

    // 메뉴 전체 열기 이벤트
    expandAll() {
      console.log(tag, 'expandAll')
      this.panel = [
        ...Array(this.$store.state.codeMgmt.codeGroups.length).keys(),
      ].map((k, i) => i)
    },

    // 메뉴 전체 닫기 이벤트
    expandNone() {
      console.log(tag, 'expandNone')
      this.panel = []
    },

    // 메뉴 > 코드 그룹 선택시 이벤트
    onClickCodeGroup(groupCode) {
      console.log(tag, 'onClickCodeGroup')
      this.$store.commit({
        type: MANAGING_CODE_GROUPS,
        payload: {
          groupCode,
        },
      })
    },
    // 메뉴 > 코드 선택시 이벤트
    onClickCode(groupCode, commonCode) {
      console.log(tag, 'onClickCode')
      this.$store.commit({
        type: MANAGING_CODE,
        payload: {
          groupCode,
          commonCode,
        },
      })
    },
    // 등록 버튼 클릭 시
    onClickAdd(codeType) {
      console.log(tag, 'onClickAdd')
      if (codeType === CODE_GROUP) {
        this.onClickAddCodeGroup()
        return
      }

      this.onClickAddCode()
    },
    // 리얼 수정 버튼 클릭 시
    onClickUpdate(codeType) {
      console.log(tag, 'onClickUpdate')
      if (codeType === CODE_GROUP) {
        this.onClickUpdateCodeGroup()
        return
      }

      this.onClickUpdateCode()
    },
    // 수정 버튼 클릭 시
    onClickToUpdate(codeType) {
      console.log(tag, 'onClickUpdate')
      if (codeType === CODE_GROUP) {
        this.onClickToUpdateCodeGroup()
        return
      }

      this.onClickToUpdateCode()
    },

    // 신규 등록 버튼 클릭 시
    onClickToAdd(codeType) {
      console.log(tag, 'onClickToAdd')
      if (codeType === CODE_GROUP) {
        this.onClickToAddCodeGroup()
        return
      }

      this.onClickToAddCode()
    },
    // 취소 버튼 클릭 시
    onClickCancel(codeType) {
      console.log(tag, 'onClickCancel')
      if (codeType === CODE_GROUP) {
        this.onCancelCodeGroup()
        return
      }

      this.onCancelCode()
    },

    // 모달 취소 버튼 클릭 시
    onClickCloseModal() {
      console.log(tag, 'onClickCloseModal')
      this.isOpen = false
    },

    // 삭제 버튼 클릭 시
    onClickToDelete() {
      console.log(tag, 'onClickToDelete')
      this.isOpen = true
      this.openConfirm('정말 삭제하시겠습니까?')
    },

    // 코드 그룹 신규 등록
    onClickToAddCodeGroup() {
      console.log(tag, 'onClickToAddCodeGroup')
      this.$store.commit({
        type: ADDING_CODE_GROUPS,
      })
    },
    // 코드 신규 등록
    onClickToAddCode() {
      console.log(tag, 'onClickToAddCode')
      this.$store.commit({
        type: ADDING_CODE,
      })
    },

    // 코드 그룹 수정
    onClickToUpdateCodeGroup() {
      console.log(tag, 'onClickToUpdateCodeGroup')
      this.$store.commit({
        type: UPDATING_CODE_GROUP,
      })
    },
    // 코드 수정
    onClickToUpdateCode() {
      console.log(tag, 'onClickToUpdateCode')
      this.$store.commit({
        type: UPDATING_CODE,
      })
    },

    // 코드 그룹 취소
    onCancelCodeGroup() {
      console.log(tag, 'onCancelCodeGroup')
      this.$store.commit({
        type: CANCEL_CODE_GROUPS,
      })
    },
    // 코드  취소
    onCancelCode() {
      console.log(tag, 'onCancelCode')
      this.$store.commit({
        type: CANCEL_CODE,
      })
    },

    // 코드 그룹 ID
    onChangeCodeGroupId(value) {
      console.log(tag, value, 'onChangeCodeGroupId')
      this.$store.commit({
        type: UPDATE_FORM,
        payload: {
          name: 'groupCode',
          value,
        },
      })
    },

    // 코드 그룹 이름
    onChangeCodeGroupName(value) {
      console.log(tag, value, 'onChangeCodeGroupName')
      this.$store.commit({
        type: UPDATE_FORM,
        payload: {
          name: 'groupName',
          value,
        },
      })
    },

    // 코드 ID
    onChangeCodeId(value) {
      console.log(tag, value, 'onChangeCommonCodeId')
      this.$store.commit({
        type: UPDATE_FORM,
        payload: {
          name: 'groupCode',
          value,
        },
      })
    },

    // 코드 이름
    onChangeCodeName(value) {
      console.log(tag, value, 'onChangeCodeName')
      this.$store.commit({
        type: UPDATE_FORM,
        payload: {
          name: 'codeName',
          value,
        },
      })
    },

    // 코드 영문 이름
    onChangeCodeNameEn(value) {
      console.log(tag, value, 'onChangeCodeNameEn')
      this.$store.commit({
        type: UPDATE_FORM,
        payload: {
          name: 'codeValue',
          value,
        },
      })
    },

    // 코드 순서
    onChangeCodeOrder(value) {
      console.log(tag, value, 'onChangeCodeOrder')
      this.$store.commit({
        type: UPDATE_FORM,
        payload: {
          name: 'codeOrder',
          value,
        },
      })
    },

    // 코드 설명
    onChangeCodeDesc(value) {
      console.log(tag, value, 'onChangeCodeDesc')
      this.$store.commit({
        type: UPDATE_FORM,
        payload: {
          name: 'description',
          value,
        },
      })
    },

    // 서비스 관련 > API 호출

    // 코드 그룹 등록
    onClickAddCodeGroup() {
      console.log(tag, 'onClickAddCodeGroup')
      // alert('코드 그룹 등록 API 호출')
    },
    // 코드 등록
    onClickAddCode() {
      console.log(tag, 'onClickAddCode')
      // alert('코드 등록 API 호출')
    },

    // 리얼 코드 그룹 수정
    onClickUpdateCodeGroup() {
      console.log(tag, 'onClickUpdateCodeGroup')
      // alert('코드 그룹 수정 API 호출')
    },
    // 리얼 코드 수정
    onClickUpdateCode() {
      console.log(tag, 'onClickAddCode')
      // alert('코드 수정 API 호출')
    },

    // 리얼 삭제 버튼 클릭 시
    onClickDelete() {
      console.log(tag, 'onClickDelete')
      this.onClickCloseModal()
      // alert('코드 삭제 API 호출')
    },
  },
}
