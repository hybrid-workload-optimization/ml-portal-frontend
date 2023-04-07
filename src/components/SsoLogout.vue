<template>
  <div>
    <form id="lg" :action="logoutUrl" method="post"></form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logoutUrl: `${process.env.VUE_APP_BASE_API}/logout`,
    }
  },
  created() {
    this.requestLogout()
  },
  methods: {
    requestLogout() {
      // const originPage = this.$route.query.originPath
      document.getElementById('lg').submit()
      // this.$router
      // .push({ path: '/ssoLogin', query: { originPath: originPage } })
      // .catch(() => {})
    },
  },
}
</script>
