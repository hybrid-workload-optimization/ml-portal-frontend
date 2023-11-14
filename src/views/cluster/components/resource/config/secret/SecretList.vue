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
      :buttonText="''"
      @input="onInputSearchValue"
      @click="onClickButton"
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
      v-if="dataList.length"
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
      title="Secret 이 존재하지 않습니다."
      description=""
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import request from '@/lib/request'
import Search from '@/components/molcule/DataTableSearch.vue'

const secretUtils = createNamespacedHelpers('secret')
const multiSelectMapUtils = createNamespacedHelpers('selectButton')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: { spTable, Empty, Search },
  data() {
    return {
      searchValue: '',

      // 멑티셀렉트 컴포넌트에서 첫번째 셀렉트 리스트를 가지고 오기 위한 메타데이터
      firstSelectMeta: {
        requestFunc: request.getNamespacesUsingGET,
        parameters: { clusterIdx: this.$route.params.id },
        valueKey: 'clusterIdx',
      },

      yamlEditClusterSelectMeta: {
        requestFunc: request.getClustersUsingGET,
      },

      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
      headers: [
        {
          text: 'Name',
          align: 'left',
          value: 'name',
          class: 'w-30',
        },
        {
          text: 'Namespace',
          align: 'left',
          value: 'namespace',
          class: 'w-20',
        },
        {
          text: 'Labels',
          align: 'left',
          value: 'label',
          class: 'w-30',
        },
        {
          text: 'Age',
          align: 'center',
          value: 'age',
          class: 'w-20',
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
        itemKey: 'configMapIdx',
      },
      isLoading: false,
      clusterIdx: null,
    }
  },

  async created() {
    this.clusterIdx = this.$route.params.id
    this.isLoading = true
    await this.initMultiSelectState() // 멀티셀렉트 데이터 초기화
    this.initSecretState()
    this.getListData()
    this.isLoading = false
  },

  computed: {
    ...multiSelectMapUtils.mapGetters(['firstValue']), // 첫번째, 두번째, 세번째 셀렉트 박스에서 선택된 항목의 value(multiSelect.js)
    ...secretUtils.mapGetters(['dataList']), // replicaSetList.js에 저장된 dataList 값 반환(replicaSetList.js)
    ...secretUtils.mapGetters(['dataListSize']), // replicaSetList.js에 저장된 dataListSize 값 반환(replicaSetList.js)
    getParameter() {
      return {
        clusterIdx: this.$route.params.id,
      }
    },
  },

  methods: {
    ...multiSelectMapUtils.mapMutations(['initMultiSelectState']), // state 데이터 초기화(multiSelect.js)

    ...secretUtils.mapActions(['getList']), // 리스트 조회 요청
    ...secretUtils.mapActions(['createSecret']), // Secret 생성 요청
    ...secretUtils.mapMutations(['initSecretState']), // state 데이터 초기화
    ...secretUtils.mapMutations(['initSecretList']), // 데이터 리스트 초기화

    ...yamlEditModalMapUtils.mapMutations(['openModal', 'closeModal']), // yaml에디트모달창 열기(yamlEditModal.js)
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

    // 서치 박스의 버튼 클릭 시 호출됨
    onClickButton() {
      // console.log('clicked button')
    },

    // 서치 박스 입력값 변경 시 호출됨
    onInputSearchValue(value) {
      console.log('searchValue:', value)
      this.searchValue = value
    },

    // 리스트 조회 요청
    async getListData() {
      // 조회 요청에서 필요한 parameter 세팅(호출한 api 파라미터 형태에 맞춰서 커스텀하게 생성)
      // 페이징 호출 관련 파라미터 세팅과 동작은 getList(replicaSet.js) 메서드와 common.js의 api 객체 참고
      const params = this.getParameter
      console.log('[params]::', params)
      if (params.clusterIdx) {
        await this.getList(params)
      } else {
        this.initSecretList()
      }
    },

    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { name, namespace } = data
      console.log('secret info === ', data)
      if (name && namespace) {
        this.$router.push(
          `/cluster/detail/${this.clusterIdx}/secret/${namespace}/${name}`,
        )
      }
    },
    // 셀렉트 박스의 선택 항목이 변결될 때마다 호출된다.
    // value 속성키 {firstVaue, secondValue, thirdValue}
    async onChangeItem(value) {
      await this.getListData(value)
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
.padding-10 {
  padding: 10px;
}

.yarm-edit-modal {
  width: 980px;
}
</style>
