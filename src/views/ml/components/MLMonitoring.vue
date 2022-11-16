<template>
  <div>
    <!-- src="http://20.249.24.41/grafana/d/4b545447f/cluster-monitoring?orgId=1&from=1668482864526&to=1668493664526&theme=light&kiosk=tv" -->
    <iframe
      class="iframe_style"
      id="easyPayIframe"
      :src="monitoringUrl"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      monitoringUrl: '',
    }
  },
  props: {
    url: {
      type: String,
    },
  },
  mounted() {
    this.monitoringUrl = this.url
    this.test()
  },
  methods: {
    test() {
      const obj = document.getElementById('easyPayIframe')

      console.log('obj = ', obj)
      return this.monitoringUrl
    },
  },
}
</script>

<style>
.iframe_style {
  display: block;
  width: 100%;
  height: 151vh;
  border: 0px;
}
</style>
