<template>
  <div class="sp-new-deploy-experiments">
    <v-form ref="form" @submit.prevent="onSubmit">
      <!-- Namespace -->
      <label-with-select
        horizontal
        name="Namespace"
        v-model="namespace"
        :items="namespaces"
      ></label-with-select>

      <!-- Experiment name -->
      <label-with-text
        horizontal
        name="Experiment name"
        v-model="experimentName"
        @blur="onBlurExperimentName"
      ></label-with-text>

      <!-- Example version -->
      <label-with-select
        horizontal
        name="Example version"
        v-model="exampleVersion"
        :items="versions"
      ></label-with-select>

      <!-- Search algorithm -->
      <label-with-select
        horizontal
        name="Search algorithm"
        v-model="searchAlgorithm"
        :items="algorithms"
      ></label-with-select>

      <!-- Repeat number -->
      <label-with-text
        horizontal
        name="Repeat number"
        v-model="repeatNumber"
        @blur="onBlurRepeatNumber"
      ></label-with-text>
    </v-form>
  </div>
</template>

<script>
import LabelWithSelect from '@/components/molcule/LabelWithSelect.vue'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import { createNamespacedHelpers } from 'vuex'
import { form } from '@/utils/mixins/form'

const autoMLMapUtils = createNamespacedHelpers('automl')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    LabelWithSelect,
    LabelWithText,
  },
  mixins: [form],
  data: () => ({
    namespace: '',
    experimentName: '',
    exampleVersion: '',
    searchAlgorithm: '',
    repeatNumber: '',

    namespaces: [],
    versions: [],
    algorithms: [],
  }),
  async created() {
    this.namespaces = await this.doNamespaceList()
    this.versions = await this.doExampleVersionList()
    this.algorithms = await this.doAlgorithm()
  },
  computed: {},
  mounted() {
    this.initData()
  },
  methods: {
    ...autoMLMapUtils.mapActions([
      'createDepolyExperiments',
      'doNamespaceList',
      'doExampleVersionList',
      'doAlgorithm',
    ]),
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

    onClickAddItem() {
      this.externalIp.push({ ipPort: '' })
    },
    onBlurExperimentName(value) {
      console.log(value)
    },
    onBlurRepeatNumber(value) {
      console.log(value)
    },
    async onSubmit() {
      if (!this.$refs.form.validate()) return
      const params = {
        namespace: this.namespace,
        name: this.experimentName,
        example: this.exampleVersion,
        algorithm: this.searchAlgorithm,
        repeat: this.repeatNumber,
      }

      const result = await this.createDepolyExperiments(params)
      if (result.data.status === 'Succeeded') {
        this.openAlert({
          title: '생성이 완료되었습니다.',
          type: 'info',
        })
      } else {
        this.openAlert({
          title: '생성에 실패하였습니다.',
          type: 'error',
        })
      }
    },
    initData() {
      this.namespace = ''
      this.experimentName = ''
      this.exampleVersion = ''
      this.searchAlgorithm = ''
      this.repeatNumber = ''
    },
  },
}
</script>

<style lang="scss">
.sp-new-deploy-experiments {
  height: 360px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: $scroll-width;
    height: $scroll-width;
  }
  &::-webkit-scrollbar-thumb {
    height: $scroll-height;
    background-color: $scroll-background-color;
    border-radius: $scroll-border-radius;
  }
  padding: 20px 10px;
  .horizontal {
    margin-bottom: 20px;
  }
  .sp-text-field.horizontal {
    margin-bottom: 0;
  }
  .sp__label {
    width: 20%;
  }
  .sp-select {
    width: 80%;
  }
  .node-port-select-wrapper,
  .external-ips-wrapper {
    padding: 15px;
    .input-set-wrapper {
      margin-bottom: 10px;
      .external-ip-input {
        width: 95%;
        display: inline-block;
      }
    }
  }
  .v-input--selection-controls {
    margin: 0;
    padding: 0;
  }
}
</style>
