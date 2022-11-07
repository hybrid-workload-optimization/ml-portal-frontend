<template>
  <div class="sp-multi-select-dashboard">
    <div class="multi-select-dashboard__box">
      <sp-select
        v-if="firstSelectMeta"
        class="project-select"
        background-color="#F5F8FBCC"
        hide-details="auto"
        placeholder="Select Project"
        outlined
        single-line
        flat
        dense
        :value="firstValue"
        @input="onChangeFirstSelect"
        :items="firstItems"
      />

      <sp-select
        v-if="firstSelectMeta && secondSelectMeta"
        class="cluster-select"
        background-color="#F5F8FBCC"
        hide-details="auto"
        placeholder="Select Cluster"
        outlined
        single-line
        flat
        dense
        :value="secondValue"
        @input="onChangeSecondSelect"
        :items="secondItems"
      />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

// const tag = '[MultiSelect]'
const multiSelectMapUtils = createNamespacedHelpers('multiSelect')

export default {
  props: {
    selectCount: {
      type: String,
      default: '3',
      description: '컴포넌트 내의 셀렉트 갯수 값 (1~3)으로 조절 가능',
    },
    btnName: {
      type: String,
      default: () => '',
      description: '버튼 명칭',
    },
    firstSelectMeta: {
      type: Object,
      default: () => null,
      description:
        '첫번째 조회할 항목의 메타 데이터({requestFunc: 호출할 메서드, parameters: 호출 시 넘길 파라미터})',
    },
    secondSelectMeta: {
      type: Object,
      default: () => null,
      description:
        '두번째 조회할 항목의 메타 데이터({requestFunc: 호출할 메서드, parameters: 호출 시 넘길 파라미터, valueKey: 이전 셀렉트 박스의 value가 세팅될 속성키})',
    },
    lastSelectAction: {
      type: Function,
      default: () => null,
      description:
        '마지막 셀렉트가 선택되었을 때 실행할 메서드(메서드 호출 시 마지막 선택된 항목의 value값이 인자로 넘어온다)',
    },
    // btnClickAction: {
    //   type: Function,
    //   default: () => null,
    //   description: '버튼이 클릭되었을 때 실행할 메서드',
    // },
  },
  computed: {
    ...multiSelectMapUtils.mapGetters([
      'firstValue',
      'secondValue',
      'firstItems',
      'secondItems',
    ]),
    selectsFirst() {
      return this.$store.state.multiSelect.multiSelect.filter(
        item => item.order === 'first',
      )
    },
  },
  created() {
    if (this.firstSelectMeta) {
      this.requestGetFirstItems(this.firstSelectMeta)
    }
  },
  data() {
    return {}
  },
  methods: {
    ...multiSelectMapUtils.mapMutations(['setFirstValue', 'setSecondValue']),
    ...multiSelectMapUtils.mapActions([
      'requestGetFirstItems',
      'requestGetSecondItems',
    ]),
    /* 기존 @change 쓸 때 사용한 함수 */
    // onChangeFirstSelect(value) {
    //   console.log(tag, 'onChangeFirstSelect')
    //   this.firstSelectValue = value
    // },
    // onChangeSecondSelect(value) {
    //   console.log(tag, 'onChangeSecondSelect')
    //   this.secondSelectValue = value
    // },
    // onChangeThirdSelect(value) {
    //   console.log(tag, 'onChangeThirdSelect')
    //   this.thirdSelectValue = value
    // },
    onChangeFirstSelect(value) {
      console.log('value~~~', value)
      this.setFirstValue(value)
      if (this.secondSelectMeta) {
        console.log('value:', value)
        this.requestGetSecondItems(this.secondSelectMeta)
      }
      this.emitChageItem()
    },
    onChangeSecondSelect(value) {
      this.setSecondValue(value)
      if (this.thirdSelectMeta) {
        this.requestGetThirdItems(this.thirdSelectMeta)
      }
      this.emitChageItem()
    },
    emitChageItem() {
      const value = {
        firstValue: this.firstValue,
        secondValue: this.secondValue,
      }
      this.$emit('changeItem', value)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-multi-select-dashboard {
  $this: 'multi-select-dashboard';

  display: flex;
  justify-content: flex-end;

  .#{$this}__box {
    justify-content: flex-end;
    display: flex;
    margin-bottom: 20px;
    .project-select,
    .cluster-select {
      width: 270px;
      .sp-select {
        border-color: #4b556680 !important;
      }
    }
    .project-select {
      margin-right: 10px;
    }
  }
}
</style>
