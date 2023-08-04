<template>
  <sp-card class="sp-overview" :class="{ isMini }" elevation="0">
    <div class="overview-header">Namespace</div>
    <div class="sp-list-content" style="height: 400px">
      <!-- 조회 내용이 존재할 때, 그리드 표시 -->
      <sp-table
        v-if="data"
        :headers="headers"
        :datas="data"
        :options="options"
        :search="searchValue"
        :custom-slot-info="customSlotInfo"
        :scrollOnly="true"
        :items-per-page="9999"
        :hide-default-footer="true"
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
        v-else
        title="clusterNamespace가 존재하지 않습니다."
        description=""
      />
    </div>
  </sp-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const clusterNamespaceMapUtils = createNamespacedHelpers('clusterNamespace')
const clusterMapUtils = createNamespacedHelpers('cluster')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')

const headers = [
  { text: 'Name', align: 'left', value: 'name', width: 200 },
  { text: 'Status', align: 'center', value: 'status' },
  { text: 'Pod', align: 'center', value: 'podStatus', width: 150 },
  { text: 'CPU Request', align: 'center', value: 'cpuRequest' },
  { text: 'Memory Request', align: 'center', value: 'memRequest' },
  { text: 'CPU Limit', align: 'center', value: 'cpuLimit' },
  { text: 'Memory Limit', align: 'center', value: 'memLimit' },
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

      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
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
      customSlotInfo,
    }
  },
  created() {
    this.checkProjectAuth()
    this.getListData()
    console.log(this.data)
  },
  computed: {
    ...clusterNamespaceMapUtils.mapGetters(['dataList', 'dataListSize']),
    ...clusterMapUtils.mapGetters(['dataDetail']),
    getChipEachColor() {
      return status => this.getChipColor(status)
    },
    getStatusText() {
      return status => (status !== 'Active' ? 'Inactive' : status)
    },
    processedData() {
      return this.data.map(item => ({
        ...item,
        role: item.role[0],
        cpuUsage: `(${item.usageDto.cpuRequests}Core / ${item.usageDto.cpuCapacity}Core)`,
        memoryUsage: `(${item.usageDto.memoryRequests}G / ${item.usageDto.memoryCapacity}G)`,
      }))
    },
  },
  methods: {
    ...clusterNamespaceMapUtils.mapMutations(['initClusterNamespaceDataList']),
    ...clusterNamespaceMapUtils.mapActions([
      'getList',
      'createClusterNamespace',
    ]),

    ...yamlEditModalMapUtils.mapMutations(['openModal', 'initModalContent']),
    ...alertMapUtils.mapMutations(['openAlert']),

    // 서치 박스의 버튼 클릭 시 호출됨
    onClickButton() {
      console.log('clicked button')
    },
    // 서치 박스 입력값 변경 시 호출됨
    onInputSearchValue(value) {
      console.log('searchValue:', value)
      this.searchValue = value
    },
    openYamlEditor() {
      // editType: 에디터 타입(create/update)
      // isEncoding: content가 인코딩 되어 있는지 여부
      // content: 에디터에 설정할 텍스트 초기값
      this.openModal({
        editType: 'create',
        isEncoding: false,
        content: '',
        title: 'New Namespace',
        resourceType: 'namespace',
      })
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
        this.$router.push({
          name: this.$route.name,
          hash: '#namespace',
          query: { namespaceId: id, detail: true },
        })
      }
    },

    // 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedCreateModal(item) {
      const { clusterIdx } = this.dataDetail
      const { encodedContent } = item
      try {
        const param = {
          clusterIdx,
          yaml: encodedContent,
        }
        await this.createClusterNamespace(param)
        this.openAlert({ title: '생성 성공했습니다.', type: 'info' })
        this.getListData()
      } catch (error) {
        this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
      }
    },
    getChipColor(statusText) {
      console.log('statusText:::', statusText)
      let status = ''
      if (statusText === 'Active') {
        status = 'On'
      } else {
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
    this.initModalContent()
  },
}
</script>

<style lang="scss"></style>
