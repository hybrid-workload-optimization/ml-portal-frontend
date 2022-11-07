<template>
  <v-textarea
    class="sp-text-area"
    :class="{ ...className }"
    :append-icon="appendIcon"
    :append-outer-icon="appendOuterIcon"
    :append-grow="appendGrow"
    :autofocus="autofocus"
    :background-color="backgroundColor"
    :clear-icon="clearIcon"
    :clearable="clearable"
    :color="color"
    :counter="counter"
    :counter-value="counterValue"
    :dark="dark"
    :dense="dense"
    :disabled="disabled"
    :error="error"
    :error-count="errorCount"
    :error-messages="errorMessage"
    :filled="filled"
    :flat="flat"
    :full-width="fullWidth"
    :height="height"
    :hide-details="hideDetails"
    :hint="hint"
    :id="id"
    :light="light"
    :loader-height="loaderHeight"
    :loading="loading"
    :messages="messages"
    :no-resize="noResize"
    :outlined="outlined"
    :placeholder="placeholder"
    :prefix="prefix"
    :prepend-icon="prependIcon"
    :prepend-inner-icon="prependInnerIcon"
    :readonly="readonly"
    :reverse="reverse"
    :rounded="rounded"
    :row-height="rowHeight"
    :rows="rows"
    :rules="rules"
    :shared="shared"
    :single-line="singleLine"
    :solo="solo"
    :solo-inverted="soloInverted"
    :success="success"
    :success-messages="successMessage"
    :suffix="suffix"
    :type="type"
    :value="value"
    @blur="onBlurText"
    @change="onChangeText"
    @click="onClickText"
    @click:append="onClickAppendIcon"
    @click:append-outer="onClickAppendOuterIcon"
    @click:prepend="onClickPrependIcon"
    @click:prepend-inner="onClickPrependInnerIcon"
    @click:clear="onClickClearIcon"
    @focus="onFocus"
    @input="onChangeInput"
    @keydown="onKeydown"
    @update:error="onUpdateError"
  >
    <template v-slot:label>
      <slot name="label"></slot>
    </template>
    <template v-slot:prepend>
      <slot name="prepend-content"></slot>
    </template>
    <template v-slot:prepend-inner>
      <slot name="prepend-inner-content"></slot>
    </template>
    <template v-slot:append>
      <slot name="append-content"></slot>
    </template>
    <template v-slot:append-outer>
      <slot name="append-outer-content"></slot>
    </template>
  </v-textarea>
</template>

