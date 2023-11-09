import axios from 'axios'
import cookieHelper from '@/lib/cookieHelper'
import vm from '@/main'
import { cookieName } from './consts'

const service = axios.create({
  baseURL: process.env.VUE_APP_REQUET_BASE_URL,
  timeout: 300000,
})

let numberOfCallPending = 0

service.interceptors.request.use(
  async config => {
    // TODO: 토큰 만료일 경우에 대한 정의 필요
    /*
      1. 토큰 만료되었을경우 토큰 갱신
        - vuex에서 토큰, 만료시간 가져온다
        - 만료되지 않았다면 그대로 보낸다
        - 만료되었다면 refresh token 을 보낸다
      2. 토큰갱신 실패시 logout 실행
      3. 토큰, 갱신토큰 둘다 없을경우 로그인 페이지로 이동
    */
    numberOfCallPending += 1
    const reqUrl = config.url.split('?')[0]
    // const { method } = config
    // 개발 환경에서 토큰 셋팅

    const refreshToken = cookieHelper.getCookie(cookieName.refresh_token)
    let accessToken = cookieHelper.getCookie(cookieName.access_token)

    // 로그아웃
    /*
        1. refresh token 이 없는경우 (현재는 cookie 에 있어 만료되면 자동 삭제)
        2. refresh token 이 만료된 경우
      */
    if (!refreshToken) {
      vm.$store.dispatch('loginUser/doLogout')
      vm.$store.commit('alert/openAlert', {
        title: '로그아웃 되었습니다.',
        type: 'info',
      })
      vm.$store.commit('resetState')
      vm.$store.commit('loading/closeLoading')
      // throw new axios.Cancel('Request canceled.')
    }

    // accessToken 만료
    if (!accessToken && !reqUrl.includes('/refresh_token')) {
      console.log('No access token')
      // refreshToken 만료
      if (!refreshToken) {
        console.log('No refresh token')
        vm.$router
          .push({ path: '/ssoLogin', query: { originUrl: reqUrl } })
          .catch(() => {})
      } else {
        const param = {
          refresh_token: refreshToken,
        }

        const refreshResult = await vm.$store.dispatch(
          'loginUser/refreshTokenV2',
          param,
        )
        if (!refreshResult) {
          console.log('no refresh fail')
          vm.$router
            .push({ path: '/ssoLogin', query: { originUrl: reqUrl } })
            .catch(() => {})
        } else {
          accessToken = cookieHelper.getCookie(cookieName.access_token)
          console.log('refresh complete')
        }
      }
    }
    config.headers.Authorization = accessToken
    vm.$store.commit('loading/showLoading')

    // 리프레쉬 토큰으로 액세스토큰 재발급 시 Authorization 값 삭제
    if (config.url.includes('/auth/refresh_token')) {
      delete config.headers.Authorization
    }
    return config
  },
  error => {
    numberOfCallPending += 1
    console.log(error)
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  response => {
    numberOfCallPending -= 1
    if (numberOfCallPending === 0) vm.$store.commit('loading/closeLoading')
    return response
  },
  error => {
    numberOfCallPending -= 1
    if (numberOfCallPending === 0) vm.$store.commit('loading/closeLoading')
    console.log(error)
    const { response } = error

    if (error.response && [419].indexOf(error.response.status) > -1) {
      // Reload or redirect to login page
      window.location.reload()
      return Promise.reject(error)
    }

    const errorMsg = response
      ? (response.data && response.data.message) || response.statusText
      : 'not response'
    let errorDesc = null
    // const vm = new Vue()
    const h = vm.$createElement

    if (response && response.status === 422) {
      if (response.data && response.data.errors) {
        errorDesc = h(
          'div',
          {},
          Object.values(response.data.errors).map(ms => {
            return h(
              'div',
              {},
              ms.map(m => h('div', {}, m)),
            )
          }),
        )
      } else {
        errorDesc = h('div', {}, response.data[0])
      }
    } else if (response && response.status === 401) {
      const originPage = vm.$route.path
      vm.$router
        .push({ path: '/ssoLogin', query: { originUrl: originPage } })
        .catch(() => {})
    } else if (response && response.status === 400) {
      // vm.$router.push('/devLogin').catch(() => {})
      // 토큰 만료 및 검증 실패에 대한 임시 코드
      // cors error -> login 페이지 이동
      // 추후 401 error -> login 페이지 이동으로 변경 예정
    } else if (error.message === 'Network Error') {
      // const originPage = vm.$route.path
      // vm.$router
      // .push({ path: '/ssoLogin', query: { originPath: originPage } })
      // .catch(() => {})
      const originPage = vm.$route.path
      vm.$router
        .push({ path: '/ssoLogin', query: { originUrl: originPage } })
        .catch(() => {})
    } else {
      errorDesc = errorMsg
    }

    console.warn(errorDesc)

    return Promise.reject(error)
  },
)
export default service
