<template>
  <div class="pod-detail-page">
    <card-title
      :titleData="{ title: getTitle }"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    >
      <template #additional-buttons>
        <sp-button
          outlined
          class="log-button title-button"
          @click="movePath('log')"
          >Log</sp-button
        >
        <sp-button
          outlined
          class="console-button title-button"
          @click="movePath('exec')"
          >Console</sp-button
        >
      </template>
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

        <!-- image -->
        <label-with name="Images" horizontal>
          <template
            #append-content
            v-if="detailInfo.images && detailInfo.images.length"
          >
            <sp-chip v-for="(value, index) in detailInfo.images" :key="index">
              {{ value }}</sp-chip
            >
          </template>
        </label-with>

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
    <div class="sp-detail-metadata owner-referneces">
      <!-- Owner Info -->
      <div class="title-wrapper">
        <span class="title-text">Owner References</span>
      </div>
      <div class="info-table">
        <template v-for="(head, index) in ownerTitle">
          <label-with :name="head.text" :key="index">
            <template #append-content>
              {{ ownerInfo[head.value] || '-' }}
            </template>
          </label-with>
        </template>
      </div>
    </div>
    <div class="sp-detail-metadata">
      <!-- Condition Info -->
      <div class="title-wrapper">
        <span class="title-text">Condition</span>
      </div>
      <div class="table-wrapper scrollable-table-wrapper">
        <sp-table
          :headers="conditionTitle"
          :datas="conditionList"
          :options="getOptions"
          scroll-only
        />
      </div>
    </div>

    <div class="sp-detail-metadata">
      <!-- PVC Info -->
      <div class="title-wrapper">
        <span class="title-text">Persistent Volume Claim</span>
      </div>
      <div class="table-wrapper scrollable-table-wrapper">
        <sp-table
          :headers="pvcTitle"
          :datas="pvcList"
          :options="getOptions"
          scroll-only
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

const podMapUtils = createNamespacedHelpers('pod')
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
      podName: this.$route.params.name,
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
        { text: 'Node', value: 'node' },
        { text: 'Status', value: 'status' },
        { text: 'IP', value: 'ip' },
        { text: 'QoS Class', value: 'qosClass' },
        { text: 'Restart', value: 'restart' },
      ],
      conditionTitle: [
        { text: 'Type', align: 'center', value: 'type' },
        { text: 'Status', align: 'center', value: 'status' },
        { text: '마지막 진단 시간', align: 'center', value: 'lastProbeTime' },
        {
          text: '마지막 트랜지션 시간',
          align: 'center',
          value: 'lastTransitionTime',
        },
        { text: '이유', align: 'center', value: 'reason' },
        { text: '메시지', align: 'center', value: 'message' },
      ],
      ownerTitle: [
        { text: 'Name', align: 'center', value: 'name' },
        { text: 'Type', align: 'center', value: 'type' },
        // { text: 'Pod', align: 'center', value: 'pod' },
        // { text: 'Age', align: 'center', value: 'age' },
        { text: '이미지', align: 'center', value: 'image' },
      ],
      pvcTitle: [
        { text: 'Name', align: 'center', value: 'name' },
        { text: 'Status', align: 'center', value: 'status' },
        { text: 'Volume', align: 'center', value: 'volume' },
        { text: 'Capacity', align: 'center', value: 'capacity' },
        { text: 'Access Modes', align: 'center', value: 'accessModes' },
        { text: 'Storage Class', align: 'center', value: 'storageClass' },
        { text: 'Age', align: 'center', value: 'age' },
      ],
      ownerInfoList: [],
      clusterIdx: null,
    }
  },
  // 컴포넌트 생성 후 호출됨
  async created() {
    this.clusterIdx = this.$route.params.id
    const { params } = this.$route
    await this.getDetail({
      podName: this.podName,
      clusterIdx: params.id,
      namespace: params.namespace,
    })

    // mixin
    this.checkProjectAuth(this.detailInfo.projectIdx)
  },
  computed: {
    ...podMapUtils.mapGetters([
      'detailInfo',
      'resourceInfo',
      'conditionList',
      'ownerInfo',
      'pvcList',
    ]), // 상세 정보 데이터 객체 반환(statefulSet.js)
    ...tableMapUtils.mapGetters(['getOptions']), // 상세 정보 데이터 객체 반환(statefulSet.js)
    getTitle() {
      return `${this.detailInfo.name}`
    },
  },
  methods: {
    ...podMapUtils.mapActions([
      'getDetail',
      'deletePod',
      'getPodYaml',
      'updatePod',
    ]),

    ...yamlEditModalMapUtils.mapMutations(['openModal', 'closeModal']), // yaml에디트모달창 열기(yamlEditModal.js)
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    // [수정 버튼] 클릭 시
    async onClickEdit() {
      let text = ''
      // if (this.detailInfo.yaml) {
      //   text = this.detailInfo.yaml
      // } else {
      try {
        const response = await this.getPodYaml({
          clusterId: this.detailInfo.clusterId,
          namespace: this.detailInfo.namespace,
          podName: this.podName,
        })

        text = response.data.result
      } catch (error) {
        console.log(error)
      }
      // }

      this.openModal({
        editType: 'update',
        isEncoding: true,
        content: text,
        readOnlyKeys: ['kind', 'metadata.name', 'metadata.namespace'],
        title: 'Edit Pod',
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
        await this.deletePod({
          clusterId: this.detailInfo.clusterId,
          namespace: this.detailInfo.namespace,
          podName: this.podName,
        })
        this.openAlert({ title: '리소스가 삭제 되었습니다.', type: 'info' })

        // 1초 후 리스트 화면으로 이동
        setTimeout(
          () => this.$router.push(`/cluster/detail/${this.clusterIdx}/pod`),
          1000,
        )
      } catch (error) {
        this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
      }
    },

    // 업데이트 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromEditModal(value) {
      const { params } = this.$route
      const param = {
        clusterIdx: params.id,
        yaml: value.encodedContent,
      }
      console.log(param)
      try {
        await this.updatePod(param)
        this.openAlert({ title: '리소스가 수정 되었습니다.', type: 'info' })
        this.getDetail({
          podName: this.podName,
          clusterIdx: params.id,
          namespace: params.namespace,
        })
        this.closeModal()
      } catch (error) {
        this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
      }
    },
    movePath(type) {
      this.$router.push(
        `/cluster/detail/${this.detailInfo.clusterId}/pod/${type}/${this.detailInfo.namespace}/${this.detailInfo.name}`,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.pod-detail-page {
  .sp-card-title-with-detail {
    .log-button.title-button {
      margin-right: 10px;
      color: $basic-button;
    }
    .console-button.title-button {
      margin-right: 10px;
      color: $basic-button;
    }
  }
  .sp-detail-metadata {
    &.resource-info {
      width: 60%;
    }
    &.owner-referneces {
      display: inline-block;
      width: 40%;
    }
  }
}
</style>
