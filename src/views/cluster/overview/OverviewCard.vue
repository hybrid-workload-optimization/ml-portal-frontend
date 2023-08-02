<template>
  <div>
    <overview-cluster-summary></overview-cluster-summary>
    <overview-control-plane></overview-control-plane>
    <overview-nodes></overview-nodes>
    <overview-namespace></overview-namespace>
    <overview-workload></overview-workload>
    <overview-pod></overview-pod>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import OverviewClusterSummary from '@/views/cluster/overview/OverviewClusterSummary.vue'
import OverviewControlPlane from '@/views/cluster/overview/OverviewControlPlane.vue'
import OverviewNodes from '@/views/cluster/overview/OverviewNodes.vue'
import OverviewNamespace from '@/views/cluster/overview/OverviewNamespace.vue'
import OverviewWorkload from '@/views/cluster/overview/OverviewWorkload.vue'
import OverviewPod from '@/views/cluster/overview/OverviewPod.vue'

const clusterMapUtils = createNamespacedHelpers('cluster')

export default {
  components: {
    OverviewControlPlane,
    OverviewClusterSummary,
    OverviewNodes,
    OverviewNamespace,
    OverviewWorkload,
    OverviewPod,
  },
  data() {
    return {
      chartData: [
        { name: 'Category 1', value: 30 },
        { name: 'Category 2', value: 40 },
        { name: 'Category 3', value: 20 },
      ],
      donutColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      donutLabel: 'Total',
      chartOptionProps: {
        responsive: true,
        maintainAspectRatio: false,
        // 다른 도넛 차트 옵션 설정
      },
    }
  },
  computed: {
    ...clusterMapUtils.mapGetters(['overviewData']),
    isMini() {
      return this.$store.state.sideNav.isMini
    },
  },
  async mounted() {
    this.isLoading = true
    await this.getDataDetail()
    this.isLoading = false
    console.log(this.overviewData)
  },
  methods: {
    ...clusterMapUtils.mapActions(['getDataOverview']),
    async getDataDetail() {
      const param = {
        clusterIdx: this.$route.params.id,
      }
      await this.getDataOverview(param)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-overview {
  $this: 'overview';
  width: 100%;
  margin-bottom: 1.5%;
  // width: 18.8%;
  // margin-right: 1.5%;
  // margin-bottom: 1.5%;
  // white-space: nowrap;

  // &:nth-child(5n) {
  // margin-right: 0;
  // }

  // &.isMini {
  //   width: 15.4%;
  //   margin-right: 1.5%;
  //   &:nth-child(6n) {
  //     margin-right: 0;
  //   }
  // }

  // .card-body {
  //   padding: 0 !important;
  // }

  // height: 150px;
  // max-height: 150px;
  border: 1px solid rgba($color: $sp-box-border, $alpha: 1) !important;
  background: rgba($color: #fff, $alpha: 1) !important;

  .#{$this}__header-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    padding-top: 20px;
    .#{$this}__tag-box {
      display: flex;
      align-items: center;

      .#{$this}__tag {
        @include set-text(500, 11, rgba($color: #fff, $alpha: 1));
        padding: 0 15px;
        height: 21px;
        margin-right: 5px;
        &.NEW {
          background: $sp-cerise !important;
        }
        &.Owner {
          background: $sp-blue-400 !important;
        }
      }
    }
    .#{$this}--more {
      .v-btn__content {
        padding: 0;
        margin: 0;
      }
      background: transparent;
      padding: 0;
      height: 0;
      min-width: 0;
    }
  }
  .#{$this}__contents-box {
    width: 100%;
    padding-top: 11px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow-x: auto;
    // flex-wrap: wrap;
    max-height: 1000px;
    .#{$this}__title-wrapper {
      align-self: flex-start;
      width: 100%;
    }
    .#{$this}__title {
      @include set-text(bold, 16, rgba($color: $sp-title, $alpha: 1));
      cursor: pointer;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .#{$this}-wrapper {
      padding-top: 10px;
      .apexcharts-legend {
        display: none !important;
      }
      .#{$this}__long-box {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        // border-bottom: 1px solid rgba($color: $sp-box-border, $alpha: 1);
        padding: 11px 2px;
        &:first-child {
          // border-top: 1px solid rgba($color: $sp-box-border, $alpha: 1);
        }
        &.#{$this}-box {
          .#{$this}-row-box {
            // width: 48%;
            display: flex;
            align-items: center;
            float: left;
            margin-right: 10px;
          }
          .#{$this}-title {
            display: flex;
            align-items: center;
            margin-right: 10px;
            @include set-text(500, 10, rgba($color: $sp-title, $alpha: 1));
            .#{$this}__cluster__image-wrapper {
              width: 18px;
              height: 18px;
              margin-right: 10px;
            }
          }
          .#{$this}__description {
            @include set-text(400, 14, rgba($color: $sp-title, $alpha: 1));
            text-overflow: ellipsis;
            overflow: hidden;
            height: 30px;
            width: 100%;
          }
          .#{$this}-num {
            @include set-text(bold, 12, rgba($color: $sp-title, $alpha: 1));
          }
        }
      }
    }
  }
  .#{$this}__footer-box {
    margin-top: 22px;
    padding-bottom: 13px;
    padding-top: 10px;
    border-top: 1px solid rgba($color: $sp-box-border, $alpha: 1);
    .#{$this}__names-wrapper {
      padding: 0 20px;
      .#{$this}__owner {
        @include set-text(500, 13, rgba($color: $sp-title, $alpha: 1));
      }
      .#{$this}__authority-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        @include set-text(500, 11, rgba($color: $sp-title, $alpha: 0.75));
      }
    }
  }
}

.v-list-item {
  min-height: 25px;
}
</style>
