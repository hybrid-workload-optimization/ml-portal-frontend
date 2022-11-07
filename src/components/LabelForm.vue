<template>
  <div class="sp-label-form">
    <v-form ref="form" @submit.prevent="onSubmit">
      <div class="label-form__input-box">
        <label-with-text
          name="labelKey"
          :value="labelKey"
          placeholder="label key"
          :rules="rules.requiredLabelKey"
          background-color="#F5F5f5"
          :className="{
            inputStyle: {
              fontSize: '0.8rem',
              borderRadius: '10px',
            },
          }"
          @input="onChangeLabelKey"
        />
      </div>
      <div class="label-form__input-box">
        <label-with-text
          name="labelValue"
          :value="labelValue"
          placeholder="label value"
          :rules="rules.requiredLabelValue"
          background-color="#F5F5f5"
          :className="{
            inputStyle: {
              fontSize: '0.8rem',
              borderRadius: '10px',
            },
          }"
          @input="onChangeLabelValue"
        />
      </div>
    </v-form>
  </div>
</template>

<script>
import { form } from '@/utils/mixins/form'
import LabelWithText from './molcule/LabelWithText.vue'

export default {
  components: { LabelWithText },
  mixins: [form],
}
</script>

<style lang="scss">
.sp-label-form {
  $this: 'label-form';
  width: 100%;
  padding: 23px 33px 0 33px;
  .#{$this}__input-box {
    &:first-child {
      margin-bottom: 21px;
    }
  }
}
</style>
