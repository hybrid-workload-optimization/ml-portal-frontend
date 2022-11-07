<template>
  <div class="import-cluster-part">
    <div class="editor-wrapper">
      <editor
        :content="formData.kubeConfig"
        @input="onChangeKubeConfig"
      ></editor>
    </div>
    <div class="button-wrapper">
      <sp-button
        :disabled="formData.kubeConfig === ''"
        class="check-connect-button"
        depressed
        @click="checkConnect"
        ><span v-if="checkedKubeConfig === true">(V)</span>Check
        Connect</sp-button
      >
      <!-- <dimmed v-if="isOpenLoading"
        ><loading loading-message="Check Connect"
      /></dimmed> -->
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Editor from '@/components/Editor.vue'

const tag = '[cluster-reg-import]'

const clusterMapUtils = createNamespacedHelpers('cluster')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  props: {
    editable: {
      type: Boolean,
      default: false,
      description: '수정 가능 여부',
    },
    editData: {
      type: Object,
      default: {
        kubeConfig: '',
      },
      description: '수정 데이터',
    },
  },
  components: {
    Editor,
  },
  data() {
    return {
      formData: {
        kubeConfig: this.editData ? this.editData.kubeConfig : '',
      },
      // Kube Config 연결 확인용
      checkedKubeConfig: !!this.editable,
    }
  },
  created() {
    // console.log(tag, 'called created')
  },
  watch: {
    editData(value) {
      console.log(tag, 'editData=', value)
      this.formData = value
    },
  },
  computed: {
    //
  },
  methods: {
    ...clusterMapUtils.mapMutations(['setDataFormKubeConfig']),
    ...clusterMapUtils.mapMutations(['initDataFormKubespray']),
    ...clusterMapUtils.mapActions(['checkConnection']),
    ...alertMapUtils.mapMutations(['openAlert']),

    onChangeKubeConfig(e) {
      console.log(tag, 'onChangeKubeConfig=', e)
      this.checkedKubeConfig = false
      this.formData.kubeConfig = e
    },
    validateDataForm() {
      console.log(tag, 'validateDataForm=', this.formData.kubeConfig)

      if (this.formData.kubeConfig === '') {
        this.openAlert({
          title: 'Kube Config 정보를 입력하십시오.',
          type: 'error',
        })
        return false
      }

      if (!this.checkedKubeConfig) {
        this.openAlert({
          title: 'Check Connect를 통하여 연결확인하여 주십시오',
          type: 'error',
        })
        return false
      }

      return true
    },
    onSave() {
      if (this.validateDataForm()) {
        this.setDataFormKubeConfig(this.formData)
        this.initDataFormKubespray()
        return true
      }
      return false
    },
    async checkConnect() {
      console.log(tag, 'checkConnect=', this.formData.kubeConfig)

      if (this.formData.kubeConfig === '') {
        this.openAlert({
          title: 'Kube Config 정보를 입력하십시오.',
          type: 'error',
        })
        return
      }

      try {
        const response = await this.checkConnection({
          kubeConfig: this.formData.kubeConfig,
        })

        if (response.status === 200) {
          if (response.data.result) {
            this.openAlert({
              title: '클러스터 연결이 확인 되었습니다.',
              type: 'info',
            })
            this.checkedKubeConfig = true
          } else {
            this.openAlert({
              title: '클러스터에 연결 할 수 없습니다.',
              type: 'error',
            })
            this.checkedKubeConfig = false
          }
        } else {
          this.openAlert({
            title: '클러스터에 연결 실패했습니다.',
            type: 'error',
          })
          this.checkedKubeConfig = false
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({
          title: '클러스터에 연결 실패했습니다.',
          type: 'error',
        })
        this.checkedKubeConfig = false
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.import-cluster-part {
  .button-wrapper {
    .connected-message {
      @include set-text(normal, 13, $sp-sky-blue-500, false, true);
      margin-right: 10px;
    }
    .check-connect-button {
      color: white;
      background: $sp-teriary;
    }
  }
}
</style>
