<template>
  <div class="sp-label-with-files" :class="{ ...className }">
    <label
      class="sp__label"
      for="state-title"
      :style="{ ...cssProps['titleStyle'] }"
    >
      {{ name }}
    </label>
    <slot name="sub-label"></slot>
    <v-file-input
      class="sp__file"
      :style="{ ...cssProps['fileStyle'] }"
      :prepend-icon="prependIcon"
      :prepend-inner-icon="prependInnerIcon"
      :append-icon="appendIcon"
      :chips="chips"
      :multiple="multiple"
      :outlined="outlined"
      :disabled="disabled"
      :background-color="backgroundColor"
      :clearable="clearable"
      hide-details
      single-line
      dense
      ref="files"
      :value="value"
      @change="event => $emit('on-change', event)"
    >
      <template v-if="chips" v-slot:selection="{ index, text }">
        <slot name="selection" :item="{ index, text }"></slot>
      </template>
      <template v-if="prependInner" v-slot:prepend-inner>
        <slot name="prepend-inner">
          <sp-button
            class="backgroundColor"
            height="45px"
            :className="{ 'gray-background': true }"
            @click="onClickFile"
            >파일선택</sp-button
          >
        </slot>
      </template>
    </v-file-input>
  </div>
</template>

<script>
// const tag = '[LabelWithFiles]'

export default {
  props: {
    className: {
      type: Object,
      description: '클래스 이름 값 할당',
      marginLeft: {
        type: Boolean,
        description: 'margin 왼쪽',
      },
    },
    name: {
      type: String,
      default: undefined,
      description: '해당 이름.',
    },
    prependIcon: {
      type: String,
      default: '',
      description: 'Prepend icon',
    },
    prependInnerIcon: {
      type: String,
      default: undefined,
      description: 'Prepend inner icon',
    },
    prependInner: {
      type: Boolean,
      default: false,
      description: 'Prepend inner',
    },
    appendIcon: {
      type: String,
      default: '',
      description: 'append icon',
    },
    chips: {
      type: Boolean,
      default: false,
      description: 'chip 형식으로 파일 첨부 유무',
    },
    disabled: {
      type: Boolean,
      default: false,
      description: 'disabled',
    },
    multiple: {
      type: Boolean,
      default: false,
      description: '파일 여러개 유무',
    },
    outlined: {
      type: Boolean,
      default: false,
      description: '가장자리 라인 유무',
    },
    clearable: {
      type: Boolean,
      default: true,
      description: '삭제 유무',
    },
    backgroundColor: {
      type: String,
      default: '#F5F8FB',
      description: '배경색상',
    },
    value: {
      type: [Array, String],
      default: undefined,
      description: '파일 값',
    },
    onChangeFuncName: {
      type: String,
      default: 'onChange',
      description: '변경 이벤트',
    },
  },
  computed: {
    cssProps() {
      return {
        titleStyle: this.className?.titleStyle,
        inputStyle: this.className?.fileStyle,
      }
    },
  },
  methods: {
    onClickFile() {
      const inputEl = this.$refs.files.$el.querySelector('input')
      inputEl && inputEl.click()
    },
  },
}
</script>

<style lang="scss" scoped>
.sp-label-with-files {
  $this: 'sp';
  .#{$this}__label {
    color: $title-color;
    opacity: 0.5;
    font-size: 0.8rem;
  }
  .#{$this}__file {
    margin-top: 5px;
  }
}
</style>
<style lang="scss">
.sp-label-with-files {
  $this: 'v-input';
  .sp__file {
    .v-input__slot {
      padding: 0 12px 0 0 !important;
      .v-input__prepend-inner {
        padding: 0 !important;
        margin: 0 !important;
      }
      .v-text-field__slot {
        max-height: 60px;
        overflow-x: auto;
        flex-wrap: nowrap;
        .v-file-input__text {
          flex-wrap: nowrap;
        }

        &::-webkit-scrollbar {
          width: $scroll-width;
          height: $scroll-width;
        }
        &::-webkit-scrollbar-thumb {
          height: $scroll-height;
          background-color: $scroll-background-color;
          border-radius: $scroll-border-radius;
        }
      }
    }
  }
}
</style>
