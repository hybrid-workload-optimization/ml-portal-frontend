<template>
  <div class="sp-bar-layout">
    <detail-title :mode="false" />
    <v-tabs v-model="tab" color="#000">
      <v-tabs-slider color="#000"></v-tabs-slider>
      <v-tab
        v-for="tabName in tabNames"
        :key="tabName"
        @change="onClickTab(tabName)"
      >
        {{ tabName }}
      </v-tab>
    </v-tabs>
    <v-tabs-items class="detail-tab-item" v-model="tab">
      <v-tab-item>
        <user-info :readOnly="false" :mode="true" />
      </v-tab-item>
      <v-tab-item>
        <naver-info :readOnly="false" :mode="true"></naver-info>
      </v-tab-item>
      <v-tab-item>
        <aws-info :readOnly="false" :mode="true"></aws-info>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import DetailTitle from '@/views/setting/user/UserTitleWithDetail.vue'
import UserInfo from '@/views/setting/user/components/UserInfo.vue'
import AwsInfo from '@/views/setting/user/components/AwsInfo.vue'
import NaverInfo from '@/views/setting/user/components/NaverInfo.vue'
import encrypt from '@/lib/encrypt'

const userMapUtils = createNamespacedHelpers('user')
const loginUserMapUtils = createNamespacedHelpers('loginUser')

export default {
  components: {
    DetailTitle,
    UserInfo,
    AwsInfo,
    NaverInfo,
  },
  data() {
    return {
      userId: null,
      authList: [],
      tab: 'General',
      tabNames: ['General', 'Naver', 'AWS'],
    }
  },
  async created() {
    this.userId = encrypt.decrypt(decodeURIComponent(this.$route.params.id))
    await this.getDetail({ userId: this.userId })
  },
  computed: {
    ...userMapUtils.mapGetters(['detailInfo']),
    ...loginUserMapUtils.mapState(['currentMenuInfo']),
  },
  methods: {
    ...userMapUtils.mapActions(['getDetail']),
    checkAuth() {
      if (this.currentMenuInfo && this.currentMenuInfo.writableYn !== 'Y') {
        this.$router.go(-1)
      }
    },
    onClickTab(tab) {
      this.tabName = tab
    },
  },
  beforeMount() {
    this.checkAuth()
  },
}
</script>
