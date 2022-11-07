<template>
  <div class="sp-sign-up">
    <div class="sign-up__info-wrapper">
      <info />
    </div>
    <div class="sign-up__sign-up-wrapper">
      <!-- <signup-form /> -->
      <SignupForm />
    </div>
  </div>
</template>

<script>
import SignupForm from '@/components/SignupForm.vue'
import Info from '@/components/Info.vue'

export default {
  props: {},
  components: {
    SignupForm,
    Info,
  },
}
</script>

<style lang="scss">
.sp-sign-up {
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100%;
  $this: 'sign-up';
  .#{$this}__info-wrapper {
    min-width: 500px;
    width: 35%;
    height: 100%;
  }
  .#{$this}__sign-up-wrapper {
    width: 65%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
