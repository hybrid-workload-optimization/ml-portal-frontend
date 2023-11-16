<template>
  <div>
    <card-title
      :titleData="{ title: getTitle }"
      :showButtons="true"
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

        <label-with name="Labels" horizontal>
          <template #append-content v-if="detailInfo.label">
            <sp-chip
              v-for="(value, key) in detailInfo.label"
              :key="key + value"
            >
              {{ key }} : {{ value }}</sp-chip
            >
          </template>
        </label-with>

        <!-- Annotations -->
        <label-with name="Annotations" horizontal>
          <template #append-content>
            <sp-chip
              v-for="annotation in detailInfo.annotation"
              :key="annotation"
              >{{ annotation }}</sp-chip
            >
          </template>
        </label-with>
      </div>
    </div>
    <div class="sp-detail-metadata resource-info">
      <!-- Resource Info -->
      <div class="title-wrapper">
        <span class="title-text">Resource Info</span>
      </div>
      <div class="info-table">
        <template v-for="(head, index) in resourceInfoTitle">
          <label-with :name="head.text" :key="index">
            <template #append-content>
              {{ resourceInfo[head.value] || '-' }}
            </template>
          </label-with>
        </template>
      </div>
    </div>

    <!-- Pod State -->
    <div class="sp-detail-metadata pod-state">
      <div class="title-wrapper">
        <span class="title-text">Pod state</span>
      </div>
      <div class="info-table">
        <template v-for="(head, index) in podStateTitle">
          <label-with :name="head.text" :key="index">
            <template #append-content>
              {{ podState[head.value] || '-' }}
            </template>
          </label-with>
        </template>
      </div>
    </div>

    <!-- Pod Grid -->
    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Pod</span>
      </div>
      <div class="table-wrapper scrollable-table-wrapper">
        <sp-table
          :headers="headers"
          :options="options"
          :datas="podList"
          scrollOnly
          :itemsPerPage="podList.length"
          is-linked
          @click:row="moveToPodDetailPage"
        />
      </div>
    </div>

    <yaml-edit-modal />
    <confirm @confirm-modal="onClickDelConfirm" />
  </div>
</template>

<script>
/**
 * Version 2 API 적용된 페이지
 */
import { createNamespacedHelpers } from 'vuex'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import Confirm from '@/components/molcule/Confirm.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWith from '@/components/molcule/LabelWith.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const workloadMapUtils = createNamespacedHelpers('clusterWorkload')
const JobMapUtils = createNamespacedHelpers('job')
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
      kind: 'job',
      jobId: null,
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
        { text: '완료', value: 'completed' },
        { text: '병렬성', value: 'parallel' },
        { text: 'Image', value: 'image' },
      ],
      podStateTitle: [
        { text: 'Succeeded', value: 'succeeded' },
        { text: 'Active', value: 'active' },
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
          text: 'Node',
          align: 'left',
          value: 'node',
          class: 'w-10',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
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
    }
  },
  // 컴포넌트 생성 후 호출됨
  async created() {
    this.getData()
    this.checkProjectAuth(this.detailInfo.projectIdx)
  },
  computed: {
    ...JobMapUtils.mapGetters([
      'detailInfo',
      'resourceInfo',
      'podList',
      'podState',
    ]), // 상세 정보 데이터 객체 반환(statefulSet.js)
    ...tableMapUtils.mapGetters(['getOptions']), // 상세 정보 데이터 객체 반환(statefulSet.js)
    getTitle() {
      return `${this.detailInfo.name}`
    },
    clusterIdx() {
      return this.$route.params?.id || null
    },
    namespace() {
      return this.$route.params?.namespace || null
    },
    name() {
      return this.$route.params?.name || null
    },
    // getData & Delete API 호출 할 때 필요한 파라미터
    params() {
      const { name, namespace, clusterIdx, kind } = this
      return { name, namespace, clusterIdx, kind }
    },
  },
  methods: {
    ...workloadMapUtils.mapActions(['deleteWorkload', 'createWorkload']),
    ...JobMapUtils.mapActions([
      'getDetailNew',
      'deleteJob',
      'getJobYaml',
      'updateJob',
      'getPodList',
      'getPodState',
    ]),

    ...yamlEditModalMapUtils.mapActions(['openGetYaml']),
    ...yamlEditModalMapUtils.mapMutations(['openModal', 'closeModal']), // yaml에디트모달창 열기(yamlEditModal.js)
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    async getData() {
      await this.getDetailNew(this.params)
    },
    // [수정 버튼] 클릭 시
    async onClickEdit() {
      this.openGetYaml(this.params)
    },
    // [삭제 버튼] 클릭 시
    onClickDelete() {
      this.openConfirm(`${this.name} 을(를) 삭제하시겠습니까?`)
    },
    // [삭제 요청 확인창] 확인 클릭 시
    async onClickDelConfirm() {
      try {
        const response = await this.deleteWorkload(this.params)

        if (response.status === 200) {
          this.openAlert({ title: '리소스가 삭제 되었습니다.', type: 'info' })
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

    moveToPodDetailPage(item) {
      this.$router.push(
        `/cluster/detail/${this.clusterIdx}/pod/${item.namespace}/${item.name}`,
      )
    },
  },
}
</script>
