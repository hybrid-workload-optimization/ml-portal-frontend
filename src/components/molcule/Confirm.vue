<template>
  <div class="sp-confirm-modal">
    <div class="confirm-modal__wrapper">
      <modal
        isWhite
        title-name=""
        modal-width="446"
        modal-height="230"
        :dialog="lazyDialog"
        @close-modal="onClickCancelModal"
      >
        <template v-slot:content>
          <div class="confirm-modal__title">{{ confrimTitle }}</div>
        </template>
        <template v-slot:footer>
          <div class="confirm-modal__button-wrapper">
            <sp-button
              class="confirm-modal--button cancel"
              elevation="0"
              dense
              @click="onClickCancelModal"
            >
              Cancel
            </sp-button>
            <sp-button
              class="confirm-modal--button confirm"
              elevation="0"
              dense
              @click="onClickConfirmModal"
            >
              Confirm
            </sp-button>
          </div>
        </template>
      </modal>
    </div>
    <!-- <v-dialog v-model="lazyDialog" width="446">
      <sp-card class="confirm-modal__wrapper" height="240" min-height="240">
        <div class="confirm-modal__title-box">{{ confrimTitle }}</div>
        <div class="confirm-modal__button-box">
          <sp-button
            elevation="0"
            color="warning"
            dense
            @click="onClickCancelModal"
          >
            Cancel
          </sp-button>
          <sp-button
            elevation="0"
            color="info"
            dense
            @click="onClickConfirmModal"
          >
            Confirm
          </sp-button>
        </div>
      </sp-card>
    </v-dialog> -->
  </div>
</template>

<script>
import Modal from '@/components/modals/Modal.vue'
import { createNamespacedHelpers } from 'vuex'

const confirmMapUtils = createNamespacedHelpers('confirm')

const tag = '[Confirm]'

export default {
  // props: {
  //   titleName: {
  //     type: String,
  //     default: '',
  //     description: '컨펌창 헤더 이름',
  //   },
  //   dialog: {
  //     type: Boolean,
  //     default: false,
  //     description: '컨펌창 오픈 여부',
  //   },
  // },

  // data() {
  //   return {
  //     dialog: false,
  //   }
  // },
  components: {
    Modal,
  },
  computed: {
    ...confirmMapUtils.mapGetters(['confrimTitle']),

    lazyDialog: {
      get() {
        return this.showConfirm()
      },
      set(value) {
        if (!value) {
          this.onClickCancelModal()
        }
      },
    },
  },
  methods: {
    ...confirmMapUtils.mapGetters(['showConfirm']),
    ...confirmMapUtils.mapMutations(['closeConfirm']),
    onClickConfirmModal() {
      console.log(tag, 'onClickConfirmModal')
      this.$emit('confirm-modal')
      this.closeConfirm()
    },
    onClickCancelModal() {
      console.log(tag, 'onClickCancelModal')
      this.$emit('cancel-modal')
      this.closeConfirm()
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.confirm-modal__title {
  text-align: center;
  white-space: pre;
  @include set-text(500, 16, rgba($color: $sp-sky-blue-500, $alpha: 1));
}

@include popup-buttons('confirm-modal', 'confirm');
</style>
