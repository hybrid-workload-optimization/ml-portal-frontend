<template>
  <div class="sp-code-mgmt-menu">
    <sp-card headered label="공통 코드 목록" outlined elevation="0">
      <!-- 검색 부붙  -->
      <div class="code-mgmt-menu__search-wrapper">
        <sp-input
          placeholder="검색할 키워드를 입력하세요"
          append-icon="mdi-magnify"
          single-line
          outlined
          @change="onChangeSearch"
          :value="search"
          dense
          hide-details
          class="code-mgmt-menu--search"
        />
      </div>

      <!-- 전체 그룹 -->
      <div class="code-mgmt-menu__expansion-group-wrapper">
        <div class="code-mgmt-menu__btn-wrapper">
          <sp-button
            min-width="26px"
            height="26px"
            elevation="0"
            class="code-mgmt-menu--button"
            @click="expandAll"
          >
            <v-icon>expand_more</v-icon>
          </sp-button>
          <sp-button
            min-width="26px"
            height="26px"
            elevation="0"
            class="code-mgmt-menu--button"
            @click="expandNone"
          >
            <v-icon>expand_less</v-icon>
          </sp-button>
        </div>
        <v-expansion-panels
          class="code-mgmt-menu__expansion-wrapper"
          focusable
          accordion
          multiple
          flat
          v-model="panel"
        >
          <v-expansion-panel v-for="(data, index) in codeGroups" :key="index">
            <v-expansion-panel-header>
              <template #actions>
                <div class="code-mgmt-menu__expansion-group-wrapper">
                  <v-icon class="expand-icon" v-show="data.codeList.length">
                    $expand
                  </v-icon>
                  <span class="code-mgmt-menu__expansion-title">
                    {{ data.groupName }}
                  </span>
                </div>
                <sp-button
                  min-width="26px"
                  height="26px"
                  elevation="0"
                  class="code-mgmt-menu__expansion--button-group"
                  :class="
                    data.groupCode === checkIsSelectedId ? 'isActive' : ''
                  "
                  @click.stop="onClickCodeGroup(data.groupCode)"
                >
                  정보보기
                </sp-button>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ul class="code-mgmt-menu__expand-list">
                <li
                  v-for="(g, i) in data.codeList"
                  :key="i"
                  class="code-mgmt-menu__expand-list-item"
                  @click="onClickCode(g.groupCode, g.commonCode)"
                >
                  <sp-button
                    min-width="26px"
                    height="26px"
                    elevation="0"
                    class="code-mgmt-menu__expand--button"
                    :class="
                      g.commonCode === checkIsSelectedId ? 'isActive' : ''
                    "
                  >
                    <v-icon class="code-mgmt-menu__expand-icon">
                      description
                    </v-icon>
                    <span class="code-mgmt-menu__expand-text">
                      {{ g.codeName }}
                    </span>
                  </sp-button>
                </li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </sp-card>
  </div>
</template>

<script>
import { codeMgmt } from '@/utils/mixins/codeMgmt'

export default {
  mixins: [codeMgmt],
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-code-mgmt-menu {
  $this: 'code-mgmt-menu';
  height: 100%;
  .sp-card {
    height: 100%;
    .card-header {
      justify-content: space-between;
      background-color: #f5f8fb66 !important;
      height: 47px;
      .card-title {
        @include set-text(
          normal,
          15,
          rgba($color: $sp-sky-blue-500, $alpha: 1)
        );
      }
    }
    .card-body {
      height: 100%;
    }
  }
  .#{$this}__btn-wrapper {
    padding-bottom: 12px;
    padding-left: 12px;
    .#{$this}--button {
      background: transparent;
      padding: 0 !important;
      .v-icon {
        @include set-text(
          normal,
          23,
          rgba($color: $sp-sky-blue-500, $alpha: 1)
        );
      }
    }
  }

  .#{$this}__search-wrapper {
    padding-top: 10px;
    padding-bottom: 20px;
    .#{$this}--search {
      @include set-text(
        normal,
        14,
        rgba($color: $sp-sky-blue-500, $alpha: 0.4)
      );

      .v-input__slot {
        min-height: 35px !important;
        fieldset {
          border: solid #4b556680 thin;
          border-radius: 5px;
        }
        .v-icon {
          @include set-text(normal, 19, rgba($color: #4b556680, $alpha: 0.4));
        }
      }
      .v-label {
        @include set-text(
          normal,
          14,
          rgba($color: $sp-sky-blue-500, $alpha: 0.4)
        );
      }
    }
  }
  .#{$this}__expansion-group-wrapper {
    height: 100%;
    .#{$this}__expansion-wrapper {
      max-height: calc(100% - 190px);
      // max-height: 200px;
      overflow: auto;
      .v-expansion-panel {
        border-radius: 0;
      }
      .v-expansion-panel-header {
        padding: 0 14px;
        height: 40px;
        min-height: 40px;
        // display: flex;
        // justify-content: space-between;
        background-color: $sp-grey-400;
        border-top: 1px solid $sp-box-border;
        border-bottom: 1px solid $sp-box-border;
        @include set-text(normal, 15, rgba($color: #ffffff, $alpha: 1));
        .#{$this}__expansion-group-wrapper {
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .v-expansion-panel-header__icon {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-left: 0;
          width: 100%;
          .v-icon__svg {
            fill: #ffffff;
            @include set-text(normal, 23, rgba($color: #ffffff, $alpha: 1));
          }
          .#{$this}__expansion-title {
            margin: 0 23px;
            @include one-line-ellipsis(100%);
          }

          .#{$this}__expansion--button-group {
            background-color: #687687;
            border-radius: 25px;

            @include set-text(normal, 13, rgba($color: #fff, $alpha: 1));
            &.isActive {
              background-color: rgba($color: $sp-title, $alpha: 1);
              .#{$this}__expand-text {
                color: #fff;
              }
              .v-icon {
                @include set-text(normal, 15, rgba($color: #fff, $alpha: 1));
              }
            }
          }
        }
      }
    }

    .v-expansion-panel-header--active {
      height: 40px;
      min-height: 40px;
    }

    .v-expansion-panel-content__wrap {
      padding: 0;
    }

    .#{$this}__expand-list {
      padding-left: 0px;
      .#{$this}__expand-list-item {
        display: flex;
        align-items: center;
        list-style: none;
        margin: 5px 0;
        cursor: pointer;
        border-radius: 5px;
        &:hover {
          background-color: rgba($color: $sp-title, $alpha: 0.1);
          width: 100%;
        }
        .#{$this}__expand--button {
          padding: 0;
          background-color: transparent;
          display: flex;
          width: 100%;
          align-items: center;
          padding-left: 55px;
          padding-bottom: 21px;
          &:first-child {
            padding-top: 21px;
          }
          &:last-child {
            padding-bottom: 21px;
          }
          @include set-text(normal, 13, rgba($color: $sp-title, $alpha: 1));
          .v-icon {
            @include set-text(normal, 15, rgba($color: $sp-title, $alpha: 1));
          }
          .#{$this}__expand-text {
            margin-left: 14px;

            @include set-text(normal, 13, rgba($color: $sp-title, $alpha: 1));
          }
          .v-btn__content {
            justify-content: flex-start;
          }
          &:hover {
            background-color: transparent;
            width: 100%;
          }

          &.isActive {
            background-color: rgba($color: $sp-title, $alpha: 1);
            width: 100%;
            .#{$this}__expand-text {
              color: #fff;
            }
            .v-icon {
              @include set-text(normal, 15, rgba($color: #fff, $alpha: 1));
            }
          }
        }
      }
    }
  }
}
</style>
