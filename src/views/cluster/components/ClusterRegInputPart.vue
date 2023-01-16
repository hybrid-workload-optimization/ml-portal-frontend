<template>
  <div class="sp-input-part-wrapper">
    <v-form ref="clusterForm">
      <label-with-text
        class="cluster-name-input"
        name="Cluster name"
        placeholder="Cluster Name을 입력하세요."
        :className="labelWithTextClass"
        :value="formData.clusterName"
        :disabled="editable"
        :rules="rules.clusterName"
        @input="onChangeClusterName"
      >
        <template #button v-if="!editable">
          <sp-button
            class="duplicate-check-button"
            :disabled="
              !formData.clusterName ||
              (!!formData.clusterName && checkedClusterName)
            "
            depressed
            height="40"
            color="#4B5566"
            @click="checkDuplicate(), (snackbar = false)"
            >중복확인</sp-button
          >
        </template>
      </label-with-text>
    </v-form>
    <label-with
      class="cluster-provider-select"
      name="Provider"
      :className="labelWithClass"
    >
      <template #append-content>
        <sp-select
          outlined
          dense
          hide-details
          :items="itemsProvider"
          :value="formData.provider"
          :disabled="editable"
          @input="onChangeProvider"
        ></sp-select>
      </template>
    </label-with>

    <label-with-text
      class="cluster-description-input"
      name="Description(Optional)"
      :className="labelWithTextClass"
      :value="formData.description"
      @input="onChangeDescription"
    ></label-with-text>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
// import { noKoreanRules } from '@/assets/data/noKoreanRules'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWith from '@/components/molcule/LabelWith.vue'

const tag = '[cluster-reg-input-part]'

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
      default() {
        return {
          clusterName: '',
          provider: '',
          description: '',
        }
      },
      description: '수정 데이터',
    },
  },
  components: {
    LabelWithText,
    LabelWith,
  },
  data() {
    return {
      // 입력 폼 데이터 저장용
      formData: {
        clusterIdx: null,
        clusterName: '',
        provider: '',
        description: '',
      },
      // 클러스터 이름 중복 확인용
      checkedClusterName: !!this.editable,
      // 프로바이더 선택용
      itemsProvider: [
        {
          text: 'Kubernetes',
          value: 'Kubernetes',
          disabled: false,
          divider: false,
        },
        {
          text: 'AWS',
          value: 'AWS',
          disabled: false,
          divider: false,
        },
        {
          text: 'NAVER',
          value: 'Naver',
          disabled: false,
          divider: false,
        },
        {
          text: 'GCP',
          value: 'GCP',
          disabled: false,
          divider: false,
        },
        {
          text: 'AZURE',
          value: 'Azure',
          disabled: false,
          divider: false,
        },
      ],
      labelWithTextClass: {
        titleStyle: {},
        inputStyle: {
          readonly: false,
          fontSize: '2rem',
          margin: '10px',
          borderRadius: '5px',
        },
      },
      labelWithClass: {
        titleStyle: {},
      },
      rules: {
        clusterName: [
          value => !!value || '값을 입력하세요.',
          value =>
            /^[a-z|A-Z|0-9|_|-]+$/.test(value) ||
            'Cluster name은 영문/숫자/특수문자(-_)만 입력할 수 있습니다.',
        ],
      },
    }
  },
  created() {
    //
  },
  watch: {
    editData(value) {
      this.formData = value
    },
  },
  computed: {
    ...clusterMapUtils.mapGetters(['dataForm']),
  },
  methods: {
    ...clusterMapUtils.mapMutations(['setDataFormClusterInfo']),
    ...alertMapUtils.mapMutations(['openAlert']),
    ...clusterMapUtils.mapActions(['checkName']),

    onChangeClusterName(e) {
      console.log(tag, 'onChangeClusterName=', e)
      this.checkedClusterName = false
      this.formData.clusterName = e
      console.log(this.formData.clusterName)
    },
    onChangeProvider(e) {
      console.log(tag, 'onChangeProvider=', e)
      this.formData.provider = e
      this.setDataFormClusterInfo(this.formData)
    },
    onChangeDescription(e) {
      console.log(tag, 'onChangeDescription=', e)
      this.formData.description = e
    },
    validateDataForm() {
      if (this.formData.clusterName === '') {
        this.openAlert({ title: 'Cluster name을 입력하십시오.', type: 'error' })
        return false
      }
      // 클러스터 이름은 영문/숫자/특수문자2개로 한정
      const engExp = /^[a-z|A-Z|0-9|_|-]+$/
      const validClusterName = engExp.test(this.formData.clusterName)
      console.log(tag, 'cluster name test =', validClusterName)

      if (!validClusterName) {
        this.openAlert({
          title: 'Cluster name은 영문/숫자/특수문자(-_)만 입력할 수 있습니다.',
          type: 'error',
        })
        return false
      }
      if (!this.checkedClusterName) {
        this.openAlert({
          title: 'Cluster name을 중복확인하여 주십시오',
          type: 'error',
        })
        return false
      }
      console.log(tag, 'this.formData.provider=', this.formData.provider)
      if (this.formData.provider === '') {
        this.openAlert({ title: 'Provider를 선택하십시오.', type: 'error' })
        return false
      }
      return true
    },
    onSave() {
      if (this.validateDataForm()) {
        this.setDataFormClusterInfo(this.formData)
        return true
      }
      return false
    },
    async checkDuplicate() {
      const engExp = /^[a-z|A-Z|0-9|_|-]+$/
      const validClusterName = engExp.test(this.formData.clusterName)
      if (!validClusterName) {
        this.openAlert({
          title: 'Cluster name은 영문/숫자/특수문자(-_)만 입력할 수 있습니다.',
          type: 'error',
        })
        return
      }

      try {
        const response = await this.checkName({
          name: this.formData.clusterName,
        })

        if (response.data.result) {
          this.openAlert({ title: '중복되었습니다.', type: 'error' })
          this.checkedClusterName = false
        } else {
          this.openAlert({
            title: '사용할 수 있는 Cluster Name 입니다.',
            type: 'info',
          })
          this.checkedClusterName = true
        }
      } catch (error) {
        this.openAlert({ title: '중복 확인에 실패했습니다.', type: 'error' })
        this.checkedClusterName = false
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss">
.sp-input-part-wrapper {
  padding-top: 30px;
  .cluster-name-input {
    margin-bottom: 35px;
    .duplicate-check-button {
      color: white;
      border-radius: 5px;
    }
    .v-input__slot {
      padding-right: 0 !important;
    }
  }
  .cluster-provider-select {
    margin-bottom: 35px;
    .sp-select {
      margin: 10px;
      border-radius: 5px !important;
    }
    .v-text-field--outlined fieldset {
      border: thin solid #dbdfe1 !important;
    }
  }
}
</style>
