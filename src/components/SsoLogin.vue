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
      const redirectUri = `${window.location.protocol}//${window.location.host}/afterSsoLogin`
      window.location.replace(
        `${process.env.VUE_APP_BASE_API}/gw/login?redirectUrl=${redirectUri}`,
      )
    },
  },
}
</script>
