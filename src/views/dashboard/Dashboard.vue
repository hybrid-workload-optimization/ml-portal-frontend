<template>
  <div class="sp-dashboard">
    <multi-select
      class="margin-bottom-20"
      :firstSelectMeta="firstSelectMeta"
      :secondSelectMeta="secodSelectMeta"
      @changeItem="onChangeItem"
    />
    <dashboard-card></dashboard-card>
    <dashboard-table></dashboard-table>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import request from '@/lib/request'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardTable from '@/components/dashboard/DashboardTable.vue'
import MultiSelect from '@/components/MultiSelectForDashboard.vue'

const dashboardMapUtils = createNamespacedHelpers('dashboard')

export default {
  components: {
    MultiSelect,
    DashboardCard,
    DashboardTable,
  },
  data() {
    return {
      // 멑티셀렉트 컴포넌트에서 첫번째 셀렉트 리스트를 가지고 오기 위한 메타데이터
      firstSelectMeta: {
        requestFunc: request.getProjectsUsingGET,
      },
      // 멑티셀렉트 컴포넌트에서 두번째 셀렉트 리스트를 가지고 오기 위한 메타데이터
      secodSelectMeta: {
        requestFunc: request.getClustersUsingGET,
        parameters: { projectIdx: '' },
        valueKey: 'projectIdx',
      },
    }
  },

  created() {
    const param = {
      firstValue: null,
      clusterIdx: null,
    }
    this.getData(param)
  },

  computed: {
    ...dashboardMapUtils.mapGetters(['nodeState', 'nodeList']),
  },

  methods: {
    ...dashboardMapUtils.mapActions(['getNodeState', 'getNodeList']),

    onChangeItem(value) {
      this.getData(value)
    },

    async getData(value) {
      // 조회 요청에서 필요한 parameter 세팅(호출한 api 파라미터 형태에 맞춰서 커스텀하게 생성)
      const param = {
        projectIdx: value.firstValue,
        clusterIdx: value.secondValue,
      }

      await this.getNodeState(param)
      await this.getNodeList(param)
    },
  },
}
</script>

<style lang="scss" scoped></style>
