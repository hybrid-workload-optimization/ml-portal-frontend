<template>
  <div class="sp-list-content">
    <search
      :title="'Total:'"
      :todoCount="dataListSize.toString()"
      :buttonText="'New StorageClass'"
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
        is-linked
        @click:row="moveToDetailPage"
      />

      <!-- 조회 내용이 존재하지 않을 때, 내용 표시(optionl) -->
      <empty
        v-else-if="!isLoading"
        title="clusterStorageClass가 존재하지 않습니다."
        description=""
      />
    </div>

    <!-- yaml 에디터 모달 -->
    <yaml-edit-modal ref="yamlEditor" @confirmed="onConfirmedFromEditModal" />
  </div>
</template>

<script>
import Search from '@/components/molcule/DataTableSearch.vue'
import { createNamespacedHelpers } from 'vuex'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const clusterStorageClassMapUtils = createNamespacedHelpers(
  'clusterStorageClass',
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
          // align: 'center',
          value: 'name',
        },
        {
          text: 'Provider',
          // align: 'center',
          value: 'provider',
        },
        {
          text: 'Parameters',
          // align: 'center',
          value: 'type',
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
      isLoading: false,
      clusterIdx: null,
    }
  },
  async created() {
    this.clusterIdx = this.$route.params.id
    this.checkProjectAuth()
    this.isLoading = true
    await this.getListData()
    this.isLoading = false
  },
  computed: {
    ...clusterStorageClassMapUtils.mapGetters(['dataList', 'dataListSize']),
    ...clusterMapUtils.mapGetters(['dataDetail']),
  },
  methods: {
    ...clusterStorageClassMapUtils.mapMutations([
      'initClusterStorageClassDataList',
    ]),
    ...clusterStorageClassMapUtils.mapActions([
      'getList',
      'createClusterStorageClass',
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
      // name 길이 체크 및 특수문자 체크 해야됨(일정 길이 이상/특수문자는 생성불가)
      this.openModal({
        editType: 'create',
        isEncoding: false,
        content: '',
        title: 'New Storage Class',
        resourceType: 'storageClass',
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
        // this.$router.push({
        //   name: this.$route.name,
        //   // hash: '#storageClass',
        //   hash: this.$route.hash,
        //   query: { storageClassId: id, detail: true },
        // })
        this.$router.push(
          `/cluster/detail/${this.clusterIdx}/storage-class/${id}`,
        )
      }
    },

    // 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromEditModal(item) {
      const { clusterIdx } = this.dataDetail
      const { encodedContent } = item
      try {
        const param = {
          clusterIdx,
          yaml: encodedContent,
        }
        await this.createClusterStorageClass(param)
        this.openAlert({ title: '생성 성공했습니다.', type: 'info' })
        this.getListData()
      } catch (error) {
        this.openAlert({ title: '생성 실패했습니다.', type: 'error' })
      }
    },
  },
  beforeDestroy() {
    this.initModalContent()
  },
}
</script>

<style lang="scss"></style>
