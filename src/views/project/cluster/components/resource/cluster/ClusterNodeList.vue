<template>
  <div class="sp-list-content">
    <div class="search-wrapper">
      <search
        :title="'Total:'"
        :todoCount="dataListSize.toString()"
        :buttonText="'New Node'"
        :isDisabled="!isProjectAuth"
        @input="onInputSearchValue"
        @click="onClickButton"
      >
      </search>
    </div>

    <!-- 조회 내용이 존재할 때, 그리드 표시 -->
    <div class="table-wrapper">
      <sp-table
        v-if="dataListSize"
        :headers="headers"
        :datas="dataList"
        :options="options"
        :search="searchValue"
        :custom-slot-info="customSlotInfo"
        is-linked
        @click:row="moveToDetailPage"
      >
        <template v-slot:status_custom="slotProps">
          <sp-chip
            :color="getChipEachColor(slotProps.item.status)"
            class="status-chip"
          >
            {{ getStatusText(slotProps.item.status) }}
          </sp-chip>
        </template>
      </sp-table>

      <!-- 조회 내용이 존재하지 않을 때, 내용 표시(optionl) -->
      <empty
        v-else-if="!isLoading"
        title="clusterNode가 존재하지 않습니다."
        description=""
      />
    </div>
  </div>
</template>

<script>
import Search from '@/components/molcule/DataTableSearch.vue'
import { createNamespacedHelpers } from 'vuex'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const clusterMapUtils = createNamespacedHelpers('cluster')
const clusterNodeMapUtils = createNamespacedHelpers('clusterNode')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
// const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    Search,
    spTable,
    Empty,
  },
  props: {
    clusterId: Number,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      searchValue: '',

      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
      headers: [
        {
          text: 'Host name',
          // align: 'center',
          value: 'name',
        },
        {
          text: 'IP',
          align: 'center',
          value: 'ip',
        },
        {
          text: 'Role',
          align: 'center',
          value: 'role',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
        },
        {
          text: 'K8S Version',
          align: 'center',
          value: 'k8sVersion',
        },
        {
          text: 'Allocated CPU',
          align: 'center',
          value: 'allocatedCpu',
        },
        {
          text: 'Allocated Memory',
          align: 'center',
          value: 'allocatedMemory',
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
        fixedHeader: false,
        showSelect: false,
        itemKey: 'id',
      },
      customSlotInfo: [{ name: 'status', slotName: 'status' }],
    }
  },
  async created() {
    this.isLoading = true
    await this.getListData()
    this.checkProjectAuth(this.dataDetail.projectIdx)
    this.isLoading = false
  },
  computed: {
    ...clusterMapUtils.mapGetters(['dataDetail']),
    ...clusterNodeMapUtils.mapGetters(['dataList', 'dataListSize']),
    getChipEachColor() {
      return status => this.getChipColor(status)
    },
    getStatusText() {
      return status => (status ? 'Power on' : 'Power off')
    },
  },
  methods: {
    ...clusterNodeMapUtils.mapActions(['getList']),
    ...clusterNodeMapUtils.mapMutations(['initClusterNodeDataList']),

    ...yamlEditModalMapUtils.mapMutations(['openModal']),
    // ...alertMapUtils.mapMutations(['openAlert']),

    // 서치 박스의 버튼 클릭 시 호출됨
    onClickButton() {
      this.$router.push(`/cluster/edit/${this.$route.params.id}`)
    },
    // 서치 박스 입력값 변경 시 호출됨
    onInputSearchValue(value) {
      console.log('searchValue:', value)
      this.searchValue = value
    },
    // yaml 에디터 모달 오픈
    openYamlEditor() {
      this.openModal({ isEncoding: true, content: '' })
    },
    getParameters() {
      return {
        clusterIdx: this.clusterId,
        name: this.searchValue,
      }
    },
    // 리스트 조회 요청
    async getListData() {
      await this.getList(this.getParameters())
    },
    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { id } = data

      if (id) {
        this.$router.replace({
          name: this.$route.name,
          hash: '#node',
          query: { clusterNodeId: id, detail: true },
        })
      }
    },
    getChipColor(statusText) {
      console.log('Status Text: ', statusText)
      let status = ''
      if (statusText) {
        status = 'On'
      } else if (statusText) {
        status = 'Off'
      }
      const STATUS = {
        On: '#00BA88',
        Off: '#1A3350',
      }
      return STATUS[status]
    },
  },
  beforeDestroy() {
    this.initClusterNodeDataList()
  },
}
</script>

<style lang="scss"></style>
