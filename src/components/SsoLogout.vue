<template>
  <div></div>
</template>

<script>
import cookieHelper from '@/lib/cookieHelper'
import { cookieName } from '@/common/consts'

export default {
  data() {
    return {
      logoutUrl: `${process.env.VUE_APP_BASE_API}/logout`,
    }
  },
  mounted() {
    this.requestLogout()
  },
  methods: {
    requestLogout() {
      const baseUrl = process.env.BASE_URL
      const afterUri = this.$route.path.substring(1)
      const redirectUri = `${window.location.protocol}//${window.location.host}${baseUrl}${afterUri}`
      const refreshToken = cookieHelper.getCookie(cookieName.refresh_token)

      cookieHelper.removeCookie(cookieName.refresh_token)
      cookieHelper.removeCookie(cookieName.access_token)

      sessionStorage.removeItem('firstVal')
      sessionStorage.removeItem('secondVal')
      sessionStorage.removeItem('thirdVal')
      sessionStorage.removeItem('menuList')
      sessionStorage.removeItem('projectUserRole')

      window.location.replace(
        `${process.env.VUE_APP_USER_API}/auth/logout?refreshToken=${refreshToken}&redirectUrl=${redirectUri}`,
        '_self',
      )
    },
  },
}
</script>
