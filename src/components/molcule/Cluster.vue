<template>
  <sp-card class="sp-cluster" :class="{ added }" elevation="0">
    <div class="cluster__icon-wrapper">
      <v-icon>storage</v-icon>
    </div>
    <div class="cluster__title-wrapper">
      <div class="cluster__title">{{ name }}</div>
      <div class="cluster__desc">{{ description }}</div>
    </div>
    <div class="cluster__button-wrapper">
      <sp-button
        v-if="!added"
        class="cluster__button cluster__button--add"
        elevation="0"
        dense
        @click="onClickAddCluster"
      >
        <v-icon>add</v-icon>
        Add
      </sp-button>
      <sp-button
        v-if="added"
        class="cluster__button cluster__button--remove"
        elevation="0"
        dense
        @click="onClickRemoveCluster"
      >
        <v-icon>remove</v-icon>
        Remove
      </sp-button>
    </div>
  </sp-card>
</template>

<script>
import { ADD_CLUSTER, REMOVE_CLUSTER } from '@/store/modules/cluster/clusters'

const tag = '[Cluster]'

export default {
  props: {
    id: {
      type: String,
      default: '',
      description: '클러스터 id',
    },
    name: {
      type: String,
      default: '',
      description: '클러스터 이름',
    },
    description: {
      type: String,
      default: '',
      description: '클러스터 설명',
    },
    added: {
      type: Boolean,
      default: false,
      description: '약간 하얗게 적용',
    },
  },
  methods: {
    onClickAddCluster() {
      console.log(tag, 'onClickAddCluster')
      this.$store.commit({
        type: ADD_CLUSTER,
        payload: {
          id: this.id,
        },
      })
    },
    onClickRemoveCluster() {
      console.log(tag, 'onClickRemoveCluster')
      this.$store.commit({
        type: REMOVE_CLUSTER,
        payload: {
          id: this.id,
        },
      })
    },
  },
}
</script>

<style lang="scss">
.sp-cluster {
  width: 100%;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  border: 1px solid $sp-box-border !important;
  background-color: $sp-grey-200 !important;
  margin-bottom: 10px;

  &.added {
    background-color: #fff !important;
  }
  $this: 'cluster';
  .card-body {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .#{$this}__icon-wrapper {
    margin-right: 20px;
  }
  .#{$this}__title-wrapper {
    flex: 1;
    .#{$this}__title {
      font-weight: bold;
      font-size: 1.3rem;
    }

    .#{$this}__desc {
      font-size: 0.8rem;
    }
  }
  .#{$this}__button-wrapper {
    .#{$this}__button {
      border-radius: 20px;
      height: 20px;
      font-weight: bold;
      font-size: 0.8rem;
      width: 120px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
    }
    .#{$this}__button--add {
      border: 1px solid $sp-teriary;
      color: $sp-teriary;
      i {
        font-size: 1rem;
        color: $sp-teriary;
      }
    }

    .#{$this}__button--remove {
      border: 1px solid $sp-red;
      color: $sp-red;
      background-color: #fff;

      i {
        font-size: 1rem;
        color: $sp-red;
      }
    }
  }
}
</style>
