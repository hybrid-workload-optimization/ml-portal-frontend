<template>
  <div class="sp-cluster-node-detail-chart-card-wrapper">
    <sp-card class="chart-card" outlined elevation="0">
      <div class="charts-wrapper">
        <!-- CPU 차트 -->
        <div class="cpu-chart-wrapper">
          <div class="chart-title-wrapper">
            <span class="chart-title">CPU</span>
          </div>
          <div class="request-chart-wrapper">
            <donut-chart
              :chart-data="cpuData.cpuRequestData"
              :donut-color="cpuColor"
              :chart-option-props="cpuRequestChartOption"
              :width="donutChartWidth"
              :height="donutChartHeight"
              donut-label="Request"
            ></donut-chart>
            <span class="chart-text">Cores: {{ cpuData.cpuRequestCores }}</span>
          </div>
          <div class="limit-chart-wrapper">
            <donut-chart
              :chart-data="cpuData.cpuLimitData"
              :donut-color="cpuColor"
              :chart-option-props="cpuLimitsChartOption"
              :width="donutChartWidth"
              :height="donutChartHeight"
              donut-label="Limits"
            ></donut-chart>
            <span class="chart-text">Cores: {{ cpuData.cpuLimitsCores }}</span>
          </div>
        </div>

        <!-- Memory 차트 -->
        <div class="memory-chart-wrapper">
          <div class="chart-title-wrapper">
            <span class="chart-title">Memory</span>
          </div>
          <div class="request-chart-wrapper">
            <donut-chart
              :chart-data="memoryData.memoryRequestData"
              :donut-color="memoryColor"
              :chart-option-props="memoryRequestChartOption"
              :width="donutChartWidth"
              :height="donutChartHeight"
              donut-label="Request"
            ></donut-chart>
            <span class="chart-text"
              >MiB: {{ memoryData.memoryRequestMib }}</span
            >
          </div>
          <div class="limit-chart-wrapper">
            <donut-chart
              :chart-data="memoryData.memoryLimitData"
              :donut-color="memoryColor"
              :chart-option-props="memoryLimitsChartOption"
              :width="donutChartWidth"
              :height="donutChartHeight"
              donut-label="Limits"
            ></donut-chart>
            <span class="chart-text"
              >MiB: {{ memoryData.memoryLimitsMib }}</span
            >
          </div>
        </div>

        <!-- Pod 차트 -->
        <div class="pod-chart-wrapper">
          <div class="chart-title-wrapper">
            <span class="chart-title">Pod</span>
          </div>
          <div class="request-chart-wrapper">
            <donut-chart
              :chart-data="podsData.podAllocationData"
              :donut-color="podColor"
              :chart-option-props="podChartOption"
              :width="donutChartWidth"
              :height="donutChartHeight"
              donut-label="Allocation"
            ></donut-chart>
            <span class="chart-text">Pods: {{ podsData.podsCount }}</span>
          </div>
        </div>
      </div>
    </sp-card>
  </div>
</template>

<script>
import DonutChart from '@/components/DonutChart.vue'
import { nodeCpuRequestDonutChartOptions } from '@/assets/data/cluster/nodeCpuRequestDonutOptions'
import { nodeCpuLimitsDonutChartOptions } from '@/assets/data/cluster/nodeCpuLimitsDonutOptions'
import { nodeMemoryRequestDonutChartOptions } from '@/assets/data/cluster/nodeMemoryRequestDonutOptions'
import { nodeMemoryLimitsDonutChartOptions } from '@/assets/data/cluster/nodeMemoryLimitsDonutChartOptions'
import { nodePodDonutChartOptions } from '@/assets/data/cluster/nodePodDonutOptions'

export default {
  components: {
    DonutChart,
  },
  data: () => ({
    cpuRequestChartOption: nodeCpuRequestDonutChartOptions.options,
    cpuLimitsChartOption: nodeCpuLimitsDonutChartOptions.options,
    memoryLimitsChartOption: nodeMemoryLimitsDonutChartOptions.options,
    memoryRequestChartOption: nodeMemoryRequestDonutChartOptions.options,
    podChartOption: nodePodDonutChartOptions.options,

    donutChartWidth: '220px',
    donutChartHeight: '220px',

    cpuData: {
      cpuRequestCores: 0.405,
      cpuLimitsCores: 1.3,
      cpuRequestData: [
        {
          name: 'Request on',
          value: 10,
        },
        {
          name: 'Request off',
          value: 0,
        },
      ],
      cpuLimitData: [
        {
          name: 'Limit on',
          value: 9,
        },
        {
          name: 'Limit off',
          value: 1,
        },
      ],
    },
    cpuColor: ['#FF6384', '#1A3350'],
    memoryData: {
      memoryRequestMib: 423,
      memoryLimitsMib: 1100,
      memoryRequestData: [
        {
          name: 'Request on',
          value: 10,
        },
        {
          name: 'Request off',
          value: 0,
        },
      ],
      memoryLimitData: [
        {
          name: 'Limit on',
          value: 0,
        },
        {
          name: 'Limit off',
          value: 10,
        },
      ],
    },
    memoryColor: ['#06ABEA', '#1A3350'],
    podsData: {
      podsCount: 16,
      podAllocationData: [
        {
          name: 'Allocation on',
          value: 10,
        },
        {
          name: 'Limit off',
          value: 0,
        },
      ],
    },
    podColor: ['#FFC400', '#1A3350'],
  }),
  computed: {
    windowWidth() {
      return window.innerWidth
    },
  },
  created() {
    if (this.windowWidth <= '1366') {
      this.donutChartWidth = '180px'
      this.donutChartHeight = '180px'
    }
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-cluster-node-detail-chart-card-wrapper {
  .chart-card {
    background-color: $sp-body-bg-color;
    padding: 10px;
    .charts-wrapper {
      display: flex;
      justify-content: center;
      .chart-title-wrapper {
        width: 100%;
        text-align: left;
        padding-left: 10px;
        margin-bottom: 10px;
        .chart-title {
          font-family: $sub-font;
          font-weight: bold;
          font-size: toRem(19);
          color: $sp-title;
        }
      }
      .cpu-chart-wrapper {
        display: flex;
        flex-wrap: wrap;
        text-align: center;
      }
      .memory-chart-wrapper {
        display: flex;
        flex-wrap: wrap;
        text-align: center;
      }
      .pod-chart-wrapper {
        display: flex;
        flex-wrap: wrap;
        text-align: center;
      }
      .chart-text {
        font-size: toRem(16);
      }
    }
  }
}
</style>
