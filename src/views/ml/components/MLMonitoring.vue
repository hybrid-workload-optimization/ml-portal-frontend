<template>
  <div>
    <iframe
      v-if="monitoringUrl"
      class="iframe_style"
      id="easyPayIframe"
      :src="monitoringUrl"
    ></iframe>
    <empty v-if="!monitoringUrl" />
  </div>
</template>

<script>
import Empty from '@/components/Empty.vue'

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
