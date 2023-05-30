<template>
  <div class="cluster-scale-popup-class">
    <div class="scale-popup-table-wrapper">
      <table class="table-wrapper-table">
        <tr>
          <td class="table-wrapper-table-number">
            <label-with-text
              id="vmCount"
              horizontal
              name="Node Count"
              v-model="vmCount"
              @blur="checkValue"
              type="number"
              :value="vmCount"
            ></label-with-text>
          </td>
        </tr>
      </table>
      <div class="popup-ml__button-wrapper">
        <sp-button
          class="popup-ml--button cancel"
          elevation="0"
          dense
          @click="popupClose"
          >Cancel</sp-button
        >
        <sp-button
          class="popup-ml--button confirm"
          elevation="0"
          dense
          @click="clickEditSave"
          >Confirm</sp-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import LabelWithText from '@/components/molcule/LabelWithText.vue'

const mlMapUtils = createNamespacedHelpers('ml')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    LabelWithText,
  },
  // created() {
  //   this.initLimitData()
  // },
  mounted() {
    this.initLimitData()
  },
  data() {
    return {
      vmCount: 0,

      dataVMTypeList: [
        {
          text: 'Pretreatment',
          value: 'ml-step-100',
        },
        {
          text: 'Verification',
          value: 'ml-step-200',
        },
        {
          text: 'Learning',
          value: 'ml-step-300',
        },
        {
          text: 'Inference',
          value: 'ml-step-400',
        },
        {
          text: 'Service',
          value: 'ml-step-900',
        },
      ],
    }
  },
  props: {
    item: {
      type: Object,
      default: {},
      description: 'clusterInfo',
    },
  },
  conputed: {},
  methods: {
    ...mlMapUtils.mapMutations(['initClusters']),
    ...mlMapUtils.mapActions(['updateClusterScale']),
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

    // input number 에 숫자가 아닌 문자가 들어올경우 조건식으로 체크
    checkValue(e) {
      console.log(e)
      const regex = /[0-9]+$/
      if (!regex.test(e.data) && e.data !== null) {
        const value = document.getElementById('vmCount')
        value.value = null
      }
    },
    initLimitData() {
      console.log(this.$store.state.scaleIdx)
      console.log(this.$store.state.scaleNodeCount)

      console.log(this.item)
      // this.vmCount = this.item.nodeCount
      this.vmCount = this.$store.state.scaleNodeCount

      if (this.vmCount === null) {
        this.vmCount = 0
      }
    },
    async clickEditSave() {
      if (this.vmCount === null) {
        this.vmCount = 0
      }
      try {
        const response = await this.updateClusterScale({
          clusterIdx: Number(this.$store.state.scaleIdx),
          nodeCount: Number(this.vmCount),
        })
        if (response.status === 200) {
          // 수정 성공 시
          this.openAlert({
            title: '클러스터 용량 변경이 시작 되었습니다.',
            type: 'info',
          })
          // 1초 후 팝업 닫기
          this.initClusters()
          setTimeout(() => this.popupClose(), 1000)
        } else {
          // 수정 실패 시
          this.openAlert({
            title: '클러스터 용량 변경에 실패하였습니다.',
            type: 'error',
          })
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({
          title: '클러스터 용량 변경에 실패하였습니다.',
          type: 'error',
        })
        console.log(error)
      }
    },
    popupClose() {
      this.$emit('closePopup')
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.scale-popup-table-wrapper {
  $this: 'popup-ml';
  .table-wrapper-table {
    margin: 0 auto;
    // margin-top: 2em;
  }
  .sp-label-with-text .horizontal {
    width: 20em;
    margin-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .sp__label {
    width: 6em;
    // text-align: left;
  }
  .#{$this}__button-wrapper {
    margin: 0 auto;
    margin-top: auto;
    text-align: right;

    .#{$this}--button {
      margin-right: 10px;
      margin-left: 10px;
      width: 114px;
      border-radius: 20px;
    }

    .cancel {
      border: 1px solid inherit;
    }
    .confirm {
      border: 1px solid $sp-teriary;
      color: $sp-teriary;
    }
  }
}

// .table-wrapper {
//   width: 100%;
//   height: 10em;
//   text-align: center;
//   margin-top: 1em;
//   .table-wrapper-table {
//     margin: 0 auto;
//     text-align: right;
//     #vmCount {
//       font-size: 1.1em;
//     }
//   }
//   .table-wrapper-table > tr:nth-child(2) {
//     text-align: left;
//   }
//   .popup-ml--button {
//     margin: 40px 15px 0 15px;
//   }
// }
</style>
