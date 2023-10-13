<template>
  <v-chip
    class="chip"
    :class="{ ...className }"
    :style="{
      width: width && width,
      height: height && height,
      ...cssProps['titleStyle'],
    }"
    :active-class="activeClass"
    :append="append"
    :close="close"
    :close-icon="closeIcon"
    :close-label="closeLabel"
    :color="color"
    :dark="dark"
    :disabled="disabled"
    :draggable="draggable"
    :exact="exact"
    :exact-active-class="exactActiveClass"
    :exact-path="exactPath"
    :filter="filter"
    :filter-icon="filterIcon"
    :href="href"
    :input-value="inputValue"
    :label="label"
    :large="large"
    :light="light"
    :link="link"
    :nuxt="nuxt"
    :outlined="outlined"
    :pill="pill"
    :replace="replace"
    :ripple="ripple"
    :small="small"
    :tag="tag"
    :target="target"
    :text-color="textColor"
    :to="to"
    :value="value"
    :x-large="xLarge"
    :x-small="xSmall"
    @click.native="onClickButton"
    @click:close="onClickCloseButton"
    @input="onChangeInput"
    @update:active="onUpdateActive"
  >
    <template #default>
      <slot name="default"></slot>
    </template>
  </v-chip>
</template>

<script>
const tag = '[Chip]'

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
      hasBg: {
        type: Boolean,
        description: '배경색 유무',
      },
      hasBorder: {
        type: Boolean,
        description: '활성화 여부',
      },
    },
    width: {
      type: String,
      default: undefined,
      description: '가로길이',
    },
    height: {
      type: String,
      default: undefined,
      description: '세로길이',
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
    close: {
      type: Boolean,
      default: false,
      description: '제거 버튼 추가.',
    },
    closeIcon: {
      type: String,
      default: '$delete',
      description: '칩 닫기에 사용되는 기본 아이콘 변경.',
    },
    closeLabel: {
      type: String,
      default: '$vuetify.close',
      description:
        '닫기 칩에서 닫기 버튼의 아리아 레이블에 사용되는 텍스트입니다. 국제화에서 전 세계적으로 사용자 정의 가능.',
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
    disabled: {
      type: Boolean,
      default: false,
      description: '입력 비활성화',
    },
    draggable: {
      type: Boolean,
      default: false,
      description: '칩을 드래그 가능 유무',
    },
    exact: {
      type: Boolean,
      default: false,
      description: '링크와 정확히 일치, 이것이 없으면 "/" 는 모든 경로와 일치',
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
    filter: {
      type: Boolean,
      default: false,
      description: '선택 시 선택 아이콘을 표시.',
    },
    filterIcon: {
      type: String,
      default: '$complete',
      description: '필터 칩에 사용되는 기본 아이콘 변경.',
    },
    href: {
      type: [Object, String],
      default: undefined,
      description: '컴포넌트를 앵커로 지정하고 href 속성을 적용',
    },
    inputValue: {
      default: undefined,
      description: '버튼의 활성 상태를 제어',
    },
    label: {
      type: Boolean,
      default: false,
      description: '원 가장자리 제거',
    },
    large: {
      type: Boolean,
      default: false,
      description: '구성요소 large 사이즈',
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
    pill: {
      type: Boolean,
      default: false,
      description: 'v-avatar 패딩 제거',
    },
    replace: {
      type: Boolean,
      default: false,
      description:
        'replace prop을 설정하면 클릭 시 router.push() 대신 router.replace()를 호출하므로 탐색은 기록 레코드를 남기지 않습니다.',
    },
    ripple: {
      type: [Boolean, Object],
      default: undefined,
      description: 'v-ripple 지시문을 적용.',
    },
    small: {
      type: Boolean,
      default: false,
      description: '구성 요소를 작게 만듬.',
    },
    tag: {
      type: String,
      default: 'span',
      description: '루트 요소에 사용되는 사용자 정의 태그를 지정',
    },
    target: {
      type: String,
      default: undefined,
      description:
        '대상 속성을 지정. This should only be applied when using the href prop',
    },
    textColor: {
      type: String,
      default: undefined,
      description: '제어 텍스트에 지정된 색상을 적용',
    },
    to: {
      type: [String, Object],
      default: undefined,
      description: '링크의 대상 경로를 나타냄',
    },
    value: {
      default: undefined,
      description: '입력 값',
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
  computed: {
    cssProps() {
      return {
        titleStyle: this.className?.titleStyle,
      }
    },
  },
  methods: {
    /*
        @brief 클릭 이벤트 함수
        @date 2021/11/09
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onClickButton(event) {
      console.log(tag, 'onClickButton')
      this.$emit('click', event)
    },
    /*
        @brief 클릭 close 아이콘 이벤트 함수
        @date 2021/11/09
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onClickCloseButton(event) {
      console.log(tag, 'onClickCloseButton')
      this.$emit('click-close', event)
    },
    /*
        @brief 업데이트된 바인딩 모델 이벤트 함수
        @date 2021/11/09
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onChangeInput(event) {
      console.log(tag, 'onChangeInput')
      this.$emit('change-input', event)
    },
    /*
        @brief 닫기 아이콘을 클릭하면 발생하고 활성을 false로 설정 함수
        @date 2021/11/09
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onUpdateActive(event) {
      console.log(tag, 'onUpdateActive')
      this.$emit('update-active', event)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.theme--light.v-chip--no-color {
  background: #c2c9d0 !important;
  .v-chip__content {
    margin: 0 auto;
    justify-content: center;
  }
}

.hasBg {
  color: #fff !important;
  min-height: 1px;
  height: auto;
  //padding: 5px 20px;

  &.gray {
    background: #4b5566 !important;
  }

  &.blue {
    background: #06abea !important;
  }

  &.blue-dark {
    background: #036eb8 !important;
  }

  &.blue-light {
    background: #87c3ff !important;
  }

  &.green {
    background: #29aa54 !important;
  }

  &.green-light {
    background: #00ba88 !important;
  }

  &.navy {
    background: #1a3350 !important;
  }

  &.red {
    background: #ea1606 !important;
  }

  &.red-light {
    background: #fb5555 !important;
  }

  &.pink {
    background: #ff8787 !important;
  }

  &.pink-light {
    background: #ff8787 !important;
  }

  &.purple {
    background: #ba61cf !important;
  }

  &.yellow {
    background: #ffcd56 !important;
  }
  &.dark-grey {
    background: #4b5566 !important;
  }
  &.dark-blue {
    background: $basic-button !important;
  }
}

.hasBorder {
  border-radius: 20px;

  &.red {
    border: 1px solid #ea1606 !important;
    background: #fff !important;
    color: #ea1606 !important;
  }

  &.green {
    border: 1px solid #00ba88 !important;
    background: #fff !important;
    color: #00ba88 !important;
  }

  &.purple {
    border: 1px solid #ba61cf !important;
    background: #fff !important;
    color: #ba61cf !important;
  }

  &.pink-light {
    border: 1px solid #ff8787 !important;
    background: #fff !important;
    color: #ff8787 !important;
  }

  &.blue-light {
    border: 1px solid #87c3ff !important;
    background: #fff !important;
    color: #87c3ff !important;
  }
  &.gray {
    border: 1px solid #dbdfe1 !important;
    background: #fff !important;
    color: #000 !important;
  }
}
</style>
