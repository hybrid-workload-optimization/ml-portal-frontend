<template>
  <div class="sp-list-content">
    <select-button
      :btnName="'New Deployment'"
      :firstSelectMeta="firstSelectMeta"
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
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import request from '@/lib/request'
import Search from '@/components/molcule/DataTableSearch.vue'
import SelectButton from '@/components/SelectButton.vue'

const deploymentMapUtils = createNamespacedHelpers('deployment')
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
      clusterIdx: null,
    }
  },

  async created() {
    this.clusterIdx = this.$route.params.id
    this.isLoading = true
    this.initDeployment()
    await this.initMultiSelectState()
    await this.getListData()
    this.isLoading = false
  },

  computed: {
    ...deploymentMapUtils.mapGetters(['deploymentList']),
    ...multiSelectMapUtils.mapGetters(['firstValue']),
    getParameters() {
      return {
        clusterIdx: this.$route.params.id,
        namespaceId: this.firstValue,
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

    ...yamlEditModalMapUtils.mapMutations(['openModal', 'closeModal']),
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
      console.log(data)
      console.log(idx)
      // const { namespace, name } = data
      if (idx) {
        // this.$router.replace({
        //   name: this.$route.name,
        //   // hash: '#resource',
        //   hash: this.$route.hash,
        //   params: {
        //     clusterIdx: idx,
        //     namespace,
        //     name,
        //   },
        //   query: { detail: true },
        // })
        // this.$router.push(
        // `/cluster/detail/${this.clusterIdx}/Deployment/${namespace}/${name}`,
        // )
        this.$router.push(
          `/cluster/detail/${this.clusterIdx}/deployment/${idx}`,
        )
      }
    },

    async onConfirmedFromEditModal(value) {
      const idx = this.$route.params.id
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
        this.getListData()
        this.closeModal()
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
.v-select {
  width: 30%;
}
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
