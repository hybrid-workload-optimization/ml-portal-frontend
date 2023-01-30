<template>
  <v-select
    class="sp-select"
    :class="{ ...className }"
    :style="{ ...cssProps['selectStyle'] }"
    :append-icon="appendIcon"
    :append-outer-icon="appendOuterIcon"
    :attach="attach"
    :autofocus="autofocus"
    :background-color="backgroundColor"
    :cache-items="cacheItems"
    :chips="chips"
    :clear-icon="clearIcon"
    :clearable="clearable"
    :color="color"
    :counter="counter"
    :counter-value="counterValue"
    :dark="dark"
    :deletable-chips="deletableChips"
    :dense="dense"
    :disable-lookup="disableLookup"
    :disabled="disabled"
    :eager="eager"
    :error="error"
    :error-messages="errorMessage"
    :filled="filled"
    :flat="flat"
    :full-width="fullWidth"
    :hide-details="hideDetails"
    :hide-selected="hideSelected"
    :hint="hint"
    :item-color="itemColor"
    :item-disabled="itemDisabled"
    :item-text="itemText"
    :item-value="itemValue"
    :items="items"
    :label="label"
    :light="light"
    :loading="loading"
    :multiple="multiple"
    :no-data-text="noDataText"
    :open-on-clear="openOnClear"
    :outlined="outlined"
    :placeholder="placeholder"
    :prefix="prefix"
    :prepend-icon="prependIcon"
    :prepend-inner-icon="prependInnerIcon"
    :readonly="readonly"
    :return-object="returnObject"
    :reverse="reverse"
    :rounded="rounded"
    :rules="rules"
    :shared="shared"
    :single-line="singleLine"
    :small-chips="smallChips"
    :solo="solo"
    :solo-inverted="soloInverted"
    :success="success"
    :suffix="suffix"
    :value="value"
    @blur="onBlurSelect"
    @change="onChangeSelect"
    @click="onClickSelect"
    @click:append-outer="onClickAppendOuterIcon"
    @click:prepend="onClickPrependIcon"
    @click:prepend-inner="onClickPrependInnerIcon"
    @click:clear="onClickClearIcon"
    @focus="onFocus"
    @update:error="onUpdateError"
    @update:list-index="onUpdateListIndex"
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
    <template v-slot:prepend-item>
      <slot name="prepend-item"></slot>
    </template>
    <template v-slot:append>
      <slot name="append-content"></slot>
    </template>
    <template v-slot:append-outer>
      <slot name="append-outer-content"></slot>
    </template>
    <template v-slot:append-item>
      <slot name="append-item"></slot>
    </template>
  </v-select>
</template>

