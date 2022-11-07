<template>
  <div class="sp-list-content">
    <search
      :title="'Total:'"
      :todoCount="dataListSize.toString()"
      :buttonText="'New PersistentVolume'"
      :isDisabled="!isProjectAuth"
      @input="onInputSearchValue"
      @click="openYamlEditor"
    >
    </search>

    <div class="table-wrapper">
      <!-- 조회 내용이 존재할 때, 그리드 표시 -->
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
            {{ slotProps.item.status }}
          </sp-chip>
        </template>
      </sp-table>

      <!-- 조회 내용이 존재하지 않을 때, 내용 표시(optionl) -->
      <empty
        v-else-if="!isLoading"
        title="clusterPersistentVolume가 존재하지 않습니다."
        description=""
      />
    </div>

    <!-- yaml 에디터 모달 -->
    <yaml-edit-modal ref="yamlEditor" @confirmed="onConfirmedFromCreateModal" />
  </div>
</template>

<script>
import Search from '@/components/molcule/DataTableSearch.vue'
import { createNamespacedHelpers } from 'vuex'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const clusterPersistentVolumeMapUtils = createNamespacedHelpers(
  'clusterPersistentVolume',
)
const clusterMapUtils = createNamespacedHelpers('cluster')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    Search,
    spTable,
    Empty,
    YamlEditModal,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      searchValue: '',

      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
      headers: [
        {
          text: 'Name',
          align: 'left',
          value: 'name',
        },
        {
          text: 'Capacity',
          align: 'center',
          value: 'size',
        },
        {
          text: 'Access Modes',
          align: 'center',
          value: 'accessMode',
        },
        {
          text: 'Reclaim Policy',
          align: 'center',
          value: 'reclaimPolicy',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
        },
        {
          text: 'Claim',
          align: 'center',
          value: 'claim',
        },
        {
          text: 'Storage Class',
          align: 'center',
          value: 'storageClassName',
        },
        {
          text: 'Age',
          align: 'center',
          value: 'createdAt',
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
      isLoading: false,
    }
  },
  async created() {
    this.checkProjectAuth(this.dataDetail.projectIdx)
    this.isLoading = true
    await this.getListData()
    this.isLoading = false
  },
  computed: {
    ...clusterPersistentVolumeMapUtils.mapGetters(['dataList', 'dataListSize']),
    ...clusterMapUtils.mapGetters(['dataDetail']),
    getChipEachColor() {
      return status => this.getChipColor(status)
    },
  },
  methods: {
    ...clusterPersistentVolumeMapUtils.mapMutations([
      'initClusterPersistentVolumeDataList',
    ]),
    ...clusterPersistentVolumeMapUtils.mapActions([
      'getList',
      'createClusterPersistentVolume',
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
    // yaml 에디터 모달 오픈
    openYamlEditor() {
      // editType: 에디터 타입(create/update)
      // isEncoding: content가 인코딩 되어 있는지 여부
      // content: 에디터에 설정할 텍스트 초기값
      this.openModal({
        editType: 'create',
        isEncoding: false,
        content: '',
        title: 'New Persistent Volume',
        resourceType: 'persistentVolume',
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
          hash: '#persistentVolume',
          query: { persistentVolumeId: id, detail: true },
        })
      }
    },

    // 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromCreateModal(item) {
      const { clusterIdx } = this.dataDetail
      const { encodedContent } = item
      try {
        const param = {
          clusterIdx,
          yaml: encodedContent,
        }
        await this.createClusterPersistentVolume(param)
        this.openAlert({ title: '생성 성공했습니다.', type: 'info' })
        this.getListData()
      } catch (error) {
        this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
      }
    },
    getChipColor(statusText) {
      console.log('statusText:::', statusText)
      let status = ''
      if (statusText === 'Available') {
        status = 'Available'
      } else if (statusText === 'Bound') {
        status = 'Bound'
      } else if (statusText === 'Failed') {
        status = 'Failed'
      } else {
        status = 'Pending'
      }
      const STATUS = {
        Available: '#00BA88',
        Bound: '#8C98A7',
        Failed: '#EA1606',
        Pending: '#FF8000',
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
