<template>
  <v-row class="top-nav-container sub-container">
    <!-- 상단 왼쪽 부분 start -->
    <div class="left-nav-wrapper" v-if="!isClusterNewWindow">
      <slot name="side-bar"></slot>
      <div class="title-wrapper">
        <sp-button icon class="fav-button" @click="toggleFav"
          ><v-icon class="material-icons-round" v-if="!isFav"
            >star_outline</v-icon
          >
          <v-icon class="material-icons-round active" v-if="isFav"
            >star</v-icon
          ></sp-button
        >
        <span class="title-text">{{ getPageName }}</span>
      </div>
      <sp-breadcrumbs v-if="pagePath" :items="pagePath['subTitle']" large>
        <template v-slot:divider>
          <v-icon>chevron_right</v-icon>
        </template>
        <template v-slot:item="slotProps">
          <v-breadcrumbs-item>
            <v-icon
              class="material-icons-outlined"
              v-if="slotProps.item.toLowerCase() === 'home'"
              >home</v-icon
            >
            <span
              :style="`color: #4B5566`"
              class="breadcrumbs-text"
              v-if="slotProps.item.toLowerCase() != 'home'"
              >{{ slotProps.item }}</span
            >
          </v-breadcrumbs-item>
        </template>
      </sp-breadcrumbs>
    </div>
    <!-- 상단 왼쪽 부분 end -->

    <!-- 상단 오른쪽 부분 start -->
    <div class="right-nav-wrapper" v-if="userInfo.userName">
      <div class="button-wrapper">
        <v-badge
          bordered
          color="#036EB8"
          :content="newNotificationSize"
          :value="notificationList.length"
          overlap
          offset-x="20"
          offset-y="15"
        >
          <sp-button
            @click="updateShowNotification(!isShowNotification)"
            depressed
            elevation="0"
            icon
            class="backgroundColor"
            :className="{ transparent: true }"
          >
            <v-icon dense color="#5B6C82">notifications_none</v-icon>
          </sp-button>
        </v-badge>

        <div class="notification-wrapper">
          <transition name="fade">
            <notification
              class="notification"
              v-if="isShowNotification"
              v-click-outside="onClickOutside"
            />
          </transition>
        </div>
      </div>
      <user-avatar
        :userName="userInfo ? userInfo.userName : ''"
        :accessRoleName="userInfo ? userInfo.userRole.userRoleName : ''"
        class="ml-12"
      >
        <template v-slot:badge>
          <v-badge
            bordered
            bottom
            color="red"
            dot
            offset-x="10"
            offset-y="10"
            :value="0"
          >
            <v-avatar size="40">
              <sp-image
                lazySrc="user-avatar.png"
                src="user-avatar.png"
                width="100"
              ></sp-image>
            </v-avatar>
          </v-badge>
        </template>
      </user-avatar>
      <!-- 유저 아바타 부분 종료 -->
    </div>
    <!-- 상단 오른쪽 부분 end -->
  </v-row>
</template>

<script>
import Notification from '@/components/Notification.vue'
import UserAvatar from '@/components/molcule/UserAvatar.vue'
import { createNamespacedHelpers } from 'vuex'
import vClickOutside from 'v-click-outside'

const tag = '[Subheader]'
const loginUserMapUtil = createNamespacedHelpers('loginUser')
const notificationMapUtil = createNamespacedHelpers('notification')

export default {
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    UserAvatar,
    Notification,
  },
  props: {
    pagePath: Object,
  },
  data: () => ({
    // isShowNotification: false,
    isAdmin: false,
    isFav: false,
    isClusterNewWindow: false,
    userName: 'Gil-dong, Hong',
    accessRoleName: 'System Admin',
  }),
  computed: {
    /*
     @brief 페이지 이름 구하는 함수
     @date 2021/11/01
     @return
     @param
    */
    // ...mapGetters(loginInfo, ["isLogin", "isUser"]),
    // ...mapState(loginInfo, ["userName", "accessRoleName", "lastLoginTime"]),
    getPageName() {
      console.log(tag, 'getPageName')
      return this.pagePath?.title
    },
    ...loginUserMapUtil.mapState([
      'userInfo',
      'currentMenuInfo',
      'favoriteList',
    ]),
    ...notificationMapUtil.mapState({
      notificationList: 'notification',
      isShowNotification: 'isShowNotification',
    }),
    ...notificationMapUtil.mapGetters(['newNotificationSize']),
  },
  mounted() {
    this.setFavData()
    this.clusterNewWindowChk()
  },
  watch: {
    $route() {
      this.setFavData()
    },
  },
  methods: {
    /*
      @brief 즐겨찾기 버튼 토글 함수
      @date 2021/11/19
      @return
      @param
    */
    ...loginUserMapUtil.mapActions(['setFavoriteData', 'deleteFavoriteData']),
    ...notificationMapUtil.mapMutations(['updateShowNotification']),
    setFavData() {
      if (this.favoriteList.length) {
        this.isFav = this.favoriteList.some(
          item => item.menuIdx === this.currentMenuInfo.menuIdx,
        )
      }
    },
    toggleFav() {
      const params = { menuIdx: this.currentMenuInfo.menuIdx }
      if (!this.isFav) {
        this.setFavoriteData(params)
      } else {
        this.deleteFavoriteData(params)
      }
      this.isFav = !this.isFav
    },
    onClickOutside() {
      this.updateShowNotification(false)
    },
    clusterNewWindowChk() {
      if (this.$route.path.includes('/cluster/detail')) {
        this.isClusterNewWindow = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';
.top-nav-container {
  max-height: 80px;
  margin: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .left-nav-wrapper {
    display: flex;
    flex: 0 0 60%;
    max-width: 60%;
    .title-wrapper {
      max-width: 45%;
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 2rem;
      color: $title-color;
      margin-right: 15px;

      .title-text {
        font-size: toRem(28);
      }
      .fav-button {
        margin-right: 5px;
        .v-icon {
          font-size: 2.3rem;
        }
        .active {
          color: $sp-warning;
        }
      }
    }
    .breadcrumbs-text {
      font-size: toRem(13);
      opacity: 0.6;
    }
  }
  .pop-up-btn {
    font-size: 0.9rem;
  }

  .service-btn {
    background-color: $basic-button;
    color: white;
  }
  .right-nav-wrapper {
    height: 55px;
    display: flex;
    flex: 0 0 40%;
    max-width: 40%;
    justify-content: flex-end;
    align-items: center;
    .button-wrapper {
      display: flex;
      justify-content: flex-end;
      min-width: 80px;

      i {
        font-size: toRem(30);
      }

      .image-wrapper {
        width: 9%;
      }
    }
  }
}
</style>

<style lang="scss">
.top-nav-container {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .notification-ico {
    i {
      color: #5b6c82 !important;
    }
  }

  .notification-wrapper {
    position: relative;
    .notification {
      position: absolute;
      left: -335px;
      top: 30px;
      z-index: 900;
    }
  }

  .service-wrapper {
    padding: 10px;
  }
  .card-wrapper {
    button {
      font-size: 0.9rem !important;
    }
  }

  &.sub-container {
    max-height: 200px !important;
    min-height: 60px !important;
    margin-bottom: 25px;
  }
  .left-nav-wrapper {
  }
  .right-nav-wrapper {
    .user-name-wrapper {
      line-height: 0.7;
    }
  }
}
</style>
