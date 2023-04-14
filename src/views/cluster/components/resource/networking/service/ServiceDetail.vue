<template>
  <div>
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
        <service-general v-if="tabName === 'General'" />
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
import ServiceGeneral from '@/views/networking/service/components/ServiceGeneral.vue'
import Confirm from '@/components/molcule/Confirm.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const serviceMapUtils = createNamespacedHelpers('service')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    ServiceGeneral,
    Confirm,
    YamlEditModal,
    CardTitle,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      serviceId: null,
      tab: null,
      isEncodingContent: true,
      tabNames: ['General', 'Relationship diagram'], // 탭 명칭들
    }
  },
  // 컴포넌트 생성 후 호출됨
  async created() {
    this.serviceId = this.$route.params.id
    await this.getData()

    // mixin
    this.checkProjectAuth(this.serviceDetailInfo.projectIdx)
  },
  computed: {
    ...serviceMapUtils.mapGetters(['serviceDetailInfo']),
    titleData() {
      return {
        title: this.serviceDetailInfo.title,
      }
    },
  },
  methods: {
    ...serviceMapUtils.mapActions(['getServiceDetail']),
    ...serviceMapUtils.mapActions(['getPodList']),
    ...serviceMapUtils.mapActions(['deleteService']),
    ...serviceMapUtils.mapActions(['getServiceYaml']),
    ...serviceMapUtils.mapActions(['updateService']),
    ...yamlEditModalMapUtils.mapMutations(['openModal']),
    ...alertMapUtils.mapMutations(['openAlert']),
    ...confirmMapUtils.mapMutations(['openConfirm']),

    async getData() {
      try {
        await this.getServiceDetail({ id: this.serviceId })
        const { serviceDetailInfo } = this
        const param = {
          clusterId: serviceDetailInfo.clusterId,
          namespaceName: serviceDetailInfo.namespace,
          selector: {},
          ownerUid: serviceDetailInfo.uid,
        }
        if (serviceDetailInfo.selectors) {
          serviceDetailInfo.selectors.forEach(e => {
            const arr = e.split(':')
            param.selector[arr[0]] = `${arr[1]}`
          })
        }

        this.getPodList(param)
      } catch (error) {
        console.log(error)
      }
    },

    // [수정 버튼] 클릭 시
    async onClickEdit() {
      let text = ''
      // if (this.detailInfo.yaml) {
      //   text = this.detailInfo.yaml
      // } else {
      try {
        const response = await this.getServiceYaml({
          id: this.serviceId,
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
        title: 'Edit Service',
      })
    },

    onClickDelete() {
      this.openConfirm(
        `${this.serviceDetailInfo.name} 을(를) 삭제하시겠습니까?`,
      )
    },

    async onClickDelConfirm() {
      try {
        const response = await this.deleteService({
          id: this.serviceId,
        })

        if (response.status === 200) {
          // 삭제 성공 시
          this.openAlert({
            title: '리소스가 삭제 되었습니다.',
            type: 'info',
          })

          // 1초 후 리스트 화면으로 이동
          setTimeout(() => this.$router.push('/network/service/list'), 1000)
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

    async onConfirmedFromEditModal(value) {
      const param = {
        id: this.serviceId,
        yaml: value.encodedContent,
      }
      try {
        const response = await this.updateService(param)
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

<style lang="scss"></style>
