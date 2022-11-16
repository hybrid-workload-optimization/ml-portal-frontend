<template>
  <div class="sp-workload-top-card">
    <sp-card outlined class="workload-top-card" elevation="0">
      <div class="card-left">
        <div class="box-wrapper">
          <resource-box
            class="resource-box"
            v-for="(data, index) in resourceBoxData"
            :key="index"
            :title="data.title"
            :value="data.value"
            outlined
            width="260px"
            max-width="260px"
            minHeight="0"
            height="125px"
            max-height="125px"
            elevation="0"
          ></resource-box>
        </div>
      </div>
      <div class="card-center"></div>
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
// import ResourceBox from '@/components/molcule/ResourceBox.vue'
import ResourceBox from '@/views/ml/components/MLResourceBox.vue'
import DonutChart from '@/components/DonutChart.vue'
import { dashboardDonutChartOptions } from '@/assets/data/mlWorkloadDountChartOptions'

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
.sp-workload-top-card {
  padding-top: 20px;
  .workload-top-card {
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
      padding-right: 10px;
      padding-top: 5px;
      width: 25%;
      margin-left: 5px;
      float: right;
      @include desktop-small(580px, 1850px) {
        width: 30%;
      }
      @include desktop-small(580px, 1477px) {
        width: 35%;
      }
      @include desktop-small(580px, 1366px) {
        width: 40%;
      }
      .title-text {
        text-align: center;
        padding-bottom: 0.5em;
        font-weight: bold;
        color: $sp-title;
        font-size: toRem(20);
      }
      .chart-wrapper {
        float: left;
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
      @include desktop-small(580px, 1850px) {
        margin-right: 10px;
      }
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
    .card-center {
      width: 15%;
      @include desktop-small(580px, 1850px) {
        width: 10%;
      }
      @include desktop-small(580px, 1515px) {
        width: 5%;
      }
      @include desktop-small(580px, 1477px) {
        width: 0%;
        margin: 0px;
        padding: 0px;
      }
    }
    .card-left {
      width: 60%;
      display: flex;
      padding-right: 10px;
      align-items: center;
      justify-content: flex-end;
      float: left;
      @include desktop-small(580px, 1850px) {
        width: 65%;
      }
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
  .box-wrapper
    > .sp-resource-box:nth-child(1)
    > .card-body
    > .contents-wrapper
    > .value-wrapper {
    font-size: toRem(23) !important;
    @include desktop-small(580px, 1850px) {
      font-size: toRem(18) !important;
    }
    @include desktop-small(580px, 1500px) {
      font-size: toRem(15) !important;
    }
  }

  .sp-resource-box {
    @include desktop-small(540px, 1850px) {
      width: 30% !important;
    }
  }
}
</style>
