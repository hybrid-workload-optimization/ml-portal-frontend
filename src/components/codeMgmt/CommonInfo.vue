<template>
  <div class="sp-code-mgmt-common-info">
    <div class="code-mgmt-common-info__flex-wrapper">
      <label-with
        class="code-mgmt-common-info__label w-50"
        name="등록자"
        isBlock
      >
        <template #append-content>
          {{ createdUserId }}
        </template>
      </label-with>
      <label-with
        class="code-mgmt-common-info__label w-50"
        name="등록일자"
        isBlock
      >
        <template #append-content>
          {{ createdAt }}
        </template>
      </label-with>
    </div>
    <div class="code-mgmt-common-info__flex-wrapper">
      <label-with
        class="code-mgmt-common-info__label w-50"
        name="수정자"
        isBlock
      >
        <template #append-content>
          {{ updateUserId }}
        </template>
      </label-with>
      <label-with
        class="code-mgmt-common-info__label w-50"
        name="수정일자"
        isBlock
      >
        <template #append-content>
          {{ updatedAt }}
        </template>
      </label-with>
    </div>
    <label-with-text
      class="code-mgmt-common-info__label"
      :class="readonly ? 'code-mgmt-common-info__label--required' : ''"
      name="요청 설명"
      lines="multi"
      :readonly="readonly"
      :value="description"
      background-color="#F5F5f5"
      @input="onChangeCodeDesc"
    />
  </div>
</template>

<script>
import LabelWith from '@/components/molcule/LabelWith.vue'
import LabelWithText from '@/components/molcule/LabelWithText.vue'

const tag = '[Code-mgmt-common-info]'
export default {
  components: {
    LabelWith,
    LabelWithText,
  },
  props: {
    createdUserId: {
      type: String,
      default: '생성자 ID',
    },
    createdAt: {
      type: String,
      default: '생성 일자',
    },
    updateUserId: {
      type: String,
      default: '수정자 ID',
    },
    updatedAt: {
      type: String,
      default: '수정 일자',
    },
    description: {
      type: String,
      default: '설명',
    },
    readonly: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onChangeCodeDesc(value) {
      console.log(tag, 'onChangeCodeDesc')
      this.$emit('input', value)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-code-mgmt-common-info {
  $this: 'code-mgmt-common-info';
  .#{$this}__label {
    margin-bottom: 19px;
    @include set-text(normal, 15, rgba($color: $sp-title, $alpha: 1));
    &.#{$this}__label--required {
      .v-input__slot {
        background-color: rgba($color: rgb(245 245 245), $alpha: 1) !important;
      }
    }
  }
  .#{$this}__flex-wrapper {
    display: flex;
    align-items: center;
    .w-50 {
      width: 50%;
    }
  }
}
</style>
