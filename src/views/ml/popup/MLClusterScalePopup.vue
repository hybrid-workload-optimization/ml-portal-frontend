<template>
  <div class="bindTable">
    <table class="popupTable">
      <tr>
        <td>
          <label>VM Type</label>
        </td>
        <td>
          <input class="input-text" type="text" v-model="vmType" disabled />
        </td>
      </tr>
      <tr>
        <td>
          <label>VM Count</label>
        </td>
        <td>
          <input type="number" min="0" max="10" v-model="vmCount" />
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
        @click="clickLimitSave"
        >Save</sp-button
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
    async clickLimitSave() {
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
.bindTable {
  width: 100%;
  padding-top: 1.7em;
}
.popupTable {
  background: #2a4058;
  margin: auto;
  text-align: center;
}
.popupTable > tr > td:nth-child(1) {
  background: white;
  // padding-left: 2em;
  // width: 15em;
}
.popupTable > tr > td:nth-child(2) > input[type='text'] {
  width: 100%;
}
.input-text {
  margin-left: 10px;
}
.popupTable > tr > td:nth-child(2) > input[type='number'] {
  width: 100%;
  text-align: center;
  border: 0px;
  // border: 1px solid #2a4058;
}
.popupTable > tr > td:nth-child(2) > label {
  margin-left: 1em;
}
.popupTable > tr > td:nth-child(2) {
  background: white;
  width: 20em;
}

.popup-ml--button:nth-child(1) {
  margin-right: 20px;
  padding-right: 20px;
}
</style>
