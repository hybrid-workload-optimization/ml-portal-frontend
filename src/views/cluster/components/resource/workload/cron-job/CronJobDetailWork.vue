<template>
  <div>
    <card-title
      :titleData="{ title: getTitle }"
      :showButtons="isProjectAuth"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    >
    </card-title>

    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Metadata</span>
      </div>

      <div class="content-wrapper">
        <!-- Name -->
        <label-with-text
          name="Name"
          :value="detailInfo.name"
          horizontal
          readonly
        />

        <!-- Namespace -->
        <label-with-text
          name="Namespace"
          :value="detailInfo.namespace"
          horizontal
          readonly
        />

        <!-- UID -->
        <label-with-text
          name="UID"
          :value="detailInfo.uid"
          horizontal
          readonly
        />

        <!-- Created At -->
        <label-with-text
          name="Created At"
          :value="detailInfo.createdAt"
          horizontal
          readonly
        />

        <!-- Annotations -->
        <label-with name="Annotations" horizontal>
          <template v-slot:append-content>
            <sp-chip
              v-for="annotation in detailInfo.annotation"
              :key="annotation"
              >{{ annotation }}</sp-chip
            >
          </template>
        </label-with>
      </div>
    </div>
    <div class="sp-detail-metadata">
      <!-- Resource Info -->
      <div class="title-wrapper">
        <span class="title-text">Resource Info</span>
      </div>
      <div class="info-table justify-space-between">
        <template v-for="(head, index) in resourceInfoTitle">
          <label-with :name="head.text" :key="index">
            <template v-slot:append-content>
              {{ resourceInfo[head.value] || '-' }}
            </template>
          </label-with>
        </template>
      </div>
    </div>

    <!-- TODO Active Job -->
    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Active Job</span>
      </div>
      <div class="table-wrapper scrollable-table-wrapper">
        <sp-table
          :headers="headers"
          :options="options"
          :datas="activeJobList"
          scrollOnly
          :itemsPerPage="activeJobList.length"
        />
      </div>
    </div>

    <!-- TODO Inactive Job -->
    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Inactive Job</span>
      </div>
      <div class="table-wrapper scrollable-table-wrapper">
        <sp-table
          :headers="headers"
          :options="options"
          :datas="inactiveJobList"
          scrollOnly
          :itemsPerPage="inactiveJobList.length"
        />
      </div>
    </div>
    <!-- 삭제 요청 확인 창 -->
    <confirm @confirm-modal="onClickDelConfirm" />

    <!-- yaml 에디터 모달 창 -->
    <yaml-edit-modal @confirmed="onConfirmedFromEditModal" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import Confirm from '@/components/molcule/Confirm.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWith from '@/components/molcule/LabelWith.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const workloadMapUtils = createNamespacedHelpers('clusterWorkload')
const yamlMapUtils = createNamespacedHelpers('yaml')
const cronJobMapUtils = createNamespacedHelpers('cronJob')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')
const tableMapUtils = createNamespacedHelpers('dataTable')

