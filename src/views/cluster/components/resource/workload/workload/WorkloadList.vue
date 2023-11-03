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
          <select-button
            :btnName="'New Workload'"
            @clickBtn="openYamlEditor"
            @changeItem="onChangeItem"
            style="margin-bottom: 10px"
          />

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

      <!-- yaml 에디터 모달 -->
      <yaml-edit-modal
        @confirmed="onConfirmedFromEditModal"
        class="yarm-edit-modal"
      />
    </div>
  </div>
</template>

<script>
import Search from '@/components/molcule/DataTableSearch2.vue'
import { createNamespacedHelpers } from 'vuex'
import SelectButton from '@/components/SelectButton.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import SmartSearch from '@/components/SmartSearch.vue'

const workloadMapUtils = createNamespacedHelpers('clusterWorkload')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    SelectButton,
    YamlEditModal,
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
      smartSearchDatas: [],
      searchValue: '',
      searchTag: true,
      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Namespace',
          value: 'namespace',
        },
        {
          text: 'Kind',
          value: 'kind',
        },
        {
          text: 'Health',
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
      customSlotInfo: [{ name: 'health', slotName: 'health' }],
      clusterIdx: null,
      currentDateTime: '',
    }
  },
  async created() {
    this.isLoading = true
    this.clusterIdx = this.$route.params.id
    await this.getListData()
    this.isLoading = false

    this.getDateTime()
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
    ...workloadMapUtils.mapActions(['getDataList', 'createWorkload']),
    ...yamlEditModalMapUtils.mapMutations(['openModal', 'closeModal']),
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
    openYamlEditor() {
      this.openModal({
        editType: 'create',
        isEncoding: false,
        content: '',
        title: 'New Workload',
        resourceType: 'workload',
      })
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
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')

      this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    async onConfirmedFromEditModal(value) {
      const idx = this.$route.params.id
      const { encodedContent } = value

      try {
        const param = {
          clusterIdx: idx,
          yaml: encodedContent,
        }

        const response = await this.createWorkload(param)

        if (
          (response.status === 201 || response.status === 200) &&
          response.data?.result?.success
        ) {
          this.openAlert({
            title: '리소스가 생성 되었습니다.',
            type: 'info',
          })
          this.closeModal()
          this.getListData()
        } else {
          this.openAlert({
            title: '생성 실패했습니다.',
            type: 'error',
          })
          console.error(response.data.result.errorMessage)
        }
      } catch (error) {
        this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
        console.error(error)
      }
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
