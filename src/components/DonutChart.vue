<template>
  <div class="sp-donut-chart">
    <apexchart
      :width="width"
      :height="height"
      type="donut"
      :options="chartOptionProps"
      :series="series"
    />
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '300px',
      description: '도넛 차트 폭',
    },
    height: {
      type: String,
      default: '300px',
      description: '도넛차트 높이',
    },
    chartData: {
      type: Array,
      default: () => {
        return []
      },
      description: '도넛 차트를 그리는데 필요한 데이터 값',
    },
    donutColor: {
      type: Array,
      default: () => {
        return []
      },
      description: '도넛 차트 컬러 값',
    },
    chartOptionProps: {
      type: Object,
      default: {},
      description: '도넛 차트 옵션',
    },
    donutLabel: {
      type: String,
      default: '',
      description: '도넛 차트 중앙 레이블 텍스트',
    },
  },
  data: () => ({
    series: [],
  }),
  methods: {
    getSeriesData(data) {
      return data.map(group => {
        return group.value
      })
    },
    getSeriesName(data) {
      return data.map(group => {
        return group.name
      })
    },
    updateChart() {
      // console.log('차트 업데이트', this.chartOptionProps.plotOptions)
      const seriesData = this.getSeriesData(this.chartData)
      const seriesName = this.getSeriesName(this.chartData)

      this.series = seriesData
      this.chartOptionProps.fill.colors = this.donutColor
      this.chartOptionProps.labels = seriesName
      this.chartOptionProps.plotOptions.pie.donut.labels.total.label =
        this.donutLabel
    },
  },
  created() {
    this.updateChart()
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.updateChart()
      },
    },
  },
}
</script>

<style lang="scss"></style>
