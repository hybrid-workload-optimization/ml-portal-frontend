<template>
  <sp-card class="sp-kubespray-page">
    <label-with-text
      name="Home Directory"
      :value="value"
      :className="labelWithTextClass"
      horizontal
      @input="onInputSettingInput"
    />

    <div
      class="form-button-wrapper"
      v-if="currentMenuInfo && currentMenuInfo.writableYn === 'Y'"
    >
      <sp-button class="reset-button" outlined @click="onReset">
        Reset
      </sp-button>
      <sp-button
        type="submit"
        class="submit-button"
        outlined
        @click="saveAction"
      >
        Save
      </sp-button>
    </div>
  </sp-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import LabelWithText from '@/components/molcule/LabelWithText.vue'

const generalMapUtil = createNamespacedHelpers('general')
const loginUserMapUtil = createNamespacedHelpers('loginUser')
// const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    LabelWithText,
  },
  data() {
    return {
      labelWithTextClass: {
        titleStyle: { width: '200px' },
      },

      value: null,
    }
  },
  computed: {
    ...generalMapUtil.mapGetters(['getSetting', 'getValue']),
    ...loginUserMapUtil.mapState(['currentMenuInfo']),
  },
  async created() {
    // TODO show loading bar
    await this.getSettings()
    this.value = this.getValue
    // TODO remove loading bar
  },

  methods: {
    ...generalMapUtil.mapActions(['getSettings', 'putSettings']),

    onInputSettingInput(event) {
      this.value = event
    },

    saveAction() {
      const params = { ...this.getSetting, value: this.value }
      this.putSettings(params)
    },

    onReset() {
      this.value = this.getValue
    },
  },
}
</script>

<style lang="scss">
.sp-kubespray-page {
  $this: 'kubespray';
  padding: 16px;
  .form-button-wrapper {
    padding-top: 25px;
    text-align: right;
    .sp-button {
      width: 114px;
      border-width: thin;
      border-radius: 5px;
      font-weight: bold;
    }

    .submit-button {
      color: $sp-teriary;
    }

    .reset-button {
      color: $basic-button;
      margin-right: 10px;
    }
  }
}
</style>
