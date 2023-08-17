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
    }
  },

  created() {
    //
  },
  async mounted() {
    this.clusterIdx = this.$route.params.id
    this.replicaSetIdx = this.$route.params.rid
    this.namespace = this.$route.params.namespace
    this.name = this.$route.params.name
    console.log(this.$route.params)
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
    ...replicaSetMapUtils.mapActions(['getDetail', 'getPodList']), // 상세 정보 조회 요청(replicaSet.js)
    ...replicaSetMapUtils.mapActions(['deleteReplicaSet']), // Replica Set 삭제 요청(replicaSet.js)
    ...replicaSetMapUtils.mapActions(['getYaml']), // Replica Set yaml 조회 요청(replicaSet.js)
    ...replicaSetMapUtils.mapActions(['updateReplicaSet']), // Replica Set 업데이트 요청(replicaSet.js)

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
        const response = await this.getYaml({
          replicaSetIdx: this.replicaSetIdx,
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
        title: 'Edit Replica Set',
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
        const response = await this.deleteReplicaSet({
          replicaSetIdx: this.replicaSetIdx,
        })

        if (response.status === 200) {
          // 삭제 성공 시
          this.openAlert({ title: '리소스가 삭제 되었습니다.', type: 'info' })

          // 1초 후 리스트 화면으로 이동
          setTimeout(
            () =>
              this.$router.push(
                `/cluster/detail/${this.clusterIdx}/replica-set`,
              ),
            1000,
          )
        } else {
          // 삭제 실패 시
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
    async onConfirmedFromEditModal(value) {
      const param = {
        replicaSetIdx: this.replicaSetIdx,
        yaml: value.encodedContent,
      }
      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.updateReplicaSet(param)
        if (response.status === 200) {
          this.openAlert({ title: '리소스가 수정 되었습니다.', type: 'info' })
          this.getDetail({ replicaSetIdx: this.replicaSetIdx })
        } else {
          this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
        console.log(error)
      }
    },
  },
}
</script>
