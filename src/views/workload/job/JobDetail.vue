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

        <label-with name="Labels" horizontal>
          <template v-slot:append-content v-if="detailInfo.label">
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
    <div class="sp-detail-metadata resource-info">
      <!-- Resource Info -->
      <div class="title-wrapper">
        <span class="title-text">Resource Info</span>
      </div>
      <div class="info-table">
        <template v-for="(head, index) in resourceInfoTitle">
          <label-with :name="head.text" :key="index">
            <template v-slot:append-content>
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
            <template v-slot:append-content>
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
    this.jobId = this.$route.params.id
    await this.getDetail({ idx: this.jobId })

    if (
      this.detailInfo.clusterId &&
      this.detailInfo.namespace &&
      this.detailInfo.uid
    ) {
      const param = {
        clusterId: this.detailInfo.clusterId,
        namespaceName: this.detailInfo.namespace,
        ownerUid: this.detailInfo.uid,
      }
      this.getPodList(param)
    }

    // mixin
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
      return `${this.detailInfo.clusterName} / ${this.detailInfo.name}`
    },
  },
  methods: {
    ...JobMapUtils.mapActions([
      'getDetail',
      'deleteJob',
      'getJobYaml',
      'updateJob',
      'getPodList',
      'getPodState',
    ]),

    ...yamlEditModalMapUtils.mapMutations(['openModal']), // yaml에디트모달창 열기(yamlEditModal.js)
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    // [수정 버튼] 클릭 시
    async onClickEdit() {
      let text = ''
      // if (this.detailInfo.yaml) {
      //   text = this.detailInfo.yaml
      // } else {
      try {
        const response = await this.getJobYaml({
          idx: this.jobId,
        })

        if (response.status === 200) {
          text = response.data.result
        } else {
          console.log(response.data.message)
        }
      } catch (error) {
        console.log(error)
      }
      // }

      this.openModal({
        editType: 'update',
        isEncoding: true,
        content: text,
        readOnlyKeys: ['kind', 'metadata.name', 'metadata.namespace'],
        title: 'Edit Job',
      })
    },

    // [삭제 버튼] 클릭 시
    onClickDelete() {
      this.openConfirm(`${this.detailInfo.name} 을(를) 삭제하시겠습니까?`)
    },

    // [삭제 요청 확인창] 확인 클릭 시
    async onClickDelConfirm() {
      try {
        // 삭제 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        await this.deleteJob({ idx: this.jobId })
        this.openAlert({ title: '리소스가 삭제 되었습니다.', type: 'info' })

        // 1초 후 리스트 화면으로 이동
        setTimeout(() => this.$router.push('/workload/job/list'), 1000)
      } catch (error) {
        this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
      }
    },

    // 업데이트 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromEditModal(value) {
      const param = {
        idx: this.jobId,
        clusterIdx: this.detailInfo.clusterIdx,
        yaml: value.encodedContent,
      }
      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        await this.updateJob(param)
        this.openAlert({ title: '리소스가 수정 되었습니다.', type: 'info' })
        this.getDetail({ idx: this.jobId })
      } catch (error) {
        this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
      }
    },
    moveToPodDetailPage(item) {
      this.$router.push(
        `/workload/pod/detail/${this.detailInfo.clusterIdx}/${item.namespace}/${item.name}`,
      )
    },
  },
}
</script>
