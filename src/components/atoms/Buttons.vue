<template>
  <v-btn
    class="sp-button"
    :class="{ ...className }"
    :absolute="absolute"
    :active-class="activeClass"
    :append="append"
    :block="block"
    :bottom="bottom"
    :color="color"
    :dark="dark"
    :depressed="depressed"
    :disabled="disabled"
    :elevation="elevation"
    :exact="exact"
    :exact-active-class="exactActiveClass"
    :exact-path="exactPath"
    :fab="fab"
    :fixed="fixed"
    :height="height"
    :href="href"
    :icon="icon"
    :input-value="inputValue"
    :large="large"
    :left="left"
    :light="light"
    :link="link"
    :loading="loading"
    :max-height="maxHeigth"
    :max-width="maxWidth"
    :min-height="minHeigth"
    :min-width="minWidth"
    :nuxt="nuxt"
    :outlined="outlined"
    :plain="plain"
    :replace="replace"
    :retain-focus-on-click="retainFocusOnClick"
    :right="right"
    :ripple="ripple"
    :rounded="rounded"
    :shaped="shaped"
    :small="small"
    :tag="tag"
    :target="target"
    :text="text"
    :tile="tile"
    :to="to"
    :top="top"
    :type="type"
    :value="value"
    :width="width"
    :x-large="xLarge"
    :x-small="xSmall"
    @click="onClickButton"
  >
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #loader>
      <slot name="loader"></slot>
    </template>
  </v-btn>
</template>

