<template>
  <div class="sp-password">
    <div class="password__info-wrapper">
      <info />
    </div>
    <div class="password__password-wrapper">
      <password-form />
    </div>
  </div>
</template>

<script>
import PasswordForm from '@/components/PasswordForm.vue'
import Info from '@/components/Info.vue'

export default {
  components: {
    PasswordForm,
    Info,
  },
}
</script>

<style lang="scss">
.sp-password {
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100%;
  $this: 'password';
  .#{$this}__info-wrapper {
    min-width: 500px;
    width: 35%;
    height: 100%;
  }
  .#{$this}__password-wrapper {
    width: 65%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
