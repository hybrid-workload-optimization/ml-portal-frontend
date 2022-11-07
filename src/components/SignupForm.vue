<template>
  <div class="sp-signup-form">
    <div class="signup-form__title">회원가입</div>
    <div class="signup-form__sub-title">
      Pass 포탈에 계정을 생성합니다. 아래 계정 정보를 입력 하시기 바랍니다.
    </div>
    <v-form ref="form" @submit.prevent="onSubmit">
      <div class="signup-form__input-box">
        <label-with-text
          name="User Name(필수)"
          :value="name"
          placeholder="이름을 입력하세요."
          background-color="#F5F5f5"
          :className="{
            inputStyle: {
              fontSize: '0.8rem',
              borderRadius: '10px',
            },
          }"
          :rules="rules.requiredName"
          @input="onChangeName"
        >
        </label-with-text>
      </div>
      <div class="signup-form__input-box">
        <label-with-text
          ref="email"
          name="E-mail(필수)"
          :value="email"
          placeholder="E-mail Address"
          background-color="#F5F5f5"
          :className="{
            inputStyle: {
              fontSize: '0.8rem',
              borderRadius: '10px',
            },
          }"
          :rules="[...rules.requiredEmail]"
          @input="onChangeEmail"
        >
          <template #button>
            <sp-button
              class="duplicate-check-button"
              depressed
              height="40"
              color="#4B5566"
              :disabled="!emailConfirmationRule || checkedUserId"
              @click="checkDuplicate(), (snackbar = false)"
              >중복확인</sp-button
            >
          </template>
        </label-with-text>
      </div>
      <div class="signup-form__input-box">
        <label-with-text
          name="Organization"
          placeholder="소속을 입력하세요."
          :value="organization"
          background-color="#F5F5f5"
          :className="{
            inputStyle: {
              fontSize: '0.8rem',
              borderRadius: '10px',
            },
          }"
          @input="onChangeOrganization"
        />
      </div>
      <div class="signup-form__input-box contact">
        <label-with-text
          name="Contact"
          placeholder="(-)를 제외한 숫자만 입력해주세요."
          :value="contact"
          background-color="#F5F5f5"
          :className="{
            inputStyle: {
              fontSize: '0.8rem',
              borderRadius: '10px',
            },
          }"
          :rules="rules.requiredContact"
          @input="onChangeContact"
        />
      </div>
      <div class="signup-form__button-wrapper">
        <sp-button
          @click="onSubmit"
          class="signup-form--button"
          elevation="0"
          dense
        >
          SignUp
        </sp-button>
      </div>
    </v-form>
  </div>
</template>

<script>
import { form } from '@/utils/mixins/form'
import { createNamespacedHelpers } from 'vuex'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
// import Alert from '@/components/molcule/Alert.vue'

// const tag = '[SignupForm]'

const userMapUtils = createNamespacedHelpers('user')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    LabelWithText,
    // Alert,
  },
  mixins: [form],
  data() {
    return {
      createFailToast: false,
      createOkToast: false,
      createInfoToast: false,
      createDuplToast: false,
      createTypeCheckToast: false,
      createCheckedToast: false,
      checkedUserId: false,
    }
  },
  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...userMapUtils.mapActions([
      'createUser',
      'updateUser',
      'checkDuplUserId',
      'getList',
    ]),
    ...userMapUtils.mapMutations(['closeSignUpModal']),
    async onSubmit() {
      if (!this.name) {
        this.openAlert({
          title: 'User Name을 입력해주세요.',
          type: 'warn',
        })
        return
      }
      if (!this.email) {
        this.openAlert({
          title: 'e-mail을 입력해주세요.',
          type: 'warn',
        })
        return
      }
      if (!this.$refs.form.validate()) {
        this.openAlert({
          title: '회원 정보를 정확히 입력해주세요.',
          type: 'warn',
        })
        return
      }
      const regNumber = /[^0-9]/g
      const user = {
        name: this.name,
        email: this.email,
        organization: this.organization,
        contact: this.contact.replace(regNumber, ''),
      }
      if (this.checkedUserId) {
        try {
          await this.createUser(user)
          this.openAlert({
            title:
              '회원가입이 완료 되었습니다. 가입하신 이메일로 비밀번호 재설정 링크가 전송되었습니다.',
            type: 'info',
          })
          if (this.$route.name === 'SignUp') {
            console.log('회원가입 페이지')
            this.$router.replace('/')
          } else {
            await this.closeSignUpModal()
            this.getList()
          }
        } catch (error) {
          this.openAlert({
            title: '회원 가입을 실패했습니다.',
            type: 'error',
          })
        }
      }
    },
    async checkDuplicate() {
      if (!this.emailConfirmationRule) {
        return
      }
      const mail = encodeURIComponent(this.email).replace(/\./g, '%2E')
      const response = await this.checkDuplUserId(mail)
      const { result } = response.data
      if (result === 'N') {
        // 이미 있음
        this.checkedUserId = false
        this.openAlert({
          title: '이미 등록된 Email 입니다.',
          type: 'error',
        })
      } else {
        this.checkedUserId = true
        this.openAlert({
          title: '가입 가능한Email 입니다.',
          type: 'info',
        })
      }
    },
  },
  computed: {
    ...userMapUtils.mapGetters(['detailInfo', 'isOpenSignUpModal']),
  },
  watch: {
    isOpenSignUpModal(value) {
      if (!value) {
        this.$refs.form.reset()
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-signup-form {
  $this: 'signup-form';
  width: 630px;
  margin: 10px;
  max-height: 100%;
  .#{$this}__title {
    @include set-text(bold, 32, rgba($color: $sp-title, $alpha: 1));
    margin-bottom: 11px;
  }
  .#{$this}__sub-title {
    @include set-text(500, 15, rgba($color: $sp-title, $alpha: 1), false, true);
    margin-bottom: 20px;
  }
  .#{$this}__input-box {
    padding-bottom: 15px;
    &.contact {
      padding-bottom: 0;
    }
  }

  .#{$this}__button-wrapper {
    margin-top: 30px;
    .#{$this}--button {
      width: 100%;
      height: 46px !important;
      border-radius: 8px;
      background-color: $sp-teriary;
      @include set-text(500, 15, rgba($color: #fff, $alpha: 1));
    }
  }

  .duplicate-check-button {
    color: #fff;
  }
}
</style>
