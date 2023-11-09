<template>
  <v-row class="top-nav-container sub-container">
    <!-- 상단 왼쪽 부분 start -->
    <div class="left-nav-wrapper">
      <slot name="side-bar"></slot>

      <router-link to="/" class="title-wrapper">
        <sp-image
          class="logo-image"
          :width="48"
          :height="48"
          lazySrc="Strato logo.png"
          src="Strato logo.png"
        />
        <span class="title-text">ML Workload Portal</span>
      </router-link>
      <div class="full-menu-btn">
        <a
          v-show="!isFullMenu"
          class="burger-button"
          @click="openFullMenu"
          @keypress="openFullMenu"
        >
          <v-icon class="burger-icon">menu</v-icon>
          <span class="burger-text">서비스</span>
        </a>
      </div>
      <!-- 즐겨찾기 주석처리 23.11.08 -->
      <!-- <sp-button icon class="fav-button" @click="toggleFav"
          ><v-icon class="material-icons-round" v-if="!isFav"
            >star_outline</v-icon
          >
          <v-icon class="material-icons-round active" v-if="isFav"
            >star</v-icon
          ></sp-button
        >
        <span class="title-text">{{ getPageName }}</span> -->

      <!--
      <div class="title-wrapper">
            <div class="logo-wrapper">

              <span class="title-text" v-if="!mini">ML Workload Portal</span>
            </div>
          </div>
       -->
      <!-- <sp-breadcrumbs v-if="pagePath" :items="pagePath['subTitle']" large>
        <template #divider>
          <v-icon>chevron_right</v-icon>
        </template>
        <template #item="slotProps">
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
      </sp-breadcrumbs> -->
    </div>
    <!-- 상단 왼쪽 부분 end -->

    <!-- 상단 오른쪽 부분 start -->
    <div class="right-nav-wrapper" v-if="userInfo.userName">
      <div class="button-wrapper">
        <sp-button
          v-if="isClusterDetail"
          class="right-nav__button--monitoring"
          depressed
          elevation="0"
          @click="openMonitoringPage"
        >
          <sp-image
            contain
            src="cluster/monitor-dashboard.svg"
            width="24"
            height="24"
          />
        </sp-button>
        <console-with-button v-if="isClusterDetail"></console-with-button>
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
            <v-icon dense color="#fff">notifications_none</v-icon>
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

      <!-- 전역 서비스그룹 셀렉트 박스 -->
      <sp-select
        class="sp-global-select"
        :value="globalServiceGroup"
        :items="serviceGroupList"
        item-text="text"
        item-value="value"
        @input="updateGlobalServiceGroup"
        dense
        dark
        outlined
        hideDetails
      />

      <user-avatar
        class="user-avatar"
        :userName="userInfo ? userInfo.userName : ''"
        :accessRoleName="userInfo ? userInfo.userRole.userRoleName : ''"
      >
        <template #badge>
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
    <!-- 서비스 풀 메뉴 -->
    <new-full-menu
      :class="{ open: isFullMenu }"
      @close="closeFullMenu"
      v-show="isFullMenu"
      :is-open="isFullMenu"
      :menu-items="fullMenuItems"
      :show-full-menu="isFullMenu"
    />
  </v-row>
</template>

<script>
import Notification from '@/components/Notification.vue'
import UserAvatar from '@/components/molcule/UserAvatar.vue'
import ConsoleWithButton from '@/views/cluster/components/ConsoleWithButton.vue'
import { createNamespacedHelpers } from 'vuex'
import vClickOutside from 'v-click-outside'
import NewFullMenu from '@/components/molcule/navigation/NewFullMenu.vue'
import { UserMenuItems } from '@/data/path'

// const tag = '[Subheader]'
const loginUserMapUtil = createNamespacedHelpers('loginUser')
const notificationMapUtil = createNamespacedHelpers('notification')
const clusterMonitoringMapUtil = createNamespacedHelpers('clusterMonitoring')
const serviceGroupMapUtil = createNamespacedHelpers('serviceGroup')

export default {
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    UserAvatar,
    Notification,
    ConsoleWithButton,
    NewFullMenu,
  },
  props: { pagePath: Object },
  data: () => ({
    // isShowNotification: false,
    isAdmin: false,
    isFav: false,
    isClusterNewWindow: false,
    userName: 'Gil-dong, Hong',
    accessRoleName: 'System Admin',
    isFullMenu: false,
    fullMenuItems: UserMenuItems,
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
    ...serviceGroupMapUtil.mapState(['globalServiceGroup', 'serviceGroupList']),
    getPageName() {
      // console.log(tag, 'getPageName')
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
    ...clusterMonitoringMapUtil.mapState(['monitoringPath']),
    isClusterDetail() {
      console.log(
        'route',
        this.$route.matched.some(obj => obj.name === 'Cluster'),
      )
      return this.$route.matched.some(obj => obj.name === 'Cluster')
    },
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
    ...serviceGroupMapUtil.mapActions(['updateGlobalServiceGroup']),
    ...loginUserMapUtil.mapActions(['setFavoriteData', 'deleteFavoriteData']),
    ...notificationMapUtil.mapMutations(['updateShowNotification']),
    ...clusterMonitoringMapUtil.mapActions(['getMonitoringPath']),
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
    openFullMenu() {
      this.isFullMenu = true
    },
    closeFullMenu() {
      this.isFullMenu = false
    },
    onClickOutside() {
      this.updateShowNotification(false)
    },
    clusterNewWindowChk() {
      if (this.$route.path.includes('/cluster/detail')) {
        this.isClusterNewWindow = true
      }
    },
    async openMonitoringPage() {
      const clusterIdx = this.$route.params?.id
      if (clusterIdx === null) return

      await this.getMonitoringPath({ clusterIdx })
      window.open(this.monitoringPath, '_blank', 'toolbar=no')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';
.top-nav-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 12;
  width: 100%;
  max-height: 68px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1c2536 0% 0% no-repeat padding-box;
  box-shadow: 0px 4px 5px rgba(138, 138, 138, 0.2);

  .left-nav-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 480px;

    .full-menu-btn {
      width: 180px;

      .burger-button {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 12px;
      }

      .burger-icon {
        background: #fff;
        border-radius: 50%;
        font-size: 18px;
      }
      .burger-text {
        color: #fff;
        font-size: 16px;
      }
    }

    .title-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      width: 300px;
      font-weight: bold;
      font-size: 2rem;
      color: $title-color;

      .logo-image {
        max-width: 40px;
        max-height: 40px;
      }

      .title-text {
        color: #fff;
        font-size: 1.15rem;
        font-weight: bold;
        white-space: nowrap;
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
  }
  .right-nav-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    height: 100%;

    .button-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      min-width: 80px;
      gap: 10px;

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

  .sp-global-select {
    max-width: 160px;

    fieldset {
      border: none !important;
    }

    .theme--dark.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)
      > .v-input__control
      > .v-input__slot
      fieldset {
      color: transparent !important;
    }

    .v-input__slot:before {
      display: none !important;
    }
  }

  &.sub-container {
    height: 100%;
  }
  .left-nav-wrapper {
  }
  .right-nav-wrapper {
    padding-right: 50px;

    .user-name-wrapper {
      line-height: 0.7;
    }

    .right-nav__button--monitoring {
      min-width: 35px !important;
      padding: 0 !important;
    }
  }
  .user-avatar {
    width: 180px;
  }
}
</style>
