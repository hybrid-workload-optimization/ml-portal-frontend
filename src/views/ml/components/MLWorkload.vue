<template>
  <div class="sp-workload-detail">
    <!-- workload 탭 상단 카드 및 데이터-->
    <workload-top-card
      :resource-box-data="setResourceBoxData"
      :pod-status-data="setPodStatusData"
    ></workload-top-card>
    <!-- workload 탭 하단 List-->
    <resources-table></resources-table>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import WorkloadTopCard from '@/views/ml/components/MLWorkloadTopCard.vue'
import ResourcesTable from '@/views/ml/components/MLResources.vue'

const mlMapUtils = createNamespacedHelpers('ml')

export default {
  components: {
    WorkloadTopCard,
    ResourcesTable,
  },
  data() {
    return {}
  },
  computed: {
    ...mlMapUtils.mapGetters(['detailInfo']), //
    setPodStatusData() {
      return [
        {
          name: 'Running',
          default: 0,
          value: this.detailInfo.activeCount,
        },
        {
          name: 'Succeded',
          default: 0,
          value: this.detailInfo.succeededCount,
        },
        {
          name: 'Failed',
          default: 0,
          value: this.detailInfo.failedCount,
        },
      ]
    },
    setResourceBoxData() {
      return [
        {
          title: 'ML Step',
          value: String(this.detailInfo.mlStep),
        },
        {
          title: 'Job',
          value: String(this.detailInfo.jobCount),
        },
        {
          title: 'Deployment',
          value: String(this.detailInfo.deploymentCount),
        },
        {
          title: 'Cron Job',
          value: String(this.detailInfo.cronJobCount),
        },
        {
          title: 'Daemon Set',
          value: String(this.detailInfo.daemonSetCount),
        },
        {
          title: 'Replica Set',
          value: String(this.detailInfo.replicaSetCount),
        },
      ]
    },
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss"></style>
