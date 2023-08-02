<!-- <template>
  <div>
    <donut-chart
      :chart-data="chartData"
      :donut-color="donutColor"
      :donut-label="donutLabel"
      :chart-options="chartOptions"
    />
  </div>
</template> -->

<template>
  <v-app>
    <v-main>
      <v-container>
        <overview-card></overview-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import OverviewCard from '@/views/cluster/overview/OverviewCard.vue'

export default {
  components: {
    OverviewCard,
  },
  data() {
    return {
      chartData: [
        { name: 'Category 1', value: 30 },
        { name: 'Category 2', value: 40 },
        { name: 'Category 3', value: 20 },
      ],
      donutColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      donutLabel: 'Total',
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        // 다른 도넛 차트 옵션 설정
      },
    }
  },
}
</script>
