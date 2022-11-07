<!-- SP-Card 컴포넌트 -->
<template>
  <v-card
    :color="color"
    :active-class="activeClass"
    :disabled="disabled"
    :elevation="elevation"
    :flat="flat"
    :max-height="maxHeight"
    :max-width="maxWidth"
    :min-height="minHeight"
    :min-width="minWidth"
    :width="width"
    :height="height"
    @click.native="$emit('click')"
    class="sp-card"
    :style="{ fontWeight: isBold ? 'bold' : '400' }"
    :class="{
      'shadow-card': shadowed,
      outlined: outlined,
      ...className,
    }"
  >
    <div
      class="card-header"
      :class="{ 'dark-header': dark, headerBottomLine }"
      :style="{ ...headerStyle }"
      v-if="headered"
    >
      <slot name="prepend-label"></slot>
      <span v-if="label" class="card-title" :style="{ ...titleStyle }"
        >{{ label }}
      </span>
      <slot name="append-label"></slot>
      <slot name="header"></slot>
    </div>
    <v-divider v-if="headered && !noLine" />
    <div class="card-body" :style="{ ...bodyStyle }">
      <slot> </slot>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'sp-card',
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
    isBold: {
      type: Boolean,
      default: false,
      description: 'font-weight bold 유무.',
    },
    color: {
      type: String,
      default: undefined,
      description:
        '지정된 색상을 컨트롤에 적용합니다. 색상의 이름(예: 자주색) 또는 CSS 색상(#033 또는 rgba(255, 0, 0, 0.5))이 될 수 있습니다.',
    },
    activeClass: {
      type: String,
      default: undefined,
      description: '링크가 활성화될 때 적용되는 활성 CSS 클래스를 구성',
    },
    disabled: {
      type: Boolean,
      description: '카드의 활성/비활성 여부 결정',
      default: false,
    },
    elevation: {
      type: [Number, String],
      description: '카드의 입체감 조절 0~24까지 가능',
      default: undefined,
    },
    flat: {
      type: Boolean,
      description: '카드의 입체감 삭제',
      default: false,
    },
    maxHeight: {
      type: [Number, String],
      description: '카드의 최대 높이 설정',
      default: undefined,
    },
    maxWidth: {
      type: [Number, String],
      description: '카드의 최대 너비 설정',
      default: undefined,
    },
    minHeight: {
      type: [Number, String],
      description: '카드의 최소 높이 설정',
      default: undefined,
    },
    minWidth: {
      type: [Number, String],
      description: '카드의 최소 너비 설정',
      default: undefined,
    },
    rounded: {
      type: [Boolean, String],
      default: '10px',
      description: '입력에 테두리 반경을 추가',
    },
    outlined: {
      type: Boolean,
      description: '카드의 외곽선 설정',
      default: false,
    },
    headerBottomLine: {
      type: Boolean,
      description: '카드 머리말의의 라인 설정',
      default: false,
    },
    width: {
      type: [Number, String],
      description: '카드의 너비 설정',
      default: undefined,
    },
    height: {
      type: [Number, String],
      description: '카드의 높이 설정',
      default: undefined,
    },
    headered: {
      type: Boolean,
      description: '카드의 헤더 유/무 설정',
      default: false,
    },
    noLine: {
      type: Boolean,
      description: '카드 헤더 아래 구분선 유무',
      default: false,
    },
    label: {
      type: String,
      description: '카드 헤더부분 타이틀 라벨 문구',
      default: undefined,
    },
    dark: {
      type: Boolean,
      description: '헤더부분의 배경색 다크하게 변경',
      default: false,
    },
    shadowed: {
      type: Boolean,
      description: '카드에 그림자 효과 부여 on/off',
      default: false,
    },
    onClickCard: {
      type: Function,
      description: '카드 클릭 시 호출 이벤트',
    },
  },
  data() {
    return {
      titleStyle: this.className?.titleStyle || null,
      headerStyle: this.className?.headerStyle || null,
      bodyStyle: this.className?.bodyStyle || null,
    }
  },
}
</script>

<style lang="scss" scoped>
.sp-card {
  overflow: hidden;
  border-radius: 5px;

  &.not-border-radius {
    border-radius: 0;
  }

  &.shadow-card {
    box-shadow: 0px 4px 16px #8a8a8a1a;
  }
  &.outlined {
    border: 0.5px solid $sp-box-border !important;
  }

  .card-header {
    background-color: $sp-grey-200;
    display: flex;
    align-items: center;
    min-width: 100%;
    padding: 10px;
    &.headerBottomLine {
      border-bottom: 1px solid $sp-box-border;
    }

    .label-wrapper {
      display: flex;
      align-items: center;
    }

    .card-title {
      color: $sub-title;
      font-weight: inherit;
      font-size: 1rem;
    }
  }
  .card-header.dark-header {
    background-color: $title-color;
    color: white;

    .card-title {
      color: white;
      font-weight: inherit;
      font-size: 1rem;
    }
  }
  .card-body {
    padding: 10px;
  }
}
</style>
