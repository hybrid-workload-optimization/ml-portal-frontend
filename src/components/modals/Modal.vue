<template>
  <v-dialog
    v-model="dialog"
    :width="modalWidth"
    class="sp-modal"
    @click:outside="onClickOutSide"
    @keydown="onKeyDownESC"
  >
    <template v-slot:activator="{ on }">
      <slot name="buttons" v-on="on"></slot>
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
      <template v-slot:header>
        <div class="button-wrapper">
          <sp-button
            v-if="isTemplateBtn"
            @click="onClickTemplate"
            class="modal--template"
            elevation="0"
            dense
          >
            <v-icon :color="isWhite ? '#1A3350' : '#fff'">assignment</v-icon>
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
const tag = '[modal]'

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
  methods: {
    /*
     @brief 모달 close 함수
     @date 2021/11/02
     @return
     @param
    */
    onClickTemplate() {
      this.$emit('click-template')
    },
    onClickCloseModal() {
      console.log(tag, 'onClickCloseModal')

      this.$emit('close-modal', this.order && this.order)
    },
    onClickOutSide() {
      // console.warn('1')
      this.onClickCloseModal()
    },
    onKeyDownESC(event) {
      if (event.keyCode === 27) {
        this.onClickCloseModal()
      }
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
  .modal--template {
    background: transparent;
    padding: 0;
    min-width: 0;
    opacity: 0.6;
  }
  .modal--template {
    margin-right: 10px;
  }
}
</style>
