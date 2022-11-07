<template>
  <div class="loading-bg">
    <v-progress-circular
      class="sp-loading"
      :class="{ ...className }"
      indeterminate
      :color="color"
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  props: {
    className: {
      type: Object,
      description: '클래스 이름 값 할당',
      isActive: {
        type: Boolean,
        description: '액티브 유무',
      },
    },
    color: {
      type: String,
      default: 'primary',
      description: '로딩 서클 색상 변경',
    },
  },
}
</script>

<style lang="scss" scoped>
.loading-bg {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(3px);
  position: absolute;
  z-index: 10000;
  left: 0;
  top: 0;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
}
</style>
