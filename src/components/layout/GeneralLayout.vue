<template>
  <div class="sp-general-layout">
    <h1>프로젝트 General #12 (완료)</h1>
    <div class="general-layout__project-name-wrapper">
      <label-with-text
        class="general-layout__label"
        name="* Project Name"
        background-color="#F5F5f5"
        @input="onChangeProjectName"
      />
    </div>
    <div class="general-layout__project-desc-wrapper">
      <label-with-text
        class="general-layout__label"
        name="Description"
        background-color="#F5F5f5"
        lines="multi"
        @input="onChangeProjectDesc"
      />
    </div>
    <div class="form-layout__description">
      <div>이벤트</div>
      - onChangeProjectName : 프로젝트 이름 입력시 이벤트
      <br />
      - onChangeProjectDesc : 프로젝트 설명 입력시 이벤트
      <br />
      <br />
      <div>값</div>
      - projectName : 프로젝트 이름 값
      <br />
      - projectDesc : 프로젝트 설명 값
      <br />
      <br />
    </div>
  </div>
</template>

<script>
import LabelWithText from '@/components/molcule/LabelWithText.vue'

const tag = '[sp-general-layout]'

export default {
  components: { LabelWithText },
  data() {
    return {
      projectName: '',
      projectDesc: '',
    }
  },
  methods: {
    onChangeProjectName(value) {
      console.log(tag, 'onChangeProjectName')
      this.projectName = value
    },
    onChangeProjectDesc(value) {
      console.log(tag, 'onChangeProjectDesc')
      this.projectDesc = value
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';

.sp-general-layout {
  width: 100%;
  $this: 'general-layout';
  .#{$this}__label {
    margin-bottom: 19px;
    @include set-text(normal, 15, rgba($color: $sp-title, $alpha: 1));
  }
}
</style>
