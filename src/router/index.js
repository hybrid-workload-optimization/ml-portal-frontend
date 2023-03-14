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
]

const router = new VueRouter({
  // mode: 'history',
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

  if (
    (!store.state.loginUser.userInfo ||
      !store.state.loginUser.userInfo.userId) &&
    to.path !== '/login' &&
    to.path !== '/find-password' &&
    to.path !== '/signup' &&
    to.path !== '/change-password'
  ) {
    // token refresh 실패시 login
    // const refreshResult = await store.dispatch('loginUser/refreshToken')
    if (store.state.loginUser.userInfo === null) {
      console.log('no refreshResult')
      next('/login')
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
        next('/login')
      }
    }
  } else {
    getViewablePath()
  }
})

export default router
