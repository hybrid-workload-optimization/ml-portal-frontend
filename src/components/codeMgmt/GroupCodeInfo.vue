<template>
  <div class="sp-code-mgmt-group-info">
    <sp-card
      class="code-mgmt-group-info__wrapper"
      label="공통 코드 그룹 상세정보"
      headered
      outlined
      elevation="0"
    >
      <template v-slot:header>
        <div class="code-mgmt-group-info__button-wrapper">
          <sp-button
            outlined
            elevation="0"
            class="code-mgmt-group-info--button primary-btn"
            @click="onClickToAdd('CODE_GROUP')"
            v-show="!checkIsGroupCodeAdding && !checkIsGroupCodeUpdating"
          >
            <v-icon>add</v-icon>
            신규등록
          </sp-button>
          <sp-button
            outlined
            elevation="0"
            class="code-mgmt-group-info--button primary-btn"
            @click="onClickToUpdate('CODE_GROUP')"
            v-show="!checkIsGroupCodeAdding && !checkIsGroupCodeUpdating"
          >
            수정내용 저장
          </sp-button>
          <sp-button
            outlined
            elevation="0"
            class="code-mgmt-group-info--button info-btn"
            @click="onClickAdd('CODE_GROUP')"
            v-show="checkIsGroupCodeAdding"
          >
            등록
          </sp-button>
          <sp-button
            outlined
            elevation="0"
            class="code-mgmt-group-info--button primary-btn"
            @click="onClickUpdate('CODE_GROUP')"
            v-show="checkIsGroupCodeUpdating"
          >
            수정
          </sp-button>
          <sp-button
            outlined
            elevation="0"
            class="code-mgmt-group-info--button black-btn"
            @click="onClickCancel('CODE_GROUP')"
            v-show="checkIsGroupCodeAdding || checkIsGroupCodeUpdating"
          >
            취소
          </sp-button>
        </div>
      </template>
      <div class="code-mgmt-group-info__input-box">
        <label-with-text
          class="code-mgmt-group-info__label"
          :class="
            !checkIsGroupCodeAdding && !checkIsGroupCodeUpdating
              ? 'code-mgmt-group-info__label--required'
              : ''
          "
          name="* 공통 코드 그룹 ID"
          :value="checkIsGroupCodeAdding ? '' : codeGroupDetail.groupCode"
          background-color="#F5F5f5"
          :readonly="
            checkIsGroupCodeAdding || checkIsGroupCodeUpdating ? false : true
          "
          @input="onChangeCodeGroupId"
        />
      </div>
      <div class="code-mgmt-group-info__input-box">
        <label-with-text
          class="code-mgmt-group-info__label"
          :class="
            !checkIsGroupCodeAdding && !checkIsGroupCodeUpdating
              ? 'code-mgmt-group-info__label--required'
              : ''
          "
          name="* 공통 코드 그룹"
          :value="checkIsGroupCodeAdding ? '' : codeGroupDetail.groupName"
          background-color="#F5F5f5"
          :readonly="
            checkIsGroupCodeAdding || checkIsGroupCodeUpdating ? false : true
          "
          @input="onChangeCodeGroupName"
        />
      </div>
      <common-info
        :createdUserId="
          checkIsGroupCodeAdding ? '' : codeGroupDetail.createdUserId
        "
        :createdAt="checkIsGroupCodeAdding ? '' : codeGroupDetail.createdAt"
        :updateUserId="
          checkIsGroupCodeAdding ? '' : codeGroupDetail.updateUserId
        "
        :updatedAt="checkIsGroupCodeAdding ? '' : codeGroupDetail.updatedAt"
        :description="checkIsGroupCodeAdding ? '' : codeGroupDetail.description"
        :readonly="
          checkIsGroupCodeAdding || checkIsGroupCodeUpdating ? false : true
        "
        @input="onChangeCodeDesc"
      />
    </sp-card>
  </div>
</template>

<script>
import { codeMgmt } from '@/utils/mixins/codeMgmt'

import LabelWithText from '@/components/molcule/LabelWithText.vue'
import CommonInfo from './CommonInfo.vue'

export default {
  components: {
    LabelWithText,
    CommonInfo,
  },
  mixins: [codeMgmt],
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-code-mgmt-group-info {
  $this: 'code-mgmt-group-info';
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
}
</style>
