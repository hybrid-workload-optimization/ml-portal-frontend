<template>
  <div class="sp-authority-add-edit-item">
    <div class="add-edit-input-wrapper">
      <!-- -->
      <label-with-text
        class="add-edit-input"
        name=""
        :placeholder="placeholder"
        :className="{
          inputStyle: {
            fontSize: '0.8rem',
          },
        }"
        :value="itemName"
        @input="setItemName"
      >
        <template #button>
          <sp-button
            class="duplicate-check-button"
            depressed
            height="40"
            color="#4B5566"
            :disabled="!isCheckedDuplicate"
            @click="checkDuplicate(), (snackbar = true)"
            >중복확인</sp-button
          >
        </template>
      </label-with-text>
    </div>
    <div class="add-edit-button-wrapper">
      <sp-button class="button cancel-button" outlined @click="closePopup"
        >취소</sp-button
      >
      <sp-button class="button apply-button" outlined @click="addEdit"
        >적용</sp-button
      >
    </div>
    <v-snackbar v-model="snackbar" top>
      {{ duplicateCheckMessage }}

      <template #action="{ attrs }">
        <sp-button v-bind="attrs" @click="snackbar = false">Close</sp-button>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import LabelWithText from '@/components/molcule/LabelWithText.vue'

const authorityMapUtil = createNamespacedHelpers('authority')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    LabelWithText,
  },
  props: {
    group: {
      type: Array,
      default: [],
      description: '중복체크할 그룹 배열',
    },
    groupIndex: {
      type: Number,
      default: null,
      description: '추가/수정할 항목의 그룹 인덱스',
    },
    isEditOrAdd: {
      type: String,
      default: '',
      description: '등록인지 수정인지 구분하는 구분자',
    },
    groupYn: {
      type: String,
      default: 'N',
      description: '해당 요청이 권한그룹인지, 그룹인지 확인하기위한 값',
    },
    userRoleIdx: {
      type: Number,
      default: null,
      description: '추가/수정할 항목의 데이터 인덱스',
    },
  },
  data: () => ({
    itemName: '',
    placeholder: '',
    isDuplicated: false,
    duplicateCheckMessage: '',
    snackbar: false,
    isCheckedDuplicate: false,
  }),
  computed: {
    ...authorityMapUtil.mapState(['duplicateFlag', 'addEditPopup']),
  },
  watch: {
    itemName() {
      this.isCheckedDuplicate = true
    },
    addEditPopup(val) {
      if (val) this.initItemName()
    },
  },
  mounted() {
    this.initItemName()
  },
  methods: {
    ...authorityMapUtil.mapActions(['getCheckDuplicate']),
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    initItemName() {
      if (this.isEditOrAdd === 'edit') {
        this.itemName = this.group[this.groupIndex].userRoleName
      }
    },
    async checkDuplicate() {
      if (this.itemName === '') {
        this.duplicateCheckMessage = '이름을 입력하십시오.'
      } else {
        await this.searchDuplicatedName()

        if (this.duplicateFlag) {
          this.duplicateCheckMessage = '이미 사용중인 이름입니다.'
          this.isDuplicated = true
          this.isCheckedDuplicate = true
        } else {
          this.duplicateCheckMessage = '사용 가능한 이름입니다.'
          this.isDuplicated = false
          this.isCheckedDuplicate = false
        }
      }
    },
    async searchDuplicatedName() {
      // api call
      await this.getCheckDuplicate({
        userRoleName: this.itemName,
        groupYn: this.groupYn,
      })
    },
    setItemName(input) {
      this.itemName = input
    },
    addEdit() {
      if (this.itemName === '') {
        this.openAlert({
          title: '이름 입력 후 중복 확인을 하십시오.',
          type: 'error',
        })
        return
      }
      if (this.isCheckedDuplicate) {
        this.openAlert({ title: '중복확인을 진행해주세요.', type: 'error' })
        return
      }

      if (!this.isDuplicated) {
        if (this.itemName === '') {
          this.openAlert({
            title: '권한 그룹 및 권한 명은 필수입니다.',
            type: 'error',
          })
        } else {
          this.$emit(
            'add-edit-item',
            this.itemName,
            this.groupIndex,
            this.groupYn,
            this.userRoleIdx,
          )
          this.initPopup()
        }
      } else {
        this.duplicateCheckMessage = '같은 이름이 존재합니다.'
        this.snackbar = true
      }
      //        this.itemName = ''
    },
    closePopup() {
      this.initPopup()
      this.$emit('close-modal')
    },
    initPopup() {
      this.isCheckedDuplicate = false
      this.isDuplicated = false
      this.itemName = ''
    },
  },
}
</script>

<style lang="scss">
.sp-authority-add-edit-item {
  padding: 15px;
  .add-edit-input-wrapper {
    .add-edit-input {
      .v-input__slot {
        padding-right: 0 !important;
      }
      .duplicate-check-button {
        color: white;
      }
    }
  }
  .add-edit-button-wrapper {
    margin-top: 45px;
    text-align: center;
    .button {
      width: 120px;
      border-radius: 5px;
      border-width: thin;
    }
    .cancel-button {
      color: $sp-primary;
      margin-right: 10px;
    }
    .apply-button {
      color: $sp-teriary;
    }
  }
}
</style>
