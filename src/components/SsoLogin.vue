<template><div></div></template>

<script>
export default {
  data() {
    return {}
  },

  created() {
    this.onSubmit()
  },

  methods: {
    onSubmit() {
      const baseUrl = process.env.BASE_URL
      const originUri = this.$route.query.originUrl
      let afterUri = ''
      if (
        !originUri ||
        originUri === '/ssoLogin' ||
        originUri === '/' ||
        originUri === ''
      ) {
        afterUri = ''
      } else {
        afterUri = originUri.substring(1)
      }
      const redirectUri = `${window.location.protocol}//${window.location.host}${baseUrl}${afterUri}`
      window.location.href = `${process.env.VUE_APP_BASE_API}/auth/login?redirectUrl=${redirectUri}`
    },
  },
}
</script>
