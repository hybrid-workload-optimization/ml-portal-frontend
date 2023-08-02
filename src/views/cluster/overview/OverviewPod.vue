<template>
  <sp-card class="sp-overview" :class="{ isMini }" elevation="0">
    <div class="overview__title-wrapper">
      <div class="overview__title">
        <span class="overview__title">Pod</span>
      </div>
    </div>
    <div class="overview__contents-box" style="margin-top: 8px">
      <div class="overview-wrapper">
        <div class="overview__long-box overview-box">
          <div class="overview-row-box">
            <div class="overview-title">Total</div>
            <div class="overview-num">103</div>
          </div>
        </div>
      </div>
      <div class="overview-wrapper">
        <donut-chart
          :chart-data="chartData"
          :donut-color="donutColor"
          :donut-label="donutLabel"
          :chartOptionProps="chartOptions"
          :width="'170px'"
          :height="'170px'"
        />
      </div>
      <div class="overview-wrapper">
        <donut-chart
          :chart-data="chartData"
          :donut-color="donutColor"
          :donut-label="donutLabel"
          :chartOptionProps="chartOptions"
          :width="'170px'"
          :height="'170px'"
        />
      </div>
      <div class="overview-wrapper">
        <div class="overview__long-box overview-box">
          <div class="overview-row-box">
            <div class="overview-title">30분 이내 재시작 (5)</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">new-pod-01-efefcc</div>
            <div class="overview-num">11:21:15</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">new-pod-01-veefs</div>
            <div class="overview-num">11:20:24</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">new-pod-01-eftyh</div>
            <div class="overview-num">11:19:33</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">new-pod-01-bttg</div>
            <div class="overview-num">11:18:42</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">new-pod-01-stekf</div>
            <div class="overview-num">11:17:51</div>
          </div>
        </div>
      </div>
    </div>
  </sp-card>
</template>

<script>
import DonutChart from '@/components/DonutChart.vue'

export default {
  components: {
    DonutChart,
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
      chartOptionProps: {
        responsive: true,
        maintainAspectRatio: false,
        // 다른 도넛 차트 옵션 설정
      },
    }
  },
  computed: {
    isMini() {
      return this.$store.state.sideNav.isMini
    },
  },
  created() {},
}
</script>
