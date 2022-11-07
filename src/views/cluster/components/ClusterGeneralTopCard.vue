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
          <label-with isBlock name="Version" class="version-wrapper"
            ><template #append-content>
              <span class="content-text"> {{ clusterData.version }} </span>
            </template>
          </label-with>
          <label-with isBlock name="Created" class="created-wrapper"
            ><template #append-content>
              <span class="content-text"> {{ clusterData.created }} </span>
            </template>
          </label-with>
        </div>

        <div class="left-bottom">
          <sp-button outlined class="content-button" @click="moveToAddOnPage"
            ><v-icon>add</v-icon> {{ getMonitoringAddOnButtonText }}
          </sp-button>
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
            max-width="150px"
            minHeight="0"
            height="142px"
            max-height="142px"
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
import { createNamespacedHelpers } from 'vuex'

const clusterMapUtils = createNamespacedHelpers('cluster')

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
  computed: {
    ...clusterMapUtils.mapGetters(['dataDetail', 'monitoringAddOnData']), // 상세
    getMonitoringAddOnButtonText() {
      return !Object.keys(this.monitoringAddOnData).length
        ? 'Install cluster monitoring'
        : 'Move to Monitoring'
    },
  },
  methods: {
    ...clusterMapUtils.mapActions(['installMonitoringAddOn']),
    moveToAddOnPage() {
      if (Object.keys(this.monitoringAddOnData).length) {
        if (
          this.monitoringAddOnData.packages &&
          this.monitoringAddOnData.packages.length
        ) {
          let endpoints = []
          this.monitoringAddOnData.packages.some(item => {
            if (
              item.name === 'grafana' &&
              item.endpoints &&
              item.endpoints.length &&
              item.endpoints[0].endpoints
            ) {
              endpoints = item.endpoints[0].endpoints
              return item
            }
            return false
          })
          if (endpoints.length) {
            window.open(endpoints[0])
          }
        }
      } else {
        this.$router.push({
          name: this.$route.name,
          hash: '#add-on',
          query: { target: 'cluster-monitoring' },
        })
      }
    },
  },
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
        .content-text {
          @include desktop-small(580px, 1366px) {
            font-size: toRem(12);
          }
        }
      }
      .left-middle {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        .content-text {
          @include desktop-small(580px, 1366px) {
            font-size: toRem(12);
          }
        }
        .created-wrapper {
          @include desktop-small(580px, 1366px) {
            padding-left: 30px;
          }
        }
      }
      .left-bottom {
        .v-icon {
          font-size: toRem(16);
          margin-right: 15px;
          @include desktop-small(580px, 1366px) {
            font-size: toRem(10);
            margin-right: 5px;
          }
        }
        .content-button {
          height: 35px;
          border-radius: 5px;
          border-width: thin;
          font-weight: bold;
          font-size: toRem(15);
          @include desktop-small(580px, 1366px) {
            font-size: 5px !important;
          }
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
      @include desktop-small(580px, 1366px) {
        justify-content: space-between;
        display: block;
        padding-top: 50px;
        .contents-title {
          font-size: toRem(11) !important;
        }
        .value-wrapper {
          font-size: toRem(25) !important;
        }
      }
    }
  }
}
</style>
