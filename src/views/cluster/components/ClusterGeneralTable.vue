<template>
  <div class="sp-cluster-general-table-wrapper">
    <div class="title-wrapper">
      <span class="title">Nodes</span>
    </div>
    <div class="datatable-wrapper scrollable-table-wrapper">
      <service-table
        :headers="nodeData.headers"
        :datas="nodeList"
        :options="nodeData.options"
        :custom-slot-info="nodeData.customSlotInfo"
        scroll-only
        is-linked
        @click:row="moveToDetailPage"
      >
        <template v-slot:status_custom="slotProps">
          <sp-chip
            :color="getChipEachColor(slotProps.item.status)"
            class="status-chip"
          >
            {{ getStatusText(slotProps.item.status) }}
          </sp-chip>
        </template>

        <!-- 데이터 테이블 내에 가로형 차트 삽입 22.03.31 요청사항 -->
        <template v-slot:cpu_custom="slotProps">
          <bar-chart
            :usage-percentage="slotProps.item.cpu"
            color="#29AA54"
          ></bar-chart>
        </template>
        <template v-slot:memory_custom="slotProps">
          <bar-chart
            :usage-percentage="slotProps.item.memory"
            color="#FF8000"
          ></bar-chart>
        </template>
      </service-table>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import ServiceTable from '@/components/dataTables/DataTable.vue'
import Dashboard from '@/assets/data/dashboardNodes.js'
import BarChart from '@/components/LinearChart.vue'

const dashboardMapUtils = createNamespacedHelpers('dashboard')

export default {
  components: {
    ServiceTable,
    BarChart,
  },
  data: () => ({
    nodeData: Dashboard,
  }),
  computed: {
    ...dashboardMapUtils.mapGetters(['nodeList']),

    getChipEachColor() {
      return status => this.getChipColor(status)
    },
    getStatusText() {
      return status => (status ? 'Power on' : 'Power off')
    },
  },
  mounted() {
    const param = {
      clusterIdx: this.$route.params.id,
    }
    this.getNodeList(param)
  },
  methods: {
    ...dashboardMapUtils.mapActions(['getNodeList']),

    getChipColor(statusText) {
      console.log('Status Text: ', statusText)
      let status = ''
      if (statusText) {
        status = 'On'
      } else if (statusText) {
        status = 'Off'
      }
      const STATUS = {
        On: '#00BA88',
        Off: '#1A3350',
      }
      return STATUS[status]
    },
    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { id } = data
      const { clusterIdx } = data
      if (id != null && clusterIdx != null) {
        // this.$router.push(
        //   `/cluster/detail/${clusterIdx}?clusterNodeId=${id}&detail=true#node`,
        // )
        this.$router.push({
          hash: '#node',
          query: { clusterNodeId: id, detail: true },
        })
      } else {
        console.log('잘못된 접근 입니다.')
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-cluster-general-table-wrapper {
  padding-top: 20px;
  .title-wrapper {
    margin-bottom: 20px;
    .title {
      font-weight: bold;
      color: $sp-title;
    }
  }
  .datatable-wrapper {
    .sp-data-table {
      font-family: $sub-font;
      th {
        font-size: toRem(14);
      }
      td {
        font-size: toRem(15);
      }
      .status-chip {
        color: white;
        font-weight: 300;
        font-family: $sub-font;
      }
    }
  }
}
</style>
