<template>
  <div class="sp-login-form">
    <span class="login-form__title">Portal Login</span>
    <!-- <v-form
      ref="loginForm"
      v-model="valid"
      lazy-validation
      @submit.prevent="onSubmit"
    > -->
    <v-form ref="loginForm" @submit.prevent="onSubmit">
      <div class="login-form__email-box">
        <sp-input
          ref="email"
          name="email"
          :value="email"
          class="login-form--email"
          placeholder="E-mail Address"
          outlined
          solo
          dense
          flat
          :rules="rules.requiredEmail"
          hide-details="auto"
          filled
          @input="onChangeEmail"
        >
          <template #prepend-inner-content>
            <sp-image contain lazySrc="email.svg" src="email.svg" />
          </template>
        </sp-input>
      </div>
      <div class="login-form__password-box">
        <sp-input
          name="password"
          type="password"
          :value="password"
          class="login-form--password"
          placeholder="password"
          outlined
          solo
          dense
          flat
          :rules="rules.requiredPw"
          hide-details="auto"
          filled
          @change="onChangePassword"
        >
          <template #prepend-inner-content>
            <sp-image contain lazySrc="password.svg" src="password.svg" />
          </template>
        </sp-input>
      </div>
      <div class="login-form__checkbox-box">
        <v-checkbox
          ref="checkboxRef"
          label="Remember E-mail Address"
          hide-details="auto"
          class="login-form--checkbox"
          off-icon="check_box_outline_blank"
          on-icon="check_box"
          :value="isRemembered"
          @change="onClickRememberEmail"
        />
      </div>
      <div class="login-form__submit-box">
        <!-- <sp-button
          class="login-form--submit"
          elevation="0"
          width="100%"
          height="46px"
          color="#036EB8"
          dense
          :disabled="!valid"
          type="submit"
        >
          Login
        </sp-button> -->
        <sp-button
          class="login-form--submit"
          elevation="0"
          width="100%"
          height="46px"
          color="#036EB8"
          dense
          type="submit"
        >
          Login
        </sp-button>
      </div>
    </v-form>
    <alert
      :dialog="isOpenToast"
      titleName="사용자 정보가 일치하지 않습니다."
      @open-Alert="onClickOpenAlert"
      @close-Alert="onClickCloseAlert"
    >
      <template #alert-icon>
        <v-icon color="#fff">error_outline</v-icon>
      </template>
    </alert>
  </div>
</template>

<script>
import { form } from '@/utils/mixins/form'
import Alert from '@/components/molcule/Alert.vue'
import encrypt from '@/lib/encrypt'
import { createNamespacedHelpers } from 'vuex'

const loginUserMapUtils = createNamespacedHelpers('loginUser')
const tag = '[LoginForm]'

export default {
  components: {
    Alert,
  },
  mixins: [form],
  data() {
    return {
      // valid: false,
      isOpenToast: false,
    }
  },
  mounted() {
    // this.$refs.loginForm.validate()
    // this.doLogout()
  },
  methods: {
    async onSubmit() {
      /*
      1. 로그인 요청
      2. 유저정보 저장 -> vuex
      3. auth token 저장 -> auth 토큰은 vuex , refresh 토큰은 cookie 에
      4. 실패시 토스트 노출
      */
      console.log('login request')
      // if (!this.$refs.loginForm.validate()) {
      //   this.onClickOpenAlert()
      // }

      const result = await this.doLogin({
        userId: this.email,
        userPassword: this.password,
      })
      console.log('login result ', result)

      if (result) {
        let menuList = JSON.parse(
          encrypt.decrypt(sessionStorage.getItem('menuList')),
        )
        const projectUserRole = JSON.parse(
          encrypt.decrypt(sessionStorage.getItem('projectUserRole')),
        )
        menuList = menuList.filter(menu => {
          if (
            menu.useYn === 'Y' &&
            (menu.viewableYn === 'Y' || menu.writableYn === 'Y')
          ) {
            if (menu.subMenuList && menu.subMenuList.length) {
              menu.subMenuList = menu.subMenuList.filter(
                subMenu =>
                  subMenu.useYn === 'Y' &&
                  (subMenu.viewableYn === 'Y' || subMenu.writableYn === 'Y'),
              )
              return menu
            }
            return menu
          }
          return false
        })
        // TODO 추후 코드 정리 필요
        const flatMenulList = this.setFlatMenuList(menuList)
        await this.$store.commit('loginUser/setFlatMenuList', flatMenulList)
        await this.$store.commit('loginUser/setMenuInfo', {
          defaultUserRole: menuList,
          projectUserRole,
        })
        const menuPath = menuList.length ? menuList[0].menuUrl : '/'

        this.$router.push(menuPath)
      } else {
        this.onClickOpenAlert()
      }
    },
    setFlatMenuList(menuList) {
      const flatMenuList = []
      menuList.forEach(item => {
        this.getSubMenuList(item, flatMenuList)
      })
      return flatMenuList
    },
    getSubMenuList(menuItem, flatMenuList) {
      if (menuItem.subMenuList && menuItem.subMenuList.length) {
        menuItem.subMenuList.forEach(item => {
          this.getSubMenuList(item, flatMenuList)
        })
      } else {
        flatMenuList.push(menuItem)
      }
    },
    onClickOpenAlert() {
      console.log(tag, 'onClickOpenAlert')
      this.isOpenToast = !this.isOpenToast
    },
    onClickCloseAlert() {
      this.isOpenToast = false
    },
    ...loginUserMapUtils.mapActions(['doLogin', 'doLogout']),
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';

.sp-login-form {
  $this: 'login-form';

  width: 500px;
  .#{$this}__title {
    @include set-text(bold, 32, $title-color, #707070);
  }
  .#{$this}__email-box {
    margin-top: 56px;
  }
  .#{$this}__password-box {
    padding-top: 21px;
  }

  .#{$this}--email,
  .#{$this}--password {
    width: 100%;
  }

  .#{$this}__checkbox-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 26px;
    .#{$this}--find-password {
      @include set-text(600, 13, $sp-teriary);
      padding: 0;
      background: transparent;
    }
  }
  .#{$this}__submit-box {
    padding-top: 55px;
    width: 100%;
    .login-form--submit {
      @include set-text(500, 15, #fff);
    }
  }

  .#{$this}__signup-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 26px;
    width: 100%;
    @include set-text(normal, 13, $sub-title);

    .#{$this}--signup {
      @include set-text(600, 13, $sp-teriary);
      padding: 0;
      padding-left: 10px;
      background: transparent;
    }
  }

  @include desktop-small {
  }

  @include desktop-medium {
  }
}
</style>
