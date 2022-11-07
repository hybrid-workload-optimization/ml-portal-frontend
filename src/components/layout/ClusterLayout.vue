<template>
  <div class="sp-clusters-layout">
    <h1>클러스터 추가/삭제 컴포넌트 #11 (완료)</h1>
    <div class="clusters__data-table-wrapper">
      <clusters
        :search="asIsSearch"
        :data="originClusters"
        :selected-items="asIsRequesterSelected"
        :get-checked-box-item="onClickCheckedBoxAsIsItem"
        @click-delete-clusters="onClickDeleteAsIsCluster"
        scroll-only
        :items-per-page="originClusters.length"
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
        scroll-only
        :items-per-page="addedClusters.length"
      />
    </div>
    <div class="clusters__button-wrapper">
      <sp-button
        class="clusters__button clusters__button--cancel"
        elevation="0"
        dense
        @click="onClickCancel"
      >
        Cancel
      </sp-button>
      <sp-button
        class="clusters__button clusters__button--finish"
        elevation="0"
        dense
        @click="onClickFinish"
      >
        Finish
      </sp-button>
    </div>
  </div>
</template>

<script>
import Clusters from '@/components/DataTableWithChips.vue'
import { ADD_CLUSTER, REMOVE_CLUSTER } from '@/store/modules/cluster/clusters'

const tag = '[ClusterLayout]'

export default {
  components: {
    Clusters,
  },
  data() {
    return {
      asIsSearch: '',
      toBeSearch: '',
      asIsRequesterSelected: [],
      toBeRequesterSelected: [],
    }
  },
  computed: {
    originClusters() {
      console.log(tag, 'originClusters')
      const filteredGroup = this.$store.state.clusters.clusters.group.filter(
        cluster => !cluster.isAdded,
      )
      return {
        ...this.$store.state.clusters.clusters,
        group: filteredGroup,
      }
    },
    addedClusters() {
      console.log(tag, 'originClusters')
      const filteredGroup = this.$store.state.clusters.clusters.group.filter(
        cluster => cluster.isAdded,
      )
      return {
        ...this.$store.state.clusters.clusters,
        group: filteredGroup,
      }
    },
  },
  methods: {
    initSelected(selected) {
      console.log(tag, 'initSelected')
      this[selected] = []
    },

    changeIsAdded(cluster) {
      console.log(tag, 'changeIsAdded')
      return this[cluster].map(item => ({
        ...item,
        isAdded: !item.isAdded,
      }))
    },

    onClickAddCluster() {
      console.log(tag, 'onClickAddCluster')

      this.toBeRequesterSelected = [
        ...this.toBeRequesterSelected,
        ...this.changeIsAdded('asIsRequesterSelected'),
      ]

      this.$store.commit({
        type: ADD_CLUSTER,
        payload: {
          selectedIds: this.changeIsAdded('asIsRequesterSelected'),
        },
      })

      this.initSelected('asIsRequesterSelected')
      this.initSelected('toBeRequesterSelected')
    },

    onClickRemoveCluster() {
      console.log(tag, 'onClickRemoveCluster')
      this.asIsRequesterSelected = [
        ...this.asIsRequesterSelected,
        ...this.changeIsAdded('toBeRequesterSelected'),
      ]

      this.$store.commit({
        type: REMOVE_CLUSTER,
        payload: {
          selectedIds: this.changeIsAdded('toBeRequesterSelected'),
        },
      })

      this.initSelected('toBeRequesterSelected')
      this.initSelected('asIsRequesterSelected')
    },

    onClickDeleteAsIsCluster(cluster) {
      console.log(tag, 'onClickDeleteAsIsCluster')

      this.asIsRequesterSelected = this.asIsRequesterSelected.filter(
        item => item.id !== cluster.id,
      )
    },

    onClickCheckedBoxAsIsItem(selected) {
      console.log(tag, 'onClickCheckedBoxAsIsItem')

      this.asIsRequesterSelected = selected
    },

    onClickCheckedBoxToBeItem(selected) {
      console.log(tag, 'onClickCheckedBoxToBItem')

      this.toBeRequesterSelected = selected
    },

    onClickDeleteToBeCluster(cluster) {
      console.log(tag, 'onClickDeleteToBeCluster')

      this.toBeRequesterSelected = this.toBeRequesterSelected.filter(
        item => item.id !== cluster.id,
      )
    },

    onClickCancel() {
      console.log(tag, 'onClickCancel')
    },

    onClickFinish() {
      console.log(tag, 'onClickFinish')
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
    align-items: center;
    .#{$this}__icon-wrapper {
      padding: 0 56px;
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
      background-color: #fff;
      border-radius: 20px;
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
