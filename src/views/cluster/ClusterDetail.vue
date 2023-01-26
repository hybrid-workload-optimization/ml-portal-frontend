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
              tab === index && tabName === 'Add-on' && !$route.query.detail
            "
          />
          <cluster-node
            v-else-if="
              tab === index && tabName === 'Node' && !$route.query.detail
            "
          />
          <cluster-node-detail
            v-else-if="
              tab === index && tabName === 'Node' && $route.query.detail
            "
          />
          <cluster-namespace
            v-else-if="
              tab === index && tabName === 'Namespace' && !$route.query.detail
            "
          />
          <cluster-namespace-detail
            v-else-if="
              tab === index && tabName === 'Namespace' && $route.query.detail
            "
          />
          <cluster-persistent-volume
            v-else-if="
              tab === index &&
              tabName === 'Persistent Volume' &&
              !$route.query.detail
            "
          />
          <cluster-persistent-volume-detail
            v-else-if="
              tab === index &&
              tabName === 'Persistent Volume' &&
              $route.query.detail
            "
          />
          <cluster-storage-class
            v-else-if="
              tab === index &&
              tabName === 'Storage Class' &&
              !$route.query.detail
            "
          />
          <cluster-storage-class-detail
            v-else-if="
              tab === index &&
              tabName === 'Storage Class' &&
              $route.query.detail
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
import ClusterNode from '@/views/cluster/components/ClusterNodeList.vue'
import ClusterNodeDetail from '@/views/cluster/components/ClusterNodeDetail.vue'
import ClusterNamespace from '@/views/cluster/components/ClusterNamespaceList.vue'
import ClusterNamespaceDetail from '@/views/cluster/components/ClusterNamespaceDetail.vue'
import ClusterPersistentVolume from '@/views/cluster/components/ClusterPersistentVolumeList.vue'
import ClusterPersistentVolumeDetail from '@/views/cluster/components/ClusterPersistentVolumeDetail.vue'
import ClusterStorageClass from '@/views/cluster/components/ClusterStorageClassList.vue'
import ClusterStorageClassDetail from '@/views/cluster/components/ClusterStorageClassDetail.vue'
import ClusterAddonCardList from '@/views/cluster/components/ClusterAddonCardList.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const clusterMapUtils = createNamespacedHelpers('cluster')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    CardTitle,
    Confirm,
    ClusterGeneral,
    ClusterNode,
    ClusterNodeDetail,
    ClusterNamespace,
    ClusterNamespaceDetail,
    ClusterPersistentVolume,
    ClusterPersistentVolumeDetail,
    ClusterStorageClass,
    ClusterStorageClassDetail,
    ClusterAddonCardList,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      clusterIdx: null,
      tab: null,
      isEncodingContent: true,
      tabNames: [
        'General',
        'Add-on',
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
      this.$router.push('/cluster/list')
    }
    console.log('클러스터 데이터: ', this.dataDetail)
    this.checkProjectAuth(this.dataDetail.projectIdx)
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
          if (
            ['KUBESPRAY', 'AKS', 'GKE', 'EKS', 'NKS'].includes(
              this.dataDetail.provisioningType,
            )
          ) {
            this.openAlert({
              title: '클러스터 삭제를 요청하였습니다.',
              type: 'info',
            })
          } else {
            this.openAlert({
              title: '클러스터가 삭제 되었습니다.',
              type: 'info',
            })
          }
          // 1초 후 리스트 화면으로 이동
          setTimeout(() => this.$router.push('/cluster/list'), 1000)
        } else {
          // 삭제 실패 시
          this.openAlert({
            title: '클러스터 삭제를 실패했습니다.',
            type: 'error',
          })
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({
          title: '클러스터 삭제를 실패했습니다.',
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
