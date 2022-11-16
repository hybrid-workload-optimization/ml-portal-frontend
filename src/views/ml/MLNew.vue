<!-- 기본 베이스 - new project, yaml 쪽만 new cluster -->
<template>
  <div class="sp-box-layout">
    <div>
      <div class="title-wrapper">
        <span class="title-text">New Workload</span>
      </div>

      <!-- name, description, ML Step, Yaml 입력 컴포넌트-->
      <ml-newtop></ml-newtop>
    </div>

    <div class="ml__button-wrapper">
      <sp-button
        class="ml__button ml__button--cancel"
        elevation="0"
        dense
        @click="onClickCancel"
      >
        Cancel
      </sp-button>
      <sp-button
        class="ml__button ml__button--finish"
        elevation="0"
        dense
        @click="onClickFinish"
      >
        Finish
      </sp-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import MlNewtop from '@/views/ml/components/MLNewTop.vue'

const mlMapUtils = createNamespacedHelpers('ml')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    MlNewtop,
  },

  data() {
    return {}
  },

  created() {
    this.initMLInfo()
  },

  computed: {},

  mounted() {},

  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...mlMapUtils.mapMutations(['initMLInfo']),
    ...mlMapUtils.mapActions(['createML']),

    onClickCancel() {
      this.$router.push('/ml/list')
    },

    openYamlEditor() {},
    async onClickFinish() {
      // Machine Learning 이름 유효성 검사 시작
      if (
        this.$store.state.ml.newMLName === undefined ||
        this.$store.state.ml.newMLName === ''
      ) {
        this.openAlert({
          title: 'Machine Learning Name을 입력해 주세요.',
          type: 'error',
        })
        return
      }
      // Machine Learning 이름 유효성 검사 끝

      // Machine Learning Discription 유효성 검사 시작
      if (this.$store.state.ml.newDescription !== '') {
        if (this.$store.state.ml.newDescription.length > 200) {
          this.openAlert({
            title: 'Description 은 200자를 초과 입력할 수 없습니다.',
            type: 'error',
          })
          return
        }
      }
      // Machine Learning Discription 유효성 검사 끝

      // Machine Learning mlStep 유효성 검사 시작
      if (
        this.$store.state.ml.newMLStepCode === undefined ||
        this.$store.state.ml.newMLStepCode === null
      ) {
        this.openAlert({
          title: 'Machine Learning Step을 선택해 주세요.',
          type: 'error',
        })
        return
      }
      // Machine Learning mlStep 유효성 검사 끝

      // Machine Learning Yaml 유효성 검사 시작
      if (
        this.$store.state.ml.newMLYaml === undefined ||
        this.$store.state.ml.newMLYaml === null
      ) {
        this.openAlert({
          title: 'Machine Learning Yaml을 입력해 주세요.',
          type: 'error',
        })
        return
      }
      // Machine Learning Yaml 유효성 검사 끝

      // api 호출을 위한 파라미터 세팅
      const encodedContent = Buffer.from(
        this.$store.state.ml.newMLYaml,
        'utf8',
      ).toString('base64')
      const param = {
        name: this.$store.state.ml.newMLName,
        description: this.$store.state.ml.newDescription,
        mlStepCode: this.$store.state.ml.newMLStepCode,
        yaml: encodedContent,
      }
      // ML 생성 api 호출
      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.createML(param)
        console.log('response === ', response)
        if (response.status === 201 || response.status === 200) {
          if (response.data.code === '10001') {
            this.openAlert({
              title: `${this.$store.state.ml.newMLName} Machine Learning 생성이 완료 되었습니다.`,
              type: 'info',
            })
            setTimeout(() => {
              this.$router.push('/ml/list')
            }, 1000)
          } else {
            this.openAlert({ title: response.data.message, type: 'error' })
          }
        } else {
          this.openAlert({ title: response.data.message, type: 'error' })
        }
      } catch (error) {
        this.openAlert({
          title: '머신러닝을 생성하지 못했습니다.',
          type: 'error',
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.title-wrapper {
  margin-top: 20px;
  .title-text {
    font-size: toRem(36);
    font-weight: bold;
    color: $sub-title;
  }
}
.yaml-part {
  .button-wrapper {
    .connected-message {
      @include set-text(normal, 13, $sp-sky-blue-500, false, true);
      margin-right: 10px;
    }
    .check-connect-button {
      color: white;
      background: $sp-teriary;
    }
  }
}
.sp-box-layout {
  $this: 'ml';
  .#{$this}__button-wrapper {
    clear: both;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 33px;
    height: 44px;
    //margin-right: 20px;

    .#{$this}__button {
      width: 114px;
      background-color: #fff;
      border-radius: 5px;
      padding: 8px 20px;
      &.#{$this}__button--cancel {
        margin-right: 8px;
        border: thin solid $sp-sky-blue-500;
        @include set-text(
          bold,
          15,
          rgba($color: $sp-sky-blue-500, $alpha: 0.8)
        );
      }
      &.#{$this}__button--finish {
        border: thin solid $sp-teriary;
        @include set-text(bold, 15, rgba($color: $sp-teriary, $alpha: 1));
      }
    }
  }
}
</style>
