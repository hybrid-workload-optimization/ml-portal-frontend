<template>
  <div class="sp-dashboard">
    <div class="dashboard-select-wrap">
      <div class="dashboard-select">
        <Select
          :value="selectItem"
          :items="selectList"
          @input="onChangeItem"
          dense
          outlined
          hideDetails
        />
      </div>
      <div class="reload-wrapper">
        <v-icon @click="getData(tempProjectIdx)" color="black"
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
import Select from '@/components/atoms/Select.vue'
import request from '@/lib/request'
import { getNowDate } from '@/lib/date'
// import DashboardTable from '@/components/dashboard/DashboardTable.vue'
// import MultiSelect from '@/components/MultiSelectForDashboard.vue'

const dashboardMapUtils = createNamespacedHelpers('dashboard')

const sessionKey = 'dashboard-select'

export default {
  components: {
    DashboardCard,
    DashboardClusterOverview,
    Select,
    // DashboardTable,
  },
  data() {
    return {
      selectList: [],
      currentDateTime: '',
      tempProjectIdx: sessionStorage.getItem(sessionKey),
    }
  },
  mounted() {
    this.getSelectItems()
  },

  computed: {
    ...dashboardMapUtils.mapGetters(['dashboardData', 'selectItem']),
  },

  methods: {
    ...dashboardMapUtils.mapActions(['getDashboardData', 'setSelectItem']),
    async getSelectItems() {
      // 셀렉트 박스 목록 호출
      try {
        this.selectList = []
        const { data } = await request.getProjectsUsingGET()
        this.selectList = data?.result || []
        this.initSelectItem()
      } catch (e) {
        console.error(e)
      }
    },
    async onChangeItem(projectIdx) {
      sessionStorage.setItem(sessionKey, projectIdx)
      this.tempProjectIdx = projectIdx
      this.setSelectItem(projectIdx)
      await this.getData(this.selectItem)
    },
    async initSelectItem() {
      if (this.tempProjectIdx === null) {
        this.tempProjectIdx = this.selectList[0].value
        this.setSelectItem(this.selectList[0].value)
      } else {
        const target = this.selectList.find(
          item => item.value === this.tempProjectIdx,
        )
        if (target) this.setSelectItem(this.tempProjectIdx)
        else this.setSelectItem(this.selectList[0].value)
      }
      await this.getData(this.selectItem)
    },
    async getData(projectIdx) {
      const param = { projectIdx }
      await this.getDashboardData(param)
      this.currentDateTime = getNowDate()
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
