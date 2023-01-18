<template>
  <div class="sp-cluster-detail-general">
    <general-top-card
      :cluster-data="setClusterData"
      :system-items="setSystemItems"
      :resource-box-data="setResourceBoxData"
    ></general-top-card>
    <div style="margin-top: 30px">
      <!-- <empty description="Relationship Diagram 적용 예정" /> -->
      <cluster-monitoring
        v-if="monitoringIframeUrl"
        :url="monitoringIframeUrl"
      />
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
    ...clusterMapUtils.mapState(['monitoringIframeUrl']),
    ...clusterMapUtils.mapGetters(['dataDetail']), // 상세

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
          title: 'Mater 가동률',
          usageStorage: 100,
          color: '#29AA54',
          usagePercentage: this.dataDetail.availableMasterPercent,
        },
        {
          title: 'Worker 가동률',
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
          title: 'Pod',
          value: String(this.dataDetail.podCount),
        },
        {
          title: 'PVC',
          value: String(this.dataDetail.pvcCount),
        },
      ]
    },
  },
  mounted() {
    this.getClusterMonotoring({ clusterIdx: this.$route.params.id })
  },
  methods: {
    ...clusterMapUtils.mapActions(['getClusterMonotoring']),
  },
}
</script>

<style lang="scss"></style>
