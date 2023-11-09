<template>
  <div class="sp-main">
    <router-view />
    <modal
      title-name="회원정보"
      modal-width="600"
      modal-height="620"
      body-height="750px"
      :dialog="dialog"
      @close-modal="onClickCloseModal"
    >
      <template #content>
        <change-my-info ref="myInfo" />
      </template>
      <template #footer>
        <!-- <div class="my-info__button-wrapper">
          <sp-button class="edit-button" outlined @click="onClickUpdate">
            Save
          </sp-button>
        </div> -->
      </template>
    </modal>
  </div>
</template>

<script>
import Modal from '@/components/modals/Modal.vue'
import ChangeMyInfo from '@/views/login/ChangeMyInfo.vue'
import { createNamespacedHelpers } from 'vuex'

const serviceGroupMapUtil = createNamespacedHelpers('serviceGroup')
const loginUserMapUtil = createNamespacedHelpers('loginUser')

export default {
  components: {
    Modal,
    ChangeMyInfo,
  },
  computed: {
    ...loginUserMapUtil.mapState({
      dialog: 'isShowEditModal',
    }),
  },
  created() {
    this.initServiceGroup()
  },
  methods: {
    ...serviceGroupMapUtil.mapActions(['initServiceGroup']),
    ...loginUserMapUtil.mapMutations(['changeShowEditModal']),
    onClickCloseModal() {
      this.changeShowEditModal(false)
      this.$refs.myInfo.initData()
    },
    onClickUpdate() {
      this.$refs.myInfo.onSubmit()
    },
  },
}
</script>

<style lang="scss">
.sp-main {
  width: 100%;
  padding-bottom: 30px;
}

.my-info__button-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  .edit-button {
    width: 112px;
    color: $sp-teriary;
  }
}
</style>
