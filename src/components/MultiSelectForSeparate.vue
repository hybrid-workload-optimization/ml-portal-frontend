<template>
  <div class="sp-multi-select">
    <div class="multi-select__box">
      <sp-select
        v-if="firstSelectMeta"
        class="multi-select--select"
        background-color="#F5F5f5"
        hide-details="auto"
        outlined
        single-line
        flat
        dense
        :value="firstValue"
        @input="onChangeFirstSelect"
        :items="firstItems"
      />
      <sp-select
        v-if="secondSelectMeta"
        class="multi-select--select"
        background-color="#F5F5f5"
        hide-details="auto"
        outlined
        single-line
        flat
        dense
        :value="secondValue"
        @input="onChangeSecondSelect"
        :items="secondItems"
      />
      <sp-select
        v-if="thirdSelectMeta"
        class="multi-select--select"
        background-color="#F5F5f5"
        hide-details="auto"
        outlined
        single-line
        flat
        dense
        :value="thirdValue"
        @input="onChangeThirdSelect"
        :items="thirdItems"
      />
    </div>
    <div class="multi-select__button-box">
      <sp-button
        class="multi-select--deploy"
        elevation="0"
        dense
        outlined
        :disabled="isDisabled"
        @click="onClickBtn"
      >
        {{ btnName }}
      </sp-button>
    </div>
  </div>
</template>

<script>
/**
 * 순서가 없는 select
 */
import { createNamespacedHelpers } from 'vuex'

// const tag = '[MultiSelect]'
const multiSelectMapUtils = createNamespacedHelpers('multiSelectForSeparate')

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
        '두번째 조회할 항목의 메타 데이터({requestFunc: 호출할 메서드})',
    },
    thirdSelectMeta: {
      type: Object,
      default: () => null,
      description:
        '세번째 조회할 항목의 메타 데이터({requestFunc: 호출할 메서드})',
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
    isDisabled: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...multiSelectMapUtils.mapGetters([
      'firstValue',
      'secondValue',
      'thirdValue',
      'firstItems',
      'secondItems',
      'thirdItems',
    ]),
    selectsFirst() {
      return this.$store.state.multiSelectForSeparate.multiSelect.filter(
        item => item.order === 'first',
      )
    },
  },
  created() {
    if (this.firstSelectMeta) {
      this.requestGetFirstItems(this.firstSelectMeta)
    }
    if (this.secondSelectMeta) {
      this.requestGetSecondItems(this.secondSelectMeta)
    }
    if (this.thirdSelectMeta) {
      this.requestGetThirdItems(this.thirdSelectMeta)
    }
  },
  data() {
    return {}
  },
  methods: {
    ...multiSelectMapUtils.mapMutations([
      'setFirstValue',
      'setSecondValue',
      'setThirdValue',
    ]),
    ...multiSelectMapUtils.mapActions([
      'requestGetFirstItems',
      'requestGetSecondItems',
      'requestGetThirdItems',
    ]),
    onClickBtn() {
      this.$emit('clickBtn')
    },
    onChangeFirstSelect(value) {
      this.setFirstValue(value)
      this.emitChageItem()
    },
    onChangeSecondSelect(value) {
      this.setSecondValue(value)
      this.emitChageItem()
    },
    onChangeThirdSelect(value) {
      this.setThirdValue(value)
      this.emitChageItem()
    },
    emitChageItem() {
      const value = {
        firstValue: this.firstValue,
        secondValue: this.secondValue,
        thirdValue: this.thirdValue,
      }
      this.$emit('changeItem', value)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-multi-select {
  $this: 'multi-select';

  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .#{$this}__box {
    display: flex;
    align-items: center;
    .#{$this}--select {
      margin-right: 16px;
      width: 256px;
      .v-input__slot {
        border-color: #4b556680;
        fieldset {
          background-color: #fff;
        }
        .v-select__slot {
          .v-icon__svg {
            color: #000;
          }
        }
      }
      @include desktop-small {
        width: 200px;
      }
    }
  }
  .#{$this}__button-box {
    .#{$this}--deploy {
      @include set-text(bold, 14, rgba($color: $sp-teriary, $alpha: 1));
      height: 35px;
      min-width: 114px;
      background: #fff;
      border-radius: 5px;
      border: thin solid rgba($color: $sp-teriary, $alpha: 1);

      &:disabled {
        border: 2px solid rgba(0, 0, 0, 0.26);
        color: rgba(0, 0, 0, 0.26);
      }
    }
  }
}
</style>
