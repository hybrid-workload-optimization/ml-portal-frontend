<template>
  <div class="sp-round-box-with-chip" :class="{ ...className }">
    <div class="title-wrapper ml-2">
      <span class="main-title mr-3" :style="{ ...cssProps['mainTitleStyle'] }"
        >{{ mainTitle }}
      </span>
      <span class="sub-title" :style="{ ...cssProps['subTitleStyle'] }"
        >{{ subTitle }}
      </span>
    </div>
    <slot name="chip">
      <div class="chip-wrapper mr-1">
        <sp-chip
          class="top-chips"
          :style="{ ...cssProps['chipStyle'] }"
          :className="{ [color]: true, hasBg: true }"
          :width="width"
          :height="height"
        >
          {{ status }}
        </sp-chip>
      </div>
    </slot>
  </div>
</template>

<script>
// import { vhConvertToPx } from '@/lib/helper.js'

// const tags = ['RoundBoxWithChip']

export default {
  props: {
    className: {
      type: Object,
      description: '클래스 이름 값 할당',
      isActive: {
        type: Boolean,
        description: '액티브 유무',
      },
    },
    mainTitle: {
      type: String,
      default: undefined,
      description: '메인 타이틀 값',
    },
    subTitle: {
      type: String,
      default: undefined,
      description: '서브 타이틀 값',
    },
    status: {
      type: String,
      default: undefined,
      description: '상태 값',
    },
    color: {
      type: String,
      default: undefined,
      description: 'gray',
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
  },
  computed: {
    cssProps() {
      return {
        mainTitleStyle: this.className?.mainTitleStyle,
        subTitleStyle: this.className?.subTitleStyle,
        chipStyle: this.className?.chipStyle,
      }
    },
  },
  methods: {
    // getVhConvertToPx(vh) {
    //   return vhConvertToPx(vh)
    // },
  },
}
</script>

<style lang="scss" scoped>
.sp-round-box-with-chip {
  display: flex;
  background-color: $sp-grey-200;
  border-radius: 100px;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  .main-title {
    font-size: 0.9rem;
    font-weight: 500;
    color: $title-color;
  }
  .sub-title {
    font-size: 0.7rem;
    color: $title-color;
  }
  .top-chips {
    font-size: 0.5rem;
  }
}
</style>
