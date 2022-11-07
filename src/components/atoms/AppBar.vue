<template>
  <v-app-bar
    class="app-bar"
    :class="{ ...className }"
    :absolute="absolute"
    :app="app"
    :bottom="bottom"
    :clipped-left="clippedLeft"
    :clipped-right="clippedRight"
    :collapse="collapse"
    :collapse-on-scroll="collapseOnScroll"
    :color="color"
    :dark="dark"
    :dense="dense"
    :elevate-on-scroll="elevateOnScroll"
    :elevation="elevation"
    :extended="extended"
    :extension-height="extensionHeight"
    :fade-img-on-scroll="fadeImgOnScroll"
    :fixed="fixed"
    :flat="flat"
    :floating="floating"
    :height="height"
    :hide-on-scroll="hideOnScroll"
    :inverted-scroll="invertedScroll"
    :light="light"
    :max-height="maxHeigth"
    :max-width="maxWidth"
    :min-height="minHeigth"
    :min-width="minWidth"
    :outlined="outlined"
    :prominent="prominent"
    :rounded="rounded"
    :scroll-off-screen="scrollOffScreen"
    :scroll-target="scrollTarget"
    :scroll-threshold="scrollThreshold"
    :shaped="shaped"
    :short="short"
    :shrink-on-scroll="shrinkOnScroll"
    :src="src"
    :tag="tag"
    :tile="tile"
    :value="value"
    :width="width"
    @mouseleave="onMouseLeave"
  >
    <template v-slot:default>
      <slot name="default"></slot>
    </template>
    <template v-slot:extension v-if="extended">
      <slot name="extension"></slot>
    </template>
    <template v-slot:img="{ props }">
      <slot name="img" :items="props"> </slot>
    </template>
  </v-app-bar>
</template>

<script>
const tags = '[AppBar]'

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
    absolute: {
      type: Boolean,
      default: false,
      description: '구성 요소에 위치: absolute 를 적용',
    },
    app: {
      type: Boolean,
      default: false,
      description: '구성 요소를 응용 프로그램 레이아웃의 일부로 지정.',
    },
    bottom: {
      type: Boolean,
      default: false,
      description: '구성요소를 아래쪽으로 정렬',
    },
    clippedLeft: {
      type: Boolean,
      default: false,
      description:
        '왼쪽에 위치한 응용 프로그램의 v-navigation-drawer가 앱 바 아래에 있음을 지정',
    },
    clippedRight: {
      type: Boolean,
      default: false,
      description:
        '오른쪽에 위치한 응용 프로그램의 v-navigation-drawer가 앱 바 아래에 있음을 지정.',
    },
    collapse: {
      type: Boolean,
      default: false,
      description: '도구 모음을 축소 상태로 전환하여 최대 너비를 줄임.',
    },
    collapseOnScroll: {
      type: Boolean,
      default: false,
      description: '스크롤할 때 앱 바를 접힌 상태로 만듬.',
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
    dense: {
      type: Boolean,
      default: false,
      description: '도구 모음 콘텐츠의 높이를 48px로 줄임',
    },
    elevateOnScroll: {
      type: Boolean,
      default: false,
      description: '스크롤할 때 앱 바를 높임',
    },
    elevation: {
      type: [Number, String],
      default: undefined,
      description: '0에서 24 사이의 구성요소에 적용된 표고를 지정',
    },
    extended: {
      type: Boolean,
      default: false,
      description:
        '콘텐츠를 추가하기 위해 확장 슬롯을 사용하지 않고 도구 모음의 높이를 높이려면 이 props을 사용',
    },
    extensionHeight: {
      type: [Number, String],
      default: 48,
      description: '확장 슬롯에 대한 명시적 높이 지정',
    },
    fadeImgOnScroll: {
      type: Boolean,
      default: false,
      description:
        'src prop 또는 img 슬롯을 사용할 때 스크롤할 때 이미지가 흐려짐',
    },
    fixed: {
      type: Boolean,
      default: false,
      description: 'position: fixed',
    },
    flat: {
      type: Boolean,
      default: false,
      description: '도구 모음의 상자 그림자를 제거',
    },
    floating: {
      type: Boolean,
      default: false,
      description: '구성 요소에 display: inline-flex를 적용',
    },
    height: {
      type: [Number, String],
      default: undefined,
      description:
        '도구 모음의 특정 높이를 지정합니다. 다른 props에 의해 부과된 높이를 무시',
    },
    hideOnScroll: {
      type: Boolean,
      default: false,
      description: '스크롤할 때 앱 바를 숨깁니다. 확장 슬롯이 계속 표시',
    },
    invertedScroll: {
      type: Boolean,
      default: false,
      description: '아래로 스크롤할 때 앱 바를 숨기고 위로 스크롤할 때 표시',
    },
    light: {
      type: Boolean,
      default: false,
      description: '구성 요소에 밝은 테마 변형을 적용',
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
    outlined: {
      type: Boolean,
      default: false,
      description: '',
    },
    prominent: {
      type: Boolean,
      default: false,
      description: '도구 모음 콘텐츠의 높이를 128px로 늘림',
    },
    rounded: {
      type: [String, Boolean],
      default: undefined,
      description: '입력에 테두리 반경을 추가',
    },
    scrollOffScreen: {
      type: Boolean,
      default: false,
      description: '스크롤할 때 앱 바를 숨깁니다. 확장 슬롯을 표시하지 않음.',
    },
    scrollTarget: {
      type: String,
      default: undefined,
      description:
        '스크롤 이벤트의 대상이 되는 요소를 지정합니다. 기본적으로 창 사용',
    },
    scrollThreshold: {
      type: [Number, String],
      default: undefined,
      description: 'Hide-on-scroll이 활성화되기 전에 아래로 스크롤 거리의 양',
    },
    shaped: {
      type: Boolean,
      default: false,
      description: '',
    },
    short: {
      type: Boolean,
      default: false,
      description: '툴바 콘텐츠의 높이를 56px로 줄입니다.',
    },
    shrinkOnScroll: {
      type: Boolean,
      default: false,
      description:
        '스크롤할 때 눈에 잘 띄는 도구 모음을 짧은(기본값) 도구 모음으로 축소',
    },
    src: {
      type: [Object, String],
      default: undefined,
      description: '이미지 출처',
    },
    tag: {
      type: String,
      default: 'header',
      description: '루트 요소에 사용되는 사용자 정의 태그를 지정',
    },
    tile: {
      type: Boolean,
      default: false,
      description: 'border-radius 속성 제거',
    },
    value: {
      type: Boolean,
      default: true,
      description: '구성요소의 표시 여부를 제어',
    },
    width: {
      type: [Number, String],
      default: undefined,
      description: '구성요소의 너비를 설정',
    },
  },
  methods: {
    onMouseLeave(event) {
      console.log(tags, 'onMouseLeave')
      this.$emit('mouseleave', event)
    },
  },
}
</script>

<style lang="scss"></style>
