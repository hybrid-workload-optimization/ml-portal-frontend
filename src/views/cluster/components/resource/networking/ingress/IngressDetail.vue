<template>
  <div class="sp-ingress-detail">
    <card-title
      :titleData="titleData"
      :showButtons="isProjectAuth"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    ></card-title>

    <!-- 상단 탭 명칭 설정 -->
    <v-tabs v-model="tab">
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="tabName in tabNames" :key="tabName">
        {{ tabName }}
      </v-tab>
    </v-tabs>

    <!-- 탭별 아이템 설정 -->
    <v-tabs-items class="detail-tab-item" v-model="tab">
      <v-tab-item v-for="tabName in tabNames" :key="tabName">
        <ingress-general v-if="tabName === 'General'" />
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
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import Confirm from '@/components/molcule/Confirm.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import IngressGeneral from '@/views/networking/ingress/components/IngressGeneral.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const ingressMapUtils = createNamespacedHelpers('ingress')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    IngressGeneral,
    Confirm,
    YamlEditModal,
    CardTitle,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      ingressId: null,
      tab: null,
      isEncodingContent: true,
      tabNames: ['General', 'Relationship diagram'], // 탭 명칭들
    }
  },
  // 컴포넌트 생성 후 호출됨
  async created() {
    this.ingressId = this.$route.params.rid
    await this.getDetail({ id: this.ingressId })

    // mixin
    this.checkProjectAuth(this.detailInfo.projectIdx)
  },
  computed: {
    ...ingressMapUtils.mapGetters(['detailInfo']), // 상세 정보 데이터 객체 반환(ingress.js)
    titleData() {
      return {
        title: this.detailInfo.title,
      }
    },
  },
  methods: {
    ...ingressMapUtils.mapActions([
      'getDetail',
      'deleteIngress',
      'getIngressYaml',
      'updateIngress',
    ]), // 상세 정보 조회 요청(ingress.js)

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
        const response = await this.getIngressYaml({
          id: this.ingressId,
          name: this.detailInfo.name,
          namespace: this.detailInfo.namespace,
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
        title: 'Edit Ingress',
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
        const response = await this.deleteIngress({
          id: this.detailInfo.id,
        })

        if (response.status === 200) {
          // 삭제 성공 시
          this.openAlert({ title: '리소스가 삭제 되었습니다.', type: 'info' })

          // 1초 후 리스트 화면으로 이동
          setTimeout(() => this.$router.push('/network/ingress/list'), 1000)
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
        id: this.detailInfo.id,
        kubeConfigId: this.detailInfo.clusterIdx,
        yaml: value.encodedContent,
      }
      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.updateIngress(param)
        if (response.status === 200) {
          this.openAlert({ title: '리소스가 수정 되었습니다.', type: 'info' })
          this.getDetail({ id: this.ingressId })
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

<style lang="scss"></style>
