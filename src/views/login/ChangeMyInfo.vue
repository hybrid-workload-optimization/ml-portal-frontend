<template>
  <div class="my-info">
    <div class="my-info__title-wrapper">
      <span class="title-text">회원정보</span>
    </div>

    <!-- <v-form ref="form" @submit.prevent="onSubmit"> -->
    <v-form ref="form">
      <div class="my-info__content-wrapper">
        <!-- <label-with-text
          name="UserName"
          :value="userInfo.userName"
          placeholder="이름을 입력하세요."
          :rules="rules.requiredName"
          horizontal
          @input="value => (userInfo.userName = value)"
        /> -->
        <label-with-text
          name="UserName"
          :value="userInfo.userName"
          readonly
          horizontal
        />
        <label-with-text
          name="User Email"
          :value="userInfo.email"
          readonly
          horizontal
        />

        <!-- <label-with-text
          name="Organization"
          :value="userInfo.organization"
          placeholder="소속을 입력하세요."
          horizontal
          @input="value => (userInfo.organization = value)"
        /> -->
        <label-with-text
          name="Organization"
          :value="userInfo.organization"
          readonly
          horizontal
        />

        <!-- <label-with-text
          name="Contact"
          :value="userInfo.contact"
          placeholder="(-)를 제외한 숫자만 입력해주세요."
          :rules="rules.requiredContact"
          horizontal
          @input="value => (userInfo.contact = value)"
        /> -->
        <label-with-text
          name="Contact"
          :value="userInfo.contact"
          readonly
          horizontal
        />
        <label-with-text
          name="Authority"
          horizontal
          readonly
          :value="userInfo.userRole.userRoleCode"
        />
        <!-- <div class="my-info-change-password__wrapper">
          <span
            class="my-info-change-password__label"
            @click="isChangePassword = !isChangePassword"
            >Change Password</span
          >
          <span
            class="my-info-change-password__line"
            @click="isChangePassword = !isChangePassword"
          ></span>
        </div>
        <template v-if="isChangePassword">
          <label-with-text
            name="Password"
            type="password"
            placeholder="변경할 Password"
            :rules="rules.requiredPw"
            horizontal
            :value="password"
            @input="value => (password = value)"
          />

          <label-with-text
            name="Password Confirm"
            type="password"
            horizontal
            placeholder="Confirm Password"
            :rules="[...rules.requiredPw, passwordConfirmationRule]"
            :value="confirmPassword"
            @input="value => (confirmPassword = value)"
          />
        </template> -->
      </div>
    </v-form>
  </div>
</template>

<script>
import { form } from '@/utils/mixins/form'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import { createNamespacedHelpers } from 'vuex'
import __ from 'lodash'

const loginUserMapUtil = createNamespacedHelpers('loginUser')
const userMapUtil = createNamespacedHelpers('user')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    LabelWithText,
  },
  mixins: [form],
  data() {
    return {
      userInfo: {
        userRole: {},
      },
      password: '',
      confirmPassword: '',
      isChangePassword: false,
    }
  },
  computed: {
    ...loginUserMapUtil.mapState({ originUserInfo: 'userInfo' }),
  },
  mounted() {
    this.initData()
  },
  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...userMapUtil.mapActions(['updateMyInfo']),
    initData() {
      this.$refs.form.resetValidation()
      this.userInfo = __.cloneDeep(this.originUserInfo)
      this.password = ''
      this.confirmPassword = ''
    },
    onSubmit() {
      if (!this.$refs.form.validate()) {
        this.openAlert({
          title: '회원 정보를 정확히 입력해주세요.',
          type: 'error',
        })
        return
      }
      const regNumber = /[^0-9]/g
      const params = {
        contact: this.userInfo.contact.replace(regNumber, ''),
        organization: this.userInfo.organization,
        userId: this.userInfo.email,
        userName: this.userInfo.userName,
      }
      if (this.isChangePassword) {
        params.userPassword = this.password
      }
      this.updateMyInfo(params)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.my-info {
  $this: 'my-info';
  width: 100%;
  padding: 10px;

  .#{$this}__title-wrapper {
    margin-top: 10px;
    margin-bottom: 20px;
    .title-text {
      font-size: toRem(22);
      font-weight: bold;
      color: $sp-title;
    }
  }
  .#{$this}__content-wrapper {
    height: 410px;
    padding: 10px 20px;
    justify-content: space-between;
    overflow-y: scroll;
    @include scroll();
    .sp-label-with-text {
      margin-bottom: 15px;
      width: 100%;
      .sp__input {
        width: 72%;
        font-family: $sub-font;
      }
      .sp__label {
        width: 28%;
      }
    }

    .#{$this}-change-password__wrapper {
      cursor: pointer;
      color: $primary;
      font-weight: 500;
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .#{$this}-change-password__line {
        // TODO 임시
        display: block;
        content: '';
        width: 65%;
        border-top: 1px dotted #cecece;
      }
    }
  }
}
</style>
