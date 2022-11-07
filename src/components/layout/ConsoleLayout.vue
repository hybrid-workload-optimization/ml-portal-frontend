<template>
  <div id="sp-console-layout">
    <h1>콘솔 컴포넌트 #17</h1>
    <div class="project-wrapper">
      <console ref="xterm" :accessPath="accessPath" console></console>
    </div>
  </div>
</template>

<script>
import Console from '@/components/Console.vue'

export default {
  components: { Console },
  data: () => ({
    env: '',
    podName: '',
    contaName: '',
    logtxt: '',
  }),
  mounted() {
    // const param = this.$route.params.name
    // const arr = param.split('==')
    // // eslint-disable-next-line prefer-destructuring
    // this.env = arr[0]
    // // eslint-disable-next-line prefer-destructuring
    // this.podName = arr[1]
    // // eslint-disable-next-line prefer-destructuring
    // this.contaName = arr[2]
    // this.$http
    //   .get(
    //     `/***/api/v1/***/pod/logs?env=${this.env}&podName=${this.podName}&cntnerName=${this.contaName}`,
    //   )
    //   .then(response => {
    //     const resp = response.data
    //     if (resp.success) {
    //       this.logtxt = resp.data.replicas
    //       this.logtxt = this.logtxt.replace(/\n/g, '\r\n')
    //       this.$refs.xterm.term.write(this.logtxt)
    //       this.$refs.xterm.term.write(this.logtxt)
    //       this.$refs.xterm.term.fit()
    //     } else {
    //       this.$message.error(`error${resp.errorMsg}`)
    //     }
    //   })
    //   .catch(err => {
    //     this.$message.error(`error${err.message}`)
    //   })
  },
  computed: {
    accessPath() {
      return '/1'
    },
  },
}
</script>

<style lang="scss">
.sp-console-layout {
  width: 100%;
  .project-wrapper {
    border: 1px solid blue;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
