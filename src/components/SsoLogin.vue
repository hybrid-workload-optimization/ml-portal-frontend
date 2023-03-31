<template><div></div></template>
<script>
export default {
  data() {
    return {}
  },
  mounted() {
    this.onSubmit()
    // this.doLogout()
  },
  methods: {
    async onSubmit() {
      const afterUri = 'afterSsoLogin'
      const baseUrl = process.env.BASE_URL
      const redirectUri = `${window.location.protocol}//${window.location.host}${baseUrl}${afterUri}`
      window.location.replace(
        `${process.env.VUE_APP_BASE_API}/gw/login?redirectUrl=${redirectUri}`,
      )
    },
  },
}
</script>
