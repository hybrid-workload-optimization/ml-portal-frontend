<template>
  <div>
    <card-title
      :titleData="titleData"
      :showButtons="isProjectAuth"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    ></card-title>

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
      clusterIdx: null,
      deploymentIdx: null,
      namespace: null,
      name: null,
      kind: 'deployment',
      tab: null,
      isEncodingContent: true,
      tabNames: ['General', 'Relationship diagram'],
    }
  },
  // 컴포넌트 생성 후 호출됨
  async created() {
    this.clusterIdx = this.$route.params.id
    // this.deploymentIdx = this.$route.params.rid
    this.namespace = this.$route.params.namespace
    this.name = this.$route.params.name

    await this.getData()
    console.log(this.deploymentDetailInfo)
    // mixin
    this.checkProjectAuth(this.deploymentDetailInfo.projectIdx)
  },
  computed: {
    ...deploymentMapUtils.mapGetters(['deploymentDetailInfo']),
    titleData() {
      return {
        title: this.deploymentDetailInfo.name,
      }
    },
  },
  methods: {
    ...deploymentMapUtils.mapActions([
      'getDeploymentDetailNew',
      'getDeploymentDetail',
      'getPodList',
      'deleteDeployment',
      'getDeploymentYaml',
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
          namespace: this.namespace,
          name: this.name,
          kind: this.kind,
          // idx: this.deploymentIdx,
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
      let text = ''
      // if (this.deploymentDetailInfo.yaml) {
      //   text = this.deploymentDetailInfo.yaml
      // } else {
      try {
        const response = await this.getDeploymentYaml({
          idx: this.deploymentIdx,
          // clusterIdx: this.clusterIdx,
          // namespace: this.namespace,
          // name: this.name,
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
        title: 'Edit Deployment',
      })
    },

    onClickDelete() {
      this.openConfirm(
        `${this.deploymentDetailInfo.name} 을(를) 삭제하시겠습니까?`,
      )
    },

    async onClickDelConfirm() {
      try {
        const response = await this.deleteDeployment({
          idx: this.deploymentIdx,
          // clusterIdx: this.clusterIdx,
          // namespace: this.namespace,
          // name: this.name,
        })

        if (response.status === 200) {
          this.openAlert({
            title: '리소스가 삭제 되었습니다.',
            type: 'info',
          })
          setTimeout(
            () =>
              this.$router.push(
                `/cluster/detail/${this.clusterIdx}/deployment`,
              ),
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

    async onConfirmedFromEditModal(value) {
      const param = {
        idx: this.deploymentIdx,
        yaml: value.encodedContent,
        // namespace: this.namespace,
        // name: this.name,
      }
      try {
        const response = await this.updateDeployment(param)
        if (response.status === 200) {
          this.openAlert({
            title: '리소스가 수정 되었습니다.',
            type: 'info',
          })
          this.getData()
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
