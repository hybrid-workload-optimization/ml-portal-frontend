<template>
  <div class="sp-dashboard">
    <div class="dashboard-select-wrap">
      <div class="reload-wrapper">
        <v-icon @click="getData(globalServiceGroup)" color="black"
          >mdi-refresh</v-icon
        >
        <span>마지막 업데이트 : {{ currentDateTime }}</span>
      </div>
    </div>
    <!-- :secondSelectMeta="secodSelectMeta" -->
    <dashboard-card />
    <dashboard-cluster-overview />
    <!-- <dashboard-table></dashboard-table> -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardClusterOverview from '@/components/dashboard/DashboardClusterOverview.vue'
import { getNowDate } from '@/lib/date'

const dashboardMapUtils = createNamespacedHelpers('dashboard')

export default {
  components: {
    DashboardCard,
    DashboardClusterOverview,
    // DashboardTable,
  },
  data() {
    return {
      selectList: [],
      currentDateTime: '',
    }
  },
  mounted() {},
  computed: {
    globalServiceGroup() {
      return this.$store.state.serviceGroup.globalServiceGroup
    },
    ...dashboardMapUtils.mapGetters(['dashboardData', 'selectItem']),
  },

  methods: {
    ...dashboardMapUtils.mapActions(['getDashboardData']),
    async getData(projectIdx) {
      await this.getDashboardData({ projectIdx })
      this.currentDateTime = getNowDate()
    },
  },
  watch: {
    globalServiceGroup: {
      deep: true,
      immediate: true,
      async handler(newVal) {
        await this.getData(newVal)
      },
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

  .dashboard-select-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;

    & .dashboard-select {
      width: 270px !important;
      margin-bottom: 16px;
    }
    .v-input.sp-select {
      background: #fff !important;
    }
  }
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
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
  }
}
</style>
