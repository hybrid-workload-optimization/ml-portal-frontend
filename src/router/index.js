import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/router/modules/login'
import Dashboard from '@/router/modules/dashboard'
import Project from '@/router/modules/project'
import Workload from '@/router/modules/workload'
import Sample from '@/router/modules/sample'
import Setting from '@/router/modules/setting'
import Cluster from '@/router/modules/cluster'
import Networking from '@/router/modules/networking'
import Config from '@/router/modules/config'
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
  ...Sample,
  ...Workload,
  ...Setting,
  ...Cluster,
  ...Config,
  ...Networking,
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

router.beforeEach(async (to, from, next) => {
  // login 안했을경우 login 페이지로 이동
  console.log('[to]', to)
  function getViewablePath() {
    if (to.meta.isAuthRequired) {
      const { flatMenuList } = store.state.loginUser
      let menuItem = {}
      const viewablePath = flatMenuList.findIndex(item => {
        const menuSplit = item.menuUrl.split('/')
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
        if (item.menuUrl === to.path || to.path.indexOf(menuStr) > -1) {
          menuItem = item
          return true
        }
        return false
      })
      if (viewablePath >= 0) {
        store.commit('loginUser/currentMenuInfo', menuItem)
        const originUri = from.query.originPath
        console.log(`origin >>>>>>> ${originUri}`)
        if (!originUri) {
          next()
        } else {
          from.query.originPath = ''
          next(originUri)
        }
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

  if (
    (!store.state.loginUser.userInfo ||
      !store.state.loginUser.userInfo.userId) &&
    to.path !== '/login' &&
    to.path !== '/devLogin' &&
    to.path !== '/ssoLogin' &&
    to.path !== '/find-password' &&
    to.path !== '/signup' &&
    to.path !== '/change-password' &&
    to.path !== '/logout'
  ) {
    // 개발환경에서 token refresh 실패시 login
    if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'dev') {
      const refreshToken = cookieHelper.getCookie(cookieName.refresh_token)
      const refreshResult = await store.dispatch(
        'loginUser/refreshToken',
        refreshToken,
      )
      if (!refreshResult) {
        console.log('no refresh fail')
        next('/devLogin')
      } else {
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
          store.dispatch('loginUser/doLogout')
          next('/devLogin')
        }
      }
      // // k8s 환경
      // } else if (
      //   process.env.NODE_ENV === 'k8s' ||
      //   store.state.loginUser.userInfo === null
      // ) {

      //   if(to.path === '/afterSsoLogin') {

      //   }
      // }
      // SSO 환경에서 유저 정보가 없으면 로그인
    } else if (store.state.loginUser.userInfo === null) {
      // if (to.path === '/afterSsoLogin') {
      alert('!!!!!!!!!!! userInfo === null >>>>>>>>>>>>>>>>>>>>>>')
      const userInfoResult = await store.dispatch('loginUser/doLogin')
      if (!userInfoResult) {
        console.log('get userInfo fail')
        next({ path: '/ssoLogin', query: { originPath: from.path } })
      } else {
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
          store.dispatch('loginUser/doLogout')
          next('/ssoLogin')
        }
      }
      // } else {
      // next({ path: '/ssoLogin', query: { originPath: from.path } })
      // }
    }
  } else {
    getViewablePath()
  }
})

export default router
