<!-- 기본 베이스 - new project, yaml 쪽만 new cluster -->
<template>
  <div class="sp-box-layout">
    <div>
      <div class="title-wrapper">
        <span class="title-text">New Workload</span>
      </div>

      <div class="sp-box-layout">
        <ml-newtop></ml-newtop>
      </div>
    </div>
    <div class="sp-box-layout">
      <div class="yaml-sector">
        <label class="yaml-title">Yaml</label>
        <ml-newyaml class="yaml-textarea"></ml-newyaml>
      </div>
    </div>
    <div class="project__button-wrapper">
      <sp-button
        class="project__button project__button--cancel"
        elevation="0"
        dense
        @click="onClickCancel"
      >
        Cancel
      </sp-button>
      <sp-button
        class="project__button project__button--finish"
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
import MlNewyaml from '@/views/ml/components/MLNewYaml.vue'

const mlMapUtils = createNamespacedHelpers('ml')
const alertMapUtils = createNamespacedHelpers('alert')
// const projectMapUtils = createNamespacedHelpers('project')
// const loginUserMapUtils = createNamespacedHelpers('loginUser')

export default {
  components: {
    MlNewtop,
    MlNewyaml,
  },

  data() {
    return {}
  },

  created() {
    // this.projectIdx = this.$route.params.id
    this.initMLInfo()
    // this.getUserRoleAllList()
  },

  computed: {
    // ...projectMapUtils.mapGetters(['dataUserRoleAllList']),
    // ...loginUserMapUtils.mapState(['currentMenuInfo']),
  },

  mounted() {
    // this.getUserRoleListForSelect()
  },

  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...mlMapUtils.mapMutations(['initMLInfo']),
    ...mlMapUtils.mapActions(['createML']),
    // ...projectMapUtils.mapActions(['getUserRoleListForSelect']),
    // ...projectMapUtils.mapActions(['getUserRoleAllList']),
    /* getProjectMembers() {
      return this.$refs.projectMembers
    }, */
    onClickCancel() {
      this.openAlert({
        title: 'Workload 생성이 취소 되었습니다.',
        type: 'error',
      })
      setTimeout(() => {
        this.$router.push('/ml/list')
      }, 1000)
    },
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

      // 테스트를 위한 파라미터
      const param = {
        // loginId: '22222',
        // loginName: '테스터',
        nameame: this.$store.state.ml.newMLName,
        description: this.$store.state.ml.newDescription,
        mlStepCode: this.$store.state.ml.newMLStep,
      }
      console.log('new param === ', param)

      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.createProject(param)
        console.log('response === ', response)
        if (response.status === 201) {
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
      this.$refs.projectMembers.onClickFinish()
    },
    // getUserRoleIdx(userRoleCode) {
    //   let result = 0
    //   const roleList = this.dataUserRoleAllList
    //   for (const role of roleList) {
    //     if (role.userRoleCode === userRoleCode) {
    //       result = role.userRoleIdx
    //       break
    //     }
    //   }
    //   return result
    // },
    checkAuth() {
      if (this.currentMenuInfo && this.currentMenuInfo.writableYn !== 'Y') {
        this.$router.go(-1)
      }
    },
  },
  beforeMount() {
    // this.checkAuth()
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.title-wrapper {
  // margin-top: 20px;
  margin-bottom: 60px;
  .title-text {
    font-size: toRem(36);
    font-weight: bold;
    color: $sub-title;
  }
}

.sp-box-layout {
  $this: 'project';
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
  .yaml-sector {
    width: 100%;
    .yaml-title {
      @include set-text(normal, 14, rgba($color: $sp-title, $alpha: 0.7));
      display: inline-block;
      float: left;
    }
    .yaml-textarea {
      width: 90%;
      float: right;
    }
  }
}
</style>
