<template>
  <div class="sp-dashboard-top-card-wrapper">
    <sp-card outlined class="sp-dashboard-top-card" elevation="0">
      <div class="card-left">
        <resource-box
          class="resource-box"
          title="Cluster"
          :value="dashboardData.clusterCount.toString()"
          outlined
          minHeight="0"
          height="133px"
          elevation="0"
          isBlocked
        ></resource-box>
        <resource-box
          class="resource-box"
          title="Node"
          :value="dashboardData.nodeCount.toString()"
          outlined
          minHeight="0"
          height="133px"
          elevation="0"
          isBlocked
        ></resource-box>
        <resource-box
          class="resource-box"
          title="Workload"
          :value="dashboardData.workloadCount.toString()"
          outlined
          minHeight="0"
          height="133px"
          elevation="0"
          isBlocked
        ></resource-box>

        <resource-box
          class="status-box"
          title="Node Status"
          :value="dashboardData.nodeUtilizationState"
          outlined
          minHeight="0"
          height="133px"
          elevation="0"
          isBlocked
        ></resource-box>
        <resource-box
          class="status-box"
          title="Restart within 10 minutes"
          :value="dashboardData.restartWithinTenMinutes.toString()"
          outlined
          minHeight="0"
          height="133px"
          elevation="0"
          isBlocked
        ></resource-box>
      </div>

      <!-- Node 사용률 차트 -->
      <div class="card-center">
        <div class="title-wrapper">
          <span class="title-text">Node utilization ratio</span>
        </div>
        <div class="chart-wrapper">
          <donut-chart
            :chart-data="nodeData"
            :donut-color="nodeColor"
            :chart-option-props="chartOption"
            width="220px"
            height="220px"
            id="node-chart"
          ></donut-chart>
        </div>
        <div class="status-wrapper">
          <div class="status-display">
            <span class="status-title">Total</span>
            <span class="status-value">{{ dashboardData.nodeCount }}</span>
          </div>
          <div class="status-display">
            <span class="status-title">Power on</span>
            <span class="status-value">{{ this.nodeData[0].value }}</span>
          </div>
          <div class="status-display">
            <span class="status-title">Power Off</span>
            <span class="status-value">{{ this.nodeData[1].value }}</span>
          </div>
        </div>
      </div>

      <!-- Master 가동률 차트 -->
      <div class="card-right">
        <div class="right-left">
          <div class="title-wrapper">
            <div class="title-text">Control Plane utilization rate</div>
          </div>
          <div class="chart-wrapper">
            <donut-chart
              :chart-data="controlPlanData"
              :donut-color="masterColor"
              :chart-option-props="masterChartOption"
              width="125px"
              height="125px"
              id="master-chart"
            ></donut-chart>
          </div>
          <div class="status-wrapper">
            <div class="status-display">
              <span class="status-value">{{
                dashboardData.controlPlaneCount
              }}</span>
              <span class="status-title">Control Plane</span>
            </div>
          </div>
        </div>

        <!-- Worker 가동률 차트 -->
        <div class="right-right">
          <div class="title-wrapper">
            <div class="title-text">Worker utilization rate</div>
          </div>
          <div class="chart-wrapper">
            <donut-chart
              :chart-data="workerData"
              :donut-color="workerColor"
              :chart-option-props="workerChartOption"
              width="125px"
              height="125px"
              id="worker-chart"
            ></donut-chart>
          </div>
          <div class="status-wrapper">
            <div class="status-display">
              <span class="status-value">{{ dashboardData.workerCount }}</span>
              <span class="status-title">Worker</span>
            </div>
          </div>
        </div>
      </div>
    </sp-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import ResourceBox from '@/components/molcule/ResourceBox.vue'
import DonutChart from '@/components/DonutChart.vue'
import { dashboardDonutChartOptions } from '@/assets/data/dashboardDonutChartOptions'
import { dashboardMasterDonutOption } from '@/assets/data/dashboardMasterDonutOption'
import { dashboardWorkerDonutOption } from '@/assets/data/dashboardWorkerChartOption'
import { dashboardTopData } from '@/assets/data/dashboardData'

const dashboardMapUtils = createNamespacedHelpers('dashboard')

