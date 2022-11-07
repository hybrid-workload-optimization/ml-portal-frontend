<template>
  <div class="sp-password-find">
    <div class="password__info-wrapper">
      <info />
    </div>
    <div class="password__password-wrapper">
      <div class="sp-password-form">
        <div class="password-form__title">비밀번호 찾기</div>
        <div class="password-form__sub-title">
          가입하신 E-mail 정보를 입력하세요.
        </div>
        <v-form ref="form" @submit.prevent="onSubmit">
          <div class="password-form__input-box">
            <label-with-text
              ref="email"
              name="E-mail"
              :value="email"
              :rules="[...rules.requiredEmail]"
              placeholder="E-mail Address"
              background-color="#F5F5f5"
              :className="{
                inputStyle: {
                  fontSize: '0.8rem',
                  borderRadius: '10px',
                },
              }"
              @input="onChangeEmail"
            />
          </div>
          <div class="password-form__button-wrapper">
            <sp-button
              @click="onSubmit"
              elevation="0"
              class="password-form--button"
              height="46px"
              dense
            >
              Submit
            </sp-button>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import Info from '@/components/Info.vue'
import { createNamespacedHelpers } from 'vuex'
import { form } from '@/utils/mixins/form'
import LabelWithText from '@/components/molcule/LabelWithText.vue'

const userMapUtils = createNamespacedHelpers('user')

export default {
  components: {
    Info,
    LabelWithText,
  },
  mixins: [form],
  methods: {
    ...userMapUtils.mapActions(['findPassword']),
    onSubmit() {
      if (this.$refs.form.validate()) {
        const params = {
          email: this.email,
        }
        this.findPassword(params)
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-password-find {
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100%;
  $this: 'password';
  .#{$this}__info-wrapper {
    min-width: 500px;
    width: 35%;
    height: 100%;
  }
  .#{$this}__password-wrapper {
    width: 65%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sp-password-form {
    $this: 'password-form';
    width: 500px;
    .#{$this}__title {
      @include set-text(bold, 32, rgba($color: $sp-title, $alpha: 1));
      margin-bottom: 11px;
    }
    .#{$this}__sub-title {
      @include set-text(
        500,
        15,
        rgba($color: $sp-title, $alpha: 1),
        false,
        true
      );
      margin-bottom: 38px;
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
}
</style>
