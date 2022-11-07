<template>
  <div class="sp-cluster-node-detail">
    <card-title
      :titleData="clusterTitle"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    ></card-title>
    <div class="name-wrapper">
      <span class="host-name">{{ hostName }}</span>
    </div>
    <detail-chart-card></detail-chart-card>
    <detail-metadata></detail-metadata>
  </div>
</template>

<script>
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import DetailChartCard from '@/components/cluster/node/DetailChartCard.vue'
import DetailMetadata from '@/components/cluster/node/DetailMetaData.vue'

export default {
  components: {
    DetailChartCard,
    DetailMetadata,
    CardTitle,
  },
  data: () => ({
    clusterTitle: {
      title: 'Cluster-01',
      description: 'Strato 개발을 위한 Cluster',
    },
    hostName: 'hostname01',
  }),
  methods: {
    onClickEdit() {},
    onClickDelete() {},
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-cluster-node-detail {
  .name-wrapper {
    margin-top: 10px;
    margin-bottom: 20px;
    .host-name {
      font-size: toRem(22);
      font-weight: bold;
      color: $sp-title;
    }
  }
}
</style>
