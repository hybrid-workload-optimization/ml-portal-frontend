<template>
  <v-expand-transition duration="1500">
    <div class="sp-full-menu">
      <div class="sp-full-menu__close-button-wrapper">
        <sp-button @click="closeFullMenu" icon>
          <v-icon class="close-button">close</v-icon>
        </sp-button>
      </div>

      <div class="sp-full-menu__title-wrapper">
        <div class="sp-full-menu__logo-wrapper">
          <sp-image
            class="sp-full-menu__logo-image"
            lazySrc="Strato_logo_white.png"
            src="Strato_logo_white.png"
          ></sp-image>

          <span class="title-text">ML Workload Portal</span>
        </div>
      </div>

      <div class="sp-full-menu__menu-wrapper">
        <ul class="sp-full-menu__menu-items">
          <li
            class="sp-full-menu__parent-items"
            v-for="(item, index) in menuItems"
            :key="index"
          >
            <div class="parent-wrapper">
              <v-icon class="material-icons-outlined">{{ item.icon }}</v-icon>
              <div class="parent-title" @click="onClikMenu(item.menuUrl)">
                {{ item.menuName }}
              </div>
            </div>
            <ul class="sp-full-menu__child-items" v-if="item.subMenuList">
              <li
                class="sp-full-menu__children"
                v-for="(subItem, index) in item.subMenuList"
                :key="index"
              >
                <div class="child-wrapper">
                  <v-icon class="material-icons-outlined">navigate_next</v-icon>
                  <div class="child-title" @click="onClikMenu(subItem.menuUrl)">
                    {{ subItem.menuName }}
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="sp-full-menu__footer">
        <span class="footer-text"
          >Powered by STRATO Cloud Management Platform</span
        >
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
  },
  methods: {
    onClikMenu(path) {
      if (path) {
        this.$router.push(path).catch(() => {})
        this.closeFullMenu()
      }
    },
    closeFullMenu() {
      this.$emit('close', false)
    },
  },
}
</script>

<style lang="scss">
.sp-full-menu {
  width: 100vw;
  max-width: 100%;
  height: 100vh;
  max-height: 100%;
  z-index: 999;
  background-color: $sp-primary;
  $this: 'sp-full-menu';

  .#{$this}__close-button-wrapper {
    text-align: left;
    padding-left: 40px;
    padding-top: 20px;

    .close-button {
      color: $menu-text-color !important;
    }
  }
  .#{$this}__title-wrapper {
    display: flex;
    justify-content: center;
    .#{$this}__logo-wrapper {
      padding-top: 30px;
      text-align: center;
      display: inline-flex;
      .#{$this}__logo-image {
        width: 50px;
        margin: auto;
      }
      .title-text {
        display: inline-flex;
        margin-left: 10px;
        font-size: 1.8rem;
        font-weight: bold;
        color: white;
      }
    }
  }
  .#{$this}__menu-wrapper {
    justify-items: center;
    color: $menu-text-color;
    .#{$this}__menu-items {
      list-style: none;
      text-align: center;
      padding-top: 50px;
      .#{$this}__parent-items {
        display: inline-grid;
        margin: 10px;
        width: 10%;
        .parent-wrapper {
          cursor: pointer;
          display: flex;
          padding: 10px;
          margin-bottom: 10px;
          .parent-title {
            font-weight: 500;
          }
          i {
            margin-right: 10px;
            color: $menu-text-color;
          }
          &:hover {
            background-color: $sp-teriary;
            border-radius: 5px;
            color: white;
            i {
              color: white;
            }
          }
        }
        .#{$this}__child-items {
          text-align: left;
          list-style: none;
          padding-left: 10px;
          .#{$this}__children {
            .child-wrapper {
              cursor: pointer;
              display: flex;
              padding: 10px;
              i {
                font-size: 0.9rem;
                color: $menu-text-color;
              }
              &:hover {
                background-color: $sp-teriary;
                border-radius: 5px;
                color: white;
                i {
                  color: white;
                }
              }
            }
          }
        }
      }
    }
  }
  .#{$this}__footer {
    text-align: center;
    position: fixed;
    color: $menu-text-color;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 20px;
    .footer-text {
      opacity: 0.4;
      font-size: 0.8rem;
    }
  }
}
</style>
