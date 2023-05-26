<template>
  <div class="sp-list-content">
    <!--
      멀티 셀렉터
      btnName: 버튼 명칭
      firtstSelectMeta: 첫번째 셀렉트 박스를 조회하기 위한 메타 정보 전달
      secondSelectMeta: 두번째 셀렉트 박스를 조회하기 위한 메타 정보 전달(optional: 없으면 selectbox 1개만 표시된다)
      thirdSelectMeta: 세번째 셀렉트 박스를 조회하기 위한 메타 정보 전달(optional: 없으면 selectbox 2개만 표시된다)
      @changeItem: 어떤 셀렉트 박스의 선택 아이템이 변경되었을 때의 이벤트(파라미터로 value 객체{firstValue, secondValue, thirdValue}가 전달된다)
      @clickBtn: 버튼을 클릭했을 때의 이벤트
    -->
    <multi-select
      :btnName="'New Ingress Controller'"
      :firstSelectMeta="firstSelectMeta"
      :secondSelectMeta="secodSelectMeta"
      @clickBtn="openModal"
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
    <!--
          조회 내용이 존재할 때, 그리드 표시
          headers: 헤더 메타 데이터
          datats: 조회할 리스트
          options: 그리드 형태에 대한 메타 데이터
          search: 넘겨지는 값에 따라 필터 기능 수행됨
          @click:row: 행 클릭시 이벤트 발생
        -->
    <sp-table
      v-if="dataListSize"
      class="table-wrapper"
      :headers="headers"
      :datas="dataList"
      :options="options"
      :search="searchValue"
      @click:row="moveToDetailPage"
      isLinked
    />

    <!-- 조회 내용이 존재하지 않을 때, 내용 표시(optionl) -->
    <empty
      v-else
      class="table-wrapper"
      title="Ingress Controller가 존재하지 않습니다."
      description=""
    />

    <!-- 신규 Ingress controller 등록 팝업 -->
    <Modal
      title-name="New Ingress Controller"
      modal-width="920"
      modal-height="520"
      body-height="450px"
      popup-card-class="popup-new-ingress-controller"
      :dialog="dialog"
      @close-modal="onClickCloseModal"
    >
      <template v-slot:content>
        <div class="new-ingress-controller-content-wrapper">
          <new-ingress-controller ref="modalContent"></new-ingress-controller>
        </div>
      </template>

      <template v-slot:footer>
        <div class="popup-new-ingress-controller__button-wrapper">
          <sp-button
            class="popup-new-ingress-controller--button cancel"
            outlined
            elevation="0"
            @click="onClickCloseModal"
          >
            취소</sp-button
          >
          <sp-button
            class="popup-new-ingress-controller--button create"
            outlined
            elevation="0"
            @click="onConfirmedFromCreateModal"
          >
            확인</sp-button
          >
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import MultiSelect from '@/components/MultiSelect.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import request from '@/lib/request'
import Search from '@/components/molcule/DataTableSearch.vue'
import Modal from '@/components/modals/Modal.vue'
import NewIngressController from '@/views/networking/ingress/components/NewIngressController.vue'

const ingressMapUtils = createNamespacedHelpers('ingress')
const multiSelectMapUtils = createNamespacedHelpers('multiSelect')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    MultiSelect,
    spTable,
    Empty,
    Search,
    Modal,
    NewIngressController,
  },
  data() {
    return {
      searchValue: '',

      dialog: false,

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
          text: 'Namespace',
          align: 'left',
          value: 'namespace',
          class: 'w-10',
        },
        {
          text: 'Host',
          align: 'left',
          value: 'host',
          class: 'w-10',
        },
        {
          text: 'Address',
          align: 'left',
          value: 'address',
          class: 'w-10',
        },
        {
          text: 'Age',
          align: 'left',
          value: 'age',
          class: 'w-10',
        },
      ],
      // 그리드 설정 값
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
    }
  },

  created() {
    // this.initMultiSelectState() // 멀티셀렉트 데이터 초기화
    this.initingressState() // 데이터 초기화
  },

  computed: {
    ...ingressMapUtils.mapGetters(['dataList']), // ingressList.js에 저장된 dataList 값 반환(ingress.js)
    ...ingressMapUtils.mapGetters(['dataListSize']), // ingressList.js에 저장된 dataListSize 값 반환(ingress.js)
  },

  methods: {
    ...multiSelectMapUtils.mapGetters(['secondValue']), // 두번째 셀렉트 박스에서 선택된 항목의 value(multiSelect.js)
    ...multiSelectMapUtils.mapMutations(['initMultiSelectState']), // state 데이터 초기화(multiSelect.js)

    ...ingressMapUtils.mapActions(['getList']), // 리스트 조회 요청(ingress.js)
    ...ingressMapUtils.mapActions(['createIngress']), // 스테이트풀셋 생성 요청(ingress.js)
    ...ingressMapUtils.mapMutations(['initingressState']), // state 데이터 초기화(ingress.js)
    ...ingressMapUtils.mapMutations(['initingressDataList']), // 데이터 리스트 초기화

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
    getListData(value) {
      // 조회 요청에서 필요한 parameter 세팅(호출한 api 파라미터 형태에 맞춰서 커스텀하게 생성)
      // 페이징 호출 관련 파라미터 세팅과 동작은 getList(ingress.js) 메서드와 common.js의 api 객체 참고
      const param = {
        clusterIdx: value.secondValue,
        namespaceIdx: value.thirdValue,
      }
      console.log(param)
      this.getList(param)
    },

    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { id } = data
      if (id) {
        // this.$router.push(`/network/ingress/detail/${id}`)
        this.$router.push(`/cluster/detail/${this.clusterIdx}/Ingress/${id}`)
      }
    },

    // 모달 오픈
    async openModal() {
      this.dialog = true
      this.$refs.modalContent.initData()
    },

    // 모달 클로즈
    onClickCloseModal() {
      this.dialog = false
      this.$refs.modalContent.initData()
    },

    // 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromCreateModal() {
      // const idx = this.secondValue() // 셀렉트 박스에서 선택한 clusterIdx
      // const { encodedContent } = value // yaml 에디터에서 받은 인코딩된 텍스트
      // try {
      //   const param = {
      //     kubeConfigId: idx,
      //     yaml: encodedContent,
      //   }
      //   const response = await this.createIngress(param)
      //   // 생성 성공 시
      //   if (response.status === 201) {
      //     this.openAlert({ title: '생성 성공했습니다.', type: 'info' })
      //     if (this.secondValue() || this.thirdValue()) {
      //       const val = {
      //         secondValue: this.secondValue(),
      //         thirdValue: this.thirdValue(),
      //       }
      //       this.getListData(val)
      //     }
      //   } else {
      //     this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
      //     console.error(response.data.message)
      //   }
      // } catch (error) {
      //   this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
      //   console.error(error)
      // }
    },

    // 셀렉트 박스의 선택 항목이 변결될 때마다 호출된다.
    // value 속성키 {firstVaue, secondValue, thirdValue}
    onChangeItem(value) {
      if (value.secondValue || value.thirdValue) {
        // 두번째 or 세번째 선택 값이 있을 경우만 조회한다.
        this.getListData(value)
      } else {
        // 데이터 리스트 초기화
        this.initingressDataList()
      }
    },
  },
}
</script>

<style lang="scss">
.margin-bottom-20 {
  margin-bottom: 20px;
}
.margin-bottom-10 {
  margin-bottom: 10px;
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