<script>
const tag = '[Select]'

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
    attach: {
      default: false,
      description:
        '이 구성 요소가 분리되어야 하는 DOM 요소를 지정합니다. String은 모든 유효한 querySelector가 될 수 있고 Object는 모든 유효한 Node가 될 수 있습니다. 기본적으로 루트 v-app 구성 요소에 연결',
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
    cacheItems: {
      type: Boolean,
      default: false,
      description: '항목 통해 전달된 모든 항목의 로컬 고유 복사본을 유지',
    },
    chips: {
      type: Boolean,
      default: false,
      description: '선택 표시를 칩으로 변경',
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
    counterValue: {
      type: Function,
      description: '',
    },
    counter: {
      type: [Boolean, Number, String],
      default: undefined,
      description:
        '입력 길이에 대한 카운터를 생성합니다. 숫자를 지정하지 않으면 기본값은 25입니다. 유효성 검사를 적용하지 않습니다.',
    },
    dark: {
      type: Boolean,
      default: false,
      description: '구성 요소에 어두운 테마 변형을 적용',
    },
    deletableChips: {
      type: Boolean,
      default: false,
      description: '선택한 칩에 제거 아이콘을 추가',
    },
    dense: {
      type: Boolean,
      default: false,
      description: '입력 높이 감소',
    },
    disableLookup: {
      type: Boolean,
      default: false,
      description: '키보드 조회 비활성화',
    },
    disabled: {
      type: Boolean,
      default: false,
      description: '입력 비활성화',
    },
    eager: {
      type: Boolean,
      default: false,
      description:
        '마운트 시 구성 요소 콘텐츠를 강제로 렌더링합니다. 이는 SEO에 대해 크롤링하려는 DOM에서 렌더링되지 않을 콘텐츠가 있는 경우에 유용',
    },
    error: {
      type: Boolean,
      default: false,
      description: '입력을 수동 오류 상태로 만듬',
    },
    errorMessage: {
      type: [String, Array],
      default() {
        return []
      },
      description:
        '입력을 오류 상태로 만들고 사용자 지정 오류 메시지를 전달합니다. 규칙 소품에서 발생하는 모든 유효성 검사와 결합됩니다. 이 필드는 유효성 검사를 트리거하지 않습니다.',
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
    filled: {
      type: Boolean,
      default: false,
      description: '대체 채워진 입력 스타일을 적용',
    },
    hideDetails: {
      type: [Boolean, String],
      default: false,
      description: '힌트 및 유효성 검사 오류를 숨깁',
    },
    hideSelected: {
      type: Boolean,
      default: false,
      description: '이미 선택된 선택 메뉴 항목에 표시하지 않음',
    },
    hint: {
      type: String,
      default: undefined,
      description: '힌트 텍스트',
    },
    itemColor: {
      type: String,
      default: 'primary',
      description: '선택한 항목의 색상을 설정',
    },
    itemDisabled: {
      type: [String, Array, Function],

      description: '항목의 비활성화 값 속성 설정',
    },
    itemText: {
      type: [String, Array, Function],

      description: '항목의 텍스트 값 속성 설정',
    },
    itemValue: {
      type: [String, Array, Function],
      description: '항목 값의 속성 설정 - 기본이어야 합니다.',
    },
    items: {
      type: Array,
      description:
        '객체의 배열 또는 문자열의 배열이 될 수 있습니다. 개체를 사용할 때 텍스트, 값 및 비활성화된 키를 찾습니다. item-text, item-value 및 item-disabled 소품을 사용하여 변경할 수 있습니다.',
    },
    label: {
      type: String,
      default: '',
      description: '입력 레이블 설정',
    },
    light: {
      type: Boolean,
      default: false,
      description: '구성 요소에 밝은 테마 변형을 적용',
    },
    loading: {
      type: Boolean,
      default: false,
      description: '진행률 표시줄 표시',
    },
    multiple: {
      type: Boolean,
      default: false,
      description: '변경 사항은 다중으로 선택됩니다. 값에 대한 배열 허용',
    },
    noDataText: {
      type: String,
      default: 'noData',
      description: '데이터가 없을 때 텍스트 표시',
    },
    openOnClear: {
      type: Boolean,
      default: false,
      description:
        '지울 수 있는 소품을 사용할 때 한 번 지우면 현재 상태에 따라 선택 메뉴가 열리거나 열린 상태로 유지',
    },
    outlined: {
      type: Boolean,
      default: false,
      description: '개요 스타일을 입력에 적용',
    },
    placeholder: {
      type: String,
      default: 'Select',
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
        '구성 요소 앞에 아이콘을 추가하고 v-icon과 동일한 구문을 사용',
    },
    prependInnerIcon: {
      type: String,
      default: undefined,
      description:
        '구성 요소의 입력 내부에 아이콘을 추가하고 v-icon과 동일한 구문을 사용',
    },
    readonly: {
      type: Boolean,
      default: false,
      description: '입력을 읽기 전용 상태로 둠',
    },
    returnObject: {
      type: Boolean,
      default: false,
      description:
        'item-value로 지정된 값이 아닌 객체를 직접 반환하도록 선택 동작을 변경',
    },
    reverse: {
      type: Boolean,
      default: false,
      description: '입력 방향 반전',
    },
    rounded: {
      type: [Boolean],
      default: false,
      description: '입력에 테두리 반경을 추가',
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
    smallChips: {
      type: Boolean,
      default: false,
      description: '속성이 작은 칩으로 선택 표시 변경',
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
  data: () => ({
    item: ['Foo', 'Bar', 'Fizz', 'Buzz'],
  }),
  computed: {
    cssProps() {
      return {
        selectStyle: this.className?.selectStyle,
      }
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
    onBlurSelect(event) {
      console.log(tag, 'onBlurSelect')
      this.$emit('blur', event)
    },
    /*
        @brief 입력창에 값이 입력될 때 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onChangeSelect(event) {
      console.log(tag, 'onChangeSelect')
      this.$emit('input', event)
    },
    /*
        @brief 입력창이 클릭 되었을 때 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onClickSelect(event) {
      console.log(tag, 'onClickSelect')
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
      console.log(event)
      // this.$emit('click', event)
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
      this.$emit('click-prepend-innter-icon', event)
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
    /*
        @brief 키보드 화살표를 사용하여 메뉴 항목을 선택시 호출되는 이벤트
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onUpdateListIndex(event) {
      console.log(tag, 'onUpdateListIndex')
      this.$emit('update-list-index', event)
    },
  },
}
</script>

<style lang="scss">
.sp-select {
  // border-radius: 10px;
  border-radius: 5px;

  .v-input__control {
    .v-input__slot {
      min-height: 35px !important;
    }
  }
  .v-select__slot {
    .v-select__selections,
    .v-label {
      font-size: 0.8rem !important;
    }
  }

  &.font-color {
    &.lightGreen {
      .v-label {
        color: #00b8d5;
      }
      .v-select__selection {
        color: #00b8d5;
      }
    }
  }
  &.icon-color {
    &.lightGreen {
      .v-input__icon {
        svg {
          color: #00b8d5;
        }
      }
    }
  }
}
</style>