export default {
  components: {
    CardTitle,
    Confirm,
    YamlEditModal,
    spTable,
    LabelWithText,
    LabelWith,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      cronJobId: null,
      isEncodingContent: true,
      labelWithClass: {
        titleStyle: {
          fontWeight: 'bold',
          fontSize: '1rem',
          width: '150px',
        },
      },
      labelWithTextClass: {
        titleStyle: {
          fontWeight: 'bold',
          fontSize: '1rem',
          width: '150px',
        },
        inputStyle: {
          readonly: true,
          fontSize: '2rem',
          margin: '20px',
          borderRadius: '10px',
        },
      },
      resourceInfoTitle: [
        { text: 'Schedule', value: 'schedule' },
        { text: 'Active Job', value: 'active' },
        { text: 'Pause', value: 'pause' },
        { text: 'Last schedule', value: 'lastSchedule' },
        { text: 'Concurrency Policy', value: 'concurrencyPolicy' },
      ],
      headers: [
        {
          text: 'Name',
          align: 'left',
          value: 'name',
          class: 'w-10',
        },
        {
          text: 'Namespace',
          align: 'left',
          value: 'namespace',
          class: 'w-10',
        },
        {
          text: 'Label',
          align: 'left',
          value: 'label',
          class: 'w-10',
        },
        {
          text: 'Pod',
          align: 'center',
          value: 'pod',
          class: 'w-10',
        },
        {
          text: 'Image',
          align: 'center',
          value: 'image',
          class: 'w-10',
        },
        {
          text: 'Created At',
          align: 'center',
          value: 'createdAt',
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
        fixedHeader: false,
        showSelect: false,
        itemKey: 'id',
      },
      clusterIdx: null,
      kind: 'cronJob',
      namespace: '',
      name: '',
      yamlStr: '',
    }
  },
  // 컴포넌트 생성 후 호출됨
  async created() {
    this.getData()
    // mixin
    this.checkProjectAuth(this.detailInfo.projectIdx)
  },
  computed: {
    ...cronJobMapUtils.mapGetters([
      'detailInfo',
      'resourceInfo',
      'activeJobList',
      'inactiveJobList',
    ]), // 상세 정보 데이터 객체 반환(statefulSet.js)
    ...tableMapUtils.mapGetters(['getOptions']), // 상세 정보 데이터 객체 반환(statefulSet.js)
    getTitle() {
      return `${this.detailInfo.name}`
    },
  },
  methods: {
    ...yamlMapUtils.mapActions(['getWorklistYaml']),
    ...cronJobMapUtils.mapActions([
      'getDetailNew',
      // 'getDetail',
      'deleteCronJob',
      'getCronJobYaml',
      'updateCronJob',
    ]),
    ...workloadMapUtils.mapActions(['deleteWorkload', 'createWorkload']),
    ...yamlEditModalMapUtils.mapMutations(['openModal']), // yaml에디트모달창 열기(yamlEditModal.js)
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    // [수정 버튼] 클릭 시

    async getData() {
      this.clusterIdx = this.$route.params.id
      this.namespace = this.$route.params.namespace
      this.name = this.$route.params.name

      await this.getDetailNew({
        clusterIdx: this.clusterIdx,
        kind: this.kind,
        namespace: this.namespace,
        name: this.name,
      })
    },

    async onClickEdit() {
      console.log('onClickEdit')

      const params = {
        clusterIdx: this.clusterIdx,
        kind: this.kind,
        name: this.name,
        namespace: this.namespace,
      }

      try {
        this.yamlStr = await this.getWorklistYaml(params)
      } catch (error) {
        console.log(error)
      }

      this.openModal({
        editType: 'update',
        isEncoding: true,
        content: this.yamlStr,
        readOnlyKeys: ['kind', 'metadata.name', 'metadata.namespace'],
        title: 'Edit Deployment',
      })
    },

    // [삭제 버튼] 클릭 시
    onClickDelete() {
      this.openConfirm(`${this.detailInfo.name} 을(를) 삭제하시겠습니까?`)
    },

    // [삭제 요청 확인창] 확인 클릭 시
    async onClickDelConfirm() {
      const params = {
        clusterIdx: this.clusterIdx,
        kind: this.kind,
        name: this.name,
        namespace: this.namespace,
      }
      try {
        const response = await this.deleteWorkload(params)

        if (response.status === 200) {
          this.openAlert({
            title: '리소스가 삭제 되었습니다.',
            type: 'info',
          })
          setTimeout(
            () =>
              this.$router.push(`/cluster/detail/${this.clusterIdx}/workload`),
            1000,
          )
        } else {
          this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
        console.log(error)
      }
    },

    // 업데이트 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromEditModal(data) {
      const params = {
        clusterIdx: this.clusterIdx,
        yaml: data.encodedContent,
      }
      try {
        const response = await this.createWorkload(params)
        console.log(response)
        if (response.status === 200) {
          this.openAlert({
            title: '리소스가 수정 되었습니다.',
            type: 'info',
          })
          this.getData()
        } else {
          this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
          console.error(response.data.message)
        }
      } catch (error) {
        this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
        console.error(error)
      }
    },
  },
}
</script>
