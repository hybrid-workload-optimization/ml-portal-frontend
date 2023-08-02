<!-- <template>
  <div>
    <canvas ref="donutChartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.renderDonutChart()
  },
  methods: {
    renderDonutChart() {
      const ctx = this.$refs.donutChartCanvas.getContext('2d')
      this.donutChart = new Chart(ctx, {
        type: 'doughnut',
        data: this.chartData,
        options: this.chartOptions,
      })
    },
  },
  beforeDestroy() {
    // 컴포넌트가 파괴될 때 차트 인스턴스 정리
    if (this.donutChart) {
      this.donutChart.destroy()
    }
  },
}
</script> -->
