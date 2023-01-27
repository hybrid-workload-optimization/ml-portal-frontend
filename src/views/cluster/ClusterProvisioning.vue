<template>
  <div class="sp-cluster-provisioning-detail">
    <card-title :titleData="getTitle" :showButtons="false">
      <template v-slot:additional-buttons>
        <sp-button
          outlined
          class="close-button title-button"
          @click="moveToList"
          >Close</sp-button
        >
        <sp-button
          v-if="provisioningStatus === 'FAILED'"
          outlined
          class="delete-button title-button"
          @click="onClickDelete"
          >Delete</sp-button
        >
      </template>
    </card-title>

    <div class="sp-empty">
      <sp-card class="empty__card-wrapper">
        <div class="empty__title-wrapper">{{ getProvisioningTitle }}</div>
        <div
          class="empty__desc-wrapper"
          v-if="['KUBESPRAY'].includes(dataDetail.provisioningType)"
        >
          로그를 확인 하시려면
          <router-link
            :to="{
              path: `/cluster/log/${this.clusterIdx}/${this.dataDetail.clusterName}/${this.dataDetail.workJobIdx}`,
              query: {
                description: `${this.dataDetail.description}`,
                date: `${this.dataDetail.createdAt}`,
              },
            }"
            replace
            >[로그 보기]</router-link
          >를 클릭하시기 바랍니다.
        </div>
      </sp-card>
    </div>

    <!-- 삭제 요청 확인 창 -->
    <confirm @confirm-modal="onClickDelConfirm" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import Confirm from '@/components/molcule/Confirm.vue'

const clusterMapUtils = createNamespacedHelpers('cluster')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    CardTitle,
    Confirm,
  },
  data() {
    return {
      clusterIdx: null,
      tab: null,
      isEncodingContent: true,
      tabNames: [
        'General',
        'Node',
        'Namespace',
        'Persistent Volume',
        'Storage Class',
      ], // 탭 명칭들
      description: '',
      intervalId: null,
    }
  },

  created() {
    const { hash } = this.$route
    this.tab = this.tabNames.findIndex(item => {
      if (
        item.replace(' ', '').toLowerCase() ===
        hash.replace('#', '').toLowerCase()
      ) {
        return item
      }
      return false
    })
    // 상세 초기화
    this.initDataDetail()
  },
  computed: {
    ...clusterMapUtils.mapState(['timeoutList']),
    ...clusterMapUtils.mapGetters(['dataDetail', 'provisioningStatus']), // 상세

    getTitle() {
      return {
        title: this.dataDetail.clusterName,
        description: this.dataDetail.description,
        date: this.dataDetail.createdAt,
        status: this.dataDetail.status,
      }
    },
    getProvisioningTitle() {
      if (this.provisioningStatus === 'STARTED') {
        return 'Cluster deployment is in progress.'
      }
      if (this.provisioningStatus === 'DELETING') {
        return 'Cluster deletion is in progress.'
      }
      if (this.provisioningStatus === 'SCALE_OUT') {
        return 'Cluster Scale Out이 진행 중입니다.'
      }
      if (this.provisioningStatus === 'SCALE_IN') {
        return 'Cluster Scale In이 진행 중입니다.'
      }
      if (this.provisioningStatus === 'FAILED') {
        return 'Cluster deployment failed.'
      }
      return ''
    },
  },

  async mounted() {
    this.clusterIdx = this.$route.params.id
    // this.provisioningStatus = this.$route.params.provisioningStatus
    await this.getDataDetail({ clusterIdx: this.clusterIdx })
    // cluster가 배포중일 때 1분마다 주기적으로 새 데이터 호출
    this.startInterval()
  },
  watch: {
    provisioningStatus(newValue) {
      console.log(newValue)
      if (
        newValue &&
        !['STARTED', 'FAILED', 'DELETING', 'SCALE_OUT', 'SCALE_IN'].includes(
          newValue,
        )
      ) {
        setTimeout(() => {
          this.$router.push('/cluster/list')
        }, 1000)
      }
    },
  },

  methods: {
    ...clusterMapUtils.mapActions([
      'getDataDetail',
      'getDataStatus',
      'deleteData',
    ]),
    ...clusterMapUtils.mapMutations(['initDataDetail', 'initTimeoutList']),

    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈
    startInterval() {
      if (
        ['STARTED', 'DELETING', 'SCALE_OUT', 'SCALE_IN'].includes(
          this.provisioningStatus,
        )
      ) {
        this.getDataStatus({
          params: { clusterIdx: this.clusterIdx },
          type: 'detail',
        })
      }
    },

    moveToList() {
      this.$router.push('/cluster/list')
    },

    // [수정 버튼] 클릭 시
    onClickEdit() {
      this.$router.push(`/cluster/edit/${this.clusterIdx}`)
    },

    // [삭제 버튼] 클릭 시
    onClickDelete() {
      this.openConfirm(
        `${this.dataDetail.clusterName} 을(를) 삭제하시겠습니까?`,
      )
    },

    // [삭제 요청 확인창] 확인 클릭 시
    async onClickDelConfirm() {
      try {
        const response = await this.deleteData({
          clusterIdx: this.clusterIdx,
        })

        if (response.status === 200) {
          // 삭제 성공 시
          this.openAlert({ title: '삭제 요청에 성공했습니다.', type: 'info' })

          // 1초 후 리스트 화면으로 이동
          setTimeout(() => this.$router.push('/cluster/list'), 1000)
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
    onClickTab(tab) {
      this.$router.replace({
        hash: tab.replace(' ', '').toLowerCase(),
      })
    },
  },
  beforeDestroy() {
    this.timeoutList.forEach(idx => clearTimeout(idx))
    this.initTimeoutList()
  },
}
</script>

<style lang="scss">
.sp-cluster-provisioning-detail {
  .sp-card-title-with-detail {
    margin-bottom: 15px;
    .title-left {
      display: inline-block;
      width: 40%;
      vertical-align: middle;
    }

    .title-right {
      width: 40%;
      display: inline-block;
      text-align: right;
      vertical-align: middle;

      .icon-button {
        min-width: 40px !important;
        width: 40px;
        margin-right: 10px;
      }
    }
    .close-button {
      margin-right: 10px;
    }
  }
}
</style>
<style lang="scss" scoped>
@import '@/styles/_mixin.scss';
.sp-empty {
  $this: 'empty';
  display: flex;
  width: 100%;
  height: 400px;
  .#{$this}__card-wrapper {
    width: 100%;
    height: 100%;
    border: 2px dotted $sp-box-border;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f1f4f633;
    .#{$this}__title-wrapper {
      @include set-text(bold, 16, rgba($color: $sp-title, $alpha: 1));
      margin-bottom: 4px;
      text-align: center;
    }
    .#{$this}__desc-wrapper {
      @include set-text(light, 13, rgba($color: $sp-title, $alpha: 1));
      text-align: center;
    }
    .#{$this}__desc-wrapper_log {
      @include set-text(light, 13, rgba($color: $sp-title, $alpha: 1));
      text-align: left;
    }
  }
}
</style>