export default {
  components: {
    ResourceBox,
    DonutChart,
  },
  data: () => ({
    // 색깔이 하나만 먹히는 문제 해결 위해 각각 옵션파일을 따로 불러오게 함
    chartOption: dashboardDonutChartOptions.options,
    masterChartOption: dashboardMasterDonutOption.options,
    workerChartOption: dashboardWorkerDonutOption.options,

    resourceData: dashboardTopData.resourceData,
    statusData: dashboardTopData.statusData,
    nodeColor: dashboardTopData.nodeColor,
    masterColor: dashboardTopData.masterColor,
    workerColor: dashboardTopData.workerColor,
    controlPlanData: [
      { name: 'Power on', value: 0 },
      { name: 'Power off', value: 0 },
    ],
    workerData: [
      { name: 'Power on', value: 0 },
      { name: 'Power off', value: 0 },
    ],
    nodeData: [
      { name: 'Power on', value: 0 },
      { name: 'Power off', value: 0 },
    ],
  }),

  computed: {
    ...dashboardMapUtils.mapGetters(['dashboardData']),
  },
  watch: {
    // 차트 데이터 업데이트
    dashboardData(newData) {
      this.nodeData[0].value =
        newData.controlPlaneReadyCount + newData.workerReadyCount
      this.nodeData[1].value =
        newData.nodeCount -
        (newData.controlPlaneReadyCount + newData.workerReadyCount)

      this.controlPlanData[0].value = newData.controlPlaneReadyCount
      this.controlPlanData[1].value =
        newData.controlPlaneCount - newData.controlPlaneReadyCount

      this.workerData[0].value = newData.workerReadyCount
      this.workerData[1].value = newData.workerCount - newData.workerReadyCount
    },
  },

  methods: {
    ...dashboardMapUtils.mapActions(['getDashboardData']),
    changeNodeStatusColor() {
      const statusBox = document.querySelector('.status-box')
      const statusValue = statusBox.querySelector('.value-wrapper')

      if (statusValue.innerText.toLowerCase() === 'good') {
        statusValue.style.color = '#06ABEA'
      } else if (statusValue.innerText.toLowerCase() === 'poor') {
        statusValue.style.color = '#DE0655'
      }
    },
  },
  mounted() {
    this.changeNodeStatusColor()
    // console.log(this.dashboardData)
  },
  created() {
    if (window.innerWidth <= '1336') {
      this.chartOption.plotOptions.pie.customScale = 0.85
    }
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-dashboard-top-card-wrapper {
  .top-select-wrapper {
    justify-content: right;
    display: flex;
    margin-bottom: 20px;
    .project-select,
    .cluster-select {
      width: 270px;
      .sp-select {
        border-color: #4b556680 !important;
      }
    }
    .project-select {
      margin-right: 10px;
    }
  }
  .sp-dashboard-top-card {
    background-color: $sp-body-bg-color;
    .status-title {
      display: block;
      font-size: toRem(14);
      font-weight: 600;
      color: $sp-grey-900;
    }
    .status-value {
      font-size: toRem(25);
      font-weight: bold;
      color: $title-color;
    }
    .card-left {
      width: 35%;
      display: inline-flex;
      flex-flow: row wrap;
      .resource-box,
      .status-box {
        flex: auto;
        display: inline-block;
        margin-right: 10px;
        background-color: white;
        .card-body {
          height: 100%;
          padding: 15px;
        }
      }
      .resource-box {
        width: 30%;
        margin-bottom: 10px;
      }
      .status-box {
        width: 45%;
      }
    }
    .card-center {
      width: 30%;
      display: inline-flex;
      flex-flow: row wrap;
      padding-left: 5%;
      .title-wrapper {
        width: 100%;
        display: block;
        margin-bottom: 20px;
        .title-text {
          font-size: toRem(19);
          font-weight: bold;
          font-family: $sub-font;
          color: $sp-title;
          white-space: nowrap;
        }
      }
      .chart-wrapper {
        display: inline-flex;
      }
      .status-wrapper {
        margin-left: 10px;
        .status-display {
          display: block;
          text-align: right;
          margin-bottom: 10px;
        }
      }
    }
    .card-right {
      display: inline-flex;
      text-align: center;
      width: 35%;
      flex-flow: row wrap;
      .right-left {
        width: 50%;
      }
      .right-right {
        width: 50%;
      }
      .title-wrapper {
        display: block;
        width: 100%;
        margin-bottom: 24px;
        .title-text {
          white-space: nowrap;
          font: {
            family: $sub-font;
            size: toRem(16);
            weight: bold;
          }
          color: $sp-sky-blue-500;
        }
      }
      .chart-wrapper {
        text-align: -webkit-center;
        margin-bottom: 20px;
      }
      .status-wrapper {
        text-align: center;
      }
    }
  }
}
@media screen and (max-width: 1366px) {
  .sp-dashboard-top-card-wrapper {
    .sp-dashboard-top-card {
      .status-title {
        font-size: toRem(14);
      }
      .status-value {
        font-size: toRem(20);
      }
      .card-left {
        width: 35%;
        .resource-box,
        .status-box {
          min-width: 0px;
          .card-body {
            .contents-title {
              font-size: toRem(14);
            }
            .value-wrapper {
              font-size: toRem(25);
            }
          }
        }
        .resource-box {
          max-width: 30%;
          width: 30%;
          margin-bottom: 10px;
        }
        .status-box {
          width: 45%;
        }
      }
      .card-center {
        width: 30%;
        padding-left: 20px;
        .title-wrapper {
          .title-text {
            white-space: nowrap;
            font-size: toRem(19);
          }
        }
      }
    }
  }
}
</style>
