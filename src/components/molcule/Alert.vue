<template>
  <div class="sp-alert">
    <v-snackbar
      @input="onClickOpenAlert"
      v-model="lazyDialog"
      :multi-line="multiLine"
      :timeout="timeout"
      :color="color"
      :height="height"
      elevation="0"
      min-width="600"
      :top="true"
    >
      <slot name="alert-icon"></slot>
      {{ titleName }}
      <template #action="{ attrs }">
        <v-btn
          v-if="isClose"
          :color="'#fff'"
          text
          v-bind="attrs"
          @click="onClickCloseAlert"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
const tag = '[Alert]'

export default {
  props: {
    titleName: {
      type: String,
      default: '',
      description: '모달 헤더 이름',
    },
    dialog: {
      type: Boolean,
      default: false,
      description: '모달 오픈 여부',
    },
    multiLine: {
      type: Boolean,
      default: false,
      description: '라인 수',
    },
    color: {
      type: String,
      default: '#DE0655',
      description: '토스트 색상',
    },
    height: {
      type: String,
      default: '48px',
      description: '토스트 높이',
    },
    width: {
      type: String,
      default: '450px',
      description: '토스트 넓이',
    },
    timeout: {
      type: Number,
      default: -1,
      description: '토스트 오픈 시간',
    },
    isClose: {
      type: Boolean,
      default: true,
      description: 'Close 버튼 노출 유무',
    },
  },
  data() {
    return {}
  },
  computed: {
    lazyDialog: {
      get() {
        return this.dialog
      },
      set(value) {
        if (!value) {
          this.$emit('close-Alert')
        }
      },
    },
  },
  methods: {
    onClickCloseAlert() {
      console.log(tag, 'onClickCloseAlert')
      this.$emit('close-Alert')
    },
    onClickOpenAlert() {
      console.log(tag, 'onClickOpenAlert')
      this.$emit('open-Alert')
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-alert {
  .v-snack__wrapper {
    .v-snack__content {
      justify-content: center;
      .v-icon {
        margin-right: 9px;
      }
      display: flex;
      padding: 13px 19px;
      align-items: center;
      @include set-text(500, 15, #fff);
    }
  }
}
</style>
