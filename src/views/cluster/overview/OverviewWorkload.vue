<template>
  <sp-card class="sp-overview" :class="{ isMini }" elevation="0">
    <div class="overview__title-wrapper">
      <div class="overview__title">
        <span class="overview__title">Workload</span>
      </div>
    </div>
    <div class="overview__contents-box" style="margin-top: 8px">
      <div class="overview-wrapper">
        <div class="overview__long-box overview-box">
          <div class="overview-row-box">
            <div class="overview-title">Deployment</div>
            <div class="overview-num">19</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">Stateful Set</div>
            <div class="overview-num">2</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">Cron Job</div>
            <div class="overview-num">0</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">Job</div>
            <div class="overview-num">1</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">Replica Set</div>
            <div class="overview-num">5</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">Daemon</div>
            <div class="overview-num">11</div>
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
        <div class="overview__long-box overview-box">
          <div class="overview-row-box">
            <div class="overview-title">2023-07-27 배포 내역 (5)</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">(Deployment) new-deployment</div>
            <div class="overview-num">09:10:23</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">(Job) new-Job</div>
            <div class="overview-num">11:13:30</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">(DaemonSet) new-daemonset</div>
            <div class="overview-num">14:16:43</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">(StatefulSet) new-statefulset</div>
            <div class="overview-num">14:27:16</div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">(Deployment) new-deployment-02</div>
            <div class="overview-num">14:33:47</div>
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
