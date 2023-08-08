<template>
  <sp-card class="sp-overview" :class="{ isMini }" elevation="0">
    <div class="overview-header">
      Nodes
      <!-- <span class="color-red"> (Cluster Autoscaler = On/Off)</span> -->
    </div>
    <div class="sp-list-content">
      <!-- 조회 내용이 존재할 때, 그리드 표시 -->
      <div class="table-wrapper">
        <sp-table
          v-if="data"
          :headers="headers"
          :datas="processedData"
          :options="options"
          :search="searchValue"
          :custom-slot-info="customSlotInfo"
          :scrollOnly="true"
          :items-per-page="9999"
          is-linked
          @click:row="moveToDetailPage"
          :height="245"
          dense
        >
          <template v-slot:status_custom="slotProps">
            <sp-chip
              :color="getChipEachColor(slotProps.item.status)"
              class="status-chip"
              small
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
  </sp-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const clusterMapUtils = createNamespacedHelpers('cluster')
const clusterNodeMapUtils = createNamespacedHelpers('clusterNode')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
// const alertMapUtils = createNamespacedHelpers('alert')

// 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
const headers = [
  { text: 'Name', value: 'name', width: 180 },
  { text: 'IP', align: 'center', value: 'ip' },
  { text: 'Role', align: 'center', value: 'role', width: 150 },
  { text: 'Status', align: 'center', value: 'status' },
  { text: 'Pod', align: 'center', value: 'podStatus' },
  {
    text: 'CPU(Request/Allocatable)',
    align: 'center',
    value: 'cpuUsage',
    width: 300,
  },
  {
    text: 'Memory(Request/Allocatable)',
    align: 'center',
    value: 'memoryUsage',
    width: 300,
  },
]
const customSlotInfo = [{ name: 'status', slotName: 'status' }]

export default {
  components: {
    spTable,
    Empty,
  },
  props: {
    data: {
      type: Array,
    },
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      searchValue: '',
      headers,
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
      customDatas: [],
      customSlotInfo,
    }
  },
  async created() {
    this.isLoading = true
    await this.getListData()
    this.checkProjectAuth(this.dataDetail.projectIdx)
    this.isLoading = false
    console.log(this.data)
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
    processedData() {
      return this.data.map(item => ({
        ...item,
        role: item.role[0],
        cpuUsage: `${item.usageDto.cpuRequestsFraction}%
                  (${item.usageDto.cpuRequests / 1000}Core /
                    ${item.usageDto.cpuCapacity / 1000}Core)`,
        memoryUsage: `${item.usageDto.memoryRequestsFraction.toFixed(1)}%
                  (${this.bytesToGB(item.usageDto.memoryRequests)}G /
                  ${this.bytesToGB(item.usageDto.memoryCapacity)}G)`,
      }))
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
        clusterIdx: this.$route.params.id,
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

    bytesToGB(bytes) {
      const GB = bytes / (1024 * 1024 * 1024)
      return parseFloat(GB.toFixed(1)) // 소수점 이하 두 자리까지 표시
    },
  },
  beforeDestroy() {
    this.initClusterNodeDataList()
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  .theme--light.v-data-table.v-data-table--fixed-header thead th {
    background-color: #eee !important;
  }
  .sp-data-table .v-data-table__wrapper {
    background-color: #fff !important;
  }
  .sp-data-table .v-data-table__wrapper tbody tr:nth-child(odd) {
    background-color: #fff !important;
  }
}
</style>
