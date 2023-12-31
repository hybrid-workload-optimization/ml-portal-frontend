<template>
  <div class="sp-user-detail">
    <card-title
      :titleData="titleData"
      :showButtons="currentMenuInfo.writableYn === 'Y'"
      :deleteButtonName="detailInfo.useYn !== 'Y' ? 'Enable' : 'Disable'"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    >
      <template v-slot:additional-buttons>
        <sp-button class="list-button" outlined @click="onClickBack"
          >List</sp-button
        >
      </template>
    </card-title>
    <user-info :mode="false" />
    <!-- 삭제 요청 확인 창 -->
    <confirm
      @confirm-modal="onClickDelConfirm"
      @cancel-modal="onClickDelCancel"
    />
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import Confirm from '@/components/molcule/Confirm.vue'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import UserInfo from '@/views/setting/user/components/UserInfo.vue'
import encrypt from '@/lib/encrypt'

const userMapUtils = createNamespacedHelpers('user')
const confirmMapUtils = createNamespacedHelpers('confirm')
const alertMapUtils = createNamespacedHelpers('alert')
const loginUserMapUtils = createNamespacedHelpers('loginUser')

export default {
  components: {
    CardTitle,
    UserInfo,
    Confirm,
  },
  data() {
    return {
      userId: null,
    }
  },
  async created() {
    this.userId = encrypt.decrypt(decodeURIComponent(this.$route.params.id))
    await this.getDetail({ userId: this.userId })
  },
  computed: {
    ...userMapUtils.mapGetters(['detailInfo']),
    ...loginUserMapUtils.mapState(['currentMenuInfo']),
    titleData() {
      return {
        title: this.detailInfo.userName,
        userRoleName: this.detailInfo.userRole.userRoleName,
        id: this.detailInfo.email,
        date: this.detailInfo.createdAt,
        update: this.detailInfo.updatedAt,
      }
    },
  },
  mounted() {
    // this.getDetail({ userId: this.userId })
  },
  methods: {
    ...userMapUtils.mapActions(['getDetail', 'deleteUser']),

    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    // 뒤로가기
    onClickBack() {
      this.$router.push('/setting/user/list')
    },
    // 수정
    onClickEdit() {
      const id = encodeURIComponent(encrypt.encrypt(this.userId))
      this.$router.push(`/setting/user/edit/${id}`)
    },
    // 삭제
    onClickDelete() {
      const msg = this.detailInfo.useYn === 'Y' ? '비활성화' : '활성화'
      this.openConfirm(`${this.detailInfo.email} 사용자를 ${msg} 하시겠습니까?`)
    },

    // [삭제 요청 확인창] 확인 클릭 시
    async onClickDelConfirm() {
      const enabled = this.detailInfo.useYn === 'Y'
      try {
        // 삭제 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        await this.deleteUser({
          userId: this.userId,
          enable: !enabled,
        })

        // 삭제 성공 시
        const msg = enabled ? '비활성화' : '활성화'
        this.openAlert({ title: `사용자가 ${msg} 되었습니다.`, type: 'info' })

        await this.getDetail({ userId: this.userId })

        // 1초 후 리스트 화면으로 이동
        // setTimeout(() => this.$router.push('/setting/user/list'), 1000)
      } catch (error) {
        this.openAlert({ title: '요청을 실패했습니다.', type: 'error' })
        console.log(error)
      }
    },

    // [삭제 요청 확인창] 취소 클릭 시
    onClickDelCancel() {},
  },
}
</script>
<style lang="scss">
.sp-user-detail {
  .list-button {
    margin-right: 10px;
    border-width: thin;
    border-radius: 5px;
    color: $basic-button;
    font-weight: bold;
    width: 120px;
  }
}
</style>
