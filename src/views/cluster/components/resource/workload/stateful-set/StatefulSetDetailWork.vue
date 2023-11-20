<template>
  <div>
    <card-title
      :titleData="titleData"
      :showButtons="isProjectAuth"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    ></card-title>

    <!-- 상단 탭 명칭 설정 -->
    <v-tabs v-model="tab" style="display: none">
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="tabName in tabNames" :key="tabName">
        {{ tabName }}
      </v-tab>
    </v-tabs>

    <!-- 탭별 아이템 설정 -->
    <v-tabs-items class="detail-tab-item" v-model="tab">
      <v-tab-item v-for="tabName in tabNames" :key="tabName">
        <stateful-set-general v-if="tabName === 'General'" />
      </v-tab-item>
    </v-tabs-items>

    <yaml-edit-modal />
    <confirm @confirm-modal="onClickDelConfirm" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import StatefulSetGeneral from '@/views/cluster/components/resource/workload/stateful-set/components/StatefulSetGeneral.vue'
import Confirm from '@/components/molcule/Confirm.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const statefulSetMapUtils = createNamespacedHelpers('statefulSet')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')
const workloadMapUtils = createNamespacedHelpers('clusterWorkload')

export default {
  components: {
    StatefulSetGeneral,
    Confirm,
    YamlEditModal,
    CardTitle,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      statefulSetId: null,
      tab: null,
      isEncodingContent: true,
      tabNames: ['General', 'Relationship diagram'], // 탭 명칭들
      kind: 'statefulSet',
    }
  },
  // 컴포넌트 생성 후 호출됨
  async created() {
    await this.getData()
    this.checkProjectAuth(this.detailInfo.projectIdx)
  },
  computed: {
    ...statefulSetMapUtils.mapGetters(['detailInfo']), // 상세 정보 데이터 객체 반환(statefulSet.js)
    titleData() {
      return {
        title: this.detailInfo.name,
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
    ...statefulSetMapUtils.mapActions(['getDetailNew']), // 상세 정보 조회 요청(statefulSet.js)
    ...statefulSetMapUtils.mapActions(['getPodList']), // 파드 리스트 정보 조회 요청(statefulSet.js)
    ...statefulSetMapUtils.mapActions(['deleteStatefulSet']), // 스테이트풀셋 삭제 요청(statefulSet.js)
    ...statefulSetMapUtils.mapActions(['getStatefulSetYaml']), // 스테이트풀셋 yaml 조회 요청(statefulSet.js)
    ...statefulSetMapUtils.mapActions(['updateStatefulSet']), // 스테이트풀셋 업데이트 요청(statefulSet.js)
    ...workloadMapUtils.mapActions(['deleteWorkload', 'createWorkload']),
    ...yamlEditModalMapUtils.mapMutations(['openModal', 'closeModal']), // yaml에디트모달창 열기(yamlEditModal.js)
    ...yamlEditModalMapUtils.mapActions(['openGetYaml']),
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    // 상세 정보와 파드 리스트 정보를 가져오는 메서드
    async getData() {
      try {
        await this.getDetailNew(this.params)
      } catch (error) {
        console.log(error)
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

    // 업데이트 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromEditModal(data) {
      const params = { clusterIdx: this.clusterIdx, yaml: data.encodedContent }
      try {
        const { data: resData } = await this.createWorkload(params)
        if (resData.result.success) {
          this.openAlert({
            title: '리소스가 수정 되었습니다.',
            type: 'info',
          })
          this.closeModal()
          this.getData()
        } else {
          this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
          console.error(resData)
        }
      } catch (error) {
        this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
        console.error(error)
      }
    },
  },
}
</script>

<style lang="scss"></style>
