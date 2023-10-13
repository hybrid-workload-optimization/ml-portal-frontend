<template>
  <div
    class="sp-code-mgmt-code-info"
    v-show="!checkIsGroupCodeAdding && !checkIsGroupCodeUpdating"
  >
    <sp-card
      class="code-mgmt-code-info__wrapper"
      label="공통 코드 상세정보"
      outlined
      headered
      elevation="0"
    >
      <template #header>
        <div class="code-mgmt-code-info__button-wrapper">
          <sp-button
            outlined
            elevation="0"
            class="code-mgmt-code-info--button primary-btn"
            @click="onClickToAdd('CODE')"
            v-show="!checkIsCodeAdding && !checkIsCodeUpdating"
          >
            <v-icon>add</v-icon>
            신규등록
          </sp-button>
          <sp-button
            outlined
            elevation="0"
            small
            class="code-mgmt-code-info--button primary-btn"
            @click="onClickToUpdate('CODE')"
            v-show="
              checkIsCodeManaging && !checkIsCodeAdding && !checkIsCodeUpdating
            "
          >
            수정
          </sp-button>
          <sp-button
            outlined
            elevation="0"
            small
            class="code-mgmt-code-info--button black-btn"
            @click="onClickToDelete('CODE')"
            v-show="
              checkIsCodeManaging && !checkIsCodeAdding && !checkIsCodeUpdating
            "
          >
            삭제
          </sp-button>
          <sp-button
            outlined
            elevation="0"
            class="code-mgmt-code-info--button info-btn"
            @click="onClickAdd('CODE')"
            v-show="checkIsCodeAdding"
          >
            등록
          </sp-button>
          <sp-button
            outlined
            elevation="0"
            class="code-mgmt-code-info--button primary-btn"
            @click="onClickUpdate('CODE')"
            v-show="checkIsCodeUpdating"
          >
            수정
          </sp-button>
          <sp-button
            outlined
            elevation="0"
            class="code-mgmt-code-info--button black-btn"
            @click="onClickCancel('CODE')"
            v-show="checkIsCodeAdding || checkIsCodeUpdating"
          >
            취소
          </sp-button>
        </div>
      </template>
      <div class="code-mgmt-code-info__input-box">
        <label-with-text
          class="code-mgmt-code-info__label code-mgmt-code-info__label--required"
          name="공통 코드 ID"
          :value="
            checkIsCodeGroupsManaging || checkIsCodeAdding
              ? ''
              : codeGroupDetail.code.groupCode
          "
          background-color="#F5F5f5"
          readonly
          @input="onChangeCodeId"
        />
      </div>
      <div class="code-mgmt-code-info__input-box">
        <label-with-text
          class="code-mgmt-code-info__label"
          :class="
            !checkIsCodeAdding && !checkIsCodeUpdating
              ? 'code-mgmt-code-info__label--required'
              : ''
          "
          name="공통 코드"
          :value="
            checkIsCodeGroupsManaging || checkIsCodeAdding
              ? ''
              : codeGroupDetail.code.codeName
          "
          background-color="#F5F5f5"
          :readonly="checkIsCodeAdding || checkIsCodeUpdating ? false : true"
          @input="onChangeCodeName"
        />
      </div>
      <div class="code-mgmt-code-info__input-box">
        <label-with-text
          class="code-mgmt-code-info__label"
          :class="
            !checkIsCodeAdding && !checkIsCodeUpdating
              ? 'code-mgmt-code-info__label--required'
              : ''
          "
          name="공통 코드 영문명"
          :value="
            checkIsCodeGroupsManaging || checkIsCodeAdding
              ? ''
              : codeGroupDetail.code.codeName
          "
          background-color="#F5F5f5"
          :readonly="checkIsCodeAdding || checkIsCodeUpdating ? false : true"
          @input="onChangeCodeNameEn"
        />
      </div>
      <div class="code-mgmt-code-info__input-box">
        <label-with-text
          class="code-mgmt-code-info__label"
          :class="
            !checkIsCodeAdding && !checkIsCodeUpdating
              ? 'code-mgmt-code-info__label--required'
              : ''
          "
          name="공통 코드 순서"
          :value="
            checkIsCodeGroupsManaging || checkIsCodeAdding
              ? ''
              : codeGroupDetail.code.codeOrder
          "
          background-color="#F5F5f5"
          :readonly="checkIsCodeAdding || checkIsCodeUpdating ? false : true"
          @input="onChangeCodeOrder"
        />
      </div>
      <common-info
        :createdUserId="
          checkIsCodeGroupsManaging || checkIsCodeAdding
            ? ''
            : codeGroupDetail.code.createdUserId
        "
        :createdAt="
          checkIsCodeGroupsManaging || checkIsCodeAdding
            ? ''
            : codeGroupDetail.code.createdAt
        "
        :updateUserId="
          checkIsCodeGroupsManaging || checkIsCodeAdding
            ? ''
            : codeGroupDetail.code.updateUserId
        "
        :updatedAt="
          checkIsCodeGroupsManaging || checkIsCodeAdding
            ? ''
            : codeGroupDetail.code.updatedAt
        "
        :description="
          checkIsCodeGroupsManaging || checkIsCodeAdding
            ? ''
            : codeGroupDetail.code.description
        "
        :readonly="checkIsCodeAdding || checkIsCodeUpdating ? false : true"
        @input="onChangeCodeDesc"
      />
    </sp-card>
    <confirm @confirm-modal="onClickDelete" timeout="3000" />
    <!-- <modal
      class="code-mgmt-code-info__modal-wrapper"
      title-name="코드 삭제"
      modal-width="400"
      :dialog="isOpen"
      @close-modal="onClickCloseModal"
    >
      <template #content>
        <div class="code-mgmt-code-info__modal-text-wrapper">
          선택한 공통 코드를 삭제하시겠습니까?
        </div>
      </template>
      <template #footer>
        <div class="code-mgmt-code-info__modal-button-wrapper">
          <sp-button
            class="code-mgmt-code-info__modal--button cancel"
            elevation="0"
            dense
            @click="onClickCloseModal"
          >
            취소
          </sp-button>
          <sp-button
            class="code-mgmt-code-info__modal--button delete"
            elevation="0"
            dense
            @click="onClickDelete"
          >
            삭제
          </sp-button>
        </div>
      </template>
    </modal> -->
  </div>
