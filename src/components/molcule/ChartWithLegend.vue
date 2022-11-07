<template>
  <div
    class="sp-chart-with-legend"
    :style="{ flexDirection: column ? 'column' : 'row' }"
  >
    <div class="pie-chart-wrapper">
      <!-- <chart-data
        :width="chartWidth"
        :height="chartHeight"
        :type="chartType"
        :options="chartOptions"
        :series="chartSeries"
      /> -->
    </div>
    <div class="pie-chart-wrapper">
      <div
        v-for="(data, idx) in chartSeries"
        :key="idx"
        class="computing-resource"
      >
        <div class="computing-resource-text-box">
          <v-icon
            :color="colors[idx]"
            class="computing-resource-circle mr-1"
            :style="{ ...cssProps['dotStyle'] }"
          >
            circle
          </v-icon>
          <div
            class="computing-resource-text"
            :style="{ ...cssProps['titleStyle'] }"
          >
            {{ chartSeriesName[idx] }}
          </div>
        </div>
        <div class="computing-resource-num-box">
          <v-icon
            :color="colors[idx]"
            class="computing-resource-circle hidden mr-1"
          >
            circle
          </v-icon>
          <div
            class="computing-resource-num"
            :style="{ ...cssProps['valueStyle'] }"
          >
            {{ data }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import chartData from '@/components/charts/Chart.vue'

// const tag = '[ChartWithLegend]'

export default {
  components: {
    // chartData,
  },
  props: {
    className: {
      type: Object,
      description: '클래스 이름 값 할당',
    },
    column: {
      type: Boolean,
      default: false,
      description: '박스 컬럼 유무',
    },
    chartWidth: {
      type: String,
      default: undefined,
      description: '가로 길이',
    },
    chartHeight: {
      type: String,
      default: undefined,
      description: '세로 길이',
    },
    colors: {
      type: Array,
      default: () => {
        return []
      },
      description: '색상들',
    },
    chartSeriesName: {
      type: Array,
      default: () => {
        return []
      },
      description: '이름들',
    },
    chartType: {
      type: String,
      default: 'bar',
      description: '차트 타입',
    },
    chartOptions: {
      type: Object,
      default: () => {
        return {}
      },
      description: '차트 옵션',
    },
    chartSeries: {
      type: Array,
      default: () => {
        return []
      },
      description: '차트 데이터',
    },
  },
  data() {
    return {
      titleStyle: this.className?.titleStyle,
      dotStyle: this.className?.dotStyle,
      valueStyle: this.className?.valueStyle,
    }
  },
  computed: {
    cssProps() {
      return {
        titleStyle: this.className?.titleStyle,
        dotStyle: this.className?.dotStyle,
        valueStyle: this.className?.valueStyle,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.sp-chart-with-legend {
  display: flex;
  align-items: center;
  .pie-chart-wrapper {
    justify-content: center;
  }

  &.column {
    flex-direction: column;
    .pie-chart-wrapper {
    }
  }

  .computing-resource {
    display: flex;
    flex-direction: column;
    margin-bottom: 2px;

    .computing-resource-text-box,
    .computing-resource-num-box {
      display: flex;
      align-items: center;

      .v-icon {
        margin-right: 5px !important;
      }
    }
    .computing-resource-circle {
      font-size: 0.62rem;
      &.hidden {
        visibility: hidden;
      }
    }
    .computing-resource-text {
      font-size: 0.8rem;
      font-weight: 600;
      color: #5d5d5d;
      font-family: $sub-font;
    }
    .computing-resource-num {
      font-size: 1.2rem;
      font-weight: 600;
      color: $title-color;
      font-family: $sub-font;
    }
  }
}
</style>
