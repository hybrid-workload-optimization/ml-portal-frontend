<template>
  <div class="sp-dashboard">
    <multi-select
      class="margin-bottom-20"
      :firstSelectMeta="firstSelectMeta"
      @changeItem="onChangeItem"
    />
    <!-- :secondSelectMeta="secodSelectMeta" -->
    <dashboard-card />
    <dashboard-cluster-overview />
    <!-- <dashboard-table></dashboard-table> -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import request from '@/lib/request'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardClusterOverview from '@/components/dashboard/DashboardClusterOverview.vue'
// import DashboardTable from '@/components/dashboard/DashboardTable.vue'
import MultiSelect from '@/components/MultiSelectForDashboard.vue'

const dashboardMapUtils = createNamespacedHelpers('dashboard')
const multiSelectMapUtils = createNamespacedHelpers('multiSelect')

export default {
  components: {
    MultiSelect,
    DashboardCard,
    DashboardClusterOverview,
    // DashboardTable,
  },
  data() {
    return {
      // 멑티셀렉트 컴포넌트에서 첫번째 셀렉트 리스트를 가지고 오기 위한 메타데이터
      firstSelectMeta: {
        requestFunc: request.getProjectsUsingGET,
      },
      // 멑티셀렉트 컴포넌트에서 두번째 셀렉트 리스트를 가지고 오기 위한 메타데이터
      // secodSelectMeta: {
      //   requestFunc: request.getClustersUsingGET,
      //   parameters: { projectIdx: '' },
      //   valueKey: 'projectIdx',
      // },
    }
  },
  watch: {},

  created() {
    // const param = {
    //   firstValue: null,
    //   clusterIdx: null,
    // }
    // this.getData(param)
  },

  computed: {
    ...dashboardMapUtils.mapGetters(['dashboardData']),
    ...multiSelectMapUtils.mapGetters(['firstValue']),
  },

  methods: {
    ...multiSelectMapUtils.mapMutations(['setFirstValue']),
    ...dashboardMapUtils.mapActions([
      'getNodeState',
      'getNodeList',
      'getDashboardData',
    ]),

    onChangeItem(value) {
      console.log(value)
      this.getData(value)
    },

    async getData({ firstValue: projectIdx }) {
      // 조회 요청에서 필요한 parameter 세팅(호출한 api 파라미터 형태에 맞춰서 커스텀하게 생성)
      const param = {
        projectIdx,
        // clusterIdx: value.secondValue,
      }
      await this.getDashboardData({ projectIdx })
      await this.getNodeState(param)
      // await this.getNodeList(param)
      console.log(this.dashboardData)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';

.sp-dashboard {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

::v-deep {
  .sp-overview {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 24px;
    border: 1px solid rgba($color: $sp-box-border, $alpha: 1) !important;
    background: rgba($color: #fff, $alpha: 1) !important;

    .overview-header {
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 8px;
    }
    .overview-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .list-wrapper {
      min-width: 300px;
      max-width: 400px;
      width: 100%;
      height: 200px;

      .list-title {
        font-size: 16px;
        font-weight: bold;
        padding-bottom: 8px;
      }

      .list-content {
        display: flex;
        flex-direction: column;
        gap: 4px;

        height: 168px;
        overflow-y: auto;
        .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .list-item-title {
            width: calc(100% - 70px);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .list-item-date {
            width: 70px;
            text-align: right;
            padding-right: 4px;
          }
        }
      }
      .no-list-content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 168px;
        border: 1px dashed $sp-grey-400;

        .no-data-msg {
          white-space: nowrap;
        }
      }
    }

    .v-data-table-header tr > th {
      background: #fff !important;
      height: 42px !important;
    }
    tbody tr > td {
      height: 42px !important;
    }
  }

  .reload-wrapper {
    float: right;
    .reload-list__image {
      display: inline-block;
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
</style>
