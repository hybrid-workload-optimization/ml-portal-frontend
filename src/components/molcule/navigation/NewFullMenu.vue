<template>
  <v-expand-transition duration="1500">
    <div class="sp-full-menu">
      <div class="sp-full-menu__menu-wrapper">
        <div
          class="sp-full-menu__menu"
          v-if="isOpen"
          v-click-outside="onClickOutside"
        >
          <div class="close-button-wrapper">
            <v-icon class="close-button__icon" @click="closeFullMenu"
              >close</v-icon
            >
          </div>
          <ul class="sp-full-menu__menu-items">
            <li class="sp-full-menu__parent-items">
              <div
                class="parent-wrapper service-item"
                v-for="(menuItem, index) in menuItems"
                :key="index"
                @click="onClikMenu(menuItem)"
                @keydown.f1="onClikMenu(menuItem)"
              >
                {{ menuItem.menuName }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </v-expand-transition>
</template>

<script>
export default {
  props: {
    menuItems: {
      type: Array,
      default: () => [],
      description: '불러올 메뉴 목록 배열',
    },
    isOpen: {
      type: Boolean,
      default: false,
      description: '',
    },
    showFullMenu: {
      type: Boolean,
      default: false,
      description: '',
    },
  },
  methods: {
    closeFullMenu() {
      this.$emit('close', false)
    },
    onClikMenu(menuItem) {
      if (menuItem.menuUrl) {
        window.location.href = menuItem.menuUrl
        this.closeFullMenu()
      }
    },
    onClickOutside() {
      if (this.isOpen) {
        this.closeFullMenu()
      }
    },
  },
}
</script>

<style lang="scss">
.sp-full-menu {
  position: fixed;
  top: 0;
  left: 0;
  padding-left: 102px;
  width: 100%;
  height: 100%;
  z-index: 1005;
  overflow: hidden;
  $this: 'sp-full-menu';

  ul {
    padding-left: 0;
  }

  .#{$this}__menu-wrapper {
    margin-top: 68px;
    background-color: $sp-mega-menu;
    width: 420px;
    height: 100%;
    color: $menu-text-color;
    box-shadow: 3px 0px 6px #00000029;

    .#{$this}__menu {
      width: 100%;
      height: 100%;
      padding: 29px 30px;
    }

    .#{$this}__menu-items {
      list-style: none;
      .#{$this}__parent-items {
        display: inline-grid;
        width: 274px;
        &:not(:first-child) {
          margin-left: 40px;
          width: 241.5px;
        }
        .parent-wrapper {
          cursor: pointer;
          display: flex;
          align-items: center;
          margin-bottom: 16.82px;
          height: 24px;
          .parent-title {
            font-size: 16px;
            font-weight: normal;
          }
          i {
            margin-right: 10px;
            color: $menu-text-color;
          }
          &:hover {
            border-radius: 5px;
            color: $sp-mega-menu-hover;
            i {
              color: $sp-mega-menu-hover;
            }
          }

          &.service-item {
            margin-left: 20px;
            margin-bottom: 25px;
            font-size: 17px;
            font-weight: normal;
            color: #fff;
          }
        }
        .#{$this}__divider {
          width: 164px;
          height: 0px;
          margin-left: 19px;
          border: 1px dashed $scroll-border-color;
        }

        .#{$this}__child-items {
          text-align: left;
          list-style: none;
          padding-left: 10px;
          .#{$this}__children {
            &:first-child {
              padding-top: 13.18px;
            }
            .child-wrapper {
              cursor: pointer;
              display: flex;
              padding: 0 0 8px 19.5px;
              line-height: 20px;
              font-size: 14px;
              color: #fff;
              i {
                color: $menu-text-color;
              }
              &:hover {
                border-radius: 5px;
                color: $sp-mega-menu-hover;
                i {
                  color: $sp-mega-menu-hover;
                }
              }
            }
            &.sub-item {
              padding-top: 0;
              padding-left: 20px;
            }
          }
        }
      }
    }
  }
  .#{$this}__footer-wrapper {
    position: relative;
    color: white;
    bottom: 68px;
    height: 68px;
    background-color: $sp-mega-menu-footer;
    display: flex;
    align-items: center;
    column-gap: 30px;

    .#{$this}__footer-items {
      display: inline-flex;
      font-size: 17px;
      font-weight: normal;

      &.portal {
        width: 254.4px;
        margin-left: 29px;
        margin-right: 33px;

        &::after {
          color: white;
          margin-left: 113px;
          content: '|';
        }
      }
      .item__title {
        width: 130px;
        text-align: center;
      }

      .cloud-image {
        width: 30px;
        height: 30px;
        margin-right: 7px;
      }
    }
  }

  .close-button-wrapper {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .close-button {
      opacity: 1 !important;
    }
    .close-button__icon {
      color: white !important;
      width: 28px;
      height: 28px;
      font-size: 28px;
      text-align: center;
    }
  }
}
</style>
