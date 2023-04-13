<template>
  <div class="sp-multi-select">
    <div class="multi-select__box">
      <sp-select
        v-if="firstSelectMeta"
        class="multi-select--select"
        background-color="#F5F5f5"
        hide-details="auto"
        placeholder="- Select"
        outlined
        single-line
        flat
        dense
        :value="firstValue"
        @input="onChangeFirstSelect"
        :items="firstItems"
      />
    </div>
    <div class="multi-select__button-box">
      <sp-button
        class="multi-select--deploy"
        elevation="0"
        dense
        outlined
        :disabled="btnDisabled || !isProjectAuth"
        @click="onClickBtn"
      >
        {{ btnName }}
      </sp-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

// const tag = '[MultiSelect]'
const selectButtonMapUtils = createNamespacedHelpers('selectButton')

export default {
  props: {
    autoSelect: {
      type: Boolean,
      default: true,
      description: '로딩 시 셀렉트 박스 항목 자동 선택 여부',
    },
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
        '세번째 조회할 항목의 메타 데이터({requestFunc: 호출할 메서드, parameters: 호출 시 넘길 파라미터, valueKey: 이전 셀렉트 박스의 value가 세팅될 속성키})',
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
  mixins: [checkProjectAuth],
  computed: {
    ...selectButtonMapUtils.mapGetters(['firstValue', 'firstItems']),
  },
  async created() {
    this.projectUserRole = this.$store.state.loginUser.projectUserRole
    this.currentMenuInfo = this.$store.state.loginUser.currentMenuInfo
    await this.initFirstItems()
  },
  data() {
    return {
      btnDisabled: true,
      projectUserRole: [], // project member의 권한에 따른 new/edit 버튼 disabled 처리
      currentMenuInfo: {},
    }
  },
  methods: {
    ...selectButtonMapUtils.mapMutations(['setFirstValue']),
    ...selectButtonMapUtils.mapActions(['requestGetFirstItems']),
    async initFirstItems() {
      if (!this.firstSelectMeta) {
        return
      }
      await this.requestGetFirstItems(this.firstSelectMeta)
      const firstItem = sessionStorage.getItem('firstVal')
      if (this.firstItems && this.firstItems.length > 0) {
        if (
          firstItem &&
          this.firstItems.some(e => Number(e.id) === Number(firstItem))
        ) {
          this.setFirstValue(firstItem)
        } else if (this.autoSelect) {
          // session storage의 id 값이 items에 없을 경우
          if (firstItem) {
            sessionStorage.removeItem('firstVal')
          }
          if (this.firstItems.length) {
            this.setFirstValue(this.firstItems[0].value)
          }
        }
        this.checkProjectAuth(this.firstItems[0].value)
        this.btnDisabled = false
      }
    },
    onClickBtn() {
      this.$emit('clickBtn')
    },
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
      this.setFirstValue(value)
      this.checkProjectAuth(value)
      this.emitChageItem()
    },
    emitChageItem() {
      console.log('[emitChageItem]:')
      const value = {
        firstValue: this.firstValue,
      }
      this.$emit('changeItem', value)
    },
    // checkEditAuthInProject() {
    //   if (this.firstValue) {
    //     const projectUserRole = this.projectUserRole[this.firstValue]
    //     if (projectUserRole) {
    //       const result = this.findMenuByMenuIdx(
    //         projectUserRole,
    //         this.currentMenuInfo.menuIdx,
    //       )
    //       this.btnDisabled = result
    //     } else {
    //       this.btnDisabled = true
    //     }
    //   } else {
    //     this.btnDisabled = true
    //   }
    // },
    // findMenuByMenuIdx(menuList, menuIdx) {
    //   return !menuList.some(menu => {
    //     if (menu.menuIdx === menuIdx && menu.writableYn !== 'Y') {
    //       return menu
    //     }
    //     if (menu.subMenuList && menu.subMenuList.length) {
    //       return this.findMenuByMenuIdx(menu.subMenuList, menuIdx)
    //     }
    //     return false
    //   })
    // },
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
      min-width: 178px;
      background: #fff;
      // border-radius: 50px;
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
