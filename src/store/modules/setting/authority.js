import request from '@/lib/request'

import _ from 'lodash'

const authority = {
  namespaced: true,
  state: {
    authGroups: [],
    authMenu: [],
    authGroup: {},
    authUser: [],
    tempDeleteUser: {},
    initAuthMenu: [],
    duplicateFlag: false,
    originUserRoleName: '', // 권한 저장 시 기존 값 대비 변경여부 확인하기 위함.
    initUserPopup: false,
    isChanged: false,
    selected: {},
    addEditPopup: false,
  },
  getters: {
    getAuthMenu(state) {
      return state.authMenu
    },
    getAuthGroup(state) {
      return state.authGroup
    },
    getAuthUser(state) {
      return state.authUser
    },
    isChanged(state) {
      return state.isChanged
    },
    selected(state) {
      return state.selected
    },
  },
  mutations: {
    setAuthMenu(state, newMenu) {
      state.authMenu = newMenu.menuList
    },
    setAuthGroup(state, newGroup) {
      state.authGroup = newGroup
      state.originUserRoleName = newGroup.userRoleName
    },
    setAuthUser(state, newUser) {
      state.authUser = newUser
    },
    setInitAuthMenu(state, newMenu) {
      state.initAuthMenu = _.cloneDeep(newMenu.menuList)
    },
    addAuthUser(state, newUser) {
      newUser.forEach(user => {
        // 중복된 id 제외한 값 추가
        if (!state.authUser.some(person => person.userId === user.userId)) {
          user.type = 'N'
          state.authUser.push(user)
          state.isChanged = true
        }
      })
    },
    deleteAuthUser(state, index) {
      if (
        state.authUser[index].type != null &&
        state.authUser[index].type === 'N'
      ) {
        // 임시 데이터이므로 splice 해도 됨
        state.authUser.splice(index, 1)
        state.isChanged = true
      } else if (state.authUser[index].type == null) {
        // 실 데이터 삭제
        state.tempDeleteUser = state.authUser[index]
        state.tempDeleteUser = state.authUser[index]
        state.tempDeleteUser.type = 'D'

        state.authUser.splice(index, 1)
        state.authUser.push(state.tempDeleteUser)
        state.tempDeleteUser = {}
        state.isChanged = true
      }
    },
    getDuplicate(state, payload) {
      // payload == true then 중복 else 중복아님
      state.duplicateFlag = payload
    },
    getListAuthority(state, payload) {
      state.authGroups = payload
    },
    setAuthorityName(state, name) {
      state.authGroup.userRoleName = name
    },
    setDescription(state, description) {
      state.authGroup.description = description
    },
    refrashMenu(state) {
      state.authMenu = _.cloneDeep(state.initAuthMenu)
    },
    initUserPopup(state, flag) {
      state.initUserPopup = flag
    },
    initAuthData(state) {
      state.authGroup = {}
      state.authMenu = []
      state.authUser = []
      state.tempDeleteUser = {}
      state.initAuthMenu = []
      state.duplicateFlag = false
      state.originUserRoleName = ''
      state.initUserPopup = false
      state.isChanged = false
      state.selected = {}
    },
    setIsChanged(state) {
      state.isChanged = true
    },
    setSelectedGroup(state, payload) {
      state.selected = payload
    },
    changeAddEditPopup(state, payload) {
      state.addEditPopup = payload
    },
  },
  actions: {
    getMenuFromSelect(context, selected) {
      const selectedGroup = selected

      context.commit('setAuthMenu', selectedGroup)
      context.commit('setAuthGroup', selectedGroup)
      context.commit('setAuthUser', selectedGroup.userList)
      context.commit('setInitAuthMenu', selectedGroup)
    },
    async getAllListAuthority({ commit }) {
      try {
        const response = await request.getAllListAuthorityUsingGET()
        commit('getListAuthority', response.data.result)
      } catch (error) {
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    async getCheckDuplicate({ commit }, payload) {
      try {
        const response = await request.getCheckAuthorityUsingGET(payload)
        commit('getDuplicate', response.data.result)
      } catch (error) {
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    async registAuthority(context, payload) {
      const response = await request.registAuthorityUsingPOST(payload)
      return response
    },
    async patchAuthority(context, payload) {
      const response = await request.patchAuthorityUsingPATCH(payload)
      return response
    },
    async deleteAuthority(context, payload) {
      const response = await request.deleteAuthorityUsingDELETE(payload)
      return response
    },
    refrashMenu({ commit }) {
      commit('refrashMenu')
    },
  },
}

export default authority
