<template>
  <div>
    <div class="reload-wrapper">
      <sp-image
        class="reload-list__image"
        contain
        lazySrc="icon-reload.png"
        src="icon-reload.png"
        width="18"
        @click="reloadData"
      ></sp-image>
      <span>마지막 업데이트 : {{ currentDateTime }}</span>
    </div>

    <overview-cluster-summary
      v-if="dataClusterSummary"
      :data="dataClusterSummary"
    ></overview-cluster-summary>
    <overview-control-plane
      v-if="dataControlPlaneComponent"
      :data="dataControlPlaneComponent"
    ></overview-control-plane>
    <overview-nodes v-if="dataNodes" :data="dataNodes"></overview-nodes>
    <overview-namespace
      v-if="dataNamespaces"
      :data="dataNamespaces"
    ></overview-namespace>
    <overview-workload
      v-if="dataWorkloadSummary"
      :data="dataWorkloadSummary"
    ></overview-workload>
    <overview-pod v-if="dataPodSummary" :data="dataPodSummary"></overview-pod>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import OverviewClusterSummary from '@/views/cluster/overview/OverviewClusterSummary.vue'
import OverviewControlPlane from '@/views/cluster/overview/OverviewControlPlane.vue'
import OverviewNodes from '@/views/cluster/overview/OverviewNodes.vue'
import OverviewNamespace from '@/views/cluster/overview/OverviewNamespace.vue'
import OverviewWorkload from '@/views/cluster/overview/OverviewWorkload.vue'
import OverviewPod from '@/views/cluster/overview/OverviewPod.vue'

const clusterMapUtils = createNamespacedHelpers('cluster')

export default {
  components: {
    OverviewControlPlane,
    OverviewClusterSummary,
    OverviewNodes,
    OverviewNamespace,
    OverviewWorkload,
    OverviewPod,
  },
  data() {
    return {
      clusterSummary: {},
      controlPlaneComponent: [],
      namespaces: [],
      nodes: [],
      podSummary: {},
      workloadSummary: {},
      currentDateTime: '',
    }
  },
  computed: {
    ...clusterMapUtils.mapGetters(['overviewData']),
    dataClusterSummary() {
      return this.overviewData.clusterSummary
    },
    dataControlPlaneComponent() {
      return this.overviewData.controlPlaneComponent
    },
    dataNamespaces() {
      return this.overviewData.namespaces
    },
    dataNodes() {
      return this.overviewData.nodes
    },
    dataPodSummary() {
      return this.overviewData.podSummary
    },
    dataWorkloadSummary() {
      return this.overviewData.workloadSummary
    },
    isMini() {
      return this.$store.state.sideNav.isMini
    },
  },
  async mounted() {
    this.isLoading = true
    await this.getDataDetail()
    this.isLoading = false
    this.dataSet()
    console.log(this.overviewData)

    this.getDateTime()
  },
  methods: {
    ...clusterMapUtils.mapActions(['getDataOverview']),
    async getDataDetail() {
      const param = {
        clusterIdx: this.$route.params.id,
      }
      await this.getDataOverview(param)
    },
    dataSet() {
      const data = this.overviewData
      this.clusterSummary = data.clusterSummary
      this.controlPlaneComponent = data.controlPlaneComponent
      this.namespaces = data.namespaces
      this.nodes = data.nodes
      this.podSummary = data.podSummary
      this.workloadSummary = data.workloadSummary
    },
    getDateTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')

      this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    async reloadData() {
      this.isLoading = true
      await this.getDataDetail()
      this.isLoading = false
      this.dataSet()
      console.log(this.overviewData)

      this.getDateTime()
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-overview {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 24px;
  border: 1px solid rgba($color: $sp-box-border, $alpha: 1) !important;
  background: rgba($color: #fff, $alpha: 1) !important;

  .overview-header {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 8px;
  }
  .overview-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .list-wrapper {
    min-width: 300px;
    max-width: 400px;
    width: 100%;
    height: 200px;

    .list-title {
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 8px;
    }

    .list-content {
      display: flex;
      flex-direction: column;
      gap: 4px;

      height: 168px;
      overflow-y: auto;
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .list-item-title {
          width: calc(100% - 70px);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .list-item-date {
          width: 70px;
          text-align: right;
          padding-right: 4px;
        }
      }
    }
    .no-list-content {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 168px;
      border: 1px dashed $sp-grey-400;

      .no-data-msg {
        white-space: nowrap;
      }
    }
  }

  .v-data-table-header tr > th {
    background: #fff !important;
    height: 42px !important;
  }
  tbody tr > td {
    height: 42px !important;
  }
}

.reload-wrapper {
  float: right;
  .reload-list__image {
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>
