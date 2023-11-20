<template>
  <div>
    <card-title
      :titleData="titleData"
      :showButtons="isProjectAuth"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    ></card-title>

    <!-- 상단 탭 명칭 설정 -->
    <!--
    <v-tabs v-model="tab">
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="tabName in tabNames" :key="tabName">
        {{ tabName }}
      </v-tab>
    </v-tabs>
    -->

    <!-- 탭별 아이템 설정 -->
    <!--
    <v-tabs-items v-model="tab">
      <div class="sp-box-layout">
        <v-tab-item v-for="tabName in tabNames" :key="tabName">
          <stateful-set-general v-if="tabName === 'General'" />
        </v-tab-item>
      </div>
    </v-tabs-items>
    -->
    <daemon-set-general />

    <yaml-edit-modal />
    <confirm @confirm-modal="onClickDelConfirm" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Confirm from '@/components/molcule/Confirm.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import DaemonSetGeneral from '@/views/cluster/components/resource/workload/daemon-set/components/DaemonSetGeneral.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const yamlMapUtils = createNamespacedHelpers('yaml')
const workloadMapUtils = createNamespacedHelpers('clusterWorkload')
const daemonSetMapUtils = createNamespacedHelpers('daemonSet')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: { DaemonSetGeneral, Confirm, YamlEditModal, CardTitle },
  mixins: [checkProjectAuth],
  data() {
    return {
      kind: 'daemonSet',
      daemonSetIdx: null,
      tab: null,
      isEncodingContent: true,
      tabNames: ['General', 'Relationship diagram'], // 탭 명칭들
    }
  },
  async mounted() {
    this.getData()
    this.checkProjectAuth(this.detailInfo.projectIdx)
  },
  computed: {
    ...daemonSetMapUtils.mapGetters(['detailInfo']),
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
    ...yamlMapUtils.mapActions(['getWorklistYaml']),
    ...workloadMapUtils.mapActions(['deleteWorkload', 'createWorkload']),
    ...daemonSetMapUtils.mapActions(['getDetail', 'getDetailNew']),
    ...daemonSetMapUtils.mapActions(['getYaml']),
    ...daemonSetMapUtils.mapActions(['updateDaemonSet']),
    ...daemonSetMapUtils.mapActions(['deleteDaemonSet']),

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
  },
}
</script>

<style lang="scss"></style>