<script>
const tag = '[Buttons]'

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
    isNotPadding: {
      type: Boolean,
      default: false,
      description: '패딩 0',
    },
    absolute: {
      type: Boolean,
      default: false,
      description: '구성 요소에 위치: absolute 를 적용',
    },
    activeClass: {
      type: String,
      default: undefined,
      description: '링크가 활성화될 때 적용되는 활성 CSS 클래스를 구성',
    },
    append: {
      type: Boolean,
      default: false,
      description: '항상 현재 경로에 상대 경로가 추가',
    },
    block: {
      type: Boolean,
      default: false,
      description: '버튼을 사용 가능한 공간의 100%까지 확장',
    },
    bottom: {
      type: Boolean,
      default: false,
      description: '구성요소를 아래쪽으로 정렬',
    },
    color: {
      type: String,
      default: undefined,
      description:
        '지정된 색상을 컨트롤에 적용합니다. 색상의 이름(예: 자주색) 또는 CSS 색상(#033 또는 rgba(255, 0, 0, 0.5))이 될 수 있습니다.',
    },
    dark: {
      type: Boolean,
      default: false,
      description: '구성 요소에 어두운 테마 변형을 적용',
    },
    depressed: {
      type: Boolean,
      default: false,
      description: '버튼 상자 그림자를 제거',
    },
    disabled: {
      type: Boolean,
      default: false,
      description: '입력 비활성화',
    },
    elevation: {
      type: [String, Number],
      default: undefined,
      description: '구성요소에 적용되는 표고를 0에서 24 사이로 지정',
    },
    exact: {
      type: Boolean,
      default: false,
      description: '링크와 정확히 일치, 이것이 없으면 "/"는 모든 경로와 일치',
    },
    exactActiveClass: {
      type: String,
      default: undefined,
      description:
        '정확히 일치하는 링크가 활성화될 때 적용되는 활성 CSS 클래스를 구성',
    },
    exactPath: {
      type: Boolean,
      default: false,
      description: '쿼리 및 해시 섹션을 무시하고 링크와 정확히 일치',
    },
    fab: {
      type: Boolean,
      default: false,
      description: '버튼을 플로팅 액션 버튼으로 지정. 버튼이 둥글게 됨.',
    },
    fixed: {
      type: Boolean,
      default: false,
      description: 'position: fixed ',
    },
    height: {
      type: [String, Number],
      default: '35px',
      description: '구성요소의 높이를 설정',
    },
    href: {
      type: [Object, String],
      default: undefined,
      description: '컴포넌트를 앵커로 지정하고 href 속성을 적용',
    },
    icon: {
      type: Boolean,
      default: false,
      description: '버튼을 아이콘으로 지정',
    },
    inputValue: {
      default: undefined,
      description: '버튼의 활성 상태를 제어',
    },
    large: {
      type: Boolean,
      default: false,
      description: '구성요소 large 사이즈',
    },
    left: {
      type: Boolean,
      default: false,
      description:
        '구성요소를 왼쪽으로 정렬, This should be used with the absolute or fixed props.',
    },
    light: {
      type: Boolean,
      default: false,
      description: '구성 요소에 밝은 테마 변형을 적용',
    },
    link: {
      type: Boolean,
      default: false,
      description:
        '구성 요소가 링크임을 지정. This is automatic when using the href or to prop.',
    },
    loading: {
      type: Boolean,
      default: false,
      description: '진행률 표시줄 표시',
    },
    maxHeigth: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최대 높이를 설정',
    },
    maxWidth: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최대 가로를 설정',
    },
    minHeigth: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최소 높이를 설정',
    },
    minWidth: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최소 가로를 설정',
    },
    nuxt: {
      type: Boolean,
      default: false,
      description: '링크가 nuxt 링크임을 지정',
    },
    outlined: {
      type: Boolean,
      default: false,
      description: '개요 스타일을 입력에 적용',
    },
    plain: {
      type: Boolean,
      default: false,
      description: '버튼 위로 마우스를 가져갈 때 적용된 기본 배경 변경을 제거',
    },
    replace: {
      type: Boolean,
      default: false,
      description:
        'replace prop을 설정하면 클릭 시 router.push() 대신 router.replace()를 호출하므로 탐색은 기록 레코드를 남기지 않습니다.',
    },
    retainFocusOnClick: {
      type: Boolean,
      default: false,
      description: '클릭 시 흐리게 처리하지 않음',
    },
    right: {
      type: Boolean,
      default: false,
      description:
        '구성요소를 오른쪽으로 정렬. This should be used with the absolute or fixed props.',
    },
    ripple: {
      type: [Boolean, Object],
      default: undefined,
      description: 'v-ripple 지시문을 적용.',
    },
    rounded: {
      type: Boolean,
      default: false,
      description: '입력에 테두리 반경을 추가',
    },
    shaped: {
      type: Boolean,
      default: false,
      description: '카드의 왼쪽 상단과 오른쪽 하단에 큰 테두리 반경을 적용',
    },
    small: {
      type: Boolean,
      default: false,
      description: '구성 요소를 작게 만듬.',
    },
    tag: {
      type: String,
      default: 'button',
      description: '루트 요소에 사용되는 사용자 정의 태그를 지정',
    },
    target: {
      type: String,
      default: undefined,
      description:
        '대상 속성을 지정. This should only be applied when using the href prop',
    },
    text: {
      type: Boolean,
      default: false,
      description:
        '배경을 투명하게 만듭니다. color prop 사용 시 배경 대신 버튼 텍스트에 색상이 적용',
    },
    tile: {
      type: Boolean,
      default: false,
      description: 'border-radius 속성 제거',
    },
    to: {
      type: [String, Object],
      default: undefined,
      description: '링크의 대상 경로를 나타냄',
    },
    top: {
      type: Boolean,
      default: false,
      description: '콘텐츠를 위쪽으로 정렬',
    },
    type: {
      type: String,
      default: 'button',
      description: '버튼의 유형 속성을 설정',
    },
    value: {
      default: undefined,
      description: '입력 값',
    },
    width: {
      type: [String, Number],
      default: undefined,
      description: '구성 요소의 너비를 설정',
    },
    xLarge: {
      type: Boolean,
      default: false,
      description: '구성 요소를 매우 크게 만듬.',
    },
    xSmall: {
      type: Boolean,
      default: false,
      description: '구성 요소를 매우 작게 만듬',
    },
  },
  data() {
    return {
      titleStyle: this.className?.titleStyle || null,
    }
  },
  methods: {
    /*
        @brief 클릭 이벤트 함수
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onClickButton(event) {
      console.log(tag, 'onClickButton')
      this.$emit('click', event)
    },
  },
}
</script>

<style lang="scss">
.sp-button.v-btn {
  text-transform: none;
  font-weight: 500;
  font-size: 0.8rem !important;
  border-radius: 5px;

  &.border {
    &.dark-gray-border {
      background-color: #fff !important;
      color: $basic-dark-button !important;
      border: thin solid $basic-dark-button !important;
    }
    &.gray-border {
      background-color: #fff !important;
      color: $basic-button !important;
      border: thin solid $basic-button !important;
    }
    &.blue-border {
      background-color: #fff !important;
      color: $nav-primary !important;
      border: thin solid $nav-primary;
    }
    &.primary-border {
      background-color: #fff !important;
      color: $sp-teriary !important;
      border: thin solid $sp-teriary;
    }
    &.light-gray-border {
      background-color: #fff !important;
      border: 1px solid $input-border;
    }
    &.green {
      background-color: #fff !important;
      color: $basic-green !important;
      border: 1px solid $basic-green;
    }
    &.red {
      background-color: #fff !important;
      color: $sp-red !important;
      border: 1px solid $sp-red;
    }
    &.dark-blue-border {
      background-color: #fff !important;
      color: $basic-button !important;
      border: 1px solid $basic-button;
      &:hover {
        background-color: $sp-teriary !important;
        color: #fff !important;
      }
    }

    &.bw-2 {
      border-width: thin !important;
    }
    &.bw-1 {
      border-width: 1px !important;
    }
  }

  &.backgroundColor {
    &.transparent {
      background-color: transparent !important;
    }
    &.gray-background {
      background-color: $sub-title !important;
    }
    &.light-gray-background {
      background-color: #f1f4f6 !important;
    }
    &.primary-background {
      background-color: $sp-teriary !important;
    }
  }

  &.modal {
    width: 150px;
    background-color: #fff !important;
    &.close {
      color: $sub-title !important;
      border: 1px solid $sub-title;
    }
    &.apply {
      color: $nav-primary !important;
      border: 1px solid $nav-primary;
    }
  }
}
</style>
