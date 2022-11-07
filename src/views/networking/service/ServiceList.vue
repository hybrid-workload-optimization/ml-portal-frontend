<template>
  <div class="sp-list-content">
    <multi-select
      :btnName="'New Service'"
      :firstSelectMeta="firstSelectMeta"
      :secondSelectMeta="secodSelectMeta"
      :thirdSelectMeta="thirdSelectMeta"
      @clickBtn="openYamlEditor"
      @changeItem="onChangeItem"
    />

    <search
      v-if="serviceListSize"
      class="top-search-wrapper"
      :title="'Total:'"
      :todoCount="serviceListSize.toString()"
      @input="onInputSearchValue"
    >
    </search>

    <sp-table
      v-if="serviceList.length"
      class="table-wrapper"
      :headers="headers"
      :datas="serviceList"
      :options="options"
      :search="searchValue"
      isLinked
      @click:row="moveToDetailPage"
    />

    <empty
      v-else-if="!isLoading"
      class="table-wrapper"
      title="생성된 Service가 존재하지 않습니다."
      description="새로운 서비스를 생성하려면 [New Service] 버튼을 클릭하세요."
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

const serviceMapUtils = createNamespacedHelpers('service')
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
          text: 'Type',
          align: 'left',
          value: 'type',
          class: 'w-10',
        },
        {
          text: 'Endpoint',
          align: 'left',
          value: 'internalEndpoint',
          class: 'w-10',
        },
        {
          text: 'Age',
          align: 'left',
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
        itemKey: 'id',
      },
      isLoading: false,
    }
  },

  created() {
    this.isLoading = true
    // this.initMultiSelectState()
    this.initServiceState()
  },

  computed: {
    ...serviceMapUtils.mapGetters(['serviceList', 'serviceListSize']),
  },

  methods: {
    ...multiSelectMapUtils.mapGetters(['secondValue']),
    ...multiSelectMapUtils.mapGetters(['thirdValue']),
    ...multiSelectMapUtils.mapMutations(['initMultiSelectState']),
    ...serviceMapUtils.mapMutations(['initServiceState']),
    ...serviceMapUtils.mapMutations(['initServiceDataList']),
    ...serviceMapUtils.mapActions(['getServiceList', 'createService']),
    ...yamlEditModalMapUtils.mapMutations(['openModal']),
    ...alertMapUtils.mapMutations(['openAlert']),

    onInputSearchValue(value) {
      this.searchValue = value
    },
    openYamlEditor() {
      this.openModal({
        editType: 'create',
        isEncoding: false,
        content: '',
        title: 'New Service',
        resourceType: 'service',
      })
    },
    async getListData(value) {
      console.log(value.thirdValue)
      const param = {
        clusterIdx: value.secondValue,
        namespaceIdx: value.thirdValue,
      }
      await this.getServiceList(param)
    },
    moveToDetailPage(data) {
      const { id } = data
      if (id) {
        this.$router.push(`/network/service/detail/${id}`)
      }
    },
    async onConfirmedFromEditModal(value) {
      const idx = this.secondValue()
      const { encodedContent } = value

      try {
        const param = {
          clusterIdx: idx,
          yaml: encodedContent,
        }

        const response = await this.createService(param)

        if (response.status === 201) {
          this.openAlert({
            title: '리소스가 생성 되었습니다.',
            type: 'info',
          })
          if (this.secondValue() || this.thirdValue()) {
            const val = {
              secondValue: this.secondValue(),
              thirdValue: this.thirdValue(),
            }
            this.getListData(val)
          }
        } else {
          this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
          console.error(response.data.message)
        }
      } catch (error) {
        this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
        console.error(error)
      }
    },
    onChangeItem(value) {
      if (value.secondValue) {
        this.getListData(value)
      } else {
        this.initServiceDataList()
      }
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
