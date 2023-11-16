<template>
  <div>
    <card-title
      :titleData="titleData"
      :showButtons="true"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    />
    <!-- :showButtons="isProjectAuth" -->

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

    <yaml-edit-modal />
    <confirm @confirm-modal="onClickDelConfirm" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import Confirm from '@/components/molcule/Confirm.vue'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import DeploymentGeneral from '@/views/cluster/components/resource/workload/deployment/components/DeploymentGeneral.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const workloadMapUtils = createNamespacedHelpers('clusterWorkload')
const deploymentMapUtils = createNamespacedHelpers('deployment')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const confirmMapUtils = createNamespacedHelpers('confirm')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    DeploymentGeneral,
    YamlEditModal,
    CardTitle,
    Confirm,
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
    await this.checkProjectAuth(this.deploymentDetailInfo.projectIdx)
  },
  mounted() {
    console.log(this.deploymentDetailInfo)
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
    // getData & Delete API 호출 할 때 필요한 파라미터
    params() {
      const { name, namespace, clusterIdx, kind } = this
      return { name, namespace, clusterIdx, kind }
    },
  },
  methods: {
    ...workloadMapUtils.mapActions(['deleteWorkload', 'createWorkload']),
    ...deploymentMapUtils.mapActions([
      'getDeploymentDetailNew',
      'getPodList',
      'deleteDeployment',
      'updateDeployment',
    ]),
    ...yamlEditModalMapUtils.mapActions(['openGetYaml']),
    ...yamlEditModalMapUtils.mapMutations(['openModal', 'closeModal']),
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈
    ...alertMapUtils.mapMutations(['openAlert']),
    // 상세 정보와 파드 리스트 정보를 가져오는 메서드
    async getData() {
      try {
        await this.getDeploymentDetailNew(this.params)
      } catch (error) {
        console.log(error)
      }
    },
    // Yaml 수정 버튼 이벤트
    async onClickEdit() {
      this.openGetYaml(this.params)
    },
    // 삭제 버튼 이벤트
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
