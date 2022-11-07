<template>
  <div class="sp-form-layout">
    <p>모든 폼의 이벤트는 @/utils/mixins/form 경로를 참고</p>
    <p>모든 폼의 유효성 검사는 @/utils/validate 경로를 참고</p>
    <h1>* 로그인 컴포넌트 #3 (완료)</h1>

    <login-form />
    <div class="form-layout__description">
      <div>이벤트</div>
      - onChangeEmail : 이메일 입력시 이벤트
      <br />
      - onChangePassword : 비밀번호 입력시 이벤트
      <br />
      - onClickRememberEmail : 이메일 저장 체크박스 이벤트
      <br />
      - onSubmit: 전송 이벤트
      <br />
      - onClickOpenAlert: 토스트 오픈 이벤트
      <br />
      <br />
      <div>값</div>
      - email : 이메일 값
      <br />
      - password : 비밀번호 값
      <br />
      - isRemembered : 체크박스 값
      <br />
      - isOpenToast : 토스트 오픈 유무
      <br />
      <br />
      <div>유효성 검사</div>
      - rules.requiredEmail : 이메일 필수 검사
      <br />
      - rules.requiredPw : 비밀번호 필수 검사
    </div>
    <h1>* 회원가입 컴포넌트 #4 (완료)</h1>
    <signup-form />
    <div class="form-layout__description">
      <div>이벤트</div>
      - onChangeName : 이름 입력시 이벤트
      <br />
      - onChangeEmail : 이메일 입력시 이벤트
      <br />
      - onChangePassword : 비밀번호 입력시 이벤트
      <br />
      - onChangeOrganization : 소속 입력 이벤트
      <br />
      - onChangeContact : 연락처 입력 이벤트
      <br />
      - onSubmit: 전송 이벤트
      <br />
      <br />
      <div>값</div>
      - name : 이름 값
      <br />
      - email : 이메일 값
      <br />
      - password : 비밀번호 값
      <br />
      - organization : 소속 값
      <br />
      - contact : 연락처 값
      <br />
      <br />
      <div>유효성 검사</div>
      - rules.requiredName : 이름 필수 검사
      <br />
      - rules.requiredEmail : 이메일 필수 검사
      <br />
      - rules.requiredPw : 비밀번호 필수 검사
      <br />
      - rules.requiredOrganization : 소속 필수 검사
      <br />
      - rules.requiredContact : 연락처 필수 검사
    </div>
    <h1>* 비밀번호 설정 컴포넌트 #5 (완료)</h1>
    <password-form />
    <div class="form-layout__description">
      <div>이벤트</div>
      - onChangeEmail : 이메일 입력시 이벤트
      <br />
      - onChangePassword : 비밀번호 입력시 이벤트
      <br />
      - onChangeConfirmPassword : 비밀번호 확인 입력시이벤트
      <br />
      - onSubmit: 전송 이벤트
      <br />
      <br />
      <div>값</div>
      - email : 이메일 값
      <br />
      - password : 비밀번호 값
      <br />
      - confirmPassword : 비밀번호 확인 값
      <br />
      <br />
      <div>유효성 검사</div>
      - rules.requiredEmail : 이메일 필수 검사
      <br />
      - rules.requiredPw : 비밀번호 필수 검사
      <br />
      - rules.requiredPwConfirm : 비밀번호 확인 필수 검사
    </div>
    <h1>* 입력 폼 컴포넌트 (완료)</h1>
    <div class="basic-form__input-box">
      <label-with-text
        name="Contact"
        placeholder="연락처를 입력하세요."
        :value="value"
        background-color="#F5F5f5"
        :className="{
          inputStyle: {
            fontSize: '0.8rem',
            borderRadius: '10px',
          },
        }"
        @input="onChange"
      />
    </div>
    <div class="basic-form__input-box">
      <label-with-text
        horizontal
        name="Contact"
        placeholder="연락처를 입력하세요."
        :value="value"
        background-color="#F5F5f5"
        :className="{
          inputStyle: {
            fontSize: '0.8rem',
            borderRadius: '10px',
          },
        }"
        @input="onChange"
      />
    </div>
    <div class="form-layout__description">
      <div>이벤트</div>
      <br />
      <div>값</div>
      <br />
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'
import SignupForm from '@/components/SignupForm.vue'
import PasswordForm from '@/components/PasswordForm.vue'
import LabelWithText from '@/components/molcule/LabelWithText.vue'

export default {
  props: {},
  data() {
    return {
      value: '',
    }
  },
  components: {
    LoginForm,
    SignupForm,
    PasswordForm,
    LabelWithText,
  },
  methods: {
    onChange(value) {
      console.log('onChange')
      this.value = value
    },
  },
}
</script>
<style lang="scss">
.sp-form-layout {
  // border: 1px solid blue;
  width: 100%;
  p {
    text-align: right;
  }
  .basic-form__input-box {
    width: 500px;
    margin-bottom: 15px;
  }
}
</style>
