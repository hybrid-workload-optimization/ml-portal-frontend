<template>
  <div class="sp-empty">
    <sp-card class="empty__card-wrapper">
      <div class="empty__title-wrapper">{{ title }}</div>
      <div class="empty__desc-wrapper">{{ description }}</div>
    </sp-card>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
      description: 'empty 제목',
    },
    description: {
      type: String,
      default: '',
      description: 'empty 내용',
    },
  },
  computed: {},
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-empty {
  $this: 'empty';
  display: flex;
  width: 100%;
  height: 120px;
  .#{$this}__card-wrapper {
    width: 100%;
    height: 100%;
    border: thin dotted $sp-box-border;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f1f4f633;
    .#{$this}__title-wrapper {
      @include set-text(bold, 16, rgba($color: $sp-title, $alpha: 1));
      margin-bottom: 4px;
      text-align: center;
    }
    .#{$this}__desc-wrapper {
      @include set-text(light, 13, rgba($color: $sp-title, $alpha: 1));
      text-align: center;
    }
  }
}
</style>
