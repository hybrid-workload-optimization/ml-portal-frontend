<template>
  <div class="sp-list-content">
    <multi-select
      btnName="New Job"
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
    <!-- 조회 내용이 존재할 때, 그리드 표시 -->
    <sp-table
      v-if="dataListSize"
      class="table-wrapper"
      :headers="headers"
      :datas="dataList"
      :options="options"
      :search="searchValue"
      is-linked
      @click:row="moveToDetailPage"
    />

    <!-- 조회 내용이 존재하지 않을 때, 내용 표시(optionl) -->
    <empty
      v-else-if="!isLoading"
      class="table-wrapper"
      title="Job이 존재하지 않습니다."
      description=""
    />

    <!-- yaml 에디터 모달 -->
    <yaml-edit-modal ref="yamlEditor" @confirmed="onConfirmedFromEditModal" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import MultiSelect from '@/components/MultiSelect.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import Search from '@/components/molcule/DataTableSearch.vue'
import request from '@/lib/request'

const jobMapUtils = createNamespacedHelpers('job')
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
      searchValue: null,
      firstSelectMeta: {
        requestFunc: request.getProjectsUsingGET,
      },
      secodSelectMeta: {
        requestFunc: request.getClustersUsingGET,
        parameters: { projectIdx: '' },
        valueKey: 'projectIdx',
      },
      thirdSelectMeta: {
        requestFunc: request.getNamespacesUsingGET,
        parameters: { clusterIdx: '' },
        valueKey: 'clusterIdx',
      },
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
          text: 'Created At',
          align: 'center',
          value: 'createdAt',
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
        fixedHeader: false,
        showSelect: false,
        itemKey: 'id',
      },
      isLoading: false,
    }
  },
  async created() {
    this.isLoading = true
    await this.initMultiSelectState() // 멀티셀렉트 데이터 초기화
    this.initJobState() // 스테이트풀셋 데이터 초기화
    this.getListData()
  },
  computed: {
    ...multiSelectMapUtils.mapGetters([
      'firstValue',
      'secondValue',
      'thirdValue',
    ]),
    ...jobMapUtils.mapGetters(['dataList', 'dataListSize']),
    getParameters() {
      return {
        projectId: this.firstValue,
        clusterIdx: this.secondValue,
        namespaceIdx: this.thirdValue,
      }
    },
  },
  methods: {
    ...multiSelectMapUtils.mapMutations(['initMultiSelectState']),

    ...jobMapUtils.mapMutations(['initJobState', 'initJobDataList']),
    ...jobMapUtils.mapActions(['getList', 'createJob']),

    ...yamlEditModalMapUtils.mapMutations(['openModal', 'closeModal']),
    ...alertMapUtils.mapMutations(['openAlert']),

    onInputSearchValue(value) {
      this.searchValue = value
    },
    // yaml 에디터 모달 오픈
    openYamlEditor() {
      this.openModal({
        editType: 'create',
        isEncoding: false,
        content: '',
        title: 'New Job',
        resourceType: 'job',
      })
    },
    // 리스트 조회 요청
    async getListData() {
      if (this.getParameters.clusterIdx) {
        // 두번째 or 세번째 선택 값이 있을 경우만 조회한다.
        await this.getList(this.getParameters)
      } else {
        // 데이터 리스트 초기화
        this.initJobDataList()
      }
    },
    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { idx } = data
      if (idx) {
        this.$router.push(`/workload/job/detail/${idx}`)
      }
    },
    // 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromEditModal(value) {
      const idx = this.secondValue
      const { encodedContent } = value
      try {
        const param = {
          clusterIdx: idx,
          yaml: encodedContent,
        }

        console.log('param === ', param)
        const response = await this.createJob(param)
        console.log('response === ', response)
        this.openAlert({ title: '리소스가 생성 되었습니다.', type: 'info' })
        this.getListData()
        this.closeModal()
      } catch (error) {
        this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
      }
    },
    async onChangeItem() {
      await this.getListData()
      this.isLoading = false
    },
  },
}
</script>
