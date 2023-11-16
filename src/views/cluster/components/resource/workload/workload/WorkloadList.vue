<template>
  <div class="sp-list-content">
    <div class="search-wrapper workload-search">
      <search
        :title="'Total:'"
        :todoCount="dataListSize.toString()"
        @input="onInputSearchValue"
        @click="onClickSearch"
      >
        <template #new-group>
          <div class="reload-wrapper">
            <v-icon @click="reloadData" color="black">mdi-refresh</v-icon>
            <span>마지막 업데이트 : {{ currentDateTime }}</span>
          </div>
        </template>

        <template #smartSearch>
          <smart-search
            width="330"
            :items="headers"
            :datas="dataList"
            density="compact"
            @update:search="searchDatas"
          />
        </template>
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
        :smart-search="smartSearchDatas"
        :custom-slot-info="customSlotInfo"
        is-linked
        @click:row="moveToDetailPage"
      >
        <template #health_custom="slotProps">
          <div class="workload__health-wrapper">
            <div class="workload__image-wrapper">
              <sp-image
                v-if="slotProps.item.health === 'Healthy'"
                contain
                lazySrc="icon_healthy.svg"
                src="icon_healthy.svg"
                width="22"
              />

              <sp-image
                v-if="slotProps.item.health === 'Unhealthy'"
                contain
                lazySrc="icon_unhealthy.svg"
                src="icon_unhealthy.svg"
                width="22"
              />
              <sp-image
                v-if="slotProps.item.health === 'Unknown'"
                contain
                lazySrc="free-icon-warning-6897039.png"
                src="free-icon-warning-6897039.png"
                width="22"
              />
            </div>

            <span>{{ slotProps.item.health }}</span>
          </div>
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
import Search from '@/components/molcule/DataTableSearch2.vue'
import { createNamespacedHelpers } from 'vuex'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import SmartSearch from '@/components/SmartSearch.vue'
import { getNowDate } from '@/lib/date'

const workloadMapUtils = createNamespacedHelpers('clusterWorkload')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: { Search, SmartSearch, spTable, Empty },
  props: { clusterId: Number },
  watch: {
    applyDate() {
      this.getListData()
    },
  },
  data() {
    return {
      smartSearchDatas: [],
      searchValue: '',
      searchTag: true,
      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Namespace', value: 'namespace' },
        { text: 'Kind', value: 'kind' },
        { text: 'Health', value: 'health' },
        { text: 'Pods', align: 'center', value: 'podCountTotal' },
        { text: 'Created', align: 'center', value: 'createAt' },
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
      customSlotInfo: [{ name: 'health', slotName: 'health' }],
      currentDateTime: '',
    }
  },
  async created() {
    this.isLoading = true
    await this.getListData()
    this.isLoading = false
    this.getDateTime()
  },
  computed: {
    ...workloadMapUtils.mapGetters(['dataList', 'dataListSize']),
    ...yamlEditModalMapUtils.mapGetters(['applyDate']),
    getChipEachColor() {
      return status => this.getChipColor(status)
    },
    getStatusText() {
      return status => (status ? 'Power on' : 'Power off')
    },
    clusterIdx() {
      return this.$route.params.id || null
    },
  },
  methods: {
    ...workloadMapUtils.mapActions(['getDataList', 'createWorkload']),
    ...alertMapUtils.mapMutations(['openAlert']),

    searchDatas(e) {
      console.log(e)
      this.smartSearchDatas = e
    },
    // 서치 박스의 버튼 클릭 시 호출됨
    onClickSearch() {
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
        this.$router.push({
          path: `/cluster/detail/${this.clusterIdx}/${kindLow}/${namespace}/${name}`,
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
    async onChangeItem() {
      await this.getListData()
      this.isLoading = false
    },
    async reloadData() {
      await this.getListData()
      this.isLoading = false
      this.getDateTime()
    },
    getDateTime() {
      this.currentDateTime = getNowDate()
    },
  },
}
</script>

<style lang="scss">
.workload-search {
  display: flex;
  // justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */

  .sp-smart-search {
    text-decoration: none !important;
    .v-input {
      padding-top: 5px;
    }
    .v-input__slot {
      border: thin solid rgba(75, 85, 102, 0.5);
      height: 20px;
    }
  }

  .v-input__slot:before {
    border: none !important;
  }
}

.workload__health-wrapper {
  display: inline-flex;
  align-items: center;
  .workload__image-wrapper {
    margin-right: 5px;
  }
}
.reload-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}
</style>
