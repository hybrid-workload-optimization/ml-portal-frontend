<template>
  <div class="sp-linear-chart">
    <div class="linear-chart__title" v-if="title.length > 0">{{ title }}</div>
    <div class="linear-chart__wrapper">
      <v-progress-linear
        class="linear-chart__bar"
        :value="usagePercentage"
        height="32"
        rounded
        :color="color"
      >
        <span :style="setStylePercentage(usagePercentage)">
          {{ usagePercentage }}%
        </span>
      </v-progress-linear>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      description: '이름',
      default: '',
    },
    usageStorage: {
      type: Number,
      description: '할당 사용량',
      default: 0,
    },
    color: {
      type: String,
      description: 'progress-bar 색상',
      default: 'primary',
    },
    usagePercentage: {
      type: Number,
      description: '사용량(%)',
      default: 0,
    },
  },
  computed: {
    setStylePercentage() {
      return percent => {
        // persent가 10보다 작으면 틀어짐
        const result = 100 - percent < 10 ? 11 : 100 - percent
        return {
          width: `${result}%`,
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';

.sp-linear-chart {
  $this: 'linear-chart';
  .linear-chart__wrapper {
    .linear-chart__bar {
      padding: 0;
      // background: linear-gradient(270deg, #ff472a33, #00b8d533);
      // background: #2a5cff15;
    }
  }
  .v-progress-linear__determinate {
    box-shadow: 0px 2px 8px #00000026;
  }

  .#{$this}__title {
    @include set-text(bold, 15, $sp-sky-blue-500, false, true);
  }
  .#{$this}__wrapper {
    margin: 5px 0;

    .#{$this}__bar {
      border-radius: 8px;
    }
    span {
      @include set-text(bold, 12, rgba(16, 10, 73, 0.76));
    }
  }
}
.v-progress-linear__background {
  border: 1px solid $sp-title;
  border-left: none;
}
</style>
