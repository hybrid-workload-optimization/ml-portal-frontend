<template>
  <sp-card
    class="sp-resource-box"
    :class="{ basicFont }"
    :style="{ fontSize }"
    :className="{ ...className }"
    :outlined="outlined"
    :width="width"
    :height="height"
    :max-height="maxHeight"
    :max-width="maxWidth"
    :min-height="minHeight"
    :min-width="minWidth"
    :shadowed="shadowed"
    :elevation="elevation"
  >
    <div
      class="contents-wrapper"
      :style="{
        minHeight,
        maxHeight,
        flexDirection: isBlocked ? 'column' : 'row',
        justifyContent: isBlocked && 'space-between',
      }"
    >
      <v-card-text v-if="!leftBottom" class="pa-0 left-top-wrapper">
        <span
          v-if="entered"
          class="contents-title"
          :style="{ ...cssProps['titleStyle'] }"
        >
          <template v-for="(v, index) in content">
            {{ v }}
            <br :key="index" />
          </template>
        </span>
        <span
          v-else
          class="contents-title"
          :style="{ ...cssProps['titleStyle'] }"
        >
          {{ title }}
        </span>
        <slot name="sub-title"></slot>
      </v-card-text>
      <div
        v-if="leftBottom"
        class="left-bottom-wrapper"
        :class="{ leftDivided, leftFlexRow }"
      >
        <v-card-text
          class="contents-title my-0 pa-0"
          :style="{ ...cssProps['titleStyle'] }"
        >
          {{ title }}
        </v-card-text>
        <v-card-text class="pa-0">
          <slot name="left-bottom"></slot>
        </v-card-text>
      </div>
      <div v-if="rightTop" class="right-top-wrapper">
        <v-card-text class="pa-0">
          <slot name="right-top"></slot>
        </v-card-text>
        <v-card-text
          class="value-wrapper pa-0"
          :style="{ ...cssProps['valueStyle'] }"
        >
          {{ value }}
          <span
            v-if="unit"
            class="unit"
            :style="{ ...cssProps['unitStyle'] }"
            >{{ unit }}</span
          >
        </v-card-text>
      </div>
      <v-card-text
        v-if="!rightTop"
        :class="{ rightDivided }"
        class="value-wrapper pa-0"
        :style="{ ...cssProps['valueStyle'] }"
      >
        {{ value }}
        <span v-if="unit" class="unit" :style="{ ...cssProps['unitStyle'] }">
          {{ unit }}
        </span>
      </v-card-text>
    </div>
  </sp-card>
</template>

<script>
// const tag = '[ResourceBox]'

export default {
  props: {
    className: {
      type: Object,
      description: '클래스 이름 값 할당',
    },
    fontSize: {
      type: String,
      default: '1rem',
      description: 'Font-size 여부',
    },
    basicFont: {
      type: Boolean,
      default: false,
      description: 'Font-family 기본 여부',
    },
    isBlocked: {
      type: Boolean,
      default: false,
      description: 'Flex 여부',
    },
    width: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 넓이를 설정',
    },
    height: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 높이를 설정',
    },
    maxHeight: {
      type: [String, Number],
      default: '150px',
      description: '구성요소의 최대 높이를 설정',
    },
    maxWidth: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최대 가로를 설정',
    },
    minHeight: {
      type: [String, Number],
      default: '140px',
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
      description: '개요 스타일을 입력에 적용',
    },
    entered: {
      type: Boolean,
      default: false,
      description: '텍스트 줄바꿈 (n) 기준으로 스플리트',
    },
    elevation: {
      type: [Number, String],
      description: '카드의 입체감 조절 0~24까지 가능',
      default: undefined,
    },
    shadowed: {
      type: Boolean,
      description: '카드에 그림자 효과 부여 on/off',
      default: false,
    },
    title: {
      type: String,
      description: '이름',
      default: '',
    },
    value: {
      type: String,
      description: '값',
      default: '',
    },
    unit: {
      type: String,
      description: '단위',
      default: '',
    },
    leftBottom: {
      type: Boolean,
      description: '왼쪽 콘텐츠 생성 유무',
      default: false,
    },
    rightTop: {
      type: Boolean,
      description: '오른쪽 위 콘텐츠 생성 유무',
      default: false,
    },
    leftDivided: {
      type: Boolean,
      description: '왼쪽 컨텐츠 나누기 (50%,50%)',
      default: false,
    },
    leftFlexRow: {
      type: Boolean,
      description: '왼쪽 컨텐츠 flex-row',
      default: false,
    },
    rightDivided: {
      type: Boolean,
      description: '오른쪽 컨텐츠 나누기 (50%,50%)',
      default: false,
    },
  },

  computed: {
    content() {
      return this.title.split('\n')
    },
    cssProps() {
      return {
        titleStyle: this.className?.titleStyle,
        valueStyle: this.className?.valueStyle,
        unitStyle: this.className?.unitStyle,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';
.sp-resource-box {
  color: $sp-title;
  font-size: inherit;
  background-color: inherit;
  font-weight: initial;
  font-family: $basic-font;
  @include desktop-small(540px, 1366px) {
    width: 18% !important;
    height: 100px !important;
  }
  &.basicFont {
    font-family: $basic-font;
  }
  &.font-weight {
    &.bold {
      font-weight: bold;
    }
  }
  &.color {
    &.dark {
      color: $title-color;
    }
  }
  .contents-wrapper {
    display: flex;
    height: 100%;
    width: 100%;
    .contents-title {
      font-size: 1rem;
      font-weight: bold;
    }
  }
  .left-bottom-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &.leftDivided {
      width: 50%;
    }
    &.leftFlexRow {
      flex-direction: row;
    }

    .contents-title {
      font-size: 1rem;
      font-weight: inherit;
    }
  }
  .right-top-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }
  .value-wrapper {
    font-size: 2rem;
    font-weight: bold;
    text-align: right;
    align-self: flex-end;
    &.rightDivided {
      line-height: 1 !important;
      font-family: $sub-font;
    }
    &.divided {
      width: 50%;
    }
    .unit {
      font-size: 0.8rem;
      color: $title-color;
      font-weight: medium;
      opacity: 0.6;
    }
  }
}
</style>
