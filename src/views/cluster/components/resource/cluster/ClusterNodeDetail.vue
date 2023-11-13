<template>
  <div class="sp-cluster-node-detail">
    <div class="title-wrapper">
      <h2 class="title-left">{{ detailInfo.name }}</h2>
      <div class="title-right">
        <sp-button outlined class="list-button title-button" @click="moveList()"
          >List</sp-button
        >
        <sp-button
          outlined
          class="delete-button title-button"
          v-if="isProjectAuth"
          @click="onClickDelete"
          >Delete</sp-button
        >
      </div>
    </div>
    <node-chart-card></node-chart-card>

    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Metadata</span>
      </div>
      <div class="content-wrapper">
        <!-- Name -->
        <label-with-text name="Name" :value="detailInfo.name" horizontal />

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
        />

        <!-- labels -->
        <label-with name="Labels" horizontal>
          <template #append-content>
            <sp-chip v-for="label in detailInfo.label" :key="label">
              {{ label }}</sp-chip
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

    <div class="sp-detail-metadata">
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
    <div class="sp-detail-metadata">
      <!-- Resource Info -->
      <div class="title-wrapper">
        <span class="title-text">System Info</span>
      </div>
      <div class="info-table">
        <template v-for="(head, index) in systemInfoTitle">
          <label-with :name="head.text" :key="index">
            <template #append-content>
              {{ systemInfo[head.value] || '-' }}
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
      <!-- podList -->
      <div class="title-wrapper">
        <span class="title-text">Pod</span>
      </div>
      <div class="table-wrapper scrollable-table-wrapper">
        <sp-table
          :headers="podTitle"
          :datas="podList"
          :options="getOptions"
          scroll-only
          :itemsPerPage="podList.length"
          is-linked
          @click:row="moveToPodDetailPage"
        />
      </div>
    </div>

    <!-- 삭제 요청 확인 창 -->
    <confirm
      @confirm-modal="onClickDelConfirm"
      @cancel-modal="onClickDelCancel"
    />

    <!-- yaml 에디터 모달 창 -->
    <!-- <yaml-edit-modal @confirmed="onConfirmedFromEditModal" /> -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Confirm from '@/components/molcule/Confirm.vue'
// import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWith from '@/components/molcule/LabelWith.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import NodeChartCard from '@/views/cluster/components/ClusterNodeChartCard.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const nodeMapUtils = createNamespacedHelpers('clusterNode')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')
const tableMapUtils = createNamespacedHelpers('dataTable')
const clusterMapUtils = createNamespacedHelpers('cluster')

