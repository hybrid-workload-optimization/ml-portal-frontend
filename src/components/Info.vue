<template>
  <div class="sp-info">
    <div class="info__body">
      <div class="info__image-wrapper">
        <sp-image contain lazySrc="icon_logo.svg" src="icon_logo.svg" />
      </div>
      <div class="info__first-title">Welcome to</div>
      <div class="info__second-title">ML Workload Portal</div>
      <div class="info__desc"></div>
    </div>
    <div class="info__footer">Powered by STRATO Cloud Management Platform</div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-info {
  width: 100%;
  height: 100%;
  background: $sp-primary;
  padding-left: 101px;
  $this: 'info';
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .#{$this}__body {
    .#{$this}__image-wrapper {
      padding-top: 127px;
      padding-bottom: 133px;
      width: 90px;
      height: 79px;
    }
    .#{$this}__first-title {
      @include set-text(500, 22, rgba($color: #fff, $alpha: 1));
    }

    .#{$this}__second-title {
      @include set-text(bold, 48, rgba($color: #fff, $alpha: 1));
      line-height: 1;
    }

    .#{$this}__desc {
      margin-top: 52px;
      width: 209px;
      @include set-text(500, 20, rgba($color: #fff, $alpha: 1));
    }
  }
  .#{$this}__footer {
    padding-bottom: 57px;
    @include set-text(500, 11, rgba($color: #fff, $alpha: 0.3));
  }
}
</style>
