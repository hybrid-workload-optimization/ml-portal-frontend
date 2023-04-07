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
  mounted() {
    this.requestLogout()
  },
  methods: {
    requestLogout() {
      document.getElementById('lg').submit()
    },
  },
}
</script>
