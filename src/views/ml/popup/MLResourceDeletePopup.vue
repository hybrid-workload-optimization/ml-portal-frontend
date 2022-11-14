<template v-slot:content>
  <div class="popup-ml__title-wrapper">
    <div>
      <div class="popup-ml__title">
        선택하신 Machine learning을 삭제하시겠습니까?
      </div>
      <div class="popup-ml__title">이 작업은 되돌릴 수 없습니다.</div>
    </div>
    <div class="popup-ml__button-wrapper">
      <sp-button
        class="popup-ml--button cancel"
        elevation="0"
        dense
        @click="onClickCloseModal"
      >
        Cancel
      </sp-button>
      <sp-button
        class="popup-ml--button finish"
        elevation="0"
        dense
        @click="onClickConfirmModal"
      >
        Confirm
      </sp-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const mlMapUtils = createNamespacedHelpers('ml')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  created() {},
  data() {
    return {
      vmType: '',
      vmCount: 0,
    }
  },
  props: {
    item: {
      type: Number,
      default: {},
      description: 'Resource Id',
    },
  },
  conputed: {},
  methods: {
    ...mlMapUtils.mapActions(['deleteMLResource']),
    ...mlMapUtils.mapMutations(['getResourceList']),
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

    async onClickConfirmModal() {
      try {
        const response = await this.deleteMLResource({
          id: this.item,
        })

        if (response.status === 200) {
          // 삭제 성공 시
          this.openAlert({
            title: '리소스가 삭제 되었습니다.',
            type: 'info',
          })
          // 1초 후 리스트 화면으로 이동
          this.getResourceList(this.item)
          setTimeout(() => this.onClickCloseModal(), 1000)
        } else {
          // 삭제 실패 시
          this.openAlert({
            title: '리소스 수정을 실패했습니다.',
            type: 'error',
          })
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({
          title: '리소스 수정을 실패했습니다.',
          type: 'error',
        })
        console.log(error)
      }
    },
    onClickCloseModal() {
      this.$emit('closePopup')
    },
  },
}
</script>

<style lang="scss">
.bindTable {
  width: 100%;
}
.popupTable {
  background: #6d6053;
  margin: auto;
}
.popupTable > tr > td:nth-child(1) {
  background: white;
  padding-left: 2em;
  width: 15em;
}
.popupTable > tr > td:nth-child(2) > input[type='text'] {
  width: 100%;
}
.input-text {
  margin-left: 10px;
}
.popupTable > tr > td:nth-child(2) > input[type='number'] {
  width: 10em;
  text-align: center;
  border: 1px solid #6d6053;
}
.popupTable > tr > td:nth-child(2) > label {
  margin-left: 1em;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  opacity: 1;
  color: red;
}
.popupTable > tr > td:nth-child(2) {
  background: white;
  width: 20em;
}
.btnDiv {
  width: 100%;
  text-align: center;
}
.btnDiv > button {
  padding: 3px 10px 3px 10px;
  margin-top: 1em;
  border-radius: 4px;
  font-weight: bold;
  color: #6d6053;
  border: 2px solid #6d6053;
}
.btnDiv > button:nth-child(1) {
  margin-right: 7px;
}
</style>
