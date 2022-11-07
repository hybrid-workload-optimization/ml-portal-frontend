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
              :chart-data="cpuChartData.cpuRequestData"
              :donut-color="cpuColor"
              :chart-option-props="cpuRequestChartOption"
              width="170px"
              height="170px"
              donut-label="Request"
            ></donut-chart>
            <span class="chart-text"
              >Cores: {{ cpuChartData.cpuRequestCores }}</span
            >
          </div>
          <div class="limit-chart-wrapper">
            <donut-chart
              :chart-data="cpuChartData.cpuLimitData"
              :donut-color="cpuColor"
              :chart-option-props="cpuLimitsChartOption"
              width="170px"
              height="170px"
              donut-label="Limits"
            ></donut-chart>
            <span class="chart-text"
              >Cores: {{ cpuChartData.cpuLimitsCores }}
            </span>
          </div>
        </div>

        <!-- Memory 차트 -->
        <div class="memory-chart-wrapper">
          <div class="chart-title-wrapper">
            <span class="chart-title">Memory</span>
          </div>
          <div class="request-chart-wrapper">
            <donut-chart
              :chart-data="memoryChartData.memoryRequestData"
              :donut-color="memoryColor"
              :chart-option-props="memoryRequestChartOption"
              width="170px"
              height="170px"
              donut-label="Request"
            ></donut-chart>
            <span class="chart-text"
              >MiB: {{ memoryChartData.memoryRequestMib }}</span
            >
          </div>
          <div class="limit-chart-wrapper">
            <donut-chart
              :chart-data="memoryChartData.memoryLimitData"
              :donut-color="memoryColor"
              :chart-option-props="memoryLimitsChartOption"
              width="170px"
              height="170px"
              donut-label="Limits"
            ></donut-chart>
            <span class="chart-text"
              >MiB: {{ memoryChartData.memoryLimitsMib }}</span
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
              :chart-data="podChartData.podAllocationData"
              :donut-color="podColor"
              :chart-option-props="podChartOption"
              width="170px"
              height="170px"
              donut-label="Allocation"
            ></donut-chart>
            <span class="chart-text">Pods: {{ podChartData.podsCount }}</span>
          </div>
        </div>
      </div>
    </sp-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import DonutChart from '@/components/DonutChart.vue'
import { nodeCpuRequestDonutChartOptions } from '@/assets/data/cluster/nodeCpuRequestDonutOptions'
import { nodeCpuLimitsDonutChartOptions } from '@/assets/data/cluster/nodeCpuLimitsDonutOptions'
import { nodeMemoryRequestDonutChartOptions } from '@/assets/data/cluster/nodeMemoryRequestDonutOptions'
import { nodeMemoryLimitsDonutChartOptions } from '@/assets/data/cluster/nodeMemoryLimitsDonutChartOptions'
import { nodePodDonutChartOptions } from '@/assets/data/cluster/nodePodDonutOptions'

const nodeMapUtils = createNamespacedHelpers('clusterNode')

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

    cpuData: {
      cpuRequestCores: 0.405,
      cpuLimitsCores: 1.3,
      cpuRequestData: [],
      cpuLimitData: [],
    },
    cpuColor: ['#FF6384', '#1A3350'],
    memoryData: {
      memoryRequestMib: 423,
      memoryLimitsMib: 1100,
      memoryRequestData: [],
      memoryLimitData: [],
    },
    memoryColor: ['#06ABEA', '#1A3350'],
    podsData: {
      podsCount: 16,
      podAllocationData: [
        {
          name: '사용량',
          value: 0,
        },
        {
          name: 'Limit off',
          value: 10,
        },
      ],
    },
    podColor: ['#FFC400', '#1A3350'],
  }),

  // 컴포넌트 생성 후 호출됨
  async created() {
    this.nodeId = this.$route.query.clusterNodeId
  },
  computed: {
    ...nodeMapUtils.mapGetters(['detailInfo', 'chartDto']), // 상세 정보 데이터 객체 반환
    ...nodeMapUtils.mapGetters({
      cpuChartData: 'cpuData',
      memoryChartData: 'memoryData',
    }),
    ...nodeMapUtils.mapGetters({ podChartData: 'podData' }),
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
