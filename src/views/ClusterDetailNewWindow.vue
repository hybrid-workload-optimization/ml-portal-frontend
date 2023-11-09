<template>
  <div>
    <cluster-resource-menu
      :menu-items="menuItems"
      :selected-name="selectedName"
      @mini-change="setMiniStatus"
      @open="openFullMenu"
      v-show="!fullMenu"
      ref="lnb"
      v-click-outside="onClickOutside"
    />

    <v-main
      class="new_win-main-wrapper"
      :class="{ 'mini-lnb': isMini }"
      v-show="!fullMenu"
    >
      <card-title
        :title-data="getTitle"
        :show-buttons="false"
        show-console
      ></card-title>

      <router-view />
    </v-main>
    <ConsoleModal v-if="consoleModal.open"></ConsoleModal>
  </div>
</template>

<script>
import ClusterResourceMenu from '@/components/cluster/resource/ClusterResourceMenu.vue'
import CardTitle from '@/components/molcule/CardTitleWithDetailResource.vue'
import ConsoleModal from '@/views/cluster/components/ConsoleModal.vue'
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
const clusterMapUtils = createNamespacedHelpers('cluster')
const consoleMapUtils = createNamespacedHelpers('console')

export default {
  name: 'App',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    ClusterResourceMenu,
    CardTitle,
    ConsoleModal,
  },
  data: () => ({
    drawer: false,
    selectedName: '',
    // menuItems: PaaSMenuItems,
    menuItems: [],
    isMini: false,
    fullMenu: false,
    sse: null,
    clusterIdx: null,
  }),
  computed: {
    ...loginUserMapUtil.mapState({
      userMenuList: 'menuList',
      favoriteList: 'favoriteList',
      userInfo: 'userInfo',
    }),
    ...clusterMapUtils.mapGetters(['dataDetail']), // 상세
    ...consoleMapUtils.mapGetters(['consoleModal']),
    getPagePath() {
      const path = this.$route.name?.split(' ')[0]
      return Paths[path]
    },
    getTitle() {
      return {
        title: this.dataDetail.clusterName,
        description: this.dataDetail.description,
        problem: this.dataDetail.problem,
        status: this.dataDetail.status,
      }
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
  async created() {
    await this.getNotificationList()
    await this.getFavoriteInfo()
    this.setMenuList()
    // 상세 초기화
    this.initDataDetail()

    this.clusterIdx = this.$route.params.id

    const result = await this.getDataDetail({ clusterIdx: this.clusterIdx })
    if (!result) {
      // this.$router.push('/cluster/list')
      this.$router.go(-1)
    }
    console.log('클러스터 데이터: ', this.dataDetail)
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
    ...clusterMapUtils.mapActions(['getDataDetail']),
    ...clusterMapUtils.mapMutations(['initDataDetail']),

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
          `${process.env.VUE_APP_SERVICE_NAME}/sse/v1/alert/receive?userId=${this.userInfo.userId}`,
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

      // 즐겨찾기 (임시)
      menuList.unshift({
        icon: 'star_border',
        menuName: 'Favorite',
        menuIdx: 999999,
        menuUrl: '',
        subMenuList: this.favoriteList,
      })
      this.menuItems = menuList
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
  // mounted() {
  //   // console.error('after login mounted')
  //   /* 페이지 첫 로드 시 해상도 감지하여 1366 이하일 때는 LNB mini 상태로 시작 */
  //   if (window.innerWidth <= '1366') {
  //     this.setMiniStatus(true)
  //     this.$refs.lnb.mini = true
  //   }
  //   this.setSseConfig()
  // },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.new_win-main-wrapper {
  // background-color: #fff;
  background-color: #f3f6f9;
  padding-left: 315px !important;
  padding-right: 15px !important;
  padding-top: 83px !important;
  padding-bottom: 15px !important;
  height: 100vh;
  @include desktop-small {
    padding-left: 310px !important;
  }
  // &.mini-lnb {
  //   padding-left: 100px !important;
  // }
}

.new_win-main-wrapper .detail-tab-item {
  background-color: #f3f6f9 !important;
}
.material-icons-outlined {
  font-family: 'Material Icons Outlined';
}

.v-tabs-bar {
  background-color: #f3f6f9 !important;
}
</style>
