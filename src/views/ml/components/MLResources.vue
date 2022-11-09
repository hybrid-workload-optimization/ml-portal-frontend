<template>
  <div class="sp-dashboard-table-wrapper">
    <div class="title-wrapper">
      <label class="title">Total</label>
      <label class="title"> {{ resourceListData.length }}</label>
    </div>
    <div class="datatable-wrapper">
      <resource-table
        ref="spTable"
        :headers="headers"
        :options="options"
        :datas="resourceListData"
        :items-per-page="5"
        is-linked
        @click:btn.stop="test"
        @click:row="moveToDetailPage"
      >
      </resource-table>
    </div>
  </div>
</template>

<script>
import ResourceTable from '@/components/dataTables/MLDataTable.vue'

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
        align: 'center',
        value: 'pod',
      },
      {
        text: 'Created At',
        align: 'center',
        value: 'createdAt',
      },
      {
        text: 'Updated At',
        align: 'center',
        value: 'updatedAt',
      },
      {
        text: 'Updated',
        align: 'center',
        value: 'uid',
      },
      {
        text: 'Action',
        align: 'center',
        value: '',
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
  computed: {},
  watch: {},
  methods: {
    test() {
      console.log('성공했음')
    },
    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { id } = data
      const { clusterIdx } = data
      if (id != null && clusterIdx != null) {
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
