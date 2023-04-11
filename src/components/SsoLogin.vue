<template><div></div></template>

<script>
import axios from 'axios'

export default {
  data() {
    return {}
  },

  created() {
    this.rmSession()
    // this.onSubmit()
  },

  methods: {
    async rmSession() {
      const path = '/gw/rmsession'
      await axios
        .get(path)
        .then(res => {
          console.log(res)
          this.onSubmit()
        })
        .catch(err => {
          console.log(err)
        })
    },
    onSubmit() {
      const baseUrl = process.env.BASE_URL
      const afterUri = 'afterSsoLogin'
      const redirectUri = `${window.location.protocol}//${window.location.host}${baseUrl}${afterUri}`
      const originUri = this.$route.query.originPath

      window.location.replace(
        `${process.env.VUE_APP_BASE_API}/gwlogin?redirect=${redirectUri}?originPath=${originUri}`,
      )
    },
  },
}
</script>
