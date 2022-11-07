<template>
  <div class="sp-clusters-layout">
    <div class="clusters__data-table-wrapper">
      <clusters
        :search="asIsSearch"
        :data="originClusters"
        :selected-items="asIsRequesterSelected"
        :get-checked-box-item="onClickCheckedBoxAsIsItem"
        @click-delete-clusters="onClickDeleteAsIsCluster"
      />
      <div class="clusters__icon-wrapper">
        <div
          class="clusters__radius-box"
          elevation="0"
          dense
          @click="onClickAddCluster"
        >
          <v-icon>forward</v-icon>
        </div>
        <div
          class="clusters__radius-box"
          elevation="0"
          dense
          @click="onClickRemoveCluster"
        >
          <v-icon class="rotate">forward</v-icon>
        </div>
      </div>
      <clusters
        added
        :search="toBeSearch"
        :data="addedClusters"
        :selected-items="toBeRequesterSelected"
        :get-checked-box-item="onClickCheckedBoxToBeItem"
        @click-delete-clusters="onClickDeleteToBeCluster"
      />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Clusters from '@/views/project/tabs/DataTableProjectCluster.vue'

const projectMapUtils = createNamespacedHelpers('project')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    Clusters,
  },
  data() {
    return {
      projectIdx: null,
      asIsSearch: '',
      toBeSearch: '',
      asIsRequesterSelected: [],
      toBeRequesterSelected: [],
      selectedIds: [],
    }
  },

  created() {
    this.projectIdx = this.$route.params.id
    this.getClusterList({ projectIdx: this.projectIdx })
  },

  computed: {
    originClusters() {
      const filteredGroup = this.dataGridClusterList.filter(
        cluster => !cluster.isAdded,
      )
      return {
        // ...this.$store.state.clusters.clusters,
        group: filteredGroup,
      }
    },
    addedClusters() {
      const filteredGroup = this.dataGridClusterList.filter(
        cluster => cluster.isAdded,
      )
      return {
        // ...this.$store.state.clusters.clusters,
        group: filteredGroup,
      }
    },

    // ...projectMapUtils.mapGetters(['dataClusterAllList']),
    // ...projectMapUtils.mapGetters(['dataClusterList']),
    ...projectMapUtils.mapGetters(['dataGridClusterList']),
  },

  mounted() {
    // this.getClusterList({ projectIdx: this.projectIdx })
  },

  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...projectMapUtils.mapActions(['getClusterList']),
    ...projectMapUtils.mapActions(['updateProjectCluster']),

    initSelected(selected) {
      this[selected] = []
    },

    changeIsAdded(cluster) {
      return this[cluster].map(item => ({
        ...item,
        isAdded: !item.isAdded,
      }))
    },

    onClickAddCluster() {
      this.toBeRequesterSelected = [
        ...this.toBeRequesterSelected,
        ...this.changeIsAdded('asIsRequesterSelected'),
      ]

      this.addCluster({
        payload: {
          selectedIds: this.changeIsAdded('asIsRequesterSelected'),
        },
      })

      this.initSelected('asIsRequesterSelected')
      this.initSelected('toBeRequesterSelected')
    },

    onClickRemoveCluster() {
      this.asIsRequesterSelected = [
        ...this.asIsRequesterSelected,
        ...this.changeIsAdded('toBeRequesterSelected'),
      ]

      this.removeCluster({
        payload: {
          selectedIds: this.changeIsAdded('toBeRequesterSelected'),
        },
      })

      this.initSelected('toBeRequesterSelected')
      this.initSelected('asIsRequesterSelected')
    },

    onClickDeleteAsIsCluster(cluster) {
      this.asIsRequesterSelected = this.asIsRequesterSelected.filter(
        item => item.clusterIdx !== cluster.clusterIdx,
      )
    },

    onClickCheckedBoxAsIsItem(selected) {
      this.asIsRequesterSelected = selected
    },

    onClickCheckedBoxToBeItem(selected) {
      this.toBeRequesterSelected = selected
    },

    onClickDeleteToBeCluster(cluster) {
      this.toBeRequesterSelected = this.toBeRequesterSelected.filter(
        item => item.clusterIdx !== cluster.clusterIdx,
      )
    },

    /* onClickCancel() {
      // this.$router.push('/project/list')
      this.$router.go(-1)
    }, */

    /* async onClickFinish() {
      const selectClusterList = this.dataGridClusterList.filter(
        cluster => cluster.isAdded,
      )
      const param = {
        projectIdx: this.projectIdx,
        clusterList: selectClusterList,
      }

      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.updateProjectCluster(param)
        if (response.status === 202) {
          this.openAlert({ title: response.data.message, type: 'info' })
          setTimeout(() => {
            this.$router.push(`/project/detail/${this.projectIdx}`)
          }, 1000)
        } else {
          this.openAlert({ title: response.data.message, type: 'error' })
        }
      } catch (error) {
        this.openAlert({
          title: '프로젝트 Cluster 정보를 수정하지 못했습니다.',
          type: 'error',
        })
      }
    }, */

    addCluster({ payload }) {
      payload.selectedIds.forEach(cluster => {
        const index = this.dataGridClusterList.findIndex(
          el => el.clusterIdx === cluster.clusterIdx,
        )
        this.dataGridClusterList[index].isAdded = true
      })

      this.changeCluster()
    },

    removeCluster({ payload }) {
      payload.selectedIds.forEach(cluster => {
        const index = this.dataGridClusterList.findIndex(
          el => el.clusterIdx === cluster.clusterIdx,
        )
        this.dataGridClusterList[index].isAdded = false
      })

      this.changeCluster()
    },

    changeCluster() {
      const selectClusterList = this.dataGridClusterList.filter(
        cluster => cluster.isAdded,
      )

      this.$store.state.project.editClusterList = null
      if (selectClusterList.length > 0) {
        this.$store.state.project.editClusterList = selectClusterList
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-clusters-layout {
  $this: 'clusters';
  height: 100%;
  .#{$this}__data-table-wrapper {
    width: 100%;
    height: calc(100% - 77px);
    display: flex;
    align-items: flex-start;
    .#{$this}__icon-wrapper {
      padding: 0 56px;
      align-self: center;
      .#{$this}__radius-box {
        margin: 24px 0;
        width: 58px;
        height: 58px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: $sp-teriary;
        border-radius: 50%;
        cursor: pointer;
        &:active {
          background: $sp-primary;
        }
        i {
          font-size: 40px;
          color: #fff;
          &.rotate {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
  .#{$this}__button-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 33px;
    height: 44px;

    .#{$this}__button {
      width: 114px;
      background-color: #fff;
      border-radius: 5px;
      padding: 8px 20px;
      &.#{$this}__button--cancel {
        margin-right: 8px;
        border: thin solid $sp-sky-blue-500;
        @include set-text(
          bold,
          15,
          rgba($color: $sp-sky-blue-500, $alpha: 0.8)
        );
      }
      &.#{$this}__button--finish {
        border: thin solid $sp-teriary;
        @include set-text(bold, 15, rgba($color: $sp-teriary, $alpha: 1));
      }
    }
  }
}
</style>