</template>

<script>
import { codeMgmt } from '@/utils/mixins/codeMgmt'

import LabelWithText from '@/components/molcule/LabelWithText.vue'
import Confirm from '@/components/molcule/Confirm.vue'
import CommonInfo from './CommonInfo.vue'

export default {
  components: {
    LabelWithText,
    CommonInfo,
    Confirm,
  },
  mixins: [codeMgmt],
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-code-mgmt-code-info {
  $this: 'code-mgmt-code-info';
  height: 100%;

  .#{$this}__wrapper {
    height: 100%;
    .card-header {
      justify-content: space-between;
      background-color: #f5f8fb66 !important;
      height: 47px;
      .#{$this}__button-wrapper {
        display: flex;
        align-items: center;

        .#{$this}--button {
          padding: 5px 20px;
          height: 33px;
          width: 114px;
          border-radius: 5px;
          margin-left: 10px;
          @include set-text(
            bold,
            13,
            rgba($color: $sp-sky-blue-500, $alpha: 1)
          );
          .v-btn__content {
            padding: 0 !important;
          }
          .v-icon {
            font-size: 18px;
            margin-right: 3px;
          }

          &.primary-btn {
            border: 1px solid rgba($color: $sp-teriary, $alpha: 1);
            @include set-text(bold, 13, rgba($color: $sp-teriary, $alpha: 1));
          }
          &.info-btn {
            border: 1px solid rgba($color: $sp-success, $alpha: 1);
            @include set-text(bold, 13, rgba($color: $sp-success, $alpha: 1));
          }
          &.danger-btn {
            border: 1px solid rgba($color: $sp-danger, $alpha: 1);
            @include set-text(bold, 13, rgba($color: $sp-danger, $alpha: 1));
          }
          &.black-btn {
            border: 1px solid rgba($color: $sp-sky-blue-500, $alpha: 1);
            @include set-text(
              bold,
              13,
              rgba($color: $sp-sky-blue-500, $alpha: 1)
            );
          }
        }
      }
      .card-title {
        @include set-text(
          normal,
          15,
          rgba($color: $sp-sky-blue-500, $alpha: 1)
        );
      }
    }
    .#{$this}__label {
      margin-bottom: 19px;
      &.#{$this}__label--required {
        .v-input__slot {
          fieldset {
            background-color: rgba(
              $color: rgb(245 245 245),
              $alpha: 1
            ) !important;
          }
        }
      }
    }
    .#{$this}__flex-wrapper {
      display: flex;
      align-items: center;
      .w-50 {
        width: 50%;
      }
    }
  }

  .#{$this}__modal-wrapper {
    .#{$this}__modal-text-wrapper {
      margin-bottom: 20px;
      @include set-text(normal, 14, rgba($color: $sp-sky-blue-500, $alpha: 1));
    }
  }
}
// @include popup-buttons('code-mgmt-code-info', 'delete');
</style>
