<template>
  <div class="sp-list-content">
    <div class="list-search-wrapper">
      <search
        class="sp-basic-search"
        :title="'Total:'"
        :todoCount="dataListSize.toString()"
        :isDisabled="currentMenuInfo.writableYn !== 'Y'"
        @change="onSearch"
        @input="onInputSearchValue"
        @click="onClickNew"
        button-text="New Deploy Experiments"
      >
      </search>
    </div>

    <!-- 조회 내용이 존재할 때, 그리드 표시 -->
    <sp-table
      v-if="dataListSize"
      class="table-wrapper"
      is-linked
      :headers="headers"
      :datas="hpDataList"
      :options="options"
      :search="searchValue"
      @page-count="15"
      @click:row="moveToDetailPage"
    />
    <!-- 조회 내용이 존재하지 않을 때, 내용 표시(optionl) -->
    <empty
      v-else-if="!isLoading"
      class="table-wrapper"
      title="Suggestion이 존재하지 않습니다."
      description=""
    />

    <Modal
      :title-name="'New Deploy Experiments'"
      modal-width="920"
      modal-height="480"
      body-height="400px"
      popup-card-class="popup-new-deploy-experiments"
      :dialog="dialog"
      @close-modal="onClickCloseModal"
    >
      <template v-slot:content>
        <div class="new-deploy-experiments-content-wrapper">
          <new-deploy-experiments ref="modalContent" />
        </div>
      </template>

      <template v-slot:footer>
        <div class="popup-new-deploy-experiments__button-wrapper">
          <sp-button
            class="popup-new-deploy-experiments--button cancel"
            outlined
            elevation="0"
            @click.stop="onClickCloseModal"
          >
            Cancel</sp-button
          >
          <sp-button
            class="popup-new-deploy-experiments--button create"
            outlined
            elevation="0"
            @click.stop="onConfirmedFromCreateModal"
          >
            Confirm</sp-button
          >
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Search from '@/components/molcule/DataTableSearch.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import Modal from '@/components/modals/Modal.vue'
import NewDeployExperiments from '@/views/automl/components/NewDeployExperiments.vue'

const automlMapUtils = createNamespacedHelpers('automl')
const loginUserMapUtils = createNamespacedHelpers('loginUser')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    Search,
    spTable,
    Empty,
    Modal,
    NewDeployExperiments,
  },
  data() {
    return {
      dialog: false,

      searchValue: '',

      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
      headers: [
        {
          text: 'Name',
          align: 'left',
          value: 'name',
          class: 'w-20',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
          class: 'w-10',
        },
        {
          text: 'Algorithm',
          align: 'center',
          value: 'algorithm',
          class: 'w-10',
        },
        {
          text: 'Lr',
          align: 'center',
          value: 'lr',
          class: 'w-10',
        },
        {
          text: 'Num layers',
          align: 'center',
          value: 'numLayers',
          class: 'w-10',
        },
        {
          text: 'Optimizer',
          align: 'center',
          value: 'optimizer',
          class: 'w-10',
        },
        {
          text: 'Optimal trial',
          align: 'center',
          value: 'optimalTrial',
          class: 'w-20',
        },
      ],
      // 그리드 설정 값
      options: {
        hideFooter: true,
        hideHeader: false,
        dark: false,
        dense: false,
        disableFiltering: false,
        disablePagination: false,
        disableSort: false,
        fixedHeader: true,
        showSelect: false,
        itemKey: 'id',
      },
      isLoading: false,
    }
  },

  created() {},

  computed: {
    ...automlMapUtils.mapGetters(['hpDataList']),
    ...automlMapUtils.mapGetters(['dataListSize']),
    ...loginUserMapUtils.mapState(['currentMenuInfo']),
  },

  async mounted() {
    this.isLoading = true
    await this.getListData()
    this.isLoading = false
  },

  methods: {
    ...automlMapUtils.mapActions(['getList']),
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    onInputSearchValue(value) {
      this.searchValue = value
    },

    // 리스트 조회 요청
    async getListData() {
      await this.getList()
    },

    // Search 박스 입력값 변경 시 호출됨
    onSearch(value) {
      this.searchValue = value
    },

    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { name, namespace } = data
      if (name && namespace) {
        this.$router.push(`/automl/detail/${namespace}/${name}`)
      }
    },

    // New Popup
    // 모달 오픈
    openModal() {
      this.dialog = true
    },
    // 모달 클로즈
    onClickCloseModal() {
      this.dialog = false
    },
    onClickNew() {
      this.openModal()
      if (this.$refs.modalContent) {
        this.$refs.modalContent.initData()
      }
    },
    // 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromCreateModal() {
      console.log('modalContent ==== ', this.$refs.modalContent)

      const namespaceValue = this.$refs.modalContent.namespace
      if (namespaceValue === '' || namespaceValue === null) {
        console.log('namespace == ', namespaceValue)
        this.openAlert('Namespace를 선택해 주세요.')
        return
      }

      const experimentNameValue = this.$refs.modalContent.experimentName
      if (
        experimentNameValue.trim() === '' ||
        experimentNameValue.trim() === null
      ) {
        this.openAlert('Experiment Name을 입력해 주세요.')
        return
      }

      const exampleVersionValue = this.$refs.modalContent.exampleVersion
      if (exampleVersionValue === '' || exampleVersionValue === null) {
        this.openAlert('Example version을 선택해 주세요.')
        return
      }

      const searchAlgorithmValue = this.$refs.modalContent.searchAlgorithm
      if (searchAlgorithmValue === '' || searchAlgorithmValue === null) {
        this.openAlert('Search Algorithm을 선택해 주세요.')
        return
      }

      const repeatNumberValue = this.$refs.modalContent.repeatNumber
      if (
        repeatNumberValue.trim() === '' ||
        repeatNumberValue.trim() === null
      ) {
        this.openAlert('Repeat number를 입력해 주세요.')
        return
      }

      await this.$refs.modalContent.onSubmit()
      this.onClickCloseModal()
      this.getListData()
    },
  },
}
</script>
<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-list-content {
  width: 100%;
}

.popup-new-deploy-experiments {
  $this: 'popup-new-deploy-experiments';
  .card-body {
    display: flex;
    flex-direction: column;
    padding-bottom: 20px !important;

    .#{$this}__button-wrapper {
      margin-right: 20px;
      margin-top: auto;
      text-align: right;

      .#{$this}--button {
        width: 114px;
        border-radius: 5px;
      }

      .cancel {
        margin-right: 15px;
      }
      .create {
        color: $sp-teriary;
      }
    }
  }
}
// .sp-list-content {
//   .sp-basic-search {
//     .search-wrapper--button {
//       width: 20em;
//     }
//     .sp-basic-toggle-button {
//       padding-right: 10px;
//       .sp-basic-toggle--click {
//         background-color: #f5f8fbcc;
//         border: 1px solid rgba($color: #4b556680, $alpha: 1);
//         &.v-item--active {
//           background-color: $sp-teriary;
//           .v-icon {
//             @include set-text(normal, 20, rgba($color: #fff, $alpha: 0.2));
//             color: #fff !important;
//           }
//         }

//         .v-icon {
//           @include set-text(
//             normal,
//             20,
//             rgba($color: $sp-box-border, $alpha: 1)
//           );
//           color: $sp-sky-blue-500 !important;
//         }
//       }
//     }
//     .search-wrapper {
//       width: 50%;
//       @include desktop-small {
//         width: 60%;
//       }
//     }
//   }
// }
</style>
