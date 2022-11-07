<template>
  <div class="not-found-page">
    <div class="not-found-card">
      <p class="not-found__title">
        404 Not Found<br />잘못된 요청을 하셨습니다.
      </p>
      <sp-button class="not-found-button" outlined @click="goToBack"
        >돌아가기</sp-button
      >
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToBack() {
      if (window.history.length <= 1 <= 1) {
        this.$router.go(-1)
      } else {
        this.$router.replace('/')
      }
    },
  },
}
</script>

<style lang="scss">
.not-found-page {
  $this: 'not-found';
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .#{$this}-card {
    width: 400px;
    height: 200px;
    background-color: $sp-body-bg-color;
    border: 1px solid $box-border;
    border-radius: 5px;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .#{$this}-button {
      width: 120px;
      color: $sp-orange;
      border-radius: 5px;
      border-width: thin;
      font-weight: bold;
      background-color: #fff;
    }
  }
}
</style>