export default {
  components: {
    Confirm,
    // YamlEditModal,
    spTable,
    LabelWithText,
    LabelWith,
    NodeChartCard,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      nodeId: null,
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
        { text: 'Hostname', align: 'center', value: 'name' },
        { text: 'IP Address', align: 'center', value: 'ip' },
        { text: 'Pod CIDR', align: 'center', value: 'podCidr' },
      ],
      systemInfoTitle: [
        { text: 'OS Image', align: 'center', value: 'osImage' },
        { text: 'Kernel Version', align: 'center', value: 'kernelVersion' },
        { text: 'Architecture', align: 'center', value: 'architecture' },
        { text: 'Kubelet Version', align: 'center', value: 'kubeletVersion' },
        { text: 'Kube-proxy 버전', align: 'center', value: 'kubeProxy' },
      ],
      conditionTitle: [
        { text: 'Type', align: 'center', value: 'type' },
        { text: 'Status', align: 'center', value: 'status' },
        {
          text: 'Last Diagnosis Time',
          align: 'center',
          value: 'lastTransitionTime',
        },
        { text: 'Reason', align: 'center', value: 'reason' },
        { text: 'Message', align: 'center', value: 'message' },
      ],
      podTitle: [
        { text: 'Name', align: 'center', value: 'name' },
        { text: 'Namespace', align: 'center', value: 'namespace' },
        { text: 'Label', align: 'center', value: 'label' },
        { text: 'Node', align: 'center', value: 'node' },
        { text: 'Restart', align: 'center', value: 'restart' },
        { text: 'Status', align: 'center', value: 'status' },
        { text: 'CPU', align: 'center', value: 'cpu' },
        { text: 'Memory', align: 'center', value: 'memory' },
        { text: 'Age', align: 'center', value: 'age' },
      ],
      clusterIdx: null,
    }
  },
  // 컴포넌트 생성 후 호출됨
  async created() {
    this.clusterIdx = this.$route.params.id
    this.nodeName = this.$route.params.nodeName
    this.getData()
    this.checkProjectAuth()
    console.log(this.dataDetail)
  },
  computed: {
    ...clusterMapUtils.mapGetters(['dataDetail']),
    ...nodeMapUtils.mapGetters([
      'detailInfo',
      'resourceInfo',
      'conditionList',
      'systemInfo',
      'podList',
    ]), // 상세 정보 데이터 객체 반환(clusterNode.js)
    ...tableMapUtils.mapGetters(['getOptions']), // 상세 정보 데이터 객체 반환(clusterNode.js)
    titleData() {
      return {
        title: this.detailInfo.name,
      }
    },
  },
  methods: {
    ...nodeMapUtils.mapMutations(['initClusterNodeListState']),
    ...nodeMapUtils.mapActions([
      'getDetailV2',
      'getNodeYaml',
      'deleteClusterNode',
      'getPodList',
    ]),

    ...yamlEditModalMapUtils.mapMutations(['openModal', 'closeModal']), // yaml에디트모달창 열기(yamlEditModal.js)

    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    // [수정 버튼] 클릭 시
    async onClickEdit() {
      try {
        const response = await this.getNodeYaml({
          id: this.nodeId,
        })

        const text = response.data.result

        this.openModal({
          editType: 'update',
          isEncoding: true,
          content: text,
          title: 'Edit Node',
        })
      } catch (error) {
        console.log(error)
      }
    },

    // 상세 정보와 파드 리스트 정보를 가져오는 메서드
    async getData() {
      try {
        await this.getDetailV2({
          clusterIdx: this.clusterIdx,
          name: this.nodeName,
        })
        const { detailInfo } = this
        console.log(detailInfo)
        // const param = {
        //   clusterId: detailInfo.clusterId,
        //   nodeName: detailInfo.name,
        //   ownerUid: detailInfo.uid,
        // }
        // this.getPodList(param)
      } catch (error) {
        console.log(error)
      }
    },

    // [삭제 버튼] 클릭 시
    onClickDelete() {
      this.openConfirm(`${this.detailInfo.name} 을(를) 삭제하시겠습니까?`)
    },
    moveList() {
      // this.$router.push({
      //   name: this.$route.name,
      //   hash: '#Node',
      // })
      this.$router.push(`/cluster/detail/${this.clusterIdx}/node`)
    },
    // [삭제 요청 확인창] 확인 클릭 시
    async onClickDelConfirm() {
      try {
        // 삭제 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        await this.deleteClusterNode({
          clusterIdx: this.clusterIdx,
          name: this.nodeName,
        })
        this.openAlert({ title: '삭제 성공했습니다.', type: 'info' })

        // 1초 후 리스트 화면으로 이동
        setTimeout(
          () =>
            // this.$router.push({
            //   name: this.$route.name,
            //   hash: '#node',
            // }),
            this.$router.push(`/cluster/detail/${this.clusterIdx}/node`),
          1000,
        )
      } catch (error) {
        this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
      }
    },

    // [삭제 요청 확인창] 취소 클릭 시
    onClickDelCancel() {},

    // // 업데이트 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    // async onConfirmedFromEditModal(value) {
    //   const param = {
    //     id: this.id,
    //     yaml: value.encodedContent,
    //   }
    //   try {
    //     // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
    //     await this.updatenode(param)
    //     this.openAlert({ title: '업데이트 성공했습니다.', type: 'info' })
    //     // this.getDetail({ id: this.id })
    //     this.closeModal()
    //   } catch (error) {
    //     this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
    //   }
    // },
    movePath(type) {
      this.$router.push(
        `/cluster/node/detail/${this.id}/${type}/${this.detailInfo.namespace}/${this.detailInfo.name}`,
      )
    },
    moveToPodDetailPage(item) {
      // this.$router.push(
      //   `/workload/pod/detail/${this.dataDetail.clusterIdx}/${item.namespace}/${item.name}`,
      // )
      this.$router.push(
        `/cluster/detail/${this.dataDetail.clusterIdx}/Pod/${item.namespace}/${item.name}`,
      )
    },
  },
  beforeDestroy() {
    this.initClusterNodeListState()
  },
}
</script>

<style lang="scss">
.sp-cluster-node-detail {
  .title-wrapper {
    padding-top: 15px;
    padding-bottom: 15px;
    .title-left {
      display: inline-block;
      width: 50%;
      vertical-align: middle;
      color: $sp-title;
    }

    .title-right {
      width: 50%;
      display: inline-block;
      text-align: right;
      vertical-align: middle;

      .title-button {
        width: 114px;
        color: $sp-teriary;
        border-radius: 5px;
        border-width: thin;
        font-weight: bold;
      }
      .edit-button,
      .list-button {
        margin-right: 10px;
      }

      .list-button {
        color: $basic-button;
      }
    }
  }
}
</style>
