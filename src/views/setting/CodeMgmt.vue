<template>
  <div class="sp-code-mng-wrapper">
    <div class="code-mng__title-wrapper">
      <span class="title-text">{{ title }}</span>
      <v-icon class="title-icon">warning_amber</v-icon>
      <span class="subtitle-text">{{ subTitle }}</span>
    </div>
    <div class="code-mng__content-wrapper">
      <div class="code-mng__content-menu">
        <code-mng-menu />
      </div>
      <div class="code-mng__content-details">
        <div class="code-mng__content-detail">
          <group-code-info />
        </div>
        <div class="code-mng__content-detail">
          <code-info />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CodeMngMenu from '@/components/codeMgmt/Menu.vue'
import GroupCodeInfo from '@/components/codeMgmt/GroupCodeInfo.vue'
import CodeInfo from '@/components/codeMgmt/CodeInfo.vue'

export default {
  components: {
    CodeMngMenu,
    GroupCodeInfo,
    CodeInfo,
  },
  data: () => ({
    title: 'Code Mgmt',
    subTitle: 'Portal에서 사용하는 공통 코드를 설정 할 수 있습니다.',
  }),
  methods: {},
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-code-mng-wrapper {
  $this: 'code-mng';
  width: 100%;
  .#{$this}__title-wrapper {
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    .title-text {
      @include set-text(bold, 34, rgba($color: $sp-title, $alpha: 1));
      margin-right: 20px;
    }
    .title-icon {
      @include set-text(normal, 18, rgba($color: $sp-warning, $alpha: 1));
      margin-right: 10px;
    }
    .subtitle-text {
      @include set-text(normal, 16, rgba($color: $sp-title, $alpha: 1));
      font: {
        family: $sub-font;
      }
    }
  }

  .#{$this}__content-wrapper {
    display: flex;
    align-items: flex-start;
    width: 100%;
    .#{$this}__content-menu {
      width: 30%;
      max-height: 627px;
      height: 627px;
      padding-right: 25px;
    }
    .#{$this}__content-details {
      width: 70%;
      .#{$this}__content-detail {
        &:first-child {
          padding-bottom: 25px;
        }
      }
    }
  }

  .#{$this}__button-wrapper {
    padding-top: 30px;
    text-align: right;
    .button {
      border-radius: 100px;
      font-weight: bold;
      font-size: 15px !important;
      border-width: thin;
      width: 120px;
      height: 44px;
    }
    .cancel-button {
      color: $sp-sky-blue-500;
    }
    .finish-button {
      margin-left: 20px;
      color: $sp-teriary;
    }
  }
}
</style>
