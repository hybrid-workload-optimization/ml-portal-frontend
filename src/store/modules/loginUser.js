import request from '@/lib/request'
import cookieHelper from '@/lib/cookieHelper'
import { cookieName } from '@/common/consts'
import encrypt from '@/lib/encrypt'

const resource = {
  namespaced: true,
  state: {
    userInfo: null,
    accessToken: null,
    expireTime: null,
    refreshTokenExpireTime: null,
    menuList: [],
    flatMenuList: [],
    projectUserRole: [],
    favoriteList: [],
    currentMenuInfo: {},
    isShowEditModal: false,
  },
  getters: {
    userInfo(state) {
      return state.userInfo
    },
  },
  mutations: {
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo
    },
    setAccessToken: (state, accessToken) => {
      state.accessToken = accessToken
    },
    setExpireTime: (state, expireTime) => {
      state.expireTime = expireTime
    },
    setRefreshTokenExpireTime: (state, refreshTokenExpireTime) => {
      state.refreshTokenExpireTime = refreshTokenExpireTime
    },
    setMenuInfo: (state, authority) => {
      state.menuList = authority.defaultUserRole
      state.projectUserRole = authority.projectUserRole
    },
    setFlatMenuList: (state, menuList) => {
      state.flatMenuList = menuList
    },
    setFavoriteList: (state, payload) => {
      state.favoriteList = payload
    },
    currentMenuInfo: (state, payload) => {
      state.currentMenuInfo = payload
    },
    changeFavoriteList: (state, payload) => {
      if (payload.type === 'add') {
        state.favoriteList.push(state.currentMenuInfo)
      } else {
        const index = state.favoriteList.findIndex(
          item => state.currentMenuInfo.menuIdx === item.menuIdx,
        )
        if (index > -1) {
          state.favoriteList.splice(index, 1)
        }
      }
    },
    changeShowEditModal: (state, payload) => {
      state.isShowEditModal = payload
    },
  },
  actions: {
    doLogin: async ({ dispatch }, payload) => {
      try {
        const loginResult = await request.doLoginUsingPOST(payload)
        dispatch('initUserInfo', loginResult.data.result)
        const { authority } = loginResult.data.result
        if (authority) {
          sessionStorage.setItem(
            'menuList',
            encrypt.encrypt(JSON.stringify(authority.defaultUserRole)),
          )
          sessionStorage.setItem(
            'projectUserRole',
            encrypt.encrypt(JSON.stringify(authority.projectUserRole)),
          )
        }
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    doLogout: async ({ commit, state }) => {
      if (!state.userInfo) {
        return
      }
      const param = {
        userId: state.userInfo.userId,
      }
      try {
        const response = await request.doLogoutUsingGET(param)
        if (response.status === 200) {
          cookieHelper.removeCookie(cookieName.refresh_token)
          cookieHelper.removeCookie(cookieName.setExpireTime)
          cookieHelper.removeCookie(cookieName.username)
          commit('setUserInfo', null)
          commit('setAccessToken', null)
          commit('setExpireTime', null)

          sessionStorage.removeItem('firstVal')
          sessionStorage.removeItem('secondVal')
          sessionStorage.removeItem('thirdVal')
          sessionStorage.removeItem('menuList')
          sessionStorage.removeItem('projectUserRole')
        }
      } catch (error) {
        console.error(error)
      }
    },
    refreshToken: async ({ dispatch }) => {
      try {
        const refreshResultawait = await request.tokenRefreshUsingPOST()
        dispatch('initUserInfo', refreshResultawait.data.result)
        return true
      } catch (error) {
        // 로그인 페이지 이동
        console.error(error)
        return false
      }
    },
    initUserInfo: ({ commit, dispatch }, userInfo) => {
      commit('setUserInfo', userInfo.user)
      commit('setAccessToken', userInfo.token.accessToken)
      commit(
        'setExpireTime',
        // new Date().getTime() + 10 * 1000,
        new Date().getTime() + userInfo.token.expiresIn * 1000,
      )
      commit(
        'setRefreshTokenExpireTime',
        // new Date().getTime() + 20 * 1000,
        new Date().getTime() + userInfo.token.refreshExpiresIn * 1000,
      )
      const { refreshToken } = userInfo.token
      const refreshTokenExpireMin = userInfo.token.refreshExpiresIn
      cookieHelper.setCookie(
        'refresh_token',
        refreshToken,
        refreshTokenExpireMin,
      )
      cookieHelper.setCookie(
        'username',
        userInfo.user.userName,
        refreshTokenExpireMin,
      )
      // 즐겨찾기 데이터
      dispatch('getFavoriteInfo')
    },
    setFavoriteData: async ({ commit }, params) => {
      try {
        await request.registerFavoriteUsingPOST(params)
        commit('changeFavoriteList', { type: 'add' })
      } catch (error) {
        console.log(error)
      }
    },
    deleteFavoriteData: async ({ commit }, params) => {
      try {
        await request.deleteFavoriteUsingDELETE(params)
        commit('changeFavoriteList', { type: 'delete' })
      } catch (error) {
        console.log(error)
      }
    },
    getFavoriteInfo: async ({ commit }) => {
      try {
        const response = await request.getFavoriteListUsingGET()
        commit('setFavoriteList', response.data.result)
      } catch (error) {
        console.log(error)
      }
    },
    getMenuList: async ({ commit }) => {
      try {
        const response = await request.getUserAuthoritiesUsingGET()
        const authority = response.data.result
        sessionStorage.setItem(
          'menuList',
          encrypt.encrypt(JSON.stringify(authority.defaultUserRole)),
        )
        sessionStorage.setItem(
          'projectUserRole',
          encrypt.encrypt(JSON.stringify(authority.projectUserRole)),
        )
        commit('setMenuInfo', authority)
      } catch (error) {
        console.log(error)
      }
    },
  },
}

export default resource