<script>
const tag = '[TextArea]'
export default {
  props: {
    /*
     @brief 클래스 이름 값 할당
     @date 2021/11/04
     @example
     {
       클래스 이름 : {
         타입: '',
         필수유무: Boolean
         디폴트: 값
       }
     }
    */
    className: {
      type: Object,
      description: '클래스 이름 값 할당',
      isActive: {
        type: Boolean,
        description: '액티브 유무',
      },
      widthButton: {
        type: Boolean,
        description: 'with 버튼 유무',
      },
    },
    appendIcon: {
      type: String,
      default: undefined,
      description: '구성 요소에 아이콘을 추가하고 v-icon과 동일한 구문을 사용',
    },
    appendOuterIcon: {
      type: String,
      default: undefined,
      description:
        '구성 요소의 입력 외부에 아이콘을 추가하고 v-icon과 동일한 구문을 사용',
    },
    appendGrow: {
      type: Boolean,
      default: false,
      description: '텍스트 양에 따라 자동으로 텍스트 영역 확장',
    },
    autofocus: {
      type: Boolean,
      default: false,
      description: '자동 초점 활성화',
    },
    backgroundColor: {
      type: String,
      default: undefined,
      description: '입력의 배경색을 변경',
    },
    clearIcon: {
      type: String,
      default: '$clear',
      description: 'clearable을 사용하고 입력을 할 때 적용',
    },
    clearable: {
      type: Boolean,
      default: false,
      description:
        '입력 지우기 기능 추가, 기본 아이콘은 Material Design Icons mdi-clear',
    },
    color: {
      type: String,
      default: undefined,
      description:
        '지정된 색상을 컨트롤에 적용합니다. 색상의 이름(예: 자주색) 또는 CSS 색상(#033 또는 rgba(255, 0, 0, 0.5))이 될 수 있습니다.',
    },
    counter: {
      type: [Boolean, Number, String],
      default: undefined,
      description:
        '입력 길이에 대한 카운터를 생성합니다. 숫자를 지정하지 않으면 기본값은 25입니다. 유효성 검사를 적용하지 않습니다.',
    },
    counterValue: {
      type: Function,
      description: '',
    },
    dark: {
      type: Boolean,
      default: false,
      description: '구성 요소에 어두운 테마 변형을 적용',
    },
    dense: {
      type: Boolean,
      default: false,
      description: '입력 높이 감소',
    },
    disabled: {
      type: Boolean,
      default: false,
      description: '입력 비활성화',
    },
    error: {
      type: Boolean,
      default: false,
      description: '입력을 수동 오류 상태로 만듬',
    },
    errorCount: {
      type: [String, Number],
      default: 1,
      description: '한 번에 표시해야 하는 총 오류 수',
    },
    errorMessage: {
      type: [String, Array],
      default() {
        return []
      },
      description:
        '입력을 오류 상태로 만들고 사용자 지정 오류 메시지를 전달합니다. 규칙 소품에서 발생하는 모든 유효성 검사와 결합됩니다. 이 필드는 유효성 검사를 트리거하지 않습니다.',
    },
    filled: {
      type: Boolean,
      default: false,
      description: '대체 채워진 입력 스타일을 적용',
    },
    flat: {
      type: Boolean,
      default: false,
      description: '요소에 추가된 고도(그림자)를 제거',
    },
    fullWidth: {
      type: Boolean,
      default: false,
      description: '입력 유형을 가로를 꽉 채워 지정',
    },
    height: {
      type: [Number, String],
      default: undefined,
      description: '입력 높이를 설정',
    },
    hideDetails: {
      type: [Boolean, String],
      default: false,
      description: '힌트 및 유효성 검사 오류를 숨깁',
    },
    hint: {
      type: String,
      default: undefined,
      description: '힌트 텍스트',
    },
    id: {
      type: String,
      default: undefined,
      description: '구성 요소의 DOM ID를 설정',
    },
    light: {
      type: Boolean,
      default: false,
      description: '구성 요소에 밝은 테마 변형을 적용',
    },
    loaderHeight: {
      type: [Number, String],
      default: 2,
      description: '로더의 높이를 지정',
    },
    loading: {
      type: Boolean,
      default: false,
      description: '진행률 표시줄 표시',
    },
    messages: {
      type: [String, Array],
      default: () => {
        return []
      },
      description: '문자열을 사용하는 경우 메시지 또는 메시지 목록을 표시',
    },
    noResize: {
      type: Boolean,
      default: false,
      description: '크기 조정 핸들 제거',
    },
    outlined: {
      type: Boolean,
      default: false,
      description: '개요 스타일을 입력에 적용',
    },
    placeholder: {
      type: String,
      default: undefined,
      description: '입력의 자리 표시자 텍스트를 설정',
    },
    prefix: {
      type: String,
      default: undefined,
      description: '접두어 텍스트 표시',
    },
    prependIcon: {
      type: String,
      default: undefined,
      description:
        '구성 요소 앞 바깥쪽에 아이콘을 추가하고 v-icon과 동일한 구문을 사용',
    },
    prependInnerIcon: {
      type: String,
      default: undefined,
      description:
        '구성 요소 앞에 아이콘을 추가하고 v-icon과 동일한 구문을 사용',
    },
    readonly: {
      type: Boolean,
      default: false,
      description: '입력을 읽기 전용 상태로 둠',
    },
    reverse: {
      type: Boolean,
      default: false,
      description: '입력 방향 반전',
    },
    rounded: {
      type: Boolean,
      default: false,
      description: '입력에 테두리 반경을 추가',
    },
    rowHeight: {
      type: [Number, String],
      default: 24,
      description: '각 행의 높이 값',
    },
    rows: {
      type: [Number, String],
      default: 5,
      description: '기본 행 수',
    },
    rules: {
      type: Array,
      default() {
        return []
      },
      description:
        'Function, Boolean 및 String 유형의 혼합 배열 허용. 함수는 입력 값을 인수로 전달하고 true/false 또는 오류 메시지가 포함된 문자열을 반환해야 합니다. 함수가 false를 반환(또는 배열의 값이 포함)하거나 문자열인 경우 입력 필드는 오류 상태가 됩니다.',
    },
    shared: {
      type: Boolean,
      default: false,
      description:
        '윤곽선이 있는 경우 둥글고 채워진 경우 테두리 반경을 늘림. 윤곽선이 있거나 채워진 상태로 사용',
    },
    singleLine: {
      type: Boolean,
      default: false,
      description: '레이블이 포커스에서 움직이지 않음',
    },
    solo: {
      type: Boolean,
      default: false,
      description: '입력 스타일을 변경',
    },
    soloInverted: {
      type: Boolean,
      default: false,
      description: '초점이 맞춰질 때까지 요소 불투명도를 줄임',
    },
    success: {
      type: Boolean,
      default: false,
      description: '입력을 성공 상태로 설정',
    },
    successMessage: {
      type: [Array, String],
      default() {
        return []
      },
      description: '입력을 성공 상태로 만들고 사용자 지정 성공 메시지를 전달',
    },
    suffix: {
      type: String,
      default: undefined,
      description: '접미사 텍스트를 표시',
    },
    type: {
      type: String,
      default: 'type',
      description: '입력 유형 설정',
    },
    value: {
      default: undefined,
      description: '입력 값',
    },
  },
  methods: {
    /*
        @brief 입력창이 블러 처리 되었을 때 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onBlurText(event) {
      console.log(tag, 'onBlurText')
      this.$emit('blur', event)
    },
    /*
        @brief 입력창에 값이 입력될 때 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onChangeText(event) {
      console.log(tag, 'onChangeText')
      this.$emit('change', event)
    },
    /*
        @brief 입력창이 클릭 되었을 때 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onClickText(event) {
      console.log(tag, 'onClickText')
      this.$emit('click', event)
    },
    /*
        @brief 입력창 뒤쪽의 아이콘이 클릭 되었을 때 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onClickAppendIcon(event) {
      console.log(tag, 'onClickAppendIcon')
      this.$emit('click-append-icon', event)
    },
    /*
        @brief 입력창 뒤쪽의 아이콘이 클릭 되었을 때 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onClickAppendOuterIcon(event) {
      console.log(tag, 'onClickAppendOuterIcon')
      this.$emit('click-append-outer-icon', event)
    },
    /*
        @brief 입력창 안쪽의 아이콘이 클릭 되었을 때 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onClickPrependIcon(event) {
      console.log(tag, 'onClickPrependIcon')
      this.$emit('click-prepend-icon', event)
    },
    /*
        @brief 입력창 안쪽의 바깥쪽 아이콘이 클릭 되었을 때 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onClickPrependInnerIcon(event) {
      console.log(tag, 'onClickPrependInnerIcon')
      this.$emit('click-prepend-innner-icon', event)
    },
    /*
        @brief 입력창 clear 아이콘이 클릭 되었을 때 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onClickClearIcon(event) {
      console.log(tag, 'onClickClearIcon')
      this.$emit('click-clear-icon', event)
    },
    /*
        @brief 입력창이 포커스 되었을 때 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onFocus(event) {
      console.log(tag, 'onFocus')
      this.$emit('focus', event)
    },
    /*
        @brief 업데이트된 바인딩 모델 이벤트
        @date 2021/11/09
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onChangeInput(value) {
      console.log(tag, 'onChangeInput')
      this.$emit('change', value)
    },
    /*
        @brief 아무 키나 눌렀을 때 발생호되는 이벤트
        @date 2021/11/09
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onKeydown(event) {
      console.log(tag, 'onKeydown')
      this.$emit('keydown', event)
    },
    /*
        @brief 입력창의 에러가 났을 때 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onUpdateError(event) {
      console.log(tag, 'onUpdateError')
      this.$emit('update-error', event)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-text-area {
  &.v-input--is-readonly,
  &.v-input--is-disabled {
    .v-input__slot {
      background: $input-bgcolor !important;
    }
  }
  .v-input__slot {
    font-size: toRem(13);
    background: #fff !important;
    .v-input__prepend-inner {
      padding: 16px 15px !important;
    }
    fieldset {
      border: 1px solid $sp-box-border;
      border-radius: 5px;
    }
    ::placeholder {
      font-size: toRem(13);
    }
    .v-text-field__slot {
      input {
        padding: 0;
      }
    }
  }
  .widthButton {
    color: black;
    .v-input__slot {
      margin-bottom: 0 !important;
      padding-right: 0 !important;
      min-height: 0 !important;
    }
    .v-input__append-inner {
      margin: 0 !important;
    }
  }
}
</style>
