import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/router/modules/login'
import Dashboard from '@/router/modules/dashboard'
import Project from '@/router/modules/project'
import Setting from '@/router/modules/setting'
import Cluster from '@/router/modules/cluster'
import store from '@/store'
import Error from '@/router/modules/error'
import ML from '@/router/modules/ml'
import AutoML from '@/router/modules/automl'
import encrypt from '@/lib/encrypt'
import cookieHelper from '@/lib/cookieHelper'
import { cookieName } from '@/common/consts'
import Test from '@/router/modules/test'

Vue.use(VueRouter)

const routes = [
  ...Login,
  ...Dashboard,
  ...Project,
  ...Setting,
  ...Cluster,
  ...ML,
  ...AutoML,
  ...Error,
  ...Test,
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // if (to.hash) {
    //   return {
    //     selector: to.hash,
    //   }
    // }
    return { x: 0, y: 0 }
  },
})

router.beforeResolve(async (to, from, next) => {
  // login 안했을경우 login 페이지로 이동
  console.log('[to]', to)

  // function resourceMenuCheck(item) {
  //   const menuSplit = item.menuUrl.split('/')
  //   const lastPart = menuSplit[menuSplit.length - 1]
  //   const isNumber = Number.isNaN(lastPart)
  //   // 숫자면 true, 아니면 false
  //   if (isNumber) {
  //     return menuSplit[menuSplit.length - 2]
  //   }
  //   if (item.menuUrl.includes('pod')) {
  //     return 'pod'
  //   }
  //   return menuSplit[menuSplit.length - 1]
  // }

  function getViewablePath() {
    if (to.meta.isAuthRequired) {
      const { flatMenuList } = store.state.loginUser

      let menuItem = {}
      const viewablePath = flatMenuList.findIndex(item => {
        const menuSplit = item.menuUrl?.split('/')

        let splitIdx
        if (
          menuSplit.length > 4 ||
          menuSplit[menuSplit.length - 1] !== 'list'
        ) {
          splitIdx = menuSplit.length
        } else {
          splitIdx = menuSplit.length - 1
        }
        const menuStr = menuSplit.slice(0, splitIdx).join('/')

        if (
          item.menuUrl === to.path ||
          to.path.indexOf(menuStr) > -1 ||
          // to.path.indexOf(resourceMenuStr) > -1 ||
          // to.path.includes('/overview') ||
          // to.path.includes('/catalog')
          to.path.includes('/cluster/detail')
          // to.path.includes('/pod')
        ) {
          menuItem = item
          return true
        }
        return false
      })
      if (viewablePath >= 0) {
        store.commit('loginUser/currentMenuInfo', menuItem)
        next()
      } else {
        // TODO 이동 가능한 메뉴가 없을 때
        store.commit('loginUser/currentMenuInfo', {})
        next('/404')
      }
      next()
    } else {
      next()
    }
  }
  function getSubMenuList(menuItem, flatMenuList) {
    if (menuItem.subMenuList && menuItem.subMenuList.length) {
      menuItem.subMenuList.forEach(item => {
        getSubMenuList(item, flatMenuList)
      })
    } else {
      flatMenuList.push(menuItem)
    }
  }
  function setFlatMenuList(menuList) {
    const flatMenuList = []
    menuList.forEach(item => {
      getSubMenuList(item, flatMenuList)
    })
    return flatMenuList
  }

  async function initSetting() {
    try {
      let encryptMenuList = sessionStorage.getItem('menuList')
      let encryptProjectUserRole = sessionStorage.getItem('projectUserRole')
      if (!encryptMenuList || !encryptProjectUserRole) {
        await store.dispatch('loginUser/getMenuList')

        encryptMenuList = sessionStorage.getItem('menuList')
        encryptProjectUserRole = sessionStorage.getItem('projectUserRole')
      }
      let menuList = JSON.parse(encrypt.decrypt(encryptMenuList))
      const projectUserRole = JSON.parse(
        encrypt.decrypt(encryptProjectUserRole),
      )
      menuList = menuList.filter(menu => {
        if (
          menu.useYn === 'Y' &&
          (menu.viewableYn === 'Y' || menu.writableYn === 'Y')
        ) {
          if (menu.subMenuList && menu.subMenuList.length) {
            menu.subMenuList = menu.subMenuList.filter(
              subMenu =>
                subMenu.useYn === 'Y' &&
                (subMenu.viewableYn === 'Y' || subMenu.writableYn === 'Y'),
            )
            return menu
          }
          return menu
        }
        return false
      })
      store.commit('loginUser/setMenuInfo', {
        defaultUserRole: menuList,
        projectUserRole,
      })

      const flatMenulList = setFlatMenuList(menuList)
      store.commit('loginUser/setFlatMenuList', flatMenulList)

      getViewablePath()
    } catch (error) {
      console.error(error)
      console.log('no token')
      // store.dispatch('loginUser/doLogout')
      next({ path: '/ssoLogin', query: { originUrl: to.path } })
    }
  }

  // 로그인 후 토큰 쿠키에 셋팅
  if (to.query.token) {
    const { token } = to.query
    const decodeToken = JSON.parse(window.atob(token))

    const accessToken = decodeToken.access_token
    const accessTokenExpiresAt = decodeToken.expires_at
    const refreshToken = decodeToken.refresh_token
    const refreshTokenExpiresAt = decodeToken.refresh_expires_at

    cookieHelper.setCookie(
      cookieName.access_token,
      accessToken,
      accessTokenExpiresAt,
      accessTokenExpiresAt,
    )
    cookieHelper.setCookie(
      cookieName.refresh_token,
      refreshToken,
      refreshTokenExpiresAt,
      refreshTokenExpiresAt,
    )

    router.replace({ path: to.path, query: { ...to.query, token: undefined } })
  }

  if (
    to.path !== '/login' &&
    to.path !== '/devLogin' &&
    to.path !== '/ssoLogin' &&
    to.path !== '/find-password' &&
    to.path !== '/signup' &&
    to.path !== '/change-password' &&
    to.path !== '/ssoLogout' &&
    to.path !== '/auth/logout'
  ) {
    const refreshToken = cookieHelper.getCookie(cookieName.refresh_token)
    const accessToken = cookieHelper.getCookie(cookieName.access_token)

    // accessToken 만료
    if (!accessToken) {
      console.log('No access token')
      // refreshToken 만료
      if (!refreshToken) {
        console.log('No refresh token')
        next({ path: '/ssoLogin', query: { originUrl: to.path } })
      } else {
        const param = { refresh_token: refreshToken }

        const refreshResult = await store.dispatch(
          'loginUser/refreshTokenV2',
          param,
        )

        if (!refreshResult) {
          console.log('no refresh fail')
          next({ path: '/ssoLogin', query: { originUrl: to.path } })
        } else {
          console.log('refresh complete')
          initSetting()
        }
      }
      // accessToken 이 존재하면 메뉴 이동
    } else {
      const userInfoResult = await store.dispatch('loginUser/doLogin')
      if (!userInfoResult) {
        console.log('no userinfo fail')
        // next({ path: '/ssoLogin', query: { originUrl: to.path } })
      } else {
        initSetting()
      }
    }
  } else {
    getViewablePath()
  }
})

export default router
