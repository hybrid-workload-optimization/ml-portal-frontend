<template>
  <div class="sp-list-content">
    <search
      class="sp-list-content__search-input"
      :title="'Total:'"
      :todoCount="dataListSize.toString()"
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
        <template #status_custom="slotProps">
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
  </div>
</template>

<script>
import Search from '@/components/molcule/DataTableSearch.vue'
import { createNamespacedHelpers } from 'vuex'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const clusterNamespaceMapUtils = createNamespacedHelpers('clusterNamespace')
const clusterMapUtils = createNamespacedHelpers('cluster')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    Search,
    spTable,
    Empty,
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
          text: 'Lables',
          align: 'left',
          value: 'label',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
        },
        {
          text: 'Created At',
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
      clusterIdx: null,
    }
  },
  created() {
    this.clusterIdx = this.$route.params.id
    this.checkProjectAuth()
    this.getListData()
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
  },
  methods: {
    ...clusterNamespaceMapUtils.mapMutations(['initClusterNamespaceDataList']),
    ...clusterNamespaceMapUtils.mapActions([
      'getList',
      'createClusterNamespace',
    ]),
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
      const { name } = data
      if (name) {
        // this.$router.push({
        //   name: this.$route.name,
        //   // hash: '#namespace',
        //   hash: this.$route.hash,
        //   query: { namespaceId: id, detail: true },
        // })

        this.$router.push(
          `/cluster/detail/${this.clusterIdx}/namespace/${name}`,
        )
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
}
</script>

<style lang="scss"></style>
