<template>
  <sp-card class="sp-overview" :class="{ isMini }" elevation="0">
    <div class="overview__title-wrapper">
      <div class="overview__title">
        <span class="overview__title">Cluster 요약</span>
      </div>
    </div>
    <div class="overview__contents-box" style="margin-top: 8px">
      <div class="overview-wrapper">
        <div class="overview__long-box overview-box">
          <div class="overview-row-box">
            <div class="overview-title">Provider</div>
            <div class="overview-num">Azure</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">Region</div>
            <div class="overview-num">South Korea</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">Version</div>
            <div class="overview-num">1.21.84</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">Status</div>
            <div class="overview-num">Provisioned</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">Created</div>
            <div class="overview-num">2021.12.23 11:30</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">Provisioner</div>
            <div class="overview-num">홍길동</div>
          </div>
        </div>
      </div>
      <div class="overview-wrapper">
        <div class="overview__long-box overview-box">
          <div class="overview-row-box">
            <div class="overview-title">VPC CIDR</div>
            <div class="overview-num">Azure</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">Region</div>
            <div class="overview-num">South Korea</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">Version</div>
            <div class="overview-num">1.21.84</div>
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
            <div class="overview-title">5</div>
            <div class="overview-num">Node</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">6</div>
            <div class="overview-num">Namespace</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">10</div>
            <div class="overview-num">Persisten Volume</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">29</div>
            <div class="overview-num">Workload</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">103</div>
            <div class="overview-num">Pod</div>
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
