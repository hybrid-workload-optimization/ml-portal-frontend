<template>
  <sp-card class="sp-overview" :class="{ isMini }" elevation="0">
    <div class="overview__title-wrapper">
      <div class="overview__title">
        <span class="overview__title">Control Plane Component</span>
      </div>
    </div>
    <div class="overview__contents-box" style="margin-top: 8px">
      <div class="overview-wrapper">
        <div class="overview__long-box overview-box">
          <div class="overview-row-box">
            <div class="overview-title">
              <div class="overview__image-wrapper">
                <sp-image
                  contain
                  lazySrc="icon_healthy.svg"
                  src="icon_healthy.svg"
                />
              </div>
              <span>kube-apiserver (1/1)</span>
            </div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">
              <div class="overview__image-wrapper">
                <sp-image
                  contain
                  lazySrc="icon_healthy.svg"
                  src="icon_healthy.svg"
                />
              </div>
              <span>kube-controller-manager (1/1)</span>
            </div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">
              <div class="overview__image-wrapper">
                <sp-image
                  contain
                  lazySrc="icon_healthy.svg"
                  src="icon_healthy.svg"
                />
              </div>
              <span>kube-scheduler (1/1)</span>
            </div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">
              <div class="overview__image-wrapper">
                <sp-image
                  contain
                  lazySrc="icon_healthy.svg"
                  src="icon_healthy.svg"
                />
              </div>
              <span>etcd (1/1)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="overview-wrapper">
        <div class="overview__long-box overview-box">
          <div class="overview-row-box">
            <div class="overview-title">
              <div class="overview__image-wrapper">
                <sp-image
                  contain
                  lazySrc="icon_unhealthy.svg"
                  src="icon_unhealthy.svg"
                />
              </div>
              <span>kube-proxy (2/4)</span>
            </div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">
              <div class="overview__image-wrapper">
                <sp-image
                  contain
                  lazySrc="icon_healthy.svg"
                  src="icon_healthy.svg"
                />
              </div>
              <span>calico-kube-controller (1/1)</span>
            </div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">
              <div class="overview__image-wrapper">
                <sp-image
                  contain
                  lazySrc="icon_healthy.svg"
                  src="icon_healthy.svg"
                />
              </div>
              <span>calico-node (4/4)</span>
            </div>
          </div>
          <div class="overview-row-box">
            <div class="overview-title">
              <div class="overview__image-wrapper">
                <sp-image
                  contain
                  lazySrc="icon_unhealthy.svg"
                  src="icon_unhealthy.svg"
                />
              </div>
              <span>coredns (0/2)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </sp-card>
</template>

<script></script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-overview {
  $this: 'overview';
  width: 100%;
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
      width: 100%;
      flex-wrap: wrap;
    }
    .#{$this}__title {
      @include set-text(bold, 24, rgba($color: $sp-title, $alpha: 1));
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
        // display: flex;
        // align-items: center;
        // justify-content: space-between;
        // flex-wrap: wrap;
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
            .#{$this}__image-wrapper {
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
