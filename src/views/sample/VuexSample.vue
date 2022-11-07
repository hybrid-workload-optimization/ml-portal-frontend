<template>
  <div>
    <div>{{ clusters }}</div>
    <div>========================</div>
    <div>{{ clustersAlias }}</div>
    <div>========================</div>
    <div>{{ modifiedClusters }}</div>
    <div>========================</div>

    <button @click="testMu2">mutation remove test</button>
    <br />
    <button @click="actionTest1">actionTest1</button>
  </div>
</template>

<script>
import {
  mapGetters,
  mapState,
  createNamespacedHelpers,
  mapMutations,
  mapActions,
} from 'vuex'

const clusterMapUtils = createNamespacedHelpers('clusters')

export default {
  name: 'VuexSample',

  data() {
    return {
      defaultCluster: [
        {
          id: '908285e0-9071-11ec-ba47-616adbcea4d3',
          name: 'TEST-01',
          description: '테스트 입니다..',
        },
      ],
    }
  },

  mounted() {},
  computed: {
    ...mapState({
      clusters: state => state.clusters.clusters,
      clustersAlias: 'clusters', // 사용x
      modifiedClusters(state) {
        return state.clusters.clusters.concat(this.defaultCluster)
      },
    }),
    ...mapGetters({
      clusterGetter: 'clusters/getClusters',
    }),

    ...clusterMapUtils.mapState({
      moduledClusters: state => state.clusters,
      moduledClustersAlias: 'clusters', // 사용x
      moduledModifiedClusters(state) {
        return state.clusters.concat(this.defaultCluster)
      },
    }),
    ...clusterMapUtils.mapGetters({
      moduledClusterGetter: 'getClusters',
    }),
  },
  methods: {
    ...mapMutations({
      testMu2: 'clusters/removeCluster',
    }),
    ...mapActions({
      actionTest1: 'clusters/actionTest',
    }),
    ...clusterMapUtils.mapMutations({
      testMu: 'removeCluster',
    }),
  },
}
</script>

<style lang="scss" scoped></style>
