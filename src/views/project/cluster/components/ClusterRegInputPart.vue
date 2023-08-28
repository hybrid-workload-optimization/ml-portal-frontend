<template>
  <div class="sp-input-part-wrapper">
    <v-form ref="clusterForm">
      <label-with-text
        class="cluster-name-input"
        name="Cluster name"
        placeholder="Enter a cluster name."
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
            >Duplicate check</sp-button
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
          background-color="#FFF"
        ></sp-select>
      </template>
    </label-with>

    <!-- <label-with
      class="cluster-provider-select"
      name="CSP Account"
      :className="labelWithClass"
    >
      <template #append-content>
        <sp-select
          outlined
          dense
          hide-details
          :items="itemsCSPAccount"
          :value="formData.CSPAccount"
          :disabled="editable"
          @input="onChangeCSPAccount"
        ></sp-select>
      </template>
    </label-with> -->

    <label-with-select
      v-if="publicProvider.includes(formData.provider)"
      name="CSP Account"
      class="cluster-provider-select"
      :items="dataCSPAccountList"
      item-text="accountId"
      item-value="uuid"
      :disabled="editable"
      @input="onChangeCSPAccount"
    ></label-with-select>

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
import LabelWithSelect from '@/components/molcule/LabelWithSelect.vue'

const tag = '[cluster-reg-input-part]'

const clusterMapUtils = createNamespacedHelpers('cluster')
const projectMapUtils = createNamespacedHelpers('project')
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
          cspAccount: '',
          description: '',
        }
      },
      description: '수정 데이터',
    },
  },
  components: {
    LabelWithText,
    LabelWith,
    LabelWithSelect,
  },
  data() {
    return {
      publicProvider: ['AWS', 'Naver', 'GCP', 'Azure'],
      // 입력 폼 데이터 저장용
      formData: {
        projectIdx: this.$route.params.id,
        clusterIdx: null,
        clusterName: '',
        provider: '',
        cspAccountUuid: '',
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
          text: 'Kubernetes(vSphere)',
          value: 'VMware',
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
          value => !!value || 'Please enter a value.',
          value =>
            /^[a-z|A-Z|0-9|_|-]+$/.test(value) ||
            'Cluster name can only contain English/Number/Special characters (-_).',
        ],
      },
    }
  },
  watch: {
    editData(value) {
      this.formData = value
      console.log(value)
    },
  },
  computed: {
    ...clusterMapUtils.mapGetters(['dataForm']),
    ...projectMapUtils.mapGetters(['dataCSPAccountList']),
  },
  methods: {
    ...clusterMapUtils.mapMutations(['setDataFormClusterInfo']),
    ...alertMapUtils.mapMutations(['openAlert']),
    ...clusterMapUtils.mapActions(['checkName']),
    ...projectMapUtils.mapActions(['getServiceGroupCSPAccountList']),

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

      if (this.publicProvider.includes(e)) {
        this.getCspAccounts()
      }
    },
    onChangeCSPAccount(e) {
      console.log(tag, 'onChangeCSPAccount=', e)
      this.formData.cspAccountUuid = e
    },
    onChangeDescription(e) {
      console.log(tag, 'onChangeDescription=', e)
      this.formData.description = e
    },
    async getCspAccounts() {
      const param = {
        projectIdx: this.$route.params.id,
        provider: this.formData.provider,
      }
      await this.getServiceGroupCSPAccountList(param)
    },
    validateDataForm() {
      if (this.formData.clusterName === '') {
        this.openAlert({ title: 'Enter a cluster name.', type: 'error' })
        return false
      }
      // 클러스터 이름은 영문/숫자/특수문자2개로 한정
      const engExp = /^[a-z|A-Z|0-9|_|-]+$/
      const validClusterName = engExp.test(this.formData.clusterName)
      console.log(tag, 'cluster name test =', validClusterName)

      if (!validClusterName) {
        this.openAlert({
          title:
            'Cluster name can only contain English/Number/Special characters (-_).',
          type: 'error',
        })
        return false
      }
      if (!this.checkedClusterName) {
        this.openAlert({
          title: 'Duplicate check cluster name please',
          type: 'error',
        })
        return false
      }
      console.log(tag, 'this.formData.provider=', this.formData.provider)
      if (this.formData.provider === '') {
        this.openAlert({ title: 'Please select a Provider.', type: 'error' })
        return false
      }
      if (this.publicProvider.includes(this.formData.provider)) {
        if (this.formData.cspAccountUuid === '') {
          this.openAlert({
            title: 'Please select a CSP Account.',
            type: 'error',
          })
          return false
        }
      }
      return true
    },
    onSave() {
      this.formData.projectIdx = this.$route.params.id
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
          title:
            'Cluster name can only contain English/Number/Special characters (-_).',
          type: 'error',
        })
        return
      }

      try {
        const response = await this.checkName({
          name: this.formData.clusterName,
        })

        if (response.data.result) {
          this.openAlert({ title: 'Duplicated.', type: 'error' })
          this.checkedClusterName = false
        } else {
          this.openAlert({
            title: 'This is the Cluster Name that can be used.',
            type: 'info',
          })
          this.checkedClusterName = true
        }
      } catch (error) {
        this.openAlert({
          title: 'Duplicate verification failed.',
          type: 'error',
        })
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
