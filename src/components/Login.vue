<template><div></div></template>
<script>
import encrypt from '@/lib/encrypt'
import { createNamespacedHelpers } from 'vuex'

const loginUserMapUtils = createNamespacedHelpers('loginUser')

export default {
  data() {
    return {
      valid: false,
      isOpenToast: false,
    }
  },
  mounted() {
    this.onSubmit()
    // this.doLogout()
  },
  methods: {
    async onSubmit() {
      /*
      1. 로그인 요청
      2. 유저정보 저장 -> vuex
      3. auth token 저장 -> auth 토큰은 vuex , refresh 토큰은 cookie 에
      4. 실패시 토스트 노출
      */
      console.log('login request')

      const result = await this.doLogin()
      console.log('login result ', result)

      if (result) {
        let menuList = JSON.parse(
          encrypt.decrypt(sessionStorage.getItem('menuList')),
        )
        const projectUserRole = JSON.parse(
          encrypt.decrypt(sessionStorage.getItem('projectUserRole')),
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

        // TODO 추후 코드 정리 필요
        const flatMenulList = this.setFlatMenuList(menuList)
        await this.$store.commit('loginUser/setFlatMenuList', flatMenulList)
        await this.$store.commit('loginUser/setMenuInfo', {
          defaultUserRole: menuList,
          projectUserRole,
        })
        const menuPath = menuList.length ? menuList[0].menuUrl : '/'

        this.$router.push(menuPath)
      } else {
        this.onClickOpenAlert()
      }
    },
    setFlatMenuList(menuList) {
      const flatMenuList = []
      menuList.forEach(item => {
        this.getSubMenuList(item, flatMenuList)
      })
      return flatMenuList
    },
    getSubMenuList(menuItem, flatMenuList) {
      if (menuItem.subMenuList && menuItem.subMenuList.length) {
        menuItem.subMenuList.forEach(item => {
          this.getSubMenuList(item, flatMenuList)
        })
      } else {
        flatMenuList.push(menuItem)
      }
    },
    ...loginUserMapUtils.mapActions(['doLogin', 'doLogout']),
  },
}
</script>
