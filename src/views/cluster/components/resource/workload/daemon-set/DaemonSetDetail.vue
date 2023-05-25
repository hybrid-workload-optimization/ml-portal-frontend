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
import DaemonSetGeneral from '@/views/workload/daemon-set/components/DaemonSetGeneral.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const daemonSetMapUtils = createNamespacedHelpers('daemonSet')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    DaemonSetGeneral,
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
    }
  },

  created() {
    //
  },
  async mounted() {
    this.daemonSetIdx = this.$route.params.rid
    await this.getDetail({ daemonSetIdx: this.daemonSetIdx })

    // mixin
    this.checkProjectAuth(this.detailInfo.projectIdx)
  },
  computed: {
    ...daemonSetMapUtils.mapGetters(['detailInfo']),
    titleData() {
      return {
        // title: this.detailInfo.name,
        title: `${this.detailInfo.name}`,
      }
    },
  },
  methods: {
    ...daemonSetMapUtils.mapActions(['getDetail']),
    ...daemonSetMapUtils.mapActions(['getYaml']),
    ...daemonSetMapUtils.mapActions(['updateDaemonSet']),
    ...daemonSetMapUtils.mapActions(['deleteDaemonSet']),

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
          daemonSetIdx: this.daemonSetIdx,
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
        title: 'Edit Daemon Set',
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
        const response = await this.deleteDaemonSet({
          daemonSetIdx: this.daemonSetIdx,
        })

        if (response.status === 200) {
          // 삭제 성공 시
          this.openAlert({ title: '리소스가 삭제 되었습니다.', type: 'info' })

          // 1초 후 리스트 화면으로 이동
          setTimeout(() => this.$router.push('/workload/daemon-set/list'), 1000)
        } else {
          // 삭제 실패 시
          this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
        }
      } catch (error) {
        this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
      }
    },

    // [삭제 요청 확인창] 취소 클릭 시
    onClickDelCancel() {},

    // 업데이트 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromEditModal(value) {
      const param = {
        daemonSetIdx: this.daemonSetIdx,
        yaml: value.encodedContent,
      }

      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.updateDaemonSet(param)
        if (response.status === 200) {
          this.openAlert({ title: '리소스가 수정 되었습니다.', type: 'info' })
          this.getDetail({ daemonSetIdx: this.daemonSetIdx })
        } else {
          this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
        }
      } catch (error) {
        this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
      }
    },
  },
}
</script>

<style lang="scss"></style>
