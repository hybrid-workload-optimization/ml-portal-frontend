import request from '@/lib/request'
import moment from 'moment'
import { api } from '@/utils/common'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    dataListForTable: [],
    detailInfo: {
      userId: '',
      userName: '',
      userPassword: '',
      email: '',
      contact: '',
      organization: '',
      useYn: '',
      userRole: {
        userRoleIdx: '',
        userRoleCode: '',
        userRoleName: '',
        description: '',
        parentUserRoleIdx: '',
        groupYn: '',
      },
      updateUserId: '',
      updateUserName: '',
      updatedAt: '',
      createUserId: '',
      createUserName: '',
      createdAt: '',
    },
    userChangedInfo: {
      userId: '',
      contact: '',
      organization: '',
      userRole: {
        userRoleCode: '',
      },
    },
    naverChangedInfo: {
      accessKey: 'laxFfnAoZa0NLvu4b5QF',
      secretKey: 'Fq3efxkisMd7LnW6rNCZhO1WhdWTE9TnC8sQKSkQ',
    },
    awsChangedInfo: {
      accessKey: 'AKIA256GSYQXL2UVSKVC',
      secretKey: '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',
    },
    userRoleList: [],
    selectRoleList: [],
    selectProjectList: [],
    selectRoles: [],
    isOpenSignUpModal: false,
    changePasswordInfo: {
      userId: '',
      userPassword: '',
    },
  },
  getters: {
    dataList(state) {
      return state.dataList
    },
    dataListSize(state) {
      return state.dataList.length
    },
    detailInfo(state) {
      return state.detailInfo
    },
    changedInfo(state) {
      return state.userChangedInfo
    },
    userRoleList(state) {
      return state.userRoleList
    },
    selectRoleList(state) {
      return state.selectRoleList
    },
    selectProjectList(state) {
      return state.selectProjectList
    },
    dataListForTable(state) {
      return state.dataListForTable
    },
    selectRoles(state) {
      return state.selectRoles
    },
    isOpenSignUpModal(state) {
      return state.isOpenSignUpModal
    },
    passwordInfo(state) {
      return state.changePasswordInfo
    },
  },
  mutations: {
    // 초기화
    initUserState(state) {
      state.dataList = []
      state.detailInfo = {
        userId: '',
        userName: '',
        userPassword: '',
        email: '',
        organization: '',
        useYn: '',
        userRole: {
          userRoleIdx: '',
          userRoleCode: '',
          userRoleName: '',
          description: '',
          parentUserRoleIdx: '',
          groupYn: '',
        },
        updateUserId: '',
        updateUserName: '',
        updatedAt: '',
        createUserId: '',
        createUserName: '',
        createdAt: '',
      }
    },
    // dataList 초기화
    initUserDataList(state) {
      state.dataList = []
    },
    changeList(state, payload) {
      const list = payload.content
      state.dataList = list
      const tableList = []
      list.forEach(e => {
        const item = {
          userId: e.userId,
          userName: e.userName,
          email: e.email,
          organization: e.organization,
          roleName: e.userRole.userRoleName,
          status: e.useYn === 'Y' ? 'Active' : 'Inactive',
          createdAt: moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        }
        tableList.push(item)
      })
      state.dataListForTable = tableList
    },
    changeRoleList(state, payload) {
      const { data } = payload
      const { result } = data
      const selectList = []
      result.forEach(e => {
        const item = {
          text: e.userRoleName,
          value: e.userRoeCode,
          divider: false,
          disabled: false,
        }
        selectList.push(item)
      })
      const list = result
      state.userRoleList = list
      state.selectRoleList = selectList
    },
    joinDetailInfo(state, payload) {
      state.detailInfo = {
        userId: payload.email,
        userName: payload.name,
        userPassword: '',
        email: payload.email,
        organization: payload.organization,
        contact: payload.contact,
        userRole: {
          userRoleCode: 'PROJECT_MEMBER',
        },
      }
    },
    changeDetailInfo(state, payload) {
      state.detailInfo = {
        userId: payload.userId,
        userName: payload.userName,
        email: payload.email,
        organization: payload.organization,
        contact: payload.contact,
        userRole: payload.userRole,
        createdAt: payload.createdAt,
        updatedAt: payload.updatedAt,
        useYn: payload.useYn,
        updateUserId: payload.updateUserId,
        updateUserName: payload.updateUserName,
        createUserId: payload.createUserId,
        createUserName: payload.createUserName,
      }
    },
    changeInfo(state, payload) {
      if (payload.type === 'general') {
        state.userChangedInfo = {
          userId: payload.userId,
          organization: payload.organization,
          contact: payload.contact,
          userRole: payload.userRole,
        }
      } else if (payload.type === 'Naver') {
        state.naverChangedInfo = {
          accessKey: payload.accessKey,
          secretKey: payload.secretKey,
        }
      } else {
        state.awsChangedInfo = {
          accessKey: payload.accessKey,
          secretKey: payload.secretKey,
        }
      }
    },
    changeSelectRoles(state, payload) {
      const { data } = payload
      const { result } = data
      state.selectRoles = result
    },
    openSignUpModal(state) {
      state.isOpenSignUpModal = true
    },
    closeSignUpModal(state) {
      state.isOpenSignUpModal = false
    },
    changePasswordInfo(state, payload) {
      state.changePasswordInfo = {
        userId: payload.userId,
        userPassword: payload.userPassword,
      }
    },
    setChangePasswordInfoUserId(state, payload) {
      const { data } = payload
      const { result } = data
      state.changePasswordInfo.userId = result.userId
    },
  },
  actions: {
    // 유저 리스트 요청
    async getList({ commit }, payload) {
      if (payload == null) {
        payload = {
          page: 1,
        }
      }
      const response = await api.getAllData(
        request.getUserListUsingGET,
        payload,
      )
      commit('changeList', response.data.result)
    },
    // 유저 정보 생성
    async createUser({ commit, state }, payload) {
      commit('joinDetailInfo', payload)
      const response = await request.postUserUsingPOST(state.detailInfo)
      return response
    },
    // 유저 정보 수정
    async updateUser({ state }) {
      const params = {
        ...state.userChangedInfo,
      }
      const response = await request.patchUserUsingPATCH(params)
      // commit('changeList', response)
      return response
    },
    // 유저 정보 삭제
    async deleteUser(context, payload) {
      const response = await request.enableUserUsingPUT(payload)
      return response
    },
    // 유저 비밀번호 변경
    async updatePassword(context, payload) {
      const response = await request.resetUserPasswordUsingPOST(payload)
      return response
    },
    // 유저 ID 중복체크
    async checkDuplUserId(context, payload) {
      const param = {
        userId: payload,
      }
      const response = await request.checkDuplUserUsingGET(param)
      return response
    },
    // @TODO 유저 권한 변경
    async updateUserRole() {
      console.log('update User ROle...')
    },
    // 유저 상세정보
    async getDetail({ commit }, payload) {
      try {
        const response = await request.getUserDetailUsingGET(payload)
        commit('changeDetailInfo', response.data.result)
      } catch (error) {
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    // 변경된 유저 정보 세팅
    setChangeInfo({ commit }, payload) {
      commit('changeInfo', payload)
    },
    // user ROle List.
    async getUserRoleList({ commit }) {
      const response = await request.getUserRoleListUsingGET()
      commit('changeRoleList', response)
      return response
    },
    // SelectBox 용 User Role List
    async getUserRoles({ commit }) {
      const response = await request.getUserRolesUsingGET()
      commit('changeSelectRoles', response)
    },
    async getUserId({ commit }, payload) {
      try {
        const response = await request.resetUserInfoUsingGET(payload)
        commit('setChangePasswordInfoUserId', response)
      } catch (error) {
        console.error(error)
      }
    },
    async findPassword({ commit }, payload) {
      try {
        const response = await request.requestResetPasswordUsingGET(payload)
        commit('setChangePasswordInfoUserId', response)
        const { result } = response.data
        if (result.result === 'success') {
          commit(
            'alert/openAlert',
            {
              title: '비밀번호 설정 관련하여 E-mail이 발송되었습니다.',
              type: 'info',
            },
            { root: true },
          )
        } else {
          commit(
            'alert/openAlert',
            {
              title: '잘못된 요청 입니다.',
              type: 'error',
            },
            { root: true },
          )
        }
      } catch (error) {
        console.log(error)
        commit(
          'alert/openAlert',
          {
            title: 'E-mail 발송을 실패하였습니다.',
            type: 'error',
          },
          { root: true },
        )
      }
    },
    async updateMyInfo({ commit, dispatch }, payload) {
      try {
        await request.patchUserUsingPUT(payload)
        await dispatch('loginUser/refreshToken', null, { root: true })
        commit(
          'alert/openAlert',
          {
            title: '사용자 정보가 수정 되었습니다.',
            type: 'info',
          },
          { root: true },
        )
        commit('loginUser/changeShowEditModal', false, { root: true })
      } catch (error) {
        console.log(error)
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
  },
}

export default resource
