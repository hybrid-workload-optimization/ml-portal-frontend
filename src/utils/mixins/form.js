import { validate } from '../validate'

// const tag = '[MixIn_Form]'

export const form = {
  data() {
    return {
      name: '',
      email: '',
      isRemembered: false,
      password: '',
      confirmPassword: '',
      organization: '',
      contact: '',
      labelKey: '',
      labelValue: '',
      rules: validate,
      isMounted: false,
      checkedUserId: false,
    }
  },
  computed: {
    passwordConfirmationRule() {
      return (
        this.confirmPassword === this.password ||
        '비밀번호가 일치하지 않습니다.'
      )
    },
    checkBeforeSubmit() {
      if (!this.isMounted) {
        return true
      }

      const isValidate = this.$refs.form.validate()
      if (!isValidate) {
        return false
      }

      return true
    },
    emailConfirmationRule() {
      if (this.rules.requiredEmail[1](this.email) === true) {
        return true
      }
      return false
    },
  },

  methods: {
    onChangeName(value) {
      // console.log(tag, value, 'onChangeName')
      this.name = value
    },
    onChangeEmail(value) {
      // console.log(tag, value, 'onChangeEmail')
      // console.log(this.rules)
      // const regVal = value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '')
      // this.email = regVal
      this.email = value?.trim()
      this.$refs.email.lazyValue = this.email
      // if (this.$refs.email && Object.keys(this.$refs.email).length) {
      //   this.$refs.email.lazyValue = regVal
      // }
      this.checkedUserId = false
    },
    onChangePassword(value) {
      // console.log(tag, value, 'onChangePassword')
      this.password = value
    },
    onClickRememberEmail(value) {
      // console.log(tag, value, 'onClickRememberEmail')
      this.isRemembered = value
    },
    onChangeConfirmPassword(value) {
      // console.log(tag, value, 'onChangeConfirmPassword')
      this.confirmPassword = value
    },
    onChangeOrganization(value) {
      // console.log(tag, value, 'onChangeOrganization')
      this.organization = value
    },
    onChangeContact(value) {
      // console.log(tag, value, 'onChangeContact')
      this.contact = value
    },
    onChangeLabelKey(value) {
      // console.log(tag, value, 'onChangeLabelKey')
      this.labelKey = value
    },
    onChangeLabelValue(value) {
      // console.log(tag, value, 'onChangeLabelValue')
      this.labelValue = value
    },
  },
  mounted() {
    this.isMounted = true
  },
}
