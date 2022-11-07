<template>
  <div class="sp-project-layout">
    <div class="project-layout__detail-wrapper">
      <detail-title
        :titleData="detailTitleData"
        @click-edit="onClickEditProject"
        @click-delete="onClickDeleteProject"
      />
    </div>
    <v-tabs class="project-layout__tabs" v-model="tab" color="#000">
      <v-tabs-slider color="#000"></v-tabs-slider>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items class="project-layout__tab-item" v-model="tab">
      <v-tab-item v-for="item in items" :key="item">
        <project-list
          v-if="item === 'cluster'"
          searchTitle="Cluster"
          :totalCount="String(getListCluster.group.length)"
          :data="getListCluster"
          :search="clusterSearch"
          @input="onChangeClusterSearch"
          @click="onClickDeleteCluster"
        />
        <project-list
          v-if="item === 'member'"
          searchTitle="Member"
          :totalCount="String(getListMember.group.length)"
          :data="getListMember"
          :search="memberSearch"
          @input="onChangeMemberSearch"
          @click="onClickDeleteMember"
        />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import DetailTitle from '@/components/molcule/CardTitleWithDetail.vue'
import ProjectList from '@/components/project/List.vue'
import { titleData } from '@/assets/data/TitleData'

const tag = '[sp-project-layout]'

export default {
  components: {
    DetailTitle,
    ProjectList,
  },
  data() {
    return {
      detailTitleData: titleData.CardTitleWithDetail,
      tab: null,
      items: ['cluster', 'member'],
      clusterSearch: '',
      memberSearch: '',
    }
  },
  computed: {
    getListCluster() {
      console.log(tag, 'getListCluster')
      return this.$store.state.projectClusters.data
    },

    getListMember() {
      console.log(tag, 'getListMember')
      return this.$store.state.projectMembers.data
    },
  },
  methods: {
    onClickEditProject() {
      console.log(tag, '수정 버튼 클릭')
      // eslint-disable-next-line no-alert
      alert('onClickEditProject')
    },
    onClickDeleteProject() {
      console.log(tag, '삭제 버튼 클릭')
      // eslint-disable-next-line no-alert
      alert('onClickDeleteProject')
    },

    onChangeClusterSearch(value) {
      console.log(tag, 'onChangeClusterSearch')
      this.clusterSearch = value
    },
    onClickDeleteCluster(item) {
      console.log(tag, item, 'onClickDeleteCluster')
      // eslint-disable-next-line no-alert
      alert('onClickDeleteCluster')
    },

    onChangeMemberSearch(value) {
      console.log(tag, 'onChangeMemberSearch')
      this.memberSearch = value
    },
    onClickDeleteMember(item) {
      console.log(tag, item, 'onClickDeleteMember')
      // eslint-disable-next-line no-alert
      alert('onClickDeleteMember')
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
    padding-bottom: 32px;
  }
  .#{$this}__tab-item {
  }
}
</style>
