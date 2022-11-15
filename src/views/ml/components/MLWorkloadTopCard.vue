<template>
  <div class="sp-cluster-general-top-card">
    <sp-card outlined class="general-top-card" elevation="0">
      <div class="card-left">
        <div class="box-wrapper">
          <resource-box
            class="resource-box"
            v-for="(data, index) in resourceBoxData"
            :key="index"
            :title="data.title"
            :value="data.value"
            outlined
            width="250px"
            max-width="250px"
            minHeight="0"
            height="125px"
            max-height="125px"
            elevation="0"
          ></resource-box>
        </div>
      </div>
      <div class="card-right">
        <div class="chart-wrapper">
          <div class="title-text">Pod 가동률</div>
          <donut-chart
            :chart-data="podStatusCountData"
            :donut-color="chartColor"
            :chart-option-props="chartOption"
            width="230px"
            height="230px"
          />
        </div>
        <div class="status-wrapper">
          <template v-for="(count, index) in podStatusCountData">
            <div class="status-display" :key="index">
              <span class="status-title">{{ count.name }}</span> <br />
              <span class="status-value">{{ count.value }}</span>
            </div>
          </template>
        </div>
      </div>
    </sp-card>
  </div>
</template>

<script>
import ResourceBox from '@/components/molcule/ResourceBox.vue'
import DonutChart from '@/components/DonutChart.vue'
import { dashboardDonutChartOptions } from '@/assets/data/dashboardDonutChartOptions'

export default {
  components: {
    ResourceBox,
    DonutChart,
  },
  data() {
    return {
      chartOption: dashboardDonutChartOptions.options,
      podStatusCountData: this.podStatusData,
      chartColor: ['#87CEFA', '#B82647', '#4682B4'],
    }
  },
  props: {
    resourceBoxData: {
      type: Array,
      default: [],
      description: '자원박스 데이터',
    },
    podStatusData: {
      type: Array,
      default: [],
      description: '파드 현황 차트 데이터',
    },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-cluster-general-top-card {
  padding-top: 20px;
  .general-top-card {
    background-color: $sp-body-bg-color;
    .card-body {
      display: flex;
    }
    .sp__label {
      font-size: toRem(12);
    }
    .content-text {
      font-size: toRem(15);
      color: $sp-title;
    }
    .card-right {
      padding: 10px;
      width: 30%;
      margin-left: 5px;
      .title-text {
        text-align: center;
        padding-bottom: 0.5em;
        font-weight: bold;
        color: $sp-title;
        font-size: toRem(20);
      }
      .chart-wrapper {
        float: left;
        padding-left: 3em;
        .sp-linear-chart {
          &:first-child {
            padding-bottom: 20px;
          }
          &:last-child {
            padding-top: 20px;
          }
        }
      }
    }
    .status-wrapper {
      margin-left: 10px;
      margin-right: 50px;
      .status-display {
        display: block;
        text-align: right;
        margin-bottom: 30px;
        .status-title {
          padding-bottom: 10px;
        }
        .status-value {
          font-size: 1.5em;
          color: $sp-title;
          font-weight: bold;
        }
      }
      .status-display:nth-child(3) {
        margin-bottom: 0px;
      }
    }
    .card-left {
      width: 70%;
      display: flex;
      padding-right: 10px;
      align-items: center;
      justify-content: flex-end;
      .resource-box {
        margin-left: 10px;
        display: inline-block;
        .card-body {
          height: 100%;
          background-color: white;
        }
      }
      @include desktop-small(580px, 1366px) {
        justify-content: space-between;
        display: block;
        padding-top: 50px;
        .contents-title {
          font-size: toRem(15) !important;
        }
        .value-wrapper {
          font-size: toRem(25) !important;
        }
      }
      .contents-title {
        font-size: toRem(17) !important;
      }
      .value-wrapper {
        font-size: toRem(25) !important;
      }
      .value-wrapper:nth-child(1) {
        font-size: toRem(15) !important;
      }
    }
  }
}
</style>
