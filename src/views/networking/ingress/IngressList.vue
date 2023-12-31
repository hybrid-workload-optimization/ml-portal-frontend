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
      :btnName="'New Ingress'"
      :firstSelectMeta="firstSelectMeta"
      :secondSelectMeta="secodSelectMeta"
      :thirdSelectMeta="thirdSelectMeta"
      @clickBtn="openYamlEditor"
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
      v-else-if="!isLoading"
      class="table-wrapper"
      title="Ingress 존재하지 않습니다."
      description=""
    />

    <!-- yaml 에디터 모달 -->
    <yaml-edit-modal
      @confirmed="onConfirmedFromEditModal"
      class="yarm-edit-modal"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import MultiSelect from '@/components/MultiSelect.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import request from '@/lib/request'
import Search from '@/components/molcule/DataTableSearch.vue'

const ingressMapUtils = createNamespacedHelpers('ingress')
const multiSelectMapUtils = createNamespacedHelpers('multiSelect')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    MultiSelect,
    spTable,
    Empty,
    YamlEditModal,
    Search,
  },
  data() {
    return {
      searchValue: '',

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
      // 멑티셀렉트 컴포넌트에서 세번째 셀렉트 리스트를 가지고 오기 위한 메타데이터
      thirdSelectMeta: {
        requestFunc: request.getNamespacesUsingGET,
        parameters: { clusterIdx: '' },
        valueKey: 'clusterIdx',
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
          text: 'Ingress Controller',
          align: 'center',
          value: 'ingressClass',
          class: 'w-10',
        },
        {
          text: 'Age',
          align: 'center',
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
      isLoading: false,
    }
  },

  async created() {
    this.isLoading = true
    await this.initMultiSelectState() // 멀티셀렉트 데이터 초기화
    this.initIngressState() // 데이터 초기화
    this.getListData()
  },

  computed: {
    ...ingressMapUtils.mapGetters(['dataList', 'dataListSize']),
    ...multiSelectMapUtils.mapGetters([
      'firstValue',
      'secondValue',
      'thirdValue',
    ]),
    getParameters() {
      return {
        projectId: this.firstValue,
        clusterIdx: this.secondValue,
        namespaceId: this.thirdValue,
      }
    },
  },

  methods: {
    ...multiSelectMapUtils.mapMutations(['initMultiSelectState']),

    ...ingressMapUtils.mapActions(['getList', 'createIngress']),
    ...ingressMapUtils.mapMutations([
      'initIngressState',
      'initIngressDataList',
    ]),

    ...yamlEditModalMapUtils.mapMutations(['openModal']),
    ...alertMapUtils.mapMutations(['openAlert']),

    // 서치 박스의 버튼 클릭 시 호출됨
    onClickButton() {
      console.log('clicked button')
    },
    // 서치 박스 입력값 변경 시 호출됨
    onInputSearchValue(value) {
      this.searchValue = value
    },
    // yaml 에디터 모달 오픈
    openYamlEditor() {
      // editType: 에디터 타입(create/update)
      // isEncoding: content가 인코딩 되어 있는지 여부
      // content: 에디터에 설정할 텍스트 초기값
      this.openModal({
        editType: 'create',
        isEncoding: false,
        content: '',
        title: 'New Ingress',
        resourceType: 'ingress',
      })
    },
    // 리스트 조회 요청
    async getListData() {
      if (this.getParameters.clusterIdx) {
        // 두번째 or 세번째 선택 값이 있을 경우만 조회한다.
        await this.getList(this.getParameters)
      } else {
        // 데이터 리스트 초기화
        this.initIngressDataList()
      }
    },

    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { id } = data
      if (id) {
        this.$router.push(`/network/ingress/detail/${id}`)
      }
    },

    // 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromEditModal(value) {
      const idx = this.secondValue // 셀렉트 박스에서 선택한 clusterIdx
      const { encodedContent } = value // yaml 에디터에서 받은 인코딩된 텍스트

      try {
        const param = {
          kubeConfigId: idx,
          yaml: encodedContent,
        }

        await this.createIngress(param)

        this.openAlert({ title: '리소스가 생성 되었습니다.', type: 'info' })
        this.getListData()
      } catch (error) {
        this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
        console.error(error)
      }
    },

    async onChangeItem() {
      await this.getListData()
      this.isLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.margin-bottom-20 {
  margin-bottom: 20px;
}
.margin-bottom-10 {
  margin-bottom: 10px;
}
.yarm-edit-modal {
  width: 980px;
}
</style>
