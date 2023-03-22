<template>
  <div class="sp-project-layout">
    <div class="project-layout__detail-wrapper">
      <detail-title
        :showButton="isProjectAuth"
        :titleData="titleData"
        @click-edit="onClickEditProject"
        @click-delete="onClickDeleteProject"
      />
    </div>
    <v-tabs class="project-layout__tabs" v-model="tab" color="#000">
      <v-tabs-slider color="#000"></v-tabs-slider>
      <v-tab class="detail-tab-item" v-for="item in tabNames" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items class="project-layout__tab-item" v-model="tab">
      <v-tab-item v-for="item in tabNames" :key="item">
        <project-list
          v-if="item === 'Cluster'"
          searchTitle="Cluster"
          :totalCount="clusterSize.toString()"
          :data="getListCluster"
          :search="clusterSearch"
          :isAuth="isProjectAuth"
          @input="onChangeClusterSearch"
          @click="onClickDeleteCluster"
        />
        <project-list
          v-if="item === 'Member'"
          searchTitle="Member"
          :totalCount="userSize.toString()"
          :data="getListMember"
          :search="memberSearch"
          :isAuth="isProjectAuth"
          @input="onChangeMemberSearch"
          class="project-layout__member-list"
        />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import DetailTitle from '@/views/project/ProjectTitleWithDetail.vue'
import ProjectList from '@/views/project/ProjectDetailClusterList.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const projectMapUtils = createNamespacedHelpers('project')

export default {
  props: {},
  components: {
    DetailTitle,
    ProjectList,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      projectIdx: null,
      tab: null,
      tabNames: ['Cluster', 'Member'], // 탭 명칭들
      clusterSearch: '',
      memberSearch: '',
    }
  },

  created() {
    this.projectIdx = this.$route.params.id
    this.checkProjectAuth(this.projectIdx)
  },

  computed: {
    getListCluster() {
      return {
        group: this.dataDetailClusterList,
      }
      // return this.$store.state.projectClusters.data
    },

    getListMember() {
      return {
        group: this.dataDetailUserList,
      }
      // return this.$store.state.projectMembers.data
    },

    ...projectMapUtils.mapGetters([
      'dataDetailClusterList',
      'userSize',
      'clusterSize',
      'dataDetailUserList',
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
        title: this.detailInfo.projectName,
        name: this.detailInfo.projectPmName,
        id: this.detailInfo.projectPmEmail,
        date: this.detailInfo.createdAt,
        description: this.detailInfo.description,
        clusterCount: this.detailInfo.clusterCount,
        memberCount: this.detailInfo.userCount,
      }
    },
  },

  mounted() {
    this.getDetail({ projectIdx: this.projectIdx, type: 'view' })
    this.getDetailClusterList({ projectIdx: this.projectIdx })
    this.getDetailUserList({ projectIdx: this.projectIdx })
    this.getUserRoleAllList()
  },

  methods: {
    ...projectMapUtils.mapActions([
      'getDetail',
      'getDetailClusterList',
      'getDetailUserList',
      'getUserRoleAllList',
    ]),
    onClickDeleteProject() {},
    onClickDeleteCluster() {},
    onClickDeleteMember() {},
    onChangeClusterSearch(value) {
      this.clusterSearch = value
    },

    onChangeMemberSearch(value) {
      this.memberSearch = value
    },

    onClickEditProject() {
      const id = this.projectIdx

      if (id) {
        this.$router.push(`/project/edit/${id}`)
      }
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
