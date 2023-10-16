<template>
  <v-dialog
    v-model="showDialog"
    :width="modalWidth"
    class="minimize-modal"
    persistent
    @keydown="onKeyDownESC"
  >
    <template #activator="{ props }">
      <!-- 최소화 된 터미널 컨트롤 버튼 -->
      <div class="minimize-modal--active">
        <v-btn
          v-show="minimizeModal && dialog"
          elevation="3"
          dark
          fab
          color="#1A3350"
          v-bind="props"
          @click="onClickEnlargeModal"
        >
          <v-icon dark>terminal</v-icon>
        </v-btn>
      </div>
    </template>
    <sp-card
      class="card-box"
      :class="popupCardClass"
      :height="modalHeight"
      :min-height="modalHeight"
      headered
      no-line
      :label="titleName"
      dark
      :className="{
        titleStyle: {
          paddingLeft: '10px',
        },
        headerStyle: {
          backgroundColor: isWhite ? '#fff' : '#1A3350',
        },
        bodyStyle: {
          height: bodyHeight ? bodyHeight : '',
        },
      }"
    >
      <template #header>
        <div class="button-wrapper">
          <sp-button
            class="modal--minimize"
            @click="onClickMinimizeModal"
            elevation="0"
            dense
          >
            <v-icon :color="isWhite ? '#1A3350' : '#fff'">remove</v-icon>
          </sp-button>
          <sp-button
            @click="onClickCloseModal"
            class="modal--cancel"
            elevation="0"
            dense
          >
            <v-icon :color="isWhite ? '#1A3350' : '#fff'">close</v-icon>
          </sp-button>
        </div>
      </template>

      <slot name="content"></slot>
      <slot name="footer"></slot>
    </sp-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    titleName: {
      type: String,
      default: '',
      description: '모달 헤더 이름',
    },
    modalWidth: {
      type: String,
      default: '',
      description: '모달 넓이',
    },
    modalHeight: {
      type: String,
      default: '',
      description: '모달 높이',
    },
    dialog: {
      type: Boolean,
      default: false,
      description: '모달 오픈 여부',
    },
    isWhite: {
      type: Boolean,
      default: false,
      description: '모달 헤드 색깔 여부',
    },
    isTemplateBtn: {
      type: Boolean,
      default: false,
      description: '템플릿 버튼 표시 여부',
    },
    bodyHeight: {
      type: String,
      default: '',
      description: 'card-body Div의 높이값 설정',
    },
    popupCardClass: {
      type: String,
      default: '',
      description: 'card의 개별 클래스네임',
    },
  },
  data() {
    return {
      minimizeModal: false,
    }
  },
  watch: {
    /*
     @brief window 클릭시 감지하는 함수
     @date 2021/11/02
     @return
     @param
        - val: Boolean(다이얼로그 open or close 값)
    */
    // dialog(val) {
    //   console.warn('2')
    //   !val && this.onClickCloseModal()
    // },
  },
  computed: {
    showDialog() {
      return this.dialog && !this.minimizeModal
    },
  },
  methods: {
    /*
     @brief 모달 close 함수
     @date 2021/11/02
     @return
     @param
    */
    onClickCloseModal() {
      this.$emit('close-modal', this.order && this.order)
    },
    onKeyDownESC(event) {
      if (event.keyCode === 27) {
        this.onClickCloseModal()
      }
    },
    onClickMinimizeModal() {
      this.minimizeModal = true
    },
    onClickEnlargeModal() {
      this.minimizeModal = false
    },
  },
}
</script>

<style lang="scss" scoped>
.button-wrapper {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  .modal--cancel,
  .modal--minimize {
    background: transparent;
    padding: 0;
    min-width: 0;
    opacity: 0.6;
  }
  .modal--minimize {
    margin-right: 10px;
  }
}

.minimize-modal--active {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2000;
}
</style>
