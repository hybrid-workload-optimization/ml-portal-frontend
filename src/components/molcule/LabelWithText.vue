<template>
  <div class="sp-label-with-text" :class="{ horizontal, ...className }">
    <label
      v-if="!noLabel"
      class="sp__label"
      for="state-title"
      :style="{ ...cssProps['titleStyle'] }"
    >
      {{ name }}
    </label>
    <sp-input
      ref="spInput"
      v-if="lines === 'one'"
      class="sp__input"
      :class="{ horizontal }"
      :style="{ ...cssProps['inputStyle'] }"
      :placeholder="placeholder"
      :type="type"
      :suffix="suffix"
      :append-icon="appendIcon"
      :prepend-inner-icon="prependInnerIcon"
      :value="value"
      :readonly="readonly"
      :disabled="disabled"
      solo
      dense
      flat
      single-line
      filled
      hide-details="auto"
      outlined
      :rules="rules"
      :background-color="backgroundColor"
      @click-append-icon="clickAppendIcon"
      @click-prepend-inner-icon="clickPrependInnerIcon"
      @input="onChangeValueInput"
      @blur="onBlurValueInput"
    >
      <template v-slot:append-content>
        <slot name="button"></slot>
      </template>
    </sp-input>
    <sp-textarea
      v-if="lines === 'multi'"
      class="sp__input sp-text-area"
      :style="{ ...cssProps['inputStyle'] }"
      :placeholder="placeholder"
      :type="type"
      :value="value"
      :readonly="readonly"
      :disabled="disabled"
      solo
      dense
      no-resize
      flat
      auto-grow
      :rows="rows"
      single-line
      filled
      :rules="rules"
      hide-details="auto"
      :background-color="backgroundColor"
      @change="onChangeValueTextArea"
    />
  </div>
</template>

<script>
const tag = '[sp-label-with-text]'
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
    readonly: {
      type: Boolean,
      default: false,
      description: 'readonly 속성 여부',
    },
    disabled: {
      type: Boolean,
      default: false,
      description: 'disabled 속성 여부',
    },
    horizontal: {
      type: Boolean,
      default: false,
      description: '가로로 배치 여부',
    },
    noLabel: {
      type: Boolean,
      default: false,
      description: '라벨 유무',
    },
    backgroundColor: {
      type: String,
      default: '#F5F7F8',
      description: '백그라운드 색상',
    },
    lines: {
      type: String,
      default: 'one',
      description: '라인 수',
    },
    value: {
      type: [Number, String],
      default: undefined,
      description: 'value',
    },
    rows: {
      type: Number,
      default: 3,
      description: '라인 수',
    },

    suffix: {
      type: String,
      default: '',
      description: '뒤첨자',
    },
    appendIcon: {
      type: String,
      default: '',
      description: 'AppendIcon',
    },
    prependInnerIcon: {
      type: String,
      default: '',
      description: 'PrependInnerIcon',
    },
    clickAppendIcon: {
      type: Function,
      default: () => {},
      description: 'AppendIcon 이벤트',
    },
    clickPrependInnerIcon: {
      type: Function,
      default: () => {},
      description: 'PrependInnerIcon 이벤트',
    },
    // onChangeValueInput: {
    //   type: Function,
    //   default: () => {},
    //   description: 'onChangeValueInput 이벤트',
    // },
    // onChangeValueTextArea: {
    //   type: Function,
    //   default: () => {},
    //   description: 'onChangeValueTextArea 이벤트',
    // },
    name: {
      type: String,
      default: undefined,
      description: '해당 이름.',
    },
    placeholder: {
      type: String,
      default: undefined,
      description: 'placeholder 명',
    },
    type: {
      type: String,
      default: 'text',
      description: 'input type 속성',
    },
    rules: {
      type: Array,
      default() {
        return []
      },
      description:
        'Function, Boolean 및 String 유형의 혼합 배열 허용. 함수는 입력 값을 인수로 전달하고 true/false 또는 오류 메시지가 포함된 문자열을 반환해야 합니다. 함수가 false를 반환(또는 배열의 값이 포함)하거나 문자열인 경우 입력 필드는 오류 상태가 됩니다.',
    },
  },
  computed: {
    cssProps() {
      return {
        titleStyle: this.className?.titleStyle,
        inputStyle: this.className?.inputStyle,
      }
    },
    lazyValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$refs.spInput.lazyValue = value
      },
    },
  },
  methods: {
    onChangeValueInput(e) {
      console.log(tag, 'onChangeValueInput')
      if (this.noKorean) {
        this.englishOnly(e)
        this.$emit('input', e)
      } else {
        this.$emit('input', e)
      }
    },
    onChangeValueTextArea(e) {
      console.log(tag, 'onChangeValueInput')
      this.$emit('input', e)
    },
    onBlurValueInput(e) {
      console.log(tag, 'onBlurValueInput')
      this.$emit('blur', e.target.value)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';
.sp-label-with-text {
  $this: 'sp';

  &.horizontal {
    display: flex;
    align-items: center;
  }
  .#{$this}__label {
    @include set-text(normal, 14, rgba($color: $sp-title, $alpha: 0.7));
    display: inline-block;
  }
  .sp-text-area {
    border: 1px solid $sp-box-border;
    // border-radius: 10px;
    border-radius: 5px;
  }
}
</style>
