<template>
  <div class="sp-bar-layout">
    <detail-title :mode="false" />
    <user-info :readOnly="false" :mode="true" />
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import DetailTitle from '@/views/setting/user/UserTitleWithDetail.vue'
import UserInfo from '@/views/setting/user/components/UserInfo.vue'
import encrypt from '@/lib/encrypt'

const userMapUtils = createNamespacedHelpers('user')
const loginUserMapUtils = createNamespacedHelpers('loginUser')

export default {
  components: {
    DetailTitle,
    UserInfo,
  },
  data() {
    return {
      userId: null,
      authList: [],
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
  },
  beforeMount() {
    this.checkAuth()
  },
}
</script>
