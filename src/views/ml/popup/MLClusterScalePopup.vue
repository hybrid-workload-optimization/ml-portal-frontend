<template>
  <div class="table-wrapper">
    <table class="table-wrapper-table">
      <tr>
        <td>
          <label class="table-wrapper-table-label">VM Type : </label>
        </td>
        <td class="table-wrapper-table-select">
          <sp-select
            class="sp__input authority_select"
            background-color="#fff"
            hide-details="auto"
            outlined
            single-line
            flat
            :items="vmType"
          />
          <!-- <input type="text" v-model="vmType" disabled /> -->
        </td>
      </tr>
      <tr>
        <td>
          <label class="table-wrapper-table-label">VM Count : </label>
        </td>
        <td class="table-wrapper-table-number">
          <input
            id="vmCount"
            type="number"
            min="0"
            max="20"
            v-model="vmCount"
            @input="checkValue"
          />
        </td>
      </tr>
    </table>
    <div class="popup-ml__button-wrapper">
      <sp-button
        class="popup-ml--button finish"
        elevation="0"
        dense
        @click="popupClose"
        >Cancel</sp-button
      >
      <sp-button
        class="popup-ml--button finish"
        elevation="0"
        dense
        @click="clickEditSave"
        >Confirm</sp-button
      >
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const mlMapUtils = createNamespacedHelpers('ml')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  created() {
    this.initLimitData()
  },
  data() {
    return {
      vmType: '',
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
    ...mlMapUtils.mapActions(['updateClusterScale']),
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

    // input number 에 숫자가 아닌 문자가 들어올경우 조건식으로 체크
    checkValue(e) {
      const regex = /[0-9]+$/
      if (!regex.test(e.data) && e.data !== null) {
        const value = document.getElementById('vmCount')
        value.value = null
      }
    },

    initLimitData() {
      this.vmType = this.item.vmType
      this.vmCount = this.item.nodeCount

      if (this.vmType === null) {
        this.vmType = 'null'
      }
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
          clusterIdx: this.item.clusterIdx,
          vmType: this.nodeType,
          nodeCount: this.vmCount,
        })

        if (response.status === 200) {
          // 삭제 성공 시
          this.openAlert({
            title: '클러스터가 수정 되었습니다.',
            type: 'info',
          })
          // 1초 후 리스트 화면으로 이동
          setTimeout(() => this.popupClose(), 1000)
        } else {
          // 삭제 실패 시
          this.openAlert({
            title: '클러스터 수정을 실패했습니다.',
            type: 'error',
          })
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({
          title: '클러스터 수정을 실패했습니다.',
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
.table-wrapper {
  width: 100%;
  height: 10em;
  text-align: center;
  .table-wrapper-table {
    margin: 0 auto;
    text-align: center;
    .table-wrapper-table-label {
      padding-right: 10px;
    }
    #vmCount {
      height: 2em;
      font-size: 1.1em;
    }
  }
  .table-wrapper-table > tr:nth-child(2) {
    text-align: left;
  }
  .table-wrapper-table-select {
    width: 13.2em;
  }
  .table-wrapper-table-number > input {
    width: 13.2em;
  }
}
</style>
