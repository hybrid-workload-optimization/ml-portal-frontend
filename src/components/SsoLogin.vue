<template><div></div></template>

<script>
export default {
  data() {
    return {}
  },

  mounted() {
    this.onSubmit() // this.doLogout()
  },

  methods: {
    async onSubmit() {
      const baseUrl = process.env.BASE_URL
      const afterUri = 'afterSsoLogin'
      const redirectUri = `${window.location.protocol}//${window.location.host}${baseUrl}${afterUri}`
      const originUri = this.$route.query.originPath

      window.location.replace(
        `${process.env.VUE_APP_BASE_API}/gw/login?redirect=${redirectUri}?originPath=${originUri}`,
      )
    },
  },
}
</script>
