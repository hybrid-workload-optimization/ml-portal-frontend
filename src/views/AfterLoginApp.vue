<template>
  <div>
    <full-menu
      @close="closeFullMenu"
      v-show="fullMenu"
      :menuItems="menuItems"
    />
    <side-drawer
      :menu-items="menuItems"
      :selected-name="selectedName"
      @mini-change="setMiniStatus"
      @open="openFullMenu"
      v-show="!fullMenu"
      ref="lnb"
      v-click-outside="onClickOutside"
    />

    <v-main
      class="main-wrapper"
      :class="{ 'mini-lnb': isMini }"
      v-show="!fullMenu"
    >
      <sub-header :pagePath="getPagePath"></sub-header>
      <router-view />
    </v-main>
  </div>
</template>

<script>
import SubHeader from '@/components/molcule/navigation/SubHeader.vue'
import SideDrawer from '@/components/molcule/navigation/SideDrawerMenu.vue'
import FullMenu from '@/components/molcule/navigation/FullMenu.vue'
// import { PaaSMenuItems } from '@/assets/data/menuItems'
import Paths from '@/assets/data/paths'
import vClickOutside from 'v-click-outside' // lnb 외부에서 클릭 시 lnb 접기 위한 외부 요소 클릭 감지 라이브러리
import { createNamespacedHelpers } from 'vuex'
// import tokenHelper from '@/lib/tokenHelper'
// import { fetchEventSource } from '@microsoft/fetch-event-source'
// import request from '@/lib/request'
import { SET_MINI } from '../store/modules/sideNav'

const loginUserMapUtil = createNamespacedHelpers('loginUser')
const notificationMapUtil = createNamespacedHelpers('notification')

export default {
  name: 'App',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    SubHeader,
    FullMenu,
    SideDrawer,
  },

  data: () => ({
    drawer: false,
    selectedName: '',
    // menuItems: PaaSMenuItems,
    menuItems: [],
    isMini: false,
    fullMenu: false,
    sse: null,
  }),
  computed: {
    ...loginUserMapUtil.mapState({
      userMenuList: 'menuList',
      favoriteList: 'favoriteList',
      userInfo: 'userInfo',
    }),
    getPagePath() {
      const path = this.$route.name?.split(' ')[0]
      return Paths[path]
    },
  },
  async created() {
    await this.getNotificationList()
    await this.getFavoriteInfo()
    this.setMenuList()
  },
  watch: {
    favoriteList: {
      deep: true,
      handler() {
        this.setMenuList()
      },
    },
  },
  methods: {
    ...notificationMapUtil.mapActions({ getNotiList: 'getDataList' }),
    ...loginUserMapUtil.mapActions(['getFavoriteInfo']),
    getNotificationList() {
      this.getNotiList()
    },
    setSseConfig() {
      // TODO 추후 /api/v1/alert/receive 로 변경
      // const reqUrl = '/api/v1/alert/test'
      // const reqTimestamp = new Date().getTime()
      // const encryptedToken = tokenHelper.encrypt(
      //   this.$store.state.loginUser.accessToken,
      //   reqUrl,
      //   'get',
      //   reqTimestamp,
      // )
      try {
        // axios: event stream 지원x
        // eventSource: header 지원x
        // const scope = this
        // fetchEventSource(reqUrl, {
        //   headers: {
        //     'access-token': encryptedToken,
        //     timestamp: reqTimestamp,
        //   },
        //   onmessage(message) {
        //     const msg = JSON.parse(message.data)
        //     scope.$store.commit('notification/changeNoti', msg)
        //   },
        //   onerror(error) {
        //     console.error(error)
        //     throw error
        //   },
        // })
        this.sse = new EventSource(
          `/comp-b-svc/sse/v1/alert/receive?userId=${this.userInfo.userId}`,
        )

        this.sse.onerror = e => {
          console.error(e)
          throw e
        }

        this.sse.onmessage = message => {
          if (message.data) {
            const msg = JSON.parse(message.data)
            this.$store.commit('notification/changeNoti', msg)
          }
        }
      } catch (error) {
        // error 시 sse 연결 재시도
        console.error(error)
        setTimeout(() => {
          this.setSseConfig()
        }, 1000)
      }
    },
    setMenuList() {
      const menuList = this.userMenuList.map(menu => {
        menu.icon = this.setMenuIcon(menu.menuIdx)
        return menu
      })

      // 클러스터 관련 메뉴는 메인페이지에서 삭제 처리
      const menuNamesToRemove = ['Cluster', 'Workload', 'Network', 'Config']
      const newMenuList = menuList.filter(
        menu => !menuNamesToRemove.includes(menu.menuName),
      )

      // 즐겨찾기 (임시)
      newMenuList.unshift({
        icon: 'star_border',
        menuName: 'Favorite',
        menuIdx: 999999,
        menuUrl: '',
        subMenuList: this.favoriteList,
      })
      this.menuItems = newMenuList
    },
    setMenuIcon(menuIdx) {
      let icon = 'dashboard'
      switch (menuIdx) {
        case 101000:
          icon = 'create_new_folder'
          break
        case 102000:
          icon = 'hub'
          break
        case 103000:
          icon = 'dvr'
          break
        case 104000:
          icon = 'lan'
          break
        case 105000:
          icon = 'build'
          break
        case 106000:
          icon = 'settings'
          break
        default:
          break
      }
      return icon
    },
    setMiniStatus(miniStatus) {
      this.isMini = miniStatus
      this.$store.commit({
        type: SET_MINI,
        payload: {
          isMini: miniStatus,
        },
      })
    },
    openFullMenu() {
      this.fullMenu = true
    },
    closeFullMenu() {
      this.fullMenu = false
    },
    onClickOutside() {
      this.$refs.lnb.subMenuItems = []
    },
  },
  mounted() {
    // console.error('after login mounted')
    /* 페이지 첫 로드 시 해상도 감지하여 1366 이하일 때는 LNB mini 상태로 시작 */
    if (window.innerWidth <= '1366') {
      this.setMiniStatus(true)
      this.$refs.lnb.mini = true
    }
    this.setSseConfig()
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.main-wrapper {
  // background-color: #fff;
  background-color: #f3f6f9;
  padding-left: 310px !important;
  padding-right: 25px !important;
  padding-top: 25px !important;
  padding-bottom: 25px !important;
  height: 100vh;
  @include desktop-small {
    padding-left: 310px !important;
  }
  &.mini-lnb {
    padding-left: 100px !important;
  }
  .sp-kubespray-page {
    background-color: #f3f6f9 !important;
  }
  .v-tabs-items {
    background-color: #f3f6f9 !important;
  }
  .v-tabs-bar {
    background-color: #f3f6f9 !important;
  }
}
.material-icons-outlined {
  font-family: 'Material Icons Outlined';
}
</style>
