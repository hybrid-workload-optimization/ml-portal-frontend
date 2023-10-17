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
// iframe의 key 값 제거 시 iframe 이전 페이지의 src를 호출하는 이슈 있음
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
  },
  watch: {
    url(newValue) {
      this.monitoringUrl = newValue
    },
  },
  methods: {
    ...clusterMapUtils.mapMutations(['setMonitoringIframeUrl']),
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
