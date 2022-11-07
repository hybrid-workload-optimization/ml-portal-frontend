<template>
  <div class="sp-cluster-detail-general">
    <general-top-card
      :cluster-data="clusterData"
      :system-items="systemItems"
      :resource-box-data="resourceBoxData"
    ></general-top-card>
    <general-node-table></general-node-table>
  </div>
</template>

<script>
import GeneralTopCard from '@/components/cluster/general/ClusterGeneralTopCard.vue'
import GeneralNodeTable from '@/components/dashboard/DashboardTable.vue'

export default {
  components: {
    GeneralTopCard,
    GeneralNodeTable,
  },
  data: () => ({
    clusterData: {
      provider: 'vSphere',
      version: '1.21.84',
      created: '2021.12.31. 12:34',
    },
    systemItems: [
      {
        title: 'Mater 가동률',
        usageStorage: '16',
        color: '#29AA54',
        usagePercentage: 30,
      },
      {
        title: 'Worker 가동률',
        usageStorage: '16',
        color: '#F49440',
        usagePercentage: 70,
      },
    ],
    resourceBoxData: [
      {
        title: 'Master',
        value: '1',
      },
      {
        title: 'Worker',
        value: '3',
      },
      {
        title: 'Namespace',
        value: '5',
      },
      {
        title: 'Pod',
        value: '29',
      },
      {
        title: 'PVC',
        value: '4',
      },
    ],
  }),
}
</script>

<style lang="scss"></style>
