<template>
  <div>
    <iframe
      v-if="monitoringUrl"
      class="iframe_style"
      id="easyPayIframe"
      :key="'name=' + Date.now()"
      :src="monitoringUrl"
    ></iframe>
    <empty v-if="!monitoringUrl" />
  </div>
</template>

<script>
// iframe의 key 값 제거 시 iframe 이전 페이지의 src를 호출하는 이슈 있음(멱등성 이슈)
import Empty from '@/components/Empty.vue'
import { createNamespacedHelpers } from 'vuex'

const clusterMapUtils = createNamespacedHelpers('cluster')

export default {
  components: {
    Empty,
  },
  props: {
    url: {
      type: String,
    },
  },
  data() {
    return {
      monitoringUrl: '',
    }
  },
  mounted() {
    this.monitoringUrl = this.url
    this.test()
  },
  watch: {
    url(newValue) {
      console.log(newValue)
      this.monitoringUrl = newValue
    },
  },
  methods: {
    ...clusterMapUtils.mapMutations(['setMonitoringIframeUrl']),
    test() {
      const obj = document.getElementById('easyPayIframe')

      console.log('obj = ', obj)
      console.log('this.monitoringUrl = ', this.monitoringUrl)
      console.log('this.monitoringUrl typeof = ', typeof this.monitoringUrl)
      console.log(
        'this.monitoringUrl toString = ',
        this.monitoringUrl.toString(),
      )
      console.log(
        'this.monitoringUrl toString typeof= ',
        typeof this.monitoringUrl.toString(),
      )
      return this.monitoringUrl
    },
  },
  beforeDestroy() {
    this.setMonitoringIframeUrl()
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
