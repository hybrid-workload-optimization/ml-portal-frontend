<template>
  <div class="sp-list-content">
    <select-button
      btnName="New CronJob"
      :firstSelectMeta="firstSelectMeta"
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
      title="CronJob이 존재하지 않습니다."
      description=""
    />

    <!-- yaml 에디터 모달 -->
    <yaml-edit-modal ref="yamlEditor" @confirmed="onConfirmedFromEditModal" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import SelectButton from '@/components/SelectButton.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import Search from '@/components/molcule/DataTableSearch.vue'
import request from '@/lib/request'

const cronJobMapUtils = createNamespacedHelpers('cronJob')
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
      searchValue: null,
      firstSelectMeta: {
        requestFunc: request.getNamespacesUsingGET,
        parameters: { clusterIdx: this.$route.params.id },
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
          text: 'Schedule',
          align: 'center',
          value: 'schedule',
          class: 'w-10',
        },
        {
          text: 'Pause',
          align: 'center',
          value: 'pause',
          class: 'w-10',
        },
        {
          text: 'Last Schedule',
          align: 'center',
          value: 'age',
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
      clusterIdx: null,
    }
  },
  async created() {
    this.clusterIdx = this.$route.params.id
    this.isLoading = true
    await this.initMultiSelectState() // 멀티셀렉트 데이터 초기화
    this.initCronJobState() // 스테이트풀셋 데이터 초기화
    this.getListData()
    this.isLoading = false
  },
  computed: {
    ...cronJobMapUtils.mapGetters(['dataList', 'dataListSize']),
    ...multiSelectMapUtils.mapGetters(['firstValue']),
    getParameters() {
      return {
        clusterIdx: this.$route.params.id,
        namespaceIdx: this.firstValue,
      }
    },
  },
  methods: {
    ...multiSelectMapUtils.mapMutations(['initMultiSelectState']),

    ...cronJobMapUtils.mapMutations([
      'initCronJobState',
      'initCronJobDataList',
    ]),
    ...cronJobMapUtils.mapActions(['getList', 'createCronJob']),

    ...yamlEditModalMapUtils.mapMutations(['openModal']),
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
        title: 'New CronJob',
        resourceType: 'CronJob',
      })
    },

    // 리스트 조회 요청
    async getListData() {
      if (this.getParameters.clusterIdx) {
        await this.getList(this.getParameters)
      } else {
        this.initCronJobDataList()
      }
    },
    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { idx } = data
      if (idx) {
        // this.$router.replace({
        //   name: this.$route.name,
        //   // hash: '#resource',
        //   hash: this.$route.hash,
        //   params: {
        //     id: idx,
        //   },
        //   query: { detail: true },
        // })
        this.$router.push(`/cluster/detail/${this.clusterIdx}/cron-job/${idx}`)
      }
    },
    // 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromEditModal(value) {
      const idx = this.$route.params.id
      const { encodedContent } = value
      try {
        const param = {
          clusterIdx: idx,
          yaml: encodedContent,
        }
        await this.createCronJob(param)
        this.openAlert({ title: '리소스가 생성 되었습니다.', type: 'info' })
        this.getListData()
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
