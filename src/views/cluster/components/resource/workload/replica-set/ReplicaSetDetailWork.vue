<template>
  <div>
    <card-title
      :titleData="titleData"
      :showButtons="isProjectAuth"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    ></card-title>
    <replica-set-general />
    <!-- 삭제 요청 확인 창 -->
    <confirm
      @confirm-modal="onClickDelConfirm"
      @cancel-modal="onClickDelCancel"
    />

    <!-- yaml 에디터 모달 창 -->
    <yaml-edit-modal @confirmed="onConfirmedFromEditModal" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import ReplicaSetGeneral from '@/views/cluster/components/resource/workload/replica-set/components/ReplicaSetGeneral.vue'
import Confirm from '@/components/molcule/Confirm.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const yamlMapUtils = createNamespacedHelpers('yaml')
const workloadMapUtils = createNamespacedHelpers('clusterWorkload')
const replicaSetMapUtils = createNamespacedHelpers('replicaSet')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    ReplicaSetGeneral,
    Confirm,
    YamlEditModal,
    CardTitle,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      clusterIdx: null,
      statefulSetId: null,
      tab: null,
      isEncodingContent: true,
      tabNames: ['General', 'Relationship diagram'], // 탭 명칭들
      kind: 'replicaSet',
      namespace: '',
      name: '',
      yamlStr: '',
    }
  },

  async mounted() {
    this.getData()
    // mixin
    this.checkProjectAuth(this.detailInfo.projectIdx)
  },
  computed: {
    ...replicaSetMapUtils.mapGetters(['detailInfo']), // 상세 정보 데이터 객체 반환(replicaSet.js)
    titleData() {
      return {
        title: `${this.detailInfo.name}`,
      }
    },
  },
  methods: {
    ...yamlMapUtils.mapActions(['getWorklistYaml']),
    ...workloadMapUtils.mapActions(['deleteWorkload', 'createWorkload']),
    ...replicaSetMapUtils.mapActions(['getDetail', 'getPodList']), // 상세 정보 조회 요청(replicaSet.js)
    ...replicaSetMapUtils.mapActions(['deleteReplicaSet']), // Replica Set 삭제 요청(replicaSet.js)
    ...replicaSetMapUtils.mapActions(['getYaml']), // Replica Set yaml 조회 요청(replicaSet.js)
    ...replicaSetMapUtils.mapActions(['updateReplicaSet']), // Replica Set 업데이트 요청(replicaSet.js)

    ...yamlEditModalMapUtils.mapMutations(['openModal']), // yaml에디트모달창 열기(yamlEditModal.js)

    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    async getData() {
      this.clusterIdx = this.$route.params.id
      this.replicaSetIdx = this.$route.params.rid
      this.namespace = this.$route.params.namespace
      this.name = this.$route.params.name

      await this.getDetail({
        clusterIdx: this.clusterIdx,
        namespace: this.namespace,
        name: this.name,
        kind: this.kind,
      })
      if (this.detailInfo.clusterId && this.detailInfo.uid) {
        const params = {
          clusterId: this.detailInfo.clusterId,
          namespaceName: this.detailInfo.namespace,
          ownerUid: this.detailInfo.uid,
        }
        this.getPodList(params)
      }
    },

    // [수정 버튼] 클릭 시
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

    // [삭제 요청 확인창] 취소 클릭 시
    onClickDelCancel() {},

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
