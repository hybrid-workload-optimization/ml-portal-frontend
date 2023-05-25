<template>
  <div class="pop-cluster-detail">
    <!-- <card-title
      :titleData="getTitle"
      :showButtons="isProjectAuth"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    ></card-title> -->

    <!-- <card-title :titleData="getTitle" :showButtons="false"></card-title> -->

    <div>
      <!-- 상단 탭 명칭 설정 -->
      <v-tabs v-model="tab" color="#000" style="display: none">
        <v-tabs-slider color="#000"></v-tabs-slider>
        <!-- <v-tab
          v-for="tabName in tabNames"
          :key="tabName"
          @change="onClickTab(tabName)"
        >
          {{ tabName }}
        </v-tab> -->
        <v-tab v-for="tabName in tabNames" :key="tabName">
          {{ tabName }}
        </v-tab>
      </v-tabs>

      <!-- 탭별 아이템 설정 -->
      <v-tabs-items
        class="detail-tab-item"
        v-model="tab"
        style="margin-top: 50px"
      >
        <v-tab-item>
          <cluster-resource />
        </v-tab-item>
      </v-tabs-items>
    </div>

    <!-- 삭제 요청 확인 창 -->
    <confirm
      @confirm-modal="onClickDelConfirm"
      @cancel-modal="onClickDelCancel"
    />
  </div>
</template>

<script>
// import CardTitle from '@/components/molcule/CardTitleWithDetailResource.vue'
import { createNamespacedHelpers } from 'vuex'
import Confirm from '@/components/molcule/Confirm.vue'
import ClusterResource from '@/views/cluster/components/ClusterResource.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const clusterMapUtils = createNamespacedHelpers('cluster')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    // CardTitle,
    Confirm,
    ClusterResource,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      projectIdx: null,
      clusterIdx: null,
      tab: null,
      isEncodingContent: true,
      tabNames: ['Resource'], // 탭 명칭들
      isNewWindow: false,
    }
  },

  created() {
    this.clusterIdx = this.$route.params.id
    // 상세 초기화
    this.initDataDetail()
  },
  async mounted() {
    const result = await this.getDataDetail({ clusterIdx: this.clusterIdx })
    if (!result) {
      this.$router.push('/cluster/list')
    }
    console.log('클러스터 데이터: ', this.dataDetail)
    this.checkProjectAuth()
    this.getDataSummary({ clusterIdx: this.clusterIdx })
    this.getMonitoringData({ clusterIdx: this.clusterIdx })
  },
  computed: {
    ...clusterMapUtils.mapGetters(['dataDetail']), // 상세

    getTitle() {
      return {
        title: this.dataDetail.clusterName,
        description: this.dataDetail.description,
        problem: this.dataDetail.problem,
        status: this.dataDetail.status,
      }
    },
  },
  // watch: {
  //   hashValue(newValue, oldValue) {
  //     if (newValue && newValue !== oldValue) {
  //       const tabIdx = this.tabNames.findIndex(item => {
  //         if (
  //           item.replace(' ', '').toLowerCase() ===
  //           newValue.replace('#', '').toLowerCase()
  //         ) {
  //           return item
  //         }
  //         return false
  //       })
  //       this.tab = tabIdx > 0 ? tabIdx : 0
  //     }
  //   },
  // },
  methods: {
    ...clusterMapUtils.mapActions([
      'getDataDetail',
      'getDataSummary',
      'deleteData',
      'getMonitoringData',
    ]),
    ...clusterMapUtils.mapMutations(['initDataDetail']),

    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    // [수정 버튼] 클릭 시
    onClickEdit() {
      this.$router.push(`/cluster/edit/${this.clusterIdx}`)
    },

    // [삭제 버튼] 클릭 시
    onClickDelete() {
      this.openConfirm(
        `Are you sure you want to delete ${this.dataDetail.clusterName} ?`,
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
          if (
            ['KUBESPRAY', 'AKS', 'GKE', 'EKS', 'NKS'].includes(
              this.dataDetail.provisioningType,
            )
          ) {
            this.openAlert({
              title: 'Cluster deletion requested.',
              type: 'info',
            })
          } else {
            this.openAlert({
              title: 'The cluster has been deleted.',
              type: 'info',
            })
          }
          // 1초 후 리스트 화면으로 이동
          setTimeout(() => this.$router.push('/cluster/list'), 1000)
        } else {
          // 삭제 실패 시
          this.openAlert({
            title: 'Failed to delete cluster.',
            type: 'error',
          })
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({
          title: 'Failed to delete cluster.',
          type: 'error',
        })
        console.log(error)
      }
    },
    // [삭제 요청 확인창] 취소 클릭 시
    onClickDelCancel() {},
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
$this: '';
.#{$this}pop-cluster-detail {
  // position: fixed;
  // right: 100px;
  // width: 75%;
  .v-tabs {
    padding-bottom: 35px;
  }
}
</style>
