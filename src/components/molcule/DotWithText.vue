<template>
  <div class="sp-dot-with-text" :class="{ ...className }">
    <v-badge
      :dot="dot"
      :offset-x="dotOffsetX"
      :offset-y="dotOffsetY"
      :color="color"
      :bordered="bordered"
      :inline="inline"
    ></v-badge>
    <slot name="name">
      <span class="text-wrapper" :style="{ ...cssProps['titleStyle'] }">{{
        name
      }}</span>
    </slot>
    <slot name="date"></slot>
    <slot name="contents"></slot>
  </div>
</template>

<script>
// const tag = '[DotWithText]'

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
    color: {
      type: String,
      default: 'primary',
      description:
        '지정된 색상을 컨트롤에 적용합니다. 색상의 이름(예: 자주색) 또는 CSS 색상(#033 또는 rgba(255, 0, 0, 0.5))이 될 수 있습니다.',
    },
    dot: {
      type: Boolean,
      default: false,
      description: '배지의 크기를 줄이고 내용을 숨깁니다.',
    },
    bordered: {
      type: Boolean,
      default: false,
      description:
        'dot 속성을 사용할 때 기본적으로 배지 주위에 2px 및 1.5px 테두리를 적용.',
    },
    dotOffsetX: {
      type: [Number, String],
      default: undefined,
      description: 'x축에서 배지를 오프셋',
    },
    dotOffsetY: {
      type: [Number, String],
      default: undefined,
      description: 'y축에서 배지를 오프셋',
    },
    inline: {
      type: Boolean,
      default: false,
      description: '인라인으로 변경',
    },
  },
  computed: {
    cssProps() {
      return {
        titleStyle: this.className?.titleStyle,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.sp-dot-with-text {
  margin-right: 5px;

  .text-wrapper {
    font-size: 0.7rem;
    color: $dot-text;
    margin-left: 1px;
  }
}
</style>
<style lang="scss">
.sp-dot-with-text {
  .v-badge--dot {
    .v-badge__badge {
      width: 0.9vh;
      height: 0.9vh;
      border-radius: 0.5vh;
    }
  }
}
</style>
