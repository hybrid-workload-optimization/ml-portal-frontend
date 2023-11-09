<template>
  <div class="sp-cluster-detail">
    <card-title
      :titleData="getTitle"
      :showButtons="isProjectAuth"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    ></card-title>

    <div>
      <!-- 상단 탭 명칭 설정 -->
      <v-tabs v-model="tab" color="#000">
        <v-tabs-slider color="#000"></v-tabs-slider>
        <v-tab
          v-for="tabName in tabNames"
          :key="tabName"
          @change="onClickTab(tabName)"
        >
          {{ tabName }}
        </v-tab>
      </v-tabs>

      <!-- 탭별 아이템 설정 -->
      <v-tabs-items class="detail-tab-item" v-model="tab">
        <v-tab-item v-for="(tabName, index) in tabNames" :key="tabName">
          <cluster-general
            v-if="
              tab === index && tabName === 'General' && !$route.query.detail
            "
          />
          <cluster-addon-card-list
            v-else-if="
              tab === index && tabName === 'Catalog' && !$route.query.detail
            "
          />
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
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import { createNamespacedHelpers } from 'vuex'
import Confirm from '@/components/molcule/Confirm.vue'
import ClusterGeneral from '@/views/cluster/components/ClusterGeneral.vue'

const clusterMapUtils = createNamespacedHelpers('cluster')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    CardTitle,
    Confirm,
    ClusterGeneral,
  },
  data() {
    return {
      clusterIdx: null,
      tab: null,
      isEncodingContent: true,
      tabNames: [
        'General',
        'Catalog',
        'Node',
        'Namespace',
        'Persistent Volume',
        'Storage Class',
      ], // 탭 명칭들
    }
  },

  created() {
    const { hash } = this.$route
    const tabIdx = this.tabNames.findIndex(item => {
      if (
        item.replace(' ', '').toLowerCase() ===
        hash.replace('#', '').toLowerCase()
      ) {
        return item
      }
      return false
    })
    this.tab = tabIdx > 0 ? tabIdx : 0
    this.clusterIdx = this.$route.params.id

    // 상세 초기화
    this.initDataDetail()
  },
  async mounted() {
    const result = await this.getDataDetail({ clusterIdx: this.clusterIdx })
    if (!result) {
      this.$router.go(-1)
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
    hashValue() {
      return this.$route.hash
    },
  },
  watch: {
    hashValue(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        const tabIdx = this.tabNames.findIndex(item => {
          if (
            item.replace(' ', '').toLowerCase() ===
            newValue.replace('#', '').toLowerCase()
          ) {
            return item
          }
          return false
        })
        this.tab = tabIdx > 0 ? tabIdx : 0
      }
    },
  },
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
          setTimeout(() => {
            // this.$router.push('/cluster/list')
            this.$router.go(-1)
          }, 1000)
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
    onClickTab(tab) {
      this.tabName = tab
      this.$router.replace({
        hash: tab.replace(' ', '').toLowerCase(),
      })
    },
    // [삭제 요청 확인창] 취소 클릭 시
    onClickDelCancel() {},
  },
}
</script>

<style lang="scss">
.sp-cluster-detail {
  .v-tabs {
    padding-bottom: 35px;
  }
}
</style>
