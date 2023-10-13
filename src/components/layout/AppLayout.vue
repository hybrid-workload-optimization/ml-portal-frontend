<template>
  <v-app class="sp-app-layout" :class="{ ...className }" id="app">
    <template #default>
      <slot name="default"></slot>
    </template>
  </v-app>
</template>

<script>
export default {
  props: {
    /*
     @brief 클래스 이름 값 할당
     @date 2021/11/04
     @example
     {
       클래스 이름 : {
         타입: '',
         필수유무: Boolean
         디폴트: 값
       }
     }
    */
    className: {
      type: Object,
      description: '클래스 이름 값 할당',
      isActive: {
        type: Boolean,
        description: '액티브 유무',
      },
    },
  },
}
</script>
<style lang="scss">
@import '@/styles/_mixin.scss';

body {
  background-color: $sp-body-bg-color;
  .sp-app-layout {
    // border: 1px solid red;
    max-width: 1920px;
    margin: 0 auto;
    background-color: #f5f7f8 !important;

    .form-layout__description {
      border: 1px solid red;
      width: 100%;
      margin-bottom: 50px;
    }
  }
}
</style>
