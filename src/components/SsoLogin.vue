<template><div></div></template>

<script>
// import axios from 'axios'

export default {
  data() {
    return {}
  },

  created() {
    // this.rmSession()
    this.onSubmit()
  },

  methods: {
    // async rmSession() {
    //   const path = '/gw/rmsession'
    //   await axios
    //     .get(path)
    //     .then(res => {
    //       console.log(res)
    //       this.onSubmit()
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // },
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
      console.log(afterUri)
      const redirectUri = `${window.location.protocol}//${window.location.host}${baseUrl}${afterUri}`
      // const originUri = this.$route.query.originPath
      console.log(afterUri)
      window.location.replace(
        `${process.env.VUE_APP_BASE_API}/auth/login?redirectUrl=${redirectUri}`,
        '_self',
      )
    },
  },
}
</script>
