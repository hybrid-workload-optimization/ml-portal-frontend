<template>
  <div>
    <card-title
      :titleData="titleData"
      :showButtons="isProjectAuth"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    />

    <v-tabs v-model="tab" style="display: none">
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="tabName in tabNames" :key="tabName">
        {{ tabName }}
      </v-tab>
    </v-tabs>

    <!-- 탭별 아이템 설정 -->
    <v-tabs-items class="detail-tab-item" v-model="tab">
      <v-tab-item v-for="tabName in tabNames" :key="tabName">
        <deployment-general v-if="tabName === 'General'" />
      </v-tab-item>
    </v-tabs-items>

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
import Confirm from '@/components/molcule/Confirm.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import DeploymentGeneral from '@/views/cluster/components/resource/workload/deployment/components/DeploymentGeneral.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const yamlMapUtils = createNamespacedHelpers('yaml')
const workloadMapUtils = createNamespacedHelpers('clusterWorkload')
const deploymentMapUtils = createNamespacedHelpers('deployment')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    DeploymentGeneral,
    Confirm,
    YamlEditModal,
    CardTitle,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      kind: 'deployment',
      tab: null,
      isEncodingContent: true,
      tabNames: ['General', 'Relationship diagram'],
    }
  },
  // 컴포넌트 생성 후 호출됨
  async created() {
    await this.getData()
    // console.log(this.deploymentDetailInfo)
    // mixin
    this.checkProjectAuth(this.deploymentDetailInfo.projectIdx)
  },
  computed: {
    ...deploymentMapUtils.mapGetters(['deploymentDetailInfo']),
    titleData() {
      return { title: this.deploymentDetailInfo.name }
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
  },
  methods: {
    ...yamlMapUtils.mapActions(['getWorklistYaml']),
    ...workloadMapUtils.mapActions(['deleteWorkload', 'createWorkload']),
    ...deploymentMapUtils.mapActions([
      'getDeploymentDetailNew',
      'getDeploymentDetail',
      'getPodList',
      'deleteDeployment',
      'updateDeployment',
    ]),
    ...yamlEditModalMapUtils.mapMutations(['openModal']),
    ...alertMapUtils.mapMutations(['openAlert']),
    ...confirmMapUtils.mapMutations(['openConfirm']),

    // 상세 정보와 파드 리스트 정보를 가져오는 메서드
    async getData() {
      try {
        await this.getDeploymentDetailNew({
          clusterIdx: this.clusterIdx,
          kind: this.kind,
          name: this.name,
          namespace: this.namespace,
        })
        // const { deploymentDetailInfo } = this

        // const param = {
        // clusterId: deploymentDetailInfo.clusterId,
        // namespaceName: deploymentDetailInfo.namespace,
        // ownerUid: deploymentDetailInfo.replicaSetUid,
        // }
        // this.getPodList(param)
      } catch (error) {
        console.log(error)
      }
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

    onClickDelete() {
      console.log('onClickDelete')
      this.openConfirm(
        `${this.deploymentDetailInfo.name} 을(를) 삭제하시겠습니까?`,
      )
    },

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

    onClickDelCancel() {},

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
