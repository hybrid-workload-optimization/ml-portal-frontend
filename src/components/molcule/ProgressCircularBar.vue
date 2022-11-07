<template>
  <div class="sp-progress-circular-bar">
    <slot name="total">
      <div class="total-capacity" :style="{ ...cssProps['totalStyle'] }">
        {{ total }}{{ unit }}
      </div>
    </slot>
    <v-progress-circular
      class="progress-bar"
      :rotate="-90"
      :size="progressSize"
      :width="progressWidth"
      :value="usage"
      :color="color"
    >
      <div class="usage-num-wrapper" :style="{ ...cssProps['valueStyle'] }">
        {{ String(usage) }}
        <span class="usage-unit" :style="{ ...cssProps['unitStyle'] }">
          {{ unit }}
        </span>
      </div>
    </v-progress-circular>
    <slot name="name">
      <div class="storage-name" :style="{ ...cssProps['titleStyle'] }">
        {{ name }}
      </div>
    </slot>
  </div>
</template>

<script>
// const tag = '[ProgressCircularbar]'

export default {
  props: {
    className: {
      type: Object,
      description: '클래스 이름 값 할당',
    },
    unit: {
      type: String,
      default: 'GB',
      description: '단위',
    },
    total: {
      type: Number,
      default: undefined,
      description: '전체 용량',
    },
    progressSize: {
      type: Number,
      default: 130,
      description: 'progress-circular 사이즈',
    },
    progressWidth: {
      type: Number,
      default: 10,
      description: 'progress-circular 크기 (px)',
    },
    usage: {
      type: Number,
      default: undefined,
      description: '사용 용량',
    },
    color: {
      type: String,
      default: undefined,
      description: 'progress-circular 색상',
    },
    name: {
      type: String,
      default: undefined,
      description: '저장소 이름',
    },
  },
  computed: {
    cssProps() {
      return {
        totalStyle: this.className?.totalStyle,
        titleStyle: this.className?.titleStyle,
        valueStyle: this.className?.valueStyle,
        unitStyle: this.className?.unitStyle,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.sp-progress-circular-bar {
  .total-capacity {
    font: {
      family: $sub-font;
      size: 0.7rem;
      weight: bold;
    }
    text-align: center;
    color: #9399a3;
    //opacity: 0.6;
  }
  .progress-bar {
    margin: 7% 0;
  }
  .usage-num-wrapper {
    display: flex;
    align-items: center;
    font: {
      family: $sub-font;
      size: 30px;
      weight: bold;
    }
    .usage-unit {
      align-self: flex-end;
      line-height: 3;
    }
  }

  .storage-name {
    font-size: 13px;
    font-weight: bold;
    color: $sub-title;
    text-align: center;
  }
}
</style>
<style lang="scss">
.v-progress-circular__overlay {
  stroke-linecap: round;
}
</style>
