<template>
  <div class="sp-user-detail">
    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">AWS Credenctial Info</span>
      </div>
      <div class="content-wrapper">
        <div class="content-wrapper">
          <label-with-text
            label="Access Key"
            :value="accessKey"
            :horizontal="true"
            :readonly="readOnly"
          />
          <label-with-text
            label="Secret Key"
            :value="readOnly ? 'password' : secretKey"
            :horizontal="true"
            :readonly="readOnly"
            :type="readOnly ? 'password' : null"
          />
        </div>
      </div>
      <div class="button-wrapper" v-if="mode">
        <sp-button class="cancel-button" outlined @click="onClickCancel">
          Cancel
        </sp-button>
        <sp-button class="edit-button" outlined @click="onClickUpdate">
          Save
        </sp-button>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import encrypt from '@/lib/encrypt'

const alertMapUtils = createNamespacedHelpers('alert')
// const userMapUtils = createNamespacedHelpers('user')
export default {
  props: {
    readOnly: {
      type: Boolean,
      default: true,
      description: 'readonly 속성 여부',
    },
    mode: {
      type: Boolean,
      default: false,
      description: '모드에 따라 버튼 노출',
    },
  },
  components: {
    LabelWithText,
  },
  data() {
    return {
      accessKey: 'AKIA256GSYQXL2UVSKVC',
      secretKey: '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',
    }
  },
  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    async onClickUpdate() {
      try {
        const response = await this.updateUser()
        if (response.status === 200) {
          this.openAlert({ title: this.successMsg, type: 'info' })
          const id = encodeURIComponent(encrypt.encrypt(this.userId))
          setTimeout(
            () => this.$router.push(`/setting/user/detail/${id}`),
            1000,
          )
          // this.$router.push(`/setting/user/detail/${this.userId}`)
        } else {
          this.openAlert({ title: this.failMsg, type: 'error' })
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({ title: this.failMsg, type: 'error' })
        console.log(error)
      }
    },
    onClickCancel() {
      const id = encodeURIComponent(this.$route.params.id)
      this.$router.push(`/setting/user/detail/${id}`)
    },
  },
}
</script>
