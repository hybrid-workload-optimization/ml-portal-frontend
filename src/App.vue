<template>
  <app-layout class="sp-app">
    <gloval-loading />
    <after-login-app v-if="isAuthRequired" />
    <before-login-app v-else />
    <v-alert
      :titleName="alertTitle"
      :dialog="showAlert"
      :color="alertOptions.color"
      :timeout="alertOptions.timeout"
      :isClose="alertOptions.isClose"
      @close-Alert="closeAlert"
    ></v-alert>
  </app-layout>
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'
import AfterLoginApp from '@/views/AfterLoginApp.vue'
import BeforeLoginApp from '@/views/BeforeLoginApp.vue'
import GlovalLoading from '@/components/GlovalLoading.vue'
import { SET_MINI } from '@/store/modules/sideNav'
import { createNamespacedHelpers } from 'vuex'
import VAlert from '@/components/molcule/Alert.vue'

const loginUserMapUtil = createNamespacedHelpers('loginUser')
const alertMapUtils = createNamespacedHelpers('alert')

export const isAuthRequired = true

export default {
  name: 'App',
  components: {
    AppLayout,
    AfterLoginApp,
    BeforeLoginApp,
    GlovalLoading,
    VAlert,
  },

  computed: {
    ...alertMapUtils.mapGetters(['showAlert', 'alertTitle', 'alertOptions']),
    ...loginUserMapUtil.mapState(['userInfo']),
    isAuthRequired() {
      if (this.$route.meta.isAuthRequired) {
        return !!this.userInfo
      }
      return false
    },
  },

  created() {
    // window.addEventListener('beforeunload', this.closeBrowserHandler)
  },
  methods: {
    ...alertMapUtils.mapMutations(['openAlert', 'closeAlert']),
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
    /* 페이지 첫 로드 시 해상도 감지하여 1366 이하일 때는 LNB mini 상태로 시작 */
    if (window.innerWidth <= '1366') {
      this.setMiniStatus(true)
      this.$refs.lnb.mini = true
    }
  },
}
</script>

<style lang="scss">
@import '@/styles/common.scss';
@import '@/styles/_mixin.scss';
</style>
