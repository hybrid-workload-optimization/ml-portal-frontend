<template>
  <div class="sp-list-content">
    <select-button
      :btnName="'New Ingress Controller'"
      @clickBtn="onClickNew"
      @changeItem="onChangeItem"
    />

    <search
      v-if="dataListSize"
      class="top-search-wrapper"
      :title="'Total:'"
      :todoCount="dataListSize.toString()"
      @input="onInputSearchValue"
    >
    </search>
    <sp-table
      v-if="dataListSize"
      class="table-wrapper"
      :headers="headers"
      :datas="dataList"
      :options="options"
      :search="searchValue"
      :custom-slot-info="customSlotInfo"
    >
      <template v-slot:action_custom="slotProps">
        <sp-button
          class="table-body--button edit"
          icon
          outlined
          @click="onClickEdit(slotProps.item)"
          ><v-icon>edit</v-icon></sp-button
        >
        <sp-button
          class="table-body--button delete"
          icon
          outlined
          @click="onClickDelete(slotProps.item)"
          ><v-icon>delete</v-icon></sp-button
        >
      </template>
    </sp-table>

    <!-- 조회 내용이 존재하지 않을 때, 내용 표시(optionl) -->
    <empty
      v-else-if="!isLoading"
      class="table-wrapper"
      title="Ingress Controller가 존재하지 않습니다."
      description=""
    />

    <!-- 신규 Ingress controller 등록 팝업 -->
    <Modal
      :title-name="
        (modalMode === 'new' ? 'New' : 'Update') + ' Ingress Controller'
      "
      modal-width="920"
      modal-height="530"
      body-height="450px"
      popup-card-class="popup-new-ingress-controller"
      :dialog="dialog"
      @close-modal="onClickCloseModal"
    >
      <template v-slot:content>
        <div class="new-ingress-controller-content-wrapper">
          <new-ingress-controller
            ref="modalContent"
            :mode="modalMode"
          ></new-ingress-controller>
        </div>
      </template>

      <template v-slot:footer>
        <div class="popup-new-ingress-controller__button-wrapper">
          <sp-button
            class="popup-new-ingress-controller--button cancel"
            outlined
            elevation="0"
            @click.stop="onClickCloseModal"
          >
            Cancel</sp-button
          >
          <sp-button
            class="popup-new-ingress-controller--button create"
            outlined
            elevation="0"
            @click.stop="onConfirmedFromCreateModal"
          >
            Confirm</sp-button
          >
        </div>
      </template>
    </Modal>

    <confirm
      @confirm-modal="onClickDelConfirm"
      @cancel-modal="onClickCancelConfirm"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import SelectButton from '@/components/SelectButton.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import request from '@/lib/request'
import Search from '@/components/molcule/DataTableSearch.vue'
import Modal from '@/components/modals/Modal.vue'
import NewIngressController from '@/views/networking/ingress/components/NewIngressController.vue'
import Confirm from '@/components/molcule/Confirm.vue'

