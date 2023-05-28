<template>
  <div class="sp-cluster-detail-general">
    <general-top-card
      :cluster-data="setClusterData"
      :system-items="setSystemItems"
      :resource-box-data="setResourceBoxData"
    ></general-top-card>
    <div style="margin-top: 30px">
      <!-- <empty description="Relationship Diagram 적용 예정" /> -->
      <empty
        description="Click the Move to Monitoring button."
        v-if="monitoringUrl === 'NOT_FOUND'"
      />
      <cluster-monitoring v-else-if="monitoringUrl" :url="monitoringUrl" />
      <empty description="Click the Install Monitoring button." v-else />
    </div>
    <!-- <general-node-table></general-node-table> -->
  </div>
</template>

<script>
import GeneralTopCard from '@/views/cluster/components/ClusterGeneralTopCard.vue'
// import GeneralNodeTable from '@/views/cluster/components/ClusterGeneralTable.vue'
import ClusterMonitoring from '@/views/ml/components/MLMonitoring.vue'
import { createNamespacedHelpers } from 'vuex'
// pub 화면
// import GeneralTopCard from '@/components/cluster/general/ClusterGeneralTopCard.vue'
import Empty from '@/components/Empty.vue'

const clusterMapUtils = createNamespacedHelpers('cluster')

export default {
  components: {
    GeneralTopCard,
    // GeneralNodeTable,
    Empty,
    ClusterMonitoring,
  },
  data() {
    return {}
  },
  computed: {
    ...clusterMapUtils.mapGetters(['dataDetail', 'monitoringAddOnData']), // 상세
    ...clusterMapUtils.mapState(['monitoringIframeUrl']),

    setClusterData() {
      return {
        provider: this.dataDetail.provider,
        version: this.dataDetail.providerVersion,
        created: this.dataDetail.createdAt,
      }
    },
    setSystemItems() {
      return [
        {
          title: 'Master utilization rate',
          usageStorage: 100,
          color: '#29AA54',
          usagePercentage: this.dataDetail.availableMasterPercent,
        },
        {
          title: 'Worker utilization rate',
          usageStorage: 100,
          color: '#F49440',
          usagePercentage: this.dataDetail.availableWorkerPercent,
        },
      ]
    },
    setResourceBoxData() {
      return [
        {
          title: 'Master',
          value: String(this.dataDetail.masterCount),
        },
        {
          title: 'Worker',
          value: String(this.dataDetail.workerCount),
        },
        {
          title: 'Namespace',
          value: String(this.dataDetail.namespaceCount),
        },
        {
          title: 'PV',
          value: String(this.dataDetail.pvCount),
        },
        {
          title: 'Storage Class',
          value: String(this.dataDetail.storageClassCount),
        },
      ]
    },
    monitoringUrl() {
      if (this.monitoringIframeUrl) {
        return this.monitoringIframeUrl
      }
      if (Object.keys(this.monitoringAddOnData).length) {
        if (
          this.monitoringAddOnData.packages &&
          this.monitoringAddOnData.packages.length
        ) {
          let endpoints = []
          this.monitoringAddOnData.packages.some(item => {
            if (
              item.name === 'grafana' &&
              item.endpoints &&
              item.endpoints.length &&
              item.endpoints[0].endpoints
            ) {
              endpoints = item.endpoints[0].endpoints
              return item
            }
            return false
          })
          if (endpoints.length) {
            return this.monitoringIframeUrl || 'NOT_FOUND'
          }
        }
      }
      return false
    },
  },
  async mounted() {
    const result = await this.getDataDetail({
      clusterIdx: this.$route.params.id,
    })
    if (!result) {
      this.$router.push('/cluster/list')
    }
    this.getClusterMonotoring({ clusterIdx: this.$route.params.id })
    this.getDataSummary({ clusterIdx: this.$route.params.id })
    this.getMonitoringData({ clusterIdx: this.$route.params.id })
  },
  methods: {
    ...clusterMapUtils.mapActions([
      'getDataDetail',
      'getClusterMonotoring',
      'getMonitoringData',
      'getDataSummary',
    ]),
  },
}
</script>

<style lang="scss"></style>
