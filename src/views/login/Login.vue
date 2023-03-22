<template>
  <div class="sp-login">
    <div class="login__info-wrapper">
      <info />
    </div>
    <div class="login__login-wrapper">
      <login-form />
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'
import Info from '@/components/Info.vue'

export default {
  components: {
    LoginForm,
    Info,
  },
}
</script>

<style lang="scss">
.sp-login {
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100%;
  $this: 'login';
  .#{$this}__info-wrapper {
    min-width: 500px;
    width: 35%;
    height: 100%;
  }
  .#{$this}__login-wrapper {
    width: 65%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
