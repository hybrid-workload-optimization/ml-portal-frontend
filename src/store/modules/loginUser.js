import request from '@/lib/request'
import cookieHelper from '@/lib/cookieHelper'
import { cookieName } from '@/common/consts'
import encrypt from '@/lib/encrypt'
import axios from 'axios'
import qs from 'qs'

const resource = {
  namespaced: true,
  state: {
    userInfo: null,
    menuList: [],
    flatMenuList: [],
    projectUserRole: [],
    favoriteList: [],
    currentMenuInfo: {},
    isShowEditModal: false,
    accessToken: null,
    expireTime: null,
    refreshTokenExpireTime: null,
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
    setAccessToken: (state, payload) => {
      state.accessToken = payload
    },
    setExpireTime: (state, expireTime) => {
      state.expireTime = expireTime
    },
    setRefreshTokenExpireTime: (state, refreshTokenExpireTime) => {
      state.refreshTokenExpireTime = refreshTokenExpireTime
    },
  },
  actions: {
    refreshToken: async ({ commit, dispatch }, param) => {
      try {
        const path =
          '/auth/realms/strato-platform/protocol/openid-connect/token'
        const body = qs.stringify({
          client_id: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
          grant_type: 'refresh_token',
          client_secret: process.env.VUE_APP_KEYCLOAK_CLIENT_SECRET,
          scope: 'openid',
          refresh_token: param,
        })
        const headers = {
          'content-type': 'application/x-www-form-urlencoded',
        }

        const result = await axios.post(path, body, { headers })
        commit('setAccessToken', result.data.access_token)
        const loginResult = await request.getUserInfoUsingGET()
        const userInfo = await request.getUserDetailUsingGET(
          loginResult.data.result.user,
        )
        dispatch('initRefreshInfo', result.data)
        dispatch('initUserInfo', userInfo.data.result)
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
    getAccessToken: async ({ commit, dispatch }, payload) => {
      try {
        const path =
          '/auth/realms/strato-platform/protocol/openid-connect/token'
        const body = qs.stringify({
          client_id: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
          grant_type: 'password',
          client_secret: process.env.VUE_APP_KEYCLOAK_CLIENT_SECRET,
          scope: 'openid',
          username: payload.userId,
          password: payload.userPassword,
        })
        const headers = {
          'content-type': 'application/x-www-form-urlencoded',
        }

        await axios({
          method: 'post',
          url: path,
          data: body,
          headers,
        }).then(res => {
          const accessToken = res.data.access_token
          commit('setAccessToken', accessToken)
          dispatch('initRefreshInfo', res.data)
        })
        return true
      } catch (error) {
        return false
      }
    },
    test: async () => {
      try {
        const url = 'http://172.16.10.164:30987'
        const path = `${url}/service/comp-b-svc/api/v1/access-manage/user-info`

        await axios({
          method: 'GET',
          url: path,
        }).then(res => {
          console.log(res)
        })
        return true
      } catch (error) {
        return false
      }
    },
    doLogin: async ({ dispatch }, payload) => {
      try {
        // 개발 환경에서 토큰 설정
        if (
          process.env.NODE_ENV === 'local' ||
          process.env.NODE_ENV === 'dev'
        ) {
          await dispatch('getAccessToken', payload)
        }
        // get userId
        const test = await dispatch('test')
        console.log(test)
        // const loginResult = await request.getUserInfoUsingGET()
        // get userDetail
        const userInfo = await request.getUserDetailUsingGET(
          test.data.result.user,
        )
        dispatch('initUserInfo', userInfo.data.result)
        const { authority } = test.data.result
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
    initUserInfo: ({ commit, dispatch }, userInfo) => {
      // commit('setUserInfo', userInfo.user)
      commit('setUserInfo', userInfo)
      // 즐겨찾기 데이터
      dispatch('getFavoriteInfo')
    },
    initRefreshInfo: ({ commit }, params) => {
      commit(
        'setExpireTime',
        // new Date().getTime() + 10 * 1000,
        new Date().getTime() + params.expires_in * 1000,
      )
      commit(
        'setRefreshTokenExpireTime',
        // new Date().getTime() + 20 * 1000,
        new Date().getTime() + params.refresh_expires_in * 1000,
      )
      const refreshToken = params.refresh_token
      const refreshTokenExpireMin = params.refresh_expires_in

      cookieHelper.setCookie(
        'refresh_token',
        refreshToken,
        refreshTokenExpireMin,
      )
      // cookieHelper.setCookie(
      //   'username',
      //   params.user.userName,
      //   refreshTokenExpireMin,
      // )
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
