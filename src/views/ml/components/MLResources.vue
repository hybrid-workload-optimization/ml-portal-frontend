<template>
  <div class="sp-dashboard-table-wrapper">
    <div class="title-wrapper">
      <label class="title">Total</label>
      <label class="title"> {{ detailInfo.resources.length }}</label>
    </div>
    <div class="datatable-wrapper">
      <resource-table
        ref="spTable"
        :headers="headers"
        :options="options"
        :datas="detailInfo.resources"
        :items-per-page="5"
        is-linked
        @page-count="15"
        @click:btn="deleteResource"
        @click:row="moveToDetailPage"
      >
      </resource-table>
    </div>

    <modal
      class="popup-cluster"
      title-name="Resource 삭제"
      modal-width="456"
      :dialog="isOpenDeleteResourceModal"
      @close-modal="onClickCloseLabelModal"
    >
      <template v-slot:content>
        <clusterscale-popup :item="item" @closePopup="onClickCloseLabelModal" />
      </template>
    </modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import ResourceTable from '@/components/dataTables/MLDataTable.vue'
import Modal from '@/components/modals/Modal.vue'
import ClusterscalePopup from '@/views/ml/popup/MLResourceDeletePopup.vue'

const mlMapUtils = createNamespacedHelpers('ml')

export default {
  components: {
    ResourceTable,
    ClusterscalePopup,
    Modal,
  },
  props: {},
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
    item: [],
    resourceList: [],
  }),
  computed: {
    ...mlMapUtils.mapGetters(['isOpenDeleteResourceModal', 'detailInfo']),
  },
  watch: {},
  methods: {
    ...mlMapUtils.mapMutations([
      'openDeleteResourceModal',
      'closeDeleteResourceModal',
    ]),

    // 리소스 삭제 버튼 클릭시 해당 함수 호출
    deleteResource(data) {
      this.item = data.id
      this.openDeleteResourceModal()
    },
    onClickCloseLabelModal() {
      this.closeDeleteResourceModal()
    },
    // 상세 페이지로 이동 요청
    moveToDetailPage() {
      // param : data
      // const { id } = data
      // const { clusterIdx } = data
      // if (id != null && clusterIdx != null) {
      //   this.$router.push({
      //     hash: '#node',
      //     query: { clusterNodeId: id, detail: true },
      //   })
      // } else {
      //   console.log('잘못된 접근 입니다.')
      // }
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
