<template>
  <div class="sp-list-content">
    <multi-select
      :btnName="'New Deployment'"
      :firstSelectMeta="firstSelectMeta"
      :secondSelectMeta="secodSelectMeta"
      :thirdSelectMeta="thirdSelectMeta"
      @clickBtn="openYamlEditor"
      @changeItem="onChangeItem"
    />

    <search
      v-if="deploymentList.length"
      class="top-search-wrapper"
      :title="'Total:'"
      :todoCount="deploymentList.length.toString()"
      @input="onInputSearchValue"
    >
    </search>

    <sp-table
      v-if="deploymentList.length"
      class="table-wrapper"
      :headers="headers"
      :datas="deploymentList"
      :options="options"
      :search="searchValue"
      isLinked
      @click:row="moveToDetailPage"
    />

    <empty
      v-else-if="!isLoading"
      title="생성된 Deployment가 존재하지 않습니다."
      class="table-wrapper"
      description=""
    />

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

const deploymentMapUtils = createNamespacedHelpers('deployment')
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
          text: 'Age',
          align: 'center',
          value: 'age',
          class: 'w-10',
        },
      ],
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
        itemKey: 'idx',
      },
      isLoading: false,
    }
  },

  async created() {
    this.isLoading = true
    this.initDeployment()
    await this.initMultiSelectState()
    await this.getListData()
    this.isLoading = false
  },

  computed: {
    ...deploymentMapUtils.mapGetters(['deploymentList']),
    ...multiSelectMapUtils.mapGetters([
      'firstValue',
      'secondValue',
      'thirdValue',
    ]),
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

    ...deploymentMapUtils.mapActions(['getDeploymentList', 'createDeployment']),
    ...deploymentMapUtils.mapMutations([
      'initDeployment',
      'initDeploymentList',
    ]),

    ...yamlEditModalMapUtils.mapMutations(['openModal']),
    ...alertMapUtils.mapMutations(['openAlert']),

    onClickButton() {
      console.log('clicked button')
    },

    onInputSearchValue(value) {
      this.searchValue = value
    },

    openYamlEditor() {
      this.openModal({
        editType: 'create',
        isEncoding: false,
        content: '',
        title: 'New Deployment',
        resourceType: 'deployment',
      })
    },

    async getListData() {
      this.initDeploymentList()
      if (this.getParameters.clusterIdx) {
        await this.getDeploymentList(this.getParameters)
      }
    },

    moveToDetailPage(data) {
      const { idx } = data
      if (idx) {
        this.$router.push(`/workload/deployment/detail/${idx}`)
      }
    },

    async onConfirmedFromEditModal(value) {
      const idx = this.secondValue
      const { encodedContent } = value

      try {
        const param = {
          clusterIdx: idx,
          yaml: encodedContent,
        }

        await this.createDeployment(param)

        // 생성 성공 시
        this.openAlert({
          title: '리소스가 생성 되었습니다.',
          type: 'info',
        })

        if (this.secondValue || this.thirdValue) {
          this.getListData()
        }
      } catch (error) {
        this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
        console.error(error)
      }
    },
    onChangeItem() {
      this.getListData()
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
