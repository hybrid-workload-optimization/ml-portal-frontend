<template>
  <div class="sp-chart-layout">
    <h1>도넛 차트 컴포넌트 #20</h1>
    <div class="project-wrapper">
      <donut-chart
        :chart-data="groupCost"
        :chart-option-props="chartOptions"
        :donut-color="colors"
      ></donut-chart>
    </div>
    <div class="form-layout__description">
      <div>이벤트</div>

      <br />
      <br />
      <div>값</div>

      <br />
      <br />
    </div>
    <h1>가로형 차트 컴포넌트 #20 (완료)</h1>
    <linear-chart
      v-for="(
        { title, usageStorage, unit, totalStorage, color, usagePercentage },
        index
      ) in systemItems"
      :key="index"
      :title="title"
      :usageStorage="usageStorage"
      :unit="unit"
      :totalStorage="totalStorage"
      :color="color"
      :usage-percentage="usagePercentage"
    />
    <div class="form-layout__description">
      <div>이벤트</div>

      <br />
      <br />
      <div>값</div>

      <br />
      <br />
    </div>
  </div>
</template>

<script>
import donutChart from '@/components/DonutChart.vue'
import LinearChart from '@/components/LinearChart.vue'
import { donutChartOptions } from '@/assets/data/donutChartOptions'

export default {
  components: {
    donutChart,
    LinearChart,
  },
  data: () => ({
    chartOptions: donutChartOptions.options,
    groupCost: [
      { name: '행정정보열람', value: 373849, ratio: 0 },
      { name: '재난지원금 조회', value: 172704, ratio: 0 },
      { name: '부가서비스', value: 255411, ratio: 0 },
      { name: '스토리지', value: 403190, ratio: 0 },
      { name: '서버', value: 65000, ratio: 0 },
    ],
    colors: ['#36A2EB', '#FFCD56', '#FF6384', '#4BC0C0', '#FF8000', '#0078FF'],
    systemItems: [
      {
        title: 'Mater 가동률',
        usageStorage: '16',
        color: '#29AA54',
        usagePercentage: 30,
      },
      {
        title: 'Worker 가동률',
        usageStorage: '16',
        color: '#0078FF',
        usagePercentage: 70,
      },
      {
        title: '블록 스토리지',
        usageStorage: '16',
        color: '#F49440',
        usagePercentage: 60,
      },
      {
        title: 'NAS 스토리지',
        usageStorage: '16',
        color: '#F4B740',
        usagePercentage: 80,
      },
    ],
  }),
}
</script>

<style lang="scss">
.sp-chart-layout {
  width: 100%;
  .project-wrapper {
    border: 1px solid blue;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
