<template>
  <div class="sp-label-with-group" :class="{ horizontal, ...className }">
    <label
      class="sp__label"
      for="state-title"
      :style="{ ...cssProps['titleStyle'] }"
    >
      {{ name }}
    </label>
    <div class="sp__content" :style="{ ...cssProps['contentStyle'] }">
      <slot name="append-content"></slot>
    </div>
  </div>
</template>

<script>
// const tag = '[LabelWith]'

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
    isBlock: {
      type: Boolean,
      default: false,
      description: '블록',
    },
    name: {
      type: String,
      default: undefined,
      description: '해당 이름.',
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
  },
  computed: {
    cssProps() {
      return {
        titleStyle: this.className?.titleStyle,
        contentStyle: this.className?.contentStyle,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';
.sp-label-with-group {
  $this: 'sp';

  &.horizontal {
    display: flex;
    align-items: center;
  }
  .#{$this}__label {
    display: inline-block;
    @include set-text(normal, 14, rgba($color: $sp-title, $alpha: 0.7));

    &.isBlock {
      display: block;
    }
  }
  .#{$this}__content {
    .v-chip {
      margin: 2px 0;
    }
  }

  .authority_template {
    width: 85%;
  }
}
</style>
