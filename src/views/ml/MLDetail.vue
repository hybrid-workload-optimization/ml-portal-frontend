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
    <v-tabs-items class="project-layout__tab-item" v-model="tab">
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
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'
import DetailTitle from '@/views/ml/components/MLTitleWithDetail.vue'
import ClusterList from '@/views/ml/components/MLDetailClusterList.vue'
import MlWorkload from '@/views/ml/components/MLWorkload.vue'

const mlMapUtils = createNamespacedHelpers('ml')

export default {
  props: {},
  components: {
    DetailTitle,
    ClusterList,
    MlWorkload,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      mlId: null,
      tab: null,
      tabNames: ['Workload', 'Cluster'], // 탭 명칭들
      clusterSearch: '',
      memberSearch: '',
    }
  },

  created() {
    this.mlId = this.$route.params.id
  },

  computed: {
    // cluster 탭 List
    getListCluster() {
      return {
        group: [this.detailInfo.clusterInfo],
      }
    },

    ...mlMapUtils.mapGetters([
      'dataDetailClusterList',
      // 'userSize',
      // 'clusterSize',
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
        // memberCount: this.detailInfo.userCount,  // 삭제
      }
    },
  },

  mounted() {
    this.getDetail({ mlId: this.mlId, type: 'view' })
    // // this.getDetailClusterList({ projectIdx: this.projectIdx }) // 삭제
    // // this.getDetailUserList({ projectIdx: this.projectIdx })    // 삭제
    // // this.getUserRoleAllList()                                 // 삭제
  },

  methods: {
    ...mlMapUtils.mapActions([
      'getDetail',
      'getDetailClusterList',
      'getDetailUserList',
      'getUserRoleAllList',
    ]),
    // onClickDeleteProject() {
    //   console.log('삭제기능 추가예정')
    // },
    // onClickDeleteCluster() {},
    // onClickDeleteMember() {},
    onChangeClusterSearch(value) {
      this.clusterSearch = value
    },

    // onChangeMemberSearch(value) {
    //   this.memberSearch = value
    // },
    //
    // onClickEditProject() {
    //   const id = this.projectIdx
    //
    //   if (id) {
    //     this.$router.push(`/project/edit/${id}`)
    //   }
    // },
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
