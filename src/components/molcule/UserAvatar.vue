<template>
  <div class="nav-my-row">
    <div class="user-name-wrapper">
      <sp-menu>
        <template v-slot:item="slotProps">
          <div
            class="user-name"
            :class="{ fontWhite }"
            v-bind="slotProps.item.attrs"
            v-on="slotProps.item.on"
          >
            <v-icon class="material-icons-round">arrow_drop_down </v-icon
            >{{ userName }}
          </div>
        </template>
        <v-list>
          <v-list-item @click="openUserInfoEditModal">
            <v-list-item-title>회원정보수정</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item>
            <v-list-item-title>마이페이지</v-list-item-title>
          </v-list-item> -->
          <v-list-item @click="requestLougout">
            <v-list-item-title> 로그아웃 </v-list-item-title>
          </v-list-item>
        </v-list>
      </sp-menu>
      <span class="user-role-wrapper" :class="{ fontWhite }">{{
        accessRoleName
      }}</span>
    </div>
    <slot name="badge"></slot>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const loginUserMapUtils = createNamespacedHelpers('loginUser')

export default {
  props: {
    /*
     @brief 클래스 이름 값 할당
     @date 2021/11/04
     @example
     {
       클래스 이름 : {
         타입: '',
         필수유무: Boolean
         디폴트: 값
       }
     }
    */
    className: {
      type: Object,
      description: '클래스 이름 값 할당',
      fontWhite: {
        type: Boolean,
        description: 'font-color 하얀색',
      },
    },
    // user: {
    //   type: Object,
    //   default: () => {
    //     return {};
    //   },
    //   description: "회원정보",
    // },
    userName: {
      type: String,
      description: '사용자 이름',
      fontWhite: {
        type: Boolean,
        description: 'font-color 하얀색',
      },
    },
    accessRoleName: {
      type: String,
      description: '사용자 역할',
      fontWhite: {
        type: Boolean,
        description: 'font-color 하얀색',
      },
    },
    lastLoginTime: {
      type: String,
      description: '최종 로그인일시',
      fontWhite: {
        type: Boolean,
        description: 'font-color 하얀색',
      },
    },
  },
  data() {
    return {
      fontWhite: this.className?.fontWhite,
      userMenu: [
        { title: '회원정보 수정' },
        // { title: '마이페이지' },
        { title: '로그아웃' },
      ],
    }
  },
  computed: {
    ...loginUserMapUtils.mapState(['isShowEditModal']),
  },
  methods: {
    async requestLougout() {
      await this.doLogout()
    },
    ...loginUserMapUtils.mapMutations(['changeShowEditModal']),
    ...loginUserMapUtils.mapActions(['doLogout']),
    openUserInfoEditModal() {
      this.changeShowEditModal(true)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';
.nav-my-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: $sp-title;
  font-size: 1rem;
  .user-name-wrapper {
    margin-right: 15px;
    font-weight: bold;
    text-align: right;
    .user-name {
      text-align: right;
    }
    .user-name.fontWhite {
      color: #fff;
    }
  }
  .user-role-wrapper {
    font-weight: 500;
    opacity: 0.75;
    font-size: toRem(12);
    &.fontWhite {
      color: #fff;
    }
  }
}
</style>
