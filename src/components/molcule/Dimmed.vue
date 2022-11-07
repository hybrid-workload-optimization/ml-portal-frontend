<template>
  <div class="sp-dimmed">
    <slot name="default"></slot>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.sp-dimmed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
</style>
