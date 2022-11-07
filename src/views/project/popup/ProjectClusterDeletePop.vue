<template>
  <div class="sp-delete-cluster">
    <span v-if="dataDetailClusterList.length" class="delete-cluster__info"
      >삭제 할 Cluster 선택</span
    >
    <div class="delete-cluster__list-wrapper">
      <div
        class="delete-cluster__list-box"
        v-for="{ id, clusterName, description } in dataDetailClusterList"
        :key="id"
      >
        <v-checkbox
          hide-details="auto"
          class="delete-cluster--checkbox"
          off-icon="check_box_outline_blank"
          on-icon="check_box"
          @change="onClickCheckbox(id)"
        />
        <div class="delete-cluster__images">
          <sp-image
            contain
            lazySrc="icon_cluster1.svg"
            src="icon_cluster1.svg"
          />
        </div>
        <div class="delete-cluster__desc-wrapper">
          <div class="delete-cluster__name">{{ clusterName }}</div>
          <div class="delete-cluster__desc">{{ description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
// import Clusters from '@/assets/data/cluster'

const projectMapUtils = createNamespacedHelpers('project')

export default {
  data() {
    return {
      deleteIds: [],
    }
  },

  created() {
    this.projectIdx = this.$route.params.id
  },

  computed: {
    ...projectMapUtils.mapGetters(['dataDetailClusterList']),
  },

  methods: {
    onClickCheckbox(clusterId) {
      console.log('현재 선택된 Cluster Idx === ', this.deleteIds)
      /* if (this.deleteIds == null) {
        const clusterInfo = {
          clusterIdx: clusterId,
        }
        this.deleteIds.push(clusterInfo)
        this.$store.state.deleteClusterIdxs = this.deleteIds
      } else {
        const clusterInfo = {
          clusterIdx: clusterId,
        }

        this.deleteIds.push(clusterInfo)
        this.$store.state.deleteClusterIdxs = this.deleteIds
      } */

      const clusterInfo = {
        clusterIdx: clusterId,
      }
      this.deleteIds.push(clusterInfo)
      this.$store.state.project.deleteClusterIdxs = this.deleteIds
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-delete-cluster {
  $this: 'delete';
  padding: 0 21px;

  .#{$this}-cluster__info {
    @include set-text(
      normal,
      14,
      rgba($color: $sp-grey-400, $alpha: 1),
      false,
      true
    );
  }

  .#{$this}-cluster__list-wrapper {
    max-height: 280px;
    @include scroll();
    overflow-y: auto;
    .#{$this}-cluster__list-box {
      display: flex;
      align-items: center;
      border-radius: 5px;
      height: 83px;
      border: 1px solid rgba($color: $sp-box-border, $alpha: 1);
      margin-bottom: 8px;
      padding: 0 23px;
      &:first-child {
        margin-top: 8px;
      }
      .#{$this}-cluster--checkbox {
        //
      }
      .#{$this}-cluster__images {
        width: 22px;
        height: 22px;
        margin-right: 13px;
        margin-left: 21px;
      }
      .#{$this}-cluster__desc-wrapper {
        display: flex;
        flex-direction: column;
        .#{$this}-cluster__name {
          @include set-text(bold, 21, rgba($color: $sp-title, $alpha: 1));
        }
        .#{$this}-cluster__desc {
          @include set-text(normal, 13, rgba($color: $sp-title, $alpha: 0.8));
        }
      }
    }
  }
}
</style>
