<template>
  <div class="sp-user-card-title-with-detail">
    <!-- 컴포넌트 왼쪽 부분 Start,  -->
    <div class="title-left">
      <h2 class="card-title">{{ detailInfo.userName }}</h2>
      <span class="left-content">
        {{ detailInfo.userName }}({{ detailInfo.email }}) </span
      ><br />
      <span class="left-label">Created</span>
      <span class="left-content">{{ detailInfo.createdAt }}</span>
      <span class="left-label">Updated</span>
      <span class="left-content">{{ detailInfo.updatedAt }}</span>
    </div>

    <div class="title-right" v-if="mode">
      <sp-button outlined class="title-button" @click="onClickBack"></sp-button>
      <sp-button
        outlined
        class="edit-button title-button"
        @click="onClickEdit"
      ></sp-button>
      <sp-button
        outlined
        class="delete-button title-button"
        @click="onClickDelete"
      ></sp-button>
    </div>

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

const userMapUtils = createNamespacedHelpers('user')
const confirmMapUtils = createNamespacedHelpers('confirm')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  props: {
    mode: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Confirm,
  },
  data() {
    return {
      userId: '',
    }
  },

  created() {
    // this.userId = this.$route.params.id
  },
  mounted() {
    // this.getDetail({ userId: this.userId })
  },
  computed: {
    ...userMapUtils.mapGetters(['detailInfo']),
  },
  methods: {
    ...userMapUtils.mapActions(['getDetail', 'deleteUser']),

    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    // 뒤로가기
    onClickBack() {
      console.log(`onClickBack..${this.detailInfo.email}`)
      this.$router.push('/setting/user/list')
    },
    // 수정
    onClickEdit() {
      console.log(`onClickEdit..${this.detailInfo.email}`)
      this.$router.push(`/setting/user/edit/${this.detailInfo.email}`)
    },
    // 삭제
    onClickDelete() {
      console.log(`onClickDelete..${this.detailInfo.email}`)
      this.openConfirm(`${this.detailInfo.email} 사용자를 삭제하시겠습니까?`)
    },

    // [삭제 요청 확인창] 확인 클릭 시
    async onClickDelConfirm() {
      try {
        // 삭제 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.deleteUser({
          userId: this.detailInfo.email,
        })

        if (response.status === 200) {
          // 삭제 성공 시
          this.openAlert({ title: '사용자가 삭제 되었습니다.', type: 'info' })

          // 1초 후 리스트 화면으로 이동
          setTimeout(() => this.$router.push('/setting/user/list'), 1000)
        } else {
          // 삭제 실패 시
          this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
        console.log(error)
      }
    },

    // [삭제 요청 확인창] 취소 클릭 시
    onClickDelCancel() {},
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-user-card-title-with-detail {
  margin-bottom: 15px;
  .title-left {
    display: inline-block;
    width: 60%;
    vertical-align: middle;
    .card-title {
      color: $sp-title;
      font-size: toRem(34);
    }
    .left-label {
      opacity: 0.8;
      font-size: 0.8rem;
      margin-right: 10px;
    }
    .left-content {
      font-size: 0.8rem;
      margin-right: 20px;
    }
  }
  .title-right {
    width: 40%;
    display: inline-block;
    text-align: right;
    vertical-align: middle;

    .title-button {
      width: 120px;
      color: $sp-teriary;
      border-radius: 5px;
      border-width: thin;
      font-weight: bold;
    }
    .edit-button {
      margin-right: 10px;
    }
  }
}
</style>
