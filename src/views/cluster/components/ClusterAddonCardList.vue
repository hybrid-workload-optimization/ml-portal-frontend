<template>
  <div class="sp-cluster-addon-list">
    <template v-for="(addonData, index) in dataList">
      <cluster-addon-card :addonData="addonData" :key="index" width="290px" />
    </template>
  </div>
</template>

<script>
import ClusterAddonCard from '@/components/ClusterAddonCard.vue'
import { createNamespacedHelpers } from 'vuex'

const clusterAddOnMapUtils = createNamespacedHelpers('clusterAddOn')

export default {
  components: {
    ClusterAddonCard,
  },
  mounted() {
    this.getDataList()
  },
  computed: {
    ...clusterAddOnMapUtils.mapGetters(['dataList']),
  },
  methods: {
    ...clusterAddOnMapUtils.mapActions(['getList']),
    getDataList() {
      const params = {
        clusterIdx: this.$route.params.id,
      }
      this.getList(params)
    },
  },
}
</script>

<style lang="scss">
.sp-cluster-addon-list {
  display: flex;
  flex-wrap: wrap;

  .sp-cluster-addon-card {
    &:nth-child(5) {
      margin-right: 0;
    }
    margin: 20px 20px 0 0;
  }
}
</style>
