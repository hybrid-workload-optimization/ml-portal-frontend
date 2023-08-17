<template>
  <div class="sp-list-content">
    <div class="search-wrapper">
      <!-- <search
        :title="'Total:'"
        :todoCount="dataListSize.toString()"
        :buttonText="'New Node'"
        :isDisabled="!isProjectAuth"
        @input="onInputSearchValue"
        @click="onClickButton"
      >
      </search> -->
      <search
        :title="'Total:'"
        :todoCount="dataListSize.toString()"
        @input="onInputSearchValue"
        @click="onClickButton"
      >
      </search>
      <!-- <smart-search
        :placeholder="0$t('instance.placeholder.search')"
        :items="headers"
        :datas="instanceList"
        density="compact"
        search-tag
        @update:search="searchDatas"
      ></smart-search> -->

      <smart-search
        :items="headers"
        :datas="dataList"
        density="compact"
        @update:search="searchDatas"
      ></smart-search>
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
import SmartSearch from '@/components/SmartSearch.vue'

const workloadMapUtils = createNamespacedHelpers('clusterWorkload')
// const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    Search,
    SmartSearch,
    spTable,
    Empty,
  },
  props: {
    clusterId: Number,
  },
  data() {
    return {
      searchValue: '',
      searchDatas: [],
      searchTag: true,
      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
      headers: [
        {
          text: 'Name',
          // align: 'center',
          value: 'name',
        },
        {
          text: 'Namespace',
          align: 'center',
          value: 'namespace',
        },
        {
          text: 'Kind',
          align: 'center',
          value: 'kind',
        },
        {
          text: 'Health',
          align: 'center',
          value: 'health',
        },
        {
          text: 'Pods',
          align: 'center',
          value: 'podCountTotal',
        },
        {
          text: 'Created',
          align: 'center',
          value: 'createAt',
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
  async created() {
    this.isLoading = true
    this.clusterIdx = this.$route.params.id
    await this.getListData()
    this.isLoading = false
  },
  computed: {
    ...workloadMapUtils.mapGetters(['dataList', 'dataListSize']),
    getChipEachColor() {
      return status => this.getChipColor(status)
    },
    getStatusText() {
      return status => (status ? 'Power on' : 'Power off')
    },
  },
  methods: {
    ...workloadMapUtils.mapActions(['getDataList']),
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
    getParameters() {
      return {
        clusterIdx: this.$route.params.id,
      }
    },
    // 리스트 조회 요청
    async getListData() {
      await this.getDataList(this.getParameters())
    },
    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { uid, kind, name, namespace } = data
      console.log('workload list item:', data)
      const kindLow = kind.charAt(0).toLowerCase() + kind.slice(1)
      if (uid) {
        // this.$router.replace({
        //   name: this.$route.name,
        //   // hash: '#node',
        //   hash: this.$route.hash,
        //   query: { clusterNodeId: id, detail: true },
        // })
        this.$router.push({
          path: `/cluster/detail/${this.clusterIdx}/${kindLow}/${namespace}/${name}`,
        })
        // this.$router.push(`/cluster/detail/${this.clusterIdx}/workload/${id}`)
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
    // this.initClusterNodeDataList()
  },
}
</script>

<style lang="scss"></style>
