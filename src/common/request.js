import axios from 'axios'
// import Vue from 'vue'
// import tokenHelper from '@/lib/tokenHelper'
// import cookieHelper from '@/lib/cookieHelper'
import vm from '@/main'
// import { cookieName } from './consts'

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
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
    // const { accessToken } = vm.$store.state.loginUser
    const { method } = config

    // config.headers.Authorization = accessToken

    // console.log(reqUrl)
    // 로그인, 토큰갱신 요청시 예외
    if (
      (reqUrl === '/comp-b-svc/api/v1/user-manage/users' &&
        method === 'post') ||
      (reqUrl.includes('/comp-b-svc/api/v1/access-manage') &&
        reqUrl !== '/comp-b-svc/api/v1/access-manage/user-authority') ||
      reqUrl.includes('/users/dupl')
    ) {
      vm.$store.commit('loading/showLoading')
    }
    return config
  },
  // 로그아웃
  /*
      1. refresh token 이 없는경우 (현재는 cookie 에 있어 만료되면 자동 삭제)
      2. refresh token 이 만료된 경우
    */
  // if (!refreshToken) {
  //   vm.$store.dispatch('loginUser/doLogout')
  //   vm.$store.commit('alert/openAlert', {
  //     title: '로그아웃 되었습니다.',
  //     type: 'info',
  //   })
  //   vm.$store.commit('resetState')
  //   // vm.$store.commit('loading/closeLoading')
  //   vm.$router.push('/login').catch(() => {})
  //   throw new axios.Cancel('Request canceled.')
  // }

  // if (reqTimestamp > vm.$store.state.loginUser.refreshTokenExpireTime) {
  //   console.log(
  //     'refresh token timeout!',
  //     vm.$store.state.loginUser.refreshTokenExpireTime,
  //   )
  //   vm.$store.dispatch('loginUser/doLogout')
  //   vm.$store.commit('alert/openAlert', {
  //     title: '로그아웃 되었습니다.',
  //     type: 'info',
  //   })
  //   vm.$store.commit('resetState')
  //   // vm.$store.commit('loading/closeLoading')
  //   vm.$router.push('/login').catch(() => {})
  //   throw new axios.Cancel('Request canceled.')
  // }

  // 토큰 갱신
  /*
      1. refresh token 만료되지 않은 경우
      2. access token 이 없거나 만료된 경우
    */
  // if (!accessToken || reqTimestamp > vm.$store.state.loginUser.expireTime) {
  //   // 토큰 만료 상태
  //   // TODO : 토큰 갱신 요청, 실패시 로그아웃
  //   // vuex 에서 토큰 갱신
  //   const refreshResut = await vm.$store.dispatch('loginUser/refreshToken')
  //   if (!refreshResut) {
  //     vm.$store.dispatch('loginUser/doLogout')
  //     vm.$store.commit('alert/openAlert', {
  //       title: '로그아웃 되었습니다.',
  //       type: 'info',
  //     })
  //     vm.$store.commit('resetState')
  //     // vm.$store.commit('loading/closeLoading')
  //     vm.$router.push('/login').catch(() => {})
  //     throw new axios.Cancel('Request canceled.')
  //   }
  // }

  // const encryptedToken = tokenHelper.encrypt(
  //   vm.$store.state.loginUser.accessToken,
  //   reqUrl,
  //   config.method,
  //   reqTimestamp,
  // )
  // // console.log('[headers]::', config.headers)
  // config.headers['access-token'] = encryptedToken
  // config.headers.timestamp = reqTimestamp
  // vm.$store.commit('loading/showLoading')
  // return config
  // },
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
    console.log(error)
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
      vm.$router.push('/login').catch(() => {})
    } else {
      errorDesc = errorMsg
    }

    console.warn(errorDesc)

    return Promise.reject(error)
  },
)
export default service
