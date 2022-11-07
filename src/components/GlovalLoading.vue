<template>
  <div class="sp-loading" v-if="showLoading">
    <sp-card class="loading__card-wrapper">
      <div class="loading__title-wrapper">{{ loadingMessage }}</div>
      <div class="loading__icon-wrapper">
        <v-progress-circular
          class="sp-loading"
          indeterminate
          :color="color"
        ></v-progress-circular>
      </div>
      <div class="loading__desc-wrapper">Please wait...</div>
    </sp-card>
  </div>
</template>

<script>
export default {
  props: {
    loadingMessage: {
      type: String,
      default: 'Check-loading',
      description: '로딩창 메세지 값',
    },
  },
  computed: {
    showLoading() {
      return this.$store.state.loading.show
    },
  },
  data: () => ({
    color: 'black',
  }),
}
</script>

<style lang="scss">
.sp-loading {
  $this: 'loading';
  .#{$this}__card-wrapper {
    z-index: 100000;
    position: absolute;
    width: 300px;
    height: 300px;
    border: 1px solid $sp-box-border;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: $sp-grey-200;
    .#{$this}__title-wrapper {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: center;
    }
    .#{$this}__icon-wrapper {
      text-align: center;
      margin-bottom: 10px;
    }
    .#{$this}__desc-wrapper {
      font-size: 1rem;
      font-weight: 500;
      text-align: center;
    }
  }
}
</style>
