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

    <yaml-edit-modal />
    <confirm @confirm-modal="onClickDelConfirm" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import ReplicaSetGeneral from '@/views/cluster/components/resource/workload/replica-set/components/ReplicaSetGeneral.vue'
import Confirm from '@/components/molcule/Confirm.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const workloadMapUtils = createNamespacedHelpers('clusterWorkload')
const replicaSetMapUtils = createNamespacedHelpers('replicaSet')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: { ReplicaSetGeneral, Confirm, YamlEditModal, CardTitle },
  mixins: [checkProjectAuth],
  data() {
    return {
      kind: 'replicaSet',
      statefulSetId: null,
      tab: null,
      isEncodingContent: true,
      tabNames: ['General', 'Relationship diagram'], // 탭 명칭들
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
    ...replicaSetMapUtils.mapActions(['getDetail', 'getPodList']), // 상세 정보 조회 요청(replicaSet.js)
    ...replicaSetMapUtils.mapActions(['deleteReplicaSet']), // Replica Set 삭제 요청(replicaSet.js)
    ...replicaSetMapUtils.mapActions(['getYaml']), // Replica Set yaml 조회 요청(replicaSet.js)
    ...replicaSetMapUtils.mapActions(['updateReplicaSet']), // Replica Set 업데이트 요청(replicaSet.js)

    ...yamlEditModalMapUtils.mapActions(['openGetYaml']),
    ...yamlEditModalMapUtils.mapMutations(['openModal', 'closeModal']), // yaml에디트모달창 열기(yamlEditModal.js)
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    async getData() {
      await this.getDetail(this.params)
      if (this.detailInfo.clusterId && this.detailInfo.uid) {
        const params = {
          clusterId: this.detailInfo?.clusterId,
          namespaceName: this.detailInfo?.namespace,
          ownerUid: this.detailInfo?.uid,
        }
        this.getPodList(params)
      }
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
  },
}
</script>
