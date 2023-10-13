<template>
  <v-img
    class="sp-image"
    :class="{ ...className }"
    :alt="alt"
    :aspect-ratio="aspectRatio"
    :contain="contain"
    :content-class="contentClass"
    :dark="dark"
    :eager="eager"
    :gradient="gradient"
    :height="height"
    :lazy-src="(lazySrc && require(`@/assets/images/` + lazySrc)) || lazySrcUrl"
    :light="light"
    :max-height="maxHeigth"
    :max-width="maxWidth"
    :min-height="minHeigth"
    :min-width="minWidth"
    :options="options"
    :position="position"
    :sizes="sizes"
    :src="(src && require(`@/assets/images/` + src)) || srcUrl"
    :srcset="srcset"
    :transition="transition"
    :width="width"
    v-bind="bind"
    v-on="onProps"
    @error="onError"
    @load="onLoad"
    @loadstart="onLoadStart"
    @click="onClickButton"
  >
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #placeholder>
      <slot name="placeholder"></slot>
    </template>
  </v-img>
</template>

<script>
const tag = '[Image]'

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
    bind: {
      type: Object,
      default: undefined,
      description: 'v-bind 옵션값',
    },
    onProps: {
      type: Object,
      default: undefined,
      description: 'v-on 옵션값',
    },
    className: {
      type: Object,
      description: '클래스 이름 값 할당',
      isActive: {
        type: Boolean,
        description: '액티브 유무',
      },
    },
    alt: {
      type: String,
      default: undefined,
      description: '스크린 리더용 대체 텍스트',
    },
    aspectRatio: {
      type: [String, Number],
      default: undefined,
      description:
        '너비/높이로 계산되므로 1920x1080px 이미지의 경우 1.7778이 됨. 생략하면 자동으로 계산',
    },
    contain: {
      type: Boolean,
      default: false,
      description: '크롭되는 이미지 사이즈를 예방함.',
    },
    contentClass: {
      type: String,
      default: undefined,
      description: '반응형 콘텐츠 div에 사용자 지정 클래스 적용',
    },
    dark: {
      type: Boolean,
      default: false,
      description: '구성 요소에 어두운 테마 변형을 적용',
    },
    eager: {
      type: Boolean,
      default: false,
      description: '마운트 시 구성 요소 콘텐츠를 강제로 렌더링',
    },
    gradient: {
      type: String,
      default: undefined,
      description: '이미지에 그라디언트를 만든다. linear-gradient 만 서포트',
    },
    height: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 높이를 설정',
    },
    lazySrc: {
      type: String,
      default: undefined,
      description:
        '기본 이미지가 로드되기를 기다리는 동안 표시할 항목으로 일반적으로 base64로 인코딩된 작은 축소판',
    },
    lazySrcUrl: {
      type: String,
      default: undefined,
      description: '기본 경로가 아닌 경로에서 가져올 lazyload 이미지 경로',
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
    options: {
      type: Object,
      default: () => {
        return {}
      },
      description: 'Intersection ovserver 생성자에 전달되는 옵션',
    },
    position: {
      type: String,
      default: 'center center',
      description:
        '잘릴 부분을 변경하려면 기본값을 재정의. background-position과 동일한 구문을 사용',
    },
    sizes: {
      type: String,
      default: undefined,
      description: 'srcset과 함께 사용.',
    },
    src: {
      type: [String, Object],
      default: () => {
        return undefined
      },
      description: '이미지 url',
    },
    srcUrl: {
      type: String,
      default: undefined,
      description: '기본 경로가 아닌 경로에서 가져올 이미지 경로',
    },
    srcset: {
      type: String,
      default: undefined,
      description: '장치 크기에 따라 사용할 대체 이미지',
    },
    transition: {
      type: [String, Boolean],
      description: 'lazy-src에서 src로 전환할 때 사용할 전환',
    },
    width: {
      type: [String, Number],
      default: undefined,
      description: '구성 요소의 너비를 설정',
    },
  },
  methods: {
    /*
        @brief 에러 발생 함수
        @date 2021/11/09
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onError(event) {
      console.log(tag, 'onError')
      this.$emit('error', event)
    },
    /*
        @brief 이미지 로드가 완료 되었을 때 호출 되는 함수
        @date 2021/11/09
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onLoad() {
      // console.log(tag, 'onLoad')
    },
    /*
        @brief 이미지 로드가 시작될 떄 호출되는 함수
        @date 2021/11/09
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onLoadStart() {
      // console.log(tag, 'onLoadStart')
    },
    /*
        @brief 클릭 이벤트 함수
        @date 2021/11/08
        @return
        @param
          - event: EventTarget(이벤트 값)
    */
    onClickButton(event) {
      // console.log(tag, 'onClickButton')
      this.$emit('click', event)
    },
  },
}
</script>

<style lang="scss">
.sp-image {
  &.with-btn {
    .v-responsive__content {
      width: 20px !important;
      max-width: 100px;
    }
  }
}
</style>
