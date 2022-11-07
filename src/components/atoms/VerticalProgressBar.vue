<template>
  <div class="loadbar">
    <strong class="bar" :style="progressHtml">{{ percent }}%</strong>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: undefined,
      description: '세로형 프로그레스바 퍼센트 값',
    },
    color: {
      type: String,
      default: '#036EB8',
      description: '세로형 프로그레스 바 색상',
    },
  },
  data: () => ({}),
  computed: {
    progressHtml() {
      return `height:${this.percent}%; background-color:${this.color};`
    },
  },
}
</script>

<style lang="scss" scoped>
.loadbar {
  width: 32px;
  height: 161px;
  background-color: #fff;
  border: 1px solid #ccc;
  position: relative;
  border-radius: 8px;
  text-align: center;
  background: transparent linear-gradient(180deg, #ff472a33 0%, #00b8d533 100%)
    0% 0% no-repeat padding-box;
  border: 1px dashed #1a33501a;
}
.bar {
  width: 100%;
  display: block;
  font-family: $sub-font;
  font-size: 12px;
  color: #fff;
  position: absolute;
  bottom: 0;
  border-radius: 8px;
  padding-top: 5px;
  box-shadow: 0px 2px 8px #00000026;
  transition: 0.5s;
}
</style>
