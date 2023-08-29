<template>
  <div class="sp-list-content">
    <multi-select
      btnName="New Pod"
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
      title="Pod가 존재하지 않습니다."
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

const podMapUtils = createNamespacedHelpers('pod')
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
          text: 'Node',
          align: 'left',
          value: 'node',
          class: 'w-10',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
          class: 'w-10',
        },
        {
          text: 'Restart',
          align: 'center',
          value: 'restart',
          class: 'w-10',
        },
        {
          text: 'CPU',
          align: 'center',
          value: 'cpu',
          class: 'w-10',
        },
        {
          text: 'Memory',
          align: 'center',
          value: 'memory',
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
    this.initPodState() // 스테이트풀셋 데이터 초기화
    this.getListData()
  },
  computed: {
    ...multiSelectMapUtils.mapGetters([
      'firstValue',
      'secondValue',
      'thirdValue',
    ]),
    ...podMapUtils.mapGetters(['dataList', 'dataListSize']),
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

    ...podMapUtils.mapMutations(['initPodState', 'initPodDataList']),
    ...podMapUtils.mapActions(['getList', 'createPod']),

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
        title: 'New Pod',
        resourceType: 'pod',
      })
    },

    // 리스트 조회 요청
    async getListData() {
      if (this.getParameters.clusterIdx) {
        await this.getList(this.getParameters)
      } else {
        this.initPodDataList()
      }
    },
    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { name, namespace } = data
      if (name) {
        this.$router.push(
          `/workload/pod/detail/${this.getParameters.clusterIdx}/${namespace}/${name}`,
        )
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
        await this.createPod(param)
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

<style lang="scss" scoped>
.margin-bottom-20 {
  margin-bottom: 20px;
}
.padding-10 {
  padding: 10px;
}
</style>
