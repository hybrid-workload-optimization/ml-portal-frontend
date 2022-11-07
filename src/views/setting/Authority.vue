<template>
  <div class="authority-page-wrapper">
    <div class="authority-page__title-wrapper">
      <span class="title-text">{{ title }}</span>
      <v-icon class="title-icon">warning_amber</v-icon>
      <span class="subtitle-text">{{ subTitle }}</span>
    </div>
    <div class="authority-page__content-wrapper">
      <div class="authority-page__content-group">
        <authority-group
          ref="group"
          :isWritable="isWritable"
          @select-group="changeGroup"
          @deleted-group="deletedGroup"
        />
      </div>
      <div class="authority-page__content-menu">
        <authority-menu />
      </div>
      <div class="authority-page__right-content">
        <div class="authority-page__content-info">
          <authority-basic-info />
        </div>
        <div class="authority-page__content-user">
          <authority-user :isWritable="isWritable" ref="user" />
        </div>
        <div class="authority-page__button-wrapper" v-if="isWritable">
          <sp-button outlined class="button cancel-button" @click="onReset"
            >Cancel</sp-button
          >
          <sp-button
            outlined
            class="button finish-button"
            :disabled="finishAble"
            @click="onClickFinish"
            >Finish</sp-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import AuthorityGroup from '@/components/authority/Group.vue'
import AuthorityMenu from '@/components/authority/Menu.vue'
import AuthorityBasicInfo from '@/components/authority/BasicInfo.vue'
import AuthorityUser from '@/components/authority/User.vue'

const authorityMapUtil = createNamespacedHelpers('authority')
const loginUserMapUtil = createNamespacedHelpers('loginUser')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    AuthorityGroup,
    AuthorityMenu,
    AuthorityBasicInfo,
    AuthorityUser,
  },
  data: () => ({
    title: 'Authority',
    subTitle:
      'User Authority 설정 시, 기준이 되는 Default 접근권한 설정을 할 수 있습니다.',
    isDuplicated: true,
    isExcepted: false,
  }),
  computed: {
    ...authorityMapUtil.mapState([
      'authGroup',
      'authMenu',
      'authUser',
      'duplicateFlag',
      'originUserRoleName',
    ]),
    ...authorityMapUtil.mapGetters(['isChanged']),
    ...loginUserMapUtil.mapState(['currentMenuInfo']),
    finishAble() {
      let flag = false
      if (this.authGroup.userRoleIdx && this.isChanged) {
        flag = false
      } else {
        flag = true
      }
      return flag
    },
    isWritable() {
      return this.currentMenuInfo && this.currentMenuInfo.writableYn === 'Y'
    },
  },
  methods: {
    ...authorityMapUtil.mapMutations(['initAuthData']),
    ...authorityMapUtil.mapActions([
      'getAllListAuthority',
      'getCheckDuplicate',
      'patchAuthority',
    ]),
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    // 검색 내역 초기화
    resetSearch() {
      this.$refs.user.search = ''
    },
    setRegisteredUser() {
      this.$refs.user.setCheckedUser()
    },
    changeGroup() {
      this.resetSearch()
      this.setRegisteredUser()
    },
    deletedGroup() {
      this.initAuthData()
      this.resetSearch()
      this.setRegisteredUser()
    },
    onReset() {
      this.initAuthData()
      this.$refs.group.expandAll()
    },
    async onClickFinish() {
      if (this.authGroup.userRoleName === '') {
        this.openAlert({ title: '권한명을 입력하십시오.', type: 'error' })
      } else {
        if (this.originUserRoleName === this.authGroup.userRoleName) {
          this.isExcepted = true
        } else {
          await this.searchDuplicatedName()
          if (this.duplicateFlag) {
            this.openAlert({
              title: '권한명이 이미 사용중입니다.',
              type: 'error',
            })
            this.isDuplicated = true
          } else {
            this.isDuplicated = false
          }
        }

        if (this.isExcepted === true || this.isDuplicated === false) {
          // 수정
          const params = this.authGroup
          this.modify(params)
        }
      }
    },
    async searchDuplicatedName() {
      try {
        await this.getCheckDuplicate({
          userRoleName: this.authGroup.userRoleName,
          groupYn: this.authGroup.groupYn,
        })
      } catch (error) {
        this.openAlert({ title: '중복검사에 실패했습니다.', type: 'error' })
      }
    },
    async modify(params) {
      try {
        await this.patchAuthority(params)
        await this.getAllListAuthority() // 다시 조회
        this.initAuthData()
        this.openAlert({
          title: '정보가 저장 되었습니다.',
          type: 'info',
        })
      } catch (error) {
        this.openAlert({
          title: '서버 에러로 인해 변경에 실패했습니다.',
          type: 'error',
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
$this: 'authority-page';
.authority-page-wrapper {
  .#{$this}__content-wrapper {
    display: flex;
    .#{$this}__content-group {
      width: 25%;
    }
    .#{$this}__content-menu {
      width: 37.5%;
      margin-left: 15px;
    }
    .#{$this}__right-content {
      width: 37.5%;
      margin-left: 15px;
      .#{$this}__content-info {
        margin-bottom: 15px;
      }
    }
  }
  .#{$this}__title-wrapper {
    margin-bottom: 25px;
    .title-text {
      font-size: toRem(34);
      font-weight: bold;
      color: $sp-title;
      margin-right: 20px;
    }
    .title-icon {
      color: $sp-warning;
      margin-right: 10px;
      font-size: toRem(18);
    }
    .subtitle-text {
      font: {
        family: $sub-font;
        size: toRem(16);
      }
      color: $sp-title;
    }
  }
  .#{$this}__button-wrapper {
    padding-top: 30px;
    text-align: right;
    .button {
      border-radius: 5px;
      font-weight: bold;
      font-size: 15px !important;
      border-width: thin;
      width: 120px;
      height: 44px;
    }
    .cancel-button {
      color: $sp-sky-blue-500;
    }
    .finish-button {
      margin-left: 20px;
      color: $sp-teriary;
    }
  }
}
</style>
