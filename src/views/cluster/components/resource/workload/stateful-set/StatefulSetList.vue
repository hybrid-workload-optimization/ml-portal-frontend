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
    <select-button
      :btnName="'New Stateful Set'"
      :firstSelectMeta="firstSelectMeta"
      @clickBtn="openYamlEditor"
      @changeItem="onChangeItem"
    />

    <!--
          서치 박스
          @change: 인풋 박스에 입력값 변경시 발생되는 이벤트
          title: 왼쪽 상단 타이틀(optional)
          todoCount: 왼쪽 상단 옆 추가 표시 값(optional)
          buttonText: 버튼 타이틀(optional, 이 값이 있으면 버튼이 표시된다)
          @click: 버튼 클릭 시 발생되는 이벤트
        -->
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
      class="table-wrapper"
      v-if="dataList.length"
      :headers="headers"
      :datas="dataList"
      :options="options"
      :search="searchValue"
      isLinked
      @click:row="moveToDetailPage"
    />

    <!-- 조회 내용이 존재하지 않을 때, 내용 표시(optionl) -->
    <empty
      class="table-wrapper"
      v-else-if="!isLoading"
      title="생성된 SatefulSet이 존재하지 않습니다."
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
import SelectButton from '@/components/SelectButton.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import request from '@/lib/request'
import Search from '@/components/molcule/DataTableSearch.vue'

const statefulSetMapUtils = createNamespacedHelpers('statefulSet')
const multiSelectMapUtils = createNamespacedHelpers('selectButton')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    SelectButton,
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
        requestFunc: request.getNamespacesUsingGET,
        parameters: { clusterIdx: this.$route.params.id },
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
          text: 'Labels',
          align: 'left',
          value: 'label',
          class: 'w-10',
        },
        {
          text: 'Pod',
          align: 'center',
          value: 'pod',
          class: 'w-10',
        },
        {
          text: 'Image',
          align: 'center',
          value: 'image',
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

  async created() {
    this.isLoading = true
    await this.initMultiSelectState() // 멀티셀렉트 데이터 초기화
    this.initStatefulSetState() // 스테이트풀셋 데이터 초기화
    await this.getListData()
    this.isLoading = false
  },

  computed: {
    ...multiSelectMapUtils.mapGetters(['firstValue']), // 첫번째, 두번째, 세번째 셀렉트 박스에서 선택된 항목의 value(multiSelect.js)
    ...statefulSetMapUtils.mapGetters(['dataList', 'dataListSize']), // statefulSetList.js에 저장된 dataList 값 반환(statefulSetList.js)
    getParameters() {
      return {
        clusterIdx: this.$route.params.id,
        namespaceIdx: this.firstValue,
      }
    },
  },

  methods: {
    ...multiSelectMapUtils.mapMutations(['initMultiSelectState']), // state 데이터 초기화(multiSelect.js)

    ...statefulSetMapUtils.mapActions(['getList']), // 리스트 조회 요청(statefulSet.js)
    ...statefulSetMapUtils.mapActions(['createStatefulSet']), // 스테이트풀셋 생성 요청(statefulSetList.js)
    ...statefulSetMapUtils.mapMutations(['initStatefulSetState']), // state 데이터 초기화(statefulSetList.js)
    ...statefulSetMapUtils.mapMutations(['initStatefulSetDataList']), // 데이터 리스트 초기화

    ...yamlEditModalMapUtils.mapMutations(['openModal']), // yaml에디트모달창 열기(yamlEditModal.js)
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

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
        title: 'New Stateful Set',
        resourceType: 'statefulSet',
      })
    },
    // 리스트 조회 요청
    async getListData() {
      // 조회 요청에서 필요한 parameter 세팅(호출한 api 파라미터 형태에 맞춰서 커스텀하게 생성)
      // 페이징 호출 관련 파라미터 세팅과 동작은 getList(statefulSet.js) 메서드와 common.js의 api 객체 참고
      if (this.getParameters.clusterIdx) {
        // 두번째 or 세번째 선택 값이 있을 경우만 조회한다.
        await this.getList(this.getParameters)
      } else {
        // 데이터 리스트 초기화
        this.initStatefulSetDataList()
      }
    },

    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { id } = data
      if (id) {
        this.$router.replace({
          name: this.$route.name,
          // hash: '#resource',
          hash: this.$route.hash,
          params: {
            id,
          },
          query: { detail: true },
        })
      }
    },

    // 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromEditModal(value) {
      const idx = this.$route.params.id // 셀렉트 박스에서 선택한 clusterIdx
      const { encodedContent } = value // yaml 에디터에서 받은 인코딩된 텍스트

      try {
        const param = {
          clusterIdx: idx,
          yaml: encodedContent,
        }

        const response = await this.createStatefulSet(param)

        // 생성 성공 시
        if (response.status === 201) {
          this.openAlert({
            title: '리소스가 생성 되었습니다.',
            type: 'info',
          })
          this.getListData()
        } else {
          this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
          console.error(response.data.message)
        }
      } catch (error) {
        this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
        console.error(error)
      }
    },

    // 셀렉트 박스의 선택 항목이 변결될 때마다 호출된다.
    // value 속성키 {firstVaue, secondValue, thirdValue}
    async onChangeItem() {
      await this.getListData()
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
.padding-10 {
  padding: 10px;
}

.yarm-edit-modal {
  width: 980px;
}
</style>