const ingressControllerMapUtils = createNamespacedHelpers('ingressController')
const multiSelectMapUtils = createNamespacedHelpers('selectButton')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    SelectButton,
    spTable,
    Empty,
    Search,
    Modal,
    NewIngressController,
    Confirm,
  },
  props: {
    clusterId: Number,
  },
  data() {
    return {
      dialog: false,
      searchValue: '',

      // 멑티셀렉트 컴포넌트에서 첫번째 셀렉트 리스트를 가지고 오기 위한 메타데이터
      firstSelectMeta: {
        requestFunc: request.getClustersUsingGET,
        parameters: { projectIdx: '' },
        valueKey: 'projectIdx',
      },
      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
      headers: [
        {
          text: 'Name',
          align: 'left',
          value: 'name',
          class: 'w-10',
        },
        {
          text: 'Cluster',
          align: 'left',
          value: 'clusterName',
          class: 'w-10',
        },
        {
          text: 'External Ip',
          align: 'left',
          value: 'externalIpStr',
          class: 'w-10',
        },
        {
          text: 'Ingress Class',
          align: 'left',
          value: 'ingressClass',
          class: 'w-10',
        },
        {
          text: 'Port',
          align: 'left',
          value: 'ports',
          class: 'w-10',
        },
        {
          text: 'Default',
          align: 'center',
          value: 'defaultYn',
          class: 'w-10',
        },
        {
          text: 'Age',
          align: 'center',
          value: 'age',
          class: 'w-10',
        },
        {
          text: 'Action',
          align: 'center',
          value: 'action',
          class: 'w-10',
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
        fixedHeader: true,
        showSelect: false,
        itemKey: 'id',
      },
      modalMode: 'new',
      customSlotInfo: [{ name: 'action', slotName: 'action' }],
      selectedId: null,
      isLoading: false,
    }
  },

  async created() {
    this.isLoading = true
    await this.initMultiSelectState() // 멀티셀렉트 데이터 초기화
    this.initDataList() // 데이터 초기화
    this.getListData()
    this.isLoading = false
  },

  computed: {
    ...ingressControllerMapUtils.mapGetters(['dataList', 'dataListSize']),
    getParameters() {
      return {
        clusterIdx: this.clusterId,
      }
    },
  },
  methods: {
    ...multiSelectMapUtils.mapMutations(['initMultiSelectState']),
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    ...ingressControllerMapUtils.mapActions([
      'getList',
      'createItem',
      'deleteItem',
    ]),
    ...ingressControllerMapUtils.mapMutations([
      'initDataList',
      'initState',
      'initProvider',
      'initSeletedItem',
      'setSeletedItem',
    ]),

    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

    // 서치 박스의 버튼 클릭 시 호출됨
    onClickButton() {
      console.log('clicked button')
    },
    // 서치 박스 입력값 변경 시 호출됨
    onInputSearchValue(value) {
      this.searchValue = value
    },
    // 리스트 조회 요청
    async getListData() {
      const params = this.getParameters
      console.log('[params]::', params)
      if (params.clusterIdx) {
        await this.getList(params)
      } else {
        this.initDataList()
      }
    },
    // 모달 오픈
    openModal() {
      this.dialog = true
    },
    // 모달 클로즈
    onClickCloseModal() {
      this.dialog = false
      this.initProvider()
    },
    onClickNew() {
      this.modalMode = 'new'

      this.openModal()
      if (this.$refs.modalContent) {
        this.$refs.modalContent.initData()
      }
    },
    onClickEdit(item) {
      this.setSeletedItem(item)
      this.modalMode = 'edit'
      this.dialog = true
      if (this.$refs.modalContent) {
        this.$refs.modalContent.setData()
      }
    },
    async onClickDelConfirm() {
      const params = {
        ingressControllerIdx: this.selectedId,
      }
      await this.deleteItem(params)
      this.getListData()
      this.selectedId = null
    },
    onClickCancelConfirm() {
      this.selectedId = null
    },
    onClickDelete(item) {
      // this.selectedId = id
      this.selectedId = item.id
      this.openConfirm(`${item.name} 을(를) 삭제하시겠습니까?`)
    },

    // 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromCreateModal() {
      console.log('modalContent ==== ', this.$refs.modalContent)

      const replicasCount = this.$refs.modalContent.replicas
      if (replicasCount === '' || replicasCount === 0) {
        this.openAlert('Replicas 를 입력해 주세요.')
        return
      }

      const type = this.$refs.modalContent.serviceType
      if (type === 'NodePort') {
        const { httpPort } = this.$refs.modalContent
        if (httpPort === '' || httpPort === 0) {
          this.openAlert('Http Port 를 입력해 주세요.')
          return
        }
        if (httpPort > 32767 || httpPort < 30000) {
          this.openAlert(
            'Http Port 는 30000-32767 범위의 숫자만 입력해 주세요.',
          )
          return
        }

        const { httpsPort } = this.$refs.modalContent
        if (httpsPort === '' || httpsPort === 0) {
          this.openAlert('Https Port 를 입력해 주세요.')
          return
        }
        if (httpsPort > 32767 || httpsPort < 30000) {
          this.openAlert(
            'Https Port 는 30000-32767 범위의 숫자만 입력해 주세요.',
          )
          return
        }
      } else {
        const ipList = this.$refs.modalContent.externalIp
        for (const ip of ipList) {
          if (ip.ipAddress === '') {
            this.openAlert('IP 를 입력해 주세요.')
            break
          }
        }
      }

      await this.$refs.modalContent.onSubmit()
      await this.onClickCloseModal()
      this.getListData()
    },

    async onChangeItem() {
      await this.getListData()
      this.isLoading = false
    },
  },
  beforeDestroy() {
    this.initState()
  },
}
</script>

<style lang="scss">
.table-body--button,
.edit {
  margin-right: 5px;
  margin-right: 5px;
}
.popup-new-ingress-controller {
  $this: 'popup-new-ingress-controller';
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
</style>
