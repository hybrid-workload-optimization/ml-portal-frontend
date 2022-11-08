<template>
  <div class="sp-dashboard-table-wrapper">
    <div class="title-wrapper">
      <!-- <search
        class="sp-basic-search"
        :title="'Total:'"
        :todoCount="2"
        @input="onInputSearchValue"
        @click="onNewProject"
      >
      </search> -->
    </div>
    <div class="datatable-wrapper">
      <resource-table
        ref="spTable"
        :headers="headers"
        :options="options"
        :datas="resourceListData"
        :items-per-page="5"
        is-linked
        @click:row="moveToDetailPage"
      >
      </resource-table>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import ResourceTable from '@/components/dataTables/DataTable.vue'
// import Search from '@/components/molcule/DataTableSearch.vue'

const mlMapUtils = createNamespacedHelpers('ml')

export default {
  components: {
    ResourceTable,
    // Search,
  },
  props: {
    resourceListData: {
      type: Array,
      default: () => [],
      description: '자원 List 데이터',
    },
  },
  data: () => ({
    headers: [
      {
        text: 'Name',
        align: 'left',
        value: 'name',
      },
      {
        text: 'Kind',
        align: 'left',
        value: 'kind',
      },
      {
        text: 'Pod',
        align: 'left',
        value: 'pod',
      },
      {
        text: 'Created At',
        align: 'left',
        value: 'createdAt',
      },
      {
        text: 'Updated At',
        align: 'left',
        value: 'updatedAt',
      },
      {
        text: 'Updated',
        align: 'left',
        value: 'uid',
      },
    ],
    options: {
      hideFooter: false,
      hideHeader: false,
      dark: false,
      dense: false,
      disableFiltering: false,
      disablePagination: false,
      disableSort: false,
      fixedHeader: false,
      showSelect: false,
      itemKey: 'id',
    },
    resourceListDatasize: 0,
  }),
  computed: {
    ...mlMapUtils.mapGetters(['detailInfo']),

    // getChipEachColor() {
    //   return status => this.getChipColor(status)
    // },
    // getStatusText() {
    //   return status => (status ? 'Power on' : 'Power off')
    // },
  },
  async mounted() {
    // const param = {
    //   clusterIdx: this.$route.params.id,
    // }
    // this.$refs.spTable.onDataBinding()
    // await this.getNodeList(param)
    // await this.getDetail()
    // this.$refs.spTable.setNoDataText()
  },
  methods: {
    // ...dashboardMapUtils.mapActions(['getNodeList']),

    // getChipColor(statusText) {
    //   console.log('Status Text: ', statusText)
    //   let status = ''
    //   if (statusText) {
    //     status = 'On'
    //   } else if (statusText) {
    //     status = 'Off'
    //   }
    //   const STATUS = {
    //     On: '#00BA88',
    //     Off: '#1A3350',
    //   }
    //   return STATUS[status]
    // },
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
.sp-dashboard-table-wrapper {
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
