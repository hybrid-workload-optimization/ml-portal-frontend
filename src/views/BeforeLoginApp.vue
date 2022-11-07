<template>
  <div class="sp-before-login">
    <router-view v-show="!isAuthRequired" />
  </div>
</template>

<script>
export default {
  name: 'BeforeLoginApp',
  data() {
    return {}
  },
  computed: {
    isAuthRequired() {
      return this.$route.meta.isAuthRequired
    },
  },
  methods: {},
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-before-login {
}
</style>
