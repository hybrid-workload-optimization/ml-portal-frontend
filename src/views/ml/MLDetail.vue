<template>
  <!-- Detail 화면 상단 -->
  <div class="sp-project-layout">
    <div class="project-layout__detail-wrapper">
      <detail-title :titleData="titleData" />
    </div>

    <!-- workload / cluster -->
    <v-tabs class="project-layout__tabs" v-model="tab" color="#000">
      <v-tabs-slider color="#000"></v-tabs-slider>
      <v-tab class="detail-tab-item" v-for="item in tabNames" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <empty
      v-if="mlStatus === false"
      class="table-wrapper"
      title="클러스터 준비중"
      description=""
    />
    <v-tabs-items
      v-else-if="mlStatus === true"
      class="project-layout__tab-item"
      v-model="tab"
    >
      <v-tab-item v-for="item in tabNames" :key="item">
        <!-- workload일 경우 -->
        <ml-workload v-if="item === 'Workload'"></ml-workload>
        <!-- cluster일 경우 -->
        <cluster-list
          v-if="item === 'Cluster'"
          searchTitle="Cluster"
          :totalCount="detailInfo.clusterSize"
          :data="getListCluster"
          :search="clusterSearch"
          :isAuth="isProjectAuth"
          @input="onChangeClusterSearch"
        />
        <ml-monitoring v-if="item === 'Monitoring'" :url="getMonitoringUrl" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'
import DetailTitle from '@/views/ml/components/MLTitleWithDetail.vue'
import MlWorkload from '@/views/ml/components/MLWorkload.vue'
import ClusterList from '@/views/ml/components/MLDetailClusterList.vue'
import MlMonitoring from '@/views/ml/components/MLMonitoring.vue'
import Empty from '@/components/Empty.vue'

const mlMapUtils = createNamespacedHelpers('ml')

export default {
  props: {},
  components: {
    DetailTitle,
    MlWorkload,
    ClusterList,
    MlMonitoring,
    Empty,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      mlId: null,
      tab: null,
      tabNames: ['Workload', 'Cluster', 'Monitoring'], // 탭 명칭들
      clusterSearch: '',
      memberSearch: '',

      mlStatus: false,
    }
  },

  created() {
    this.mlId = this.$route.params.id
  },

  computed: {
    getMonitoringUrl() {
      return this.detailInfo.monitoringUrl
    },
    // cluster 탭 List
    getListCluster() {
      return {
        group: this.detailInfo.clusters,
      }
    },

    ...mlMapUtils.mapGetters([
      'dataDetailClusterList',
      'getMLList',
      'detailInfo',
    ]),

    searching() {
      if (!this.searchValue) return this.dataDetailClusterList
      const search = this.searchValue.toLowerCase()
      return this.dataDetailClusterList.filter(item => {
        const text = item.clusterName.toLowerCase()
        return text.indexOf(search) > -1
      })
    },
    titleData() {
      return {
        title: this.detailInfo.name,
        name: this.detailInfo.userId,
        id: this.detailInfo.projectPmEmail,
        date: this.detailInfo.createdAt,
        description: this.detailInfo.description,
        clusterCount: this.detailInfo.clusterCount,
      }
    },
  },

  async mounted() {
    // api 호출에 따른 status 값으로 화면에 보여지는 데이터 가림
    const response = await this.getDetail({ mlId: this.mlId, type: 'view' })
    if (response.status !== 200) {
      this.mlStatus = false
    } else {
      this.mlStatus = true
    }
  },

  methods: {
    ...mlMapUtils.mapActions([
      'testList',
      'getDetail',
      'getDetailClusterList',
      'getDetailUserList',
      'getUserRoleAllList',
    ]),
    onChangeClusterSearch(value) {
      this.clusterSearch = value
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';

.sp-project-layout {
  width: 100%;
  $this: 'project-layout';

  .#{$this}__detail-wrapper {
    padding-bottom: 13px;
  }
  .#{$this}__tabs {
    padding-bottom: 20px;
  }
  .#{$this}__tab-item {
  }
}
</style>
