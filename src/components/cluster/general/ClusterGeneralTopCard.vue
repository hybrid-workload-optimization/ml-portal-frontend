<template>
  <div class="sp-cluster-general-top-card">
    <sp-card outlined class="general-top-card" elevation="0">
      <div class="card-left">
        <div class="left-top">
          <label-with isBlock name="Provider"
            ><template #append-content>
              <span class="content-text"> {{ clusterData.provider }} </span>
            </template>
          </label-with>
        </div>

        <div class="left-middle">
          <label-with isBlock name="Version"
            ><template #append-content>
              <span class="content-text"> {{ clusterData.version }} </span>
            </template>
          </label-with>
          <label-with isBlock name="Created"
            ><template #append-content>
              <span class="content-text"> {{ clusterData.created }} </span>
            </template>
          </label-with>
        </div>

        <div class="left-bottom">
          <sp-button outlined class="content-button"
            ><v-icon>add</v-icon> Move to Monitoring</sp-button
          >
        </div>
      </div>

      <div class="card-center">
        <div class="chart-wrapper">
          <linear-chart
            v-for="(
              {
                title,
                usageStorage,
                unit,
                totalStorage,
                color,
                usagePercentage,
              },
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
        </div>
      </div>

      <div class="card-right">
        <div class="box-wrapper">
          <resource-box
            class="resource-box"
            v-for="(data, index) in resourceBoxData"
            :key="index"
            :title="data.title"
            :value="data.value"
            outlined
            width="150px"
            minHeight="0"
            height="142px"
            elevation="0"
          ></resource-box>
        </div>
      </div>
    </sp-card>
  </div>
</template>

<script>
import LabelWith from '@/components/molcule/LabelWith.vue'
import LinearChart from '@/components/LinearChart.vue'
import ResourceBox from '@/components/molcule/ResourceBox.vue'

export default {
  components: {
    LabelWith,
    LinearChart,
    ResourceBox,
  },
  props: {
    clusterData: {
      type: Object,
      default: {},
      description: '클러스터 상세정보',
    },
    systemItems: {
      type: Array,
      default: [],
      description: '가로 차트 데이터',
    },
    resourceBoxData: {
      type: Array,
      default: [],
      description: '자원박스 데이터',
    },
  },
  data: () => ({}),
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

    .card-left {
      width: 15%;
      padding: 10px;
      .left-top {
        margin-bottom: 10px;
      }
      .left-middle {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
      }
      .left-bottom {
        .v-icon {
          font-size: toRem(16);
          margin-right: 15px;
        }
        .content-button {
          height: 35px;
          border-radius: 5px;
          border-width: thin;
          font-weight: bold;
          font-size: toRem(15);
        }
      }
    }

    .card-center {
      padding: 10px;
      width: 30%;
      margin-left: 50px;

      .chart-wrapper {
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

    .card-right {
      width: 55%;
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
    }
  }
}
</style>
