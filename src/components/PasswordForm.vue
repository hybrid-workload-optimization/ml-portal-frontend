<template>
  <div class="sp-password-form">
    <div class="password-form__title">비밀번호 설정</div>
    <div class="password-form__sub-title">
      비밀 번호를 설정합니다. 비밀번호 입력 시, 영대문자 1자리, 숫자포함
      8~17자리
    </div>
    <v-form ref="form" @submit.prevent="onSubmit">
      <div class="password-form__input-box">
        <label-with-text
          ref="email"
          name="E-mail"
          :value="email"
          placeholder="E-mail Address"
          background-color="#F5F5f5"
          :className="{
            inputStyle: {
              fontSize: '0.8rem',
              borderRadius: '10px',
            },
          }"
          @input="onChangeEmail"
          :readonly="true"
        />
      </div>
      <div class="password-form__input-box">
        <label-with-text
          type="password"
          name="Password"
          :value="password"
          placeholder="password"
          :rules="rules.requiredPw"
          background-color="#F5F5f5"
          :className="{
            inputStyle: {
              fontSize: '0.8rem',
              borderRadius: '10px',
            },
          }"
          @input="onChangePassword"
        />
      </div>
      <div class="password-form__input-box password">
        <label-with-text
          type="password"
          name="Password confirmation"
          placeholder="password"
          :value="confirmPassword"
          :rules="[...rules.requiredPw, passwordConfirmationRule]"
          background-color="#F5F5f5"
          :className="{
            inputStyle: {
              fontSize: '0.8rem',
              borderRadius: '10px',
            },
          }"
          @input="onChangeConfirmPassword"
        />
      </div>
      <div class="password-form__button-wrapper">
        <sp-button
          @click="onSubmit"
          elevation="0"
          height="46px"
          class="password-form--button"
          dense
        >
          Submit
        </sp-button>
      </div>
    </v-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { form } from '@/utils/mixins/form'
import LabelWithText from './molcule/LabelWithText.vue'

// const tag = '[PasswordForm]'

const userMapUtils = createNamespacedHelpers('user')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    LabelWithText,
  },
  mixins: [form],
  data() {
    return {
      requestCode: null,
    }
  },
  async mounted() {
    this.requestCode = this.$route.query.requestCode
    if (!this.requestCode) {
      this.openAlert({ title: '잘못된 접근입니다.', type: 'error' })
      this.$router.replace('/login')
    }
    await this.getUserId({ requestCode: this.requestCode })
    this.email = this.passwordInfo.userId
  },
  computed: {
    ...userMapUtils.mapGetters(['passwordInfo']),
  },
  methods: {
    ...userMapUtils.mapActions(['getUserId', 'updatePassword']),
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

    async onSubmit() {
      if (this.$refs.form.validate()) {
        try {
          await this.updatePassword({
            requestCode: this.requestCode,
            userId: this.email,
            userPassword: this.password,
          })
          this.openAlert({
            title: '비밀번호가 성공적으로 설정되었습니다.',
            type: 'info',
          })
          setTimeout(() => this.$router.replace('/login'), 1000)
        } catch (error) {
          console.log(error)
          this.openAlert({
            title: '비밀번호 설정에 실패하였습니다.',
            type: 'error',
          })
        }
      } else {
        this.openAlert({
          title: '비밀번호를 정확히 입력해주세요.',
          type: 'error',
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-password-form {
  $this: 'password-form';
  width: 500px;
  .#{$this}__title {
    @include set-text(bold, 32, rgba($color: $sp-title, $alpha: 1));
    margin-bottom: 11px;
  }
  .#{$this}__sub-title {
    @include set-text(500, 15, rgba($color: $sp-title, $alpha: 1), false, true);
    margin-bottom: 38px;
  }
  .#{$this}__input-box {
    padding-bottom: 15px;
    &.password {
      padding-bottom: 0;
    }
  }

  .#{$this}__button-wrapper {
    margin-top: 60px;
    .#{$this}--button {
      width: 100%;
      height: 46px;
      border-radius: 8px;
      background-color: $sp-teriary;
      @include set-text(500, 15, rgba($color: #fff, $alpha: 1));
    }
  }
}
</style>
