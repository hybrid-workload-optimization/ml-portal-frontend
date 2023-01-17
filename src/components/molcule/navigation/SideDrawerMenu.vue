<template>
  <div class="sp-side-drawer-menu">
    <v-navigation-drawer
      class="sp-admin-drawer-menu"
      ref="adminDrawer"
      :class="{ 'one-depth': subMenuItems && subMenuItems.length < 1 }"
      :value="drawer"
      :mini-variant.sync="mini"
      @input="updateDrawer"
      @update:mini-variant="emitMini"
      app
      permanent
    >
      <div
        class="body-wrapper"
        @mouseenter="toggleShrinkButton(true)"
        @mouseleave="toggleShrinkButton(false)"
      >
        <!-- LNB 왼쪽 부분 start, 1depth인 경우 폭 15% -->
        <v-fade-transition>
          <div class="shrink-button-wrapper" v-if="hoverMenu">
            <sp-button
              class="shrink-button"
              icon
              v-if="mini"
              @click="shrinkMenu(false)"
              ><v-icon>navigate_next</v-icon></sp-button
            >
            <sp-button
              class="shrink-button"
              icon
              v-if="!mini"
              @click="shrinkMenu(true)"
              ><v-icon>chevron_left</v-icon></sp-button
            >
          </div>
        </v-fade-transition>
        <div
          class="left-wrapper"
          :class="{ 'one-depth': subMenuItems && subMenuItems.length < 1 }"
        >
          <div class="title-wrapper">
            <div class="logo-wrapper">
              <sp-image
                class="logo-image"
                contain
                lazySrc="Strato_logo_white.png"
                src="Strato_logo_white.png"
              />
              <span class="title-text" v-if="!mini">PaaS Portal</span>
            </div>
          </div>
          <div class="burger-wrapper" @click="openFullMenu">
            <sp-button icon class="burger-button"
              ><v-icon class="burger-icon">density_medium</v-icon></sp-button
            >
            <span class="burger-title" v-if="!mini">Mega Menu</span>
          </div>

          <!-- 메뉴 시작 -->
          <div
            ref="image-wrapper"
            class="image-wrapper"
            v-for="({ icon, menuName, menuIdx, menuUrl }, index) in menuItems"
            :key="menuIdx"
            :class="[
              index === 0 && 'first-box',
              {
                isActive: isCurrentPathName(menuName),
              },
            ]"
            @click="onClickMenu(menuIdx, menuUrl)"
          >
            <v-tooltip right v-if="mini">
              <template v-slot:activator="{ on, attrs }">
                <div class="icon-wrapper" v-on="on">
                  <v-icon
                    v-bind="attrs"
                    class="bottom-image material-icons-outlined"
                    >{{ icon }}</v-icon
                  >
                </div>
              </template>
              <span>{{ menuName }}</span>
            </v-tooltip>

            <v-icon class="bottom-image material-icons-outlined" v-if="!mini">{{
              icon
            }}</v-icon>
            <div class="bottom-title" v-if="!mini">{{ menuName }}</div>
          </div>

          <div class="bottom-footer" v-if="!mini">
            <span class="footer-text">Powered by</span><br />
            <span class="footer-text">STRATO Cloud Management Platform</span>
          </div>
        </div>
        <!-- LNB 왼쪽 부분 End -->

        <!-- LNB 오른쪽 부분 Start, 선택된 항목의 subMenuItems 가 있을 경우에만 나타남 -->
        <div
          class="right-wrapper"
          ref="right-wrapper"
          v-show="subMenuItems && subMenuItems.length > 0"
        >
          <!-- v-for="({ name, categories, path }, index) in subMenuList" -->
          <div
            v-for="({ menuName, menuUrl }, index) in subMenuItems"
            :key="index"
          >
            <div
              class="right-title-wrapper"
              :class="menuUrl && 'hasPath'"
              @click="onClickSubMenu(menuUrl)"
            >
              <router-link :to="menuUrl" v-if="menuUrl" class="link-wrapper">
                <v-icon color="white">arrow_right</v-icon>
                <div class="name">{{ menuName }}</div>
              </router-link>
              <template v-else>
                <v-icon color="white">arrow_right</v-icon>
                <div class="name">{{ menuName }}</div>
              </template>
            </div>

            <!-- <div class="right-body-wrapper">
              <div
                class="name-wrapper"
                v-for="{ id, name, path: src } in categories"
                :key="id"
              >
                <router-link :to="src" v-if="src" class="link-wrapper">
                  - {{ name }}
                </router-link>
                <template v-else> - {{ name }}</template>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import _ from 'lodash'

const tag = '[SideDrawerMenu]'

export default {
  props: {
    drawer: {
      type: Boolean,
      default: false,
      description: 'drawer on/off',
    },
    selectedName: {
      type: String,
      default: undefined,
      description: '선택된 컨텐츠',
    },
    menuItems: {
      type: Array,
      default: () => [],
      description: '메뉴 아이템들',
    },
  },
  computed: {},
  data: () => ({
    title: 'Cloud Management Platform',
    subMenuItems: [],
    isActive: true,
    selected: '',
    subSelected: '',
    mini: false,
    fullMenu: false,
    hoverMenu: false,
  }),
  methods: {
    isCurrentPathName(menuName) {
      return !this.$route.name.toLowerCase().indexOf(menuName.toLowerCase())
    },
    updateGroup() {
      console.log(tag, 'updateGroup')
      this.$emit('on-group')
    },
    toggleShrinkButton(isHover) {
      this.hoverMenu = isHover
    },
    onFilterList(selectedName = '100000') {
      console.log(tag, 'onFilterList')

      const items = this.menuItems
      if (selectedName) {
        const { subMenuList } = _.find(items, ['menuIdx', selectedName])
        this.subMenuItems = subMenuList || []
      } else {
        this.subMenuItems = []
      }
    },
    updateDrawer(drawer) {
      console.log(tag, 'updateDrawer')
      if (drawer) {
        this.subMenuItems = []
        this.selected = this.selectedName
        this.setLocationRigthBox()
        this.onFilterList(this.selectedName)
      }
      // this.$emit("on-drawer", { drawer, selectedName: this.selectedName });
    },
    setLocationRigthBox() {
      if (
        this.$refs &&
        this.$refs['right-wrapper'] &&
        this.$refs['image-wrapper']
      ) {
        this.$refs['right-wrapper'].style.paddingTop = `${
          Array.from(this.$refs['image-wrapper'])[0].clientHeight + 148
        }px`
      }
    },
    onClickMenu(selectedName, path) {
      this.subMenuItems = []
      this.selected = selectedName
      console.log('선택된 이름 ', selectedName)
      this.onFilterList(selectedName)
      if (
        selectedName === 100000 ||
        selectedName === 101000 ||
        selectedName === 102000 ||
        selectedName === 107000 ||
        selectedName === 108000
      ) {
        this.$router.push(path).catch(() => {})
      }
    },
    onClickSubMenu(path) {
      this.$router.push(path).catch(() => {})
      this.subMenuItems = []
    },
    shrinkMenu(miniValue) {
      this.mini = miniValue
      this.subMenuItems = []
      this.selected = ''
      this.emitMini()
    },
    emitMini() {
      console.log('Set', this.mini)
      this.subMenuItems = []
      this.$emit('mini-change', this.mini)
    },
    openFullMenu() {
      // 풀메뉴 뜨도록 Flag 설정
      this.$emit('open', true)
    },
  },
  watch: {
    group() {
      console.log(tag, 'group')
      // this.$emit("on-drawer", false);
    },
    $route() {
      // console.log('[to]', to, '[from]', from)
      this.selected = ''
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-admin-drawer-menu {
  background-color: transparent !important;
  box-shadow: none !important;
  height: 100% !important;
  padding-right: 25px !important;
  width: 600px !important;
  // width: 30% !important;
  &.one-depth {
    width: 310px !important;
    .body-wrapper {
      .shrink-button-wrapper {
        right: 11px;
      }
    }
  }
  @include desktop-small {
    &.one-depth {
      width: 310px !important;
    }
  }
  .top-wrapper {
    background-color: $title-color;
    width: 23%;
    border-radius: 10px;
    min-height: 60px;
    display: flex;
    align-items: center;
    cursor: pointer;

    .top-image {
      margin: 0 10px;
    }
    .top-title {
      font-size: 0.8rem;
      color: #fff;
      word-spacing: 1px;
    }
  }
  .body-wrapper {
    height: 100vh;
    display: flex;
    .shrink-button-wrapper {
      position: fixed;
      right: 35px;
      top: 80px;
      align-items: center;
      background-color: white;
      border: 0.5px solid $input-border;
      border-radius: 50%;
      transition: 0.5s;
      .shrink-button {
        height: 25px !important;
        width: 25px;
      }
      &:hover {
        background-color: $sp-teriary;
        border-color: $sp-teriary;
        i {
          color: white;
        }
      }
      i {
        color: $sp-primary;
        font-size: 15px;
      }
    }
    .button-wrapper {
      text-align: right;
    }
    .left-wrapper {
      //width: 50%;
      width: 300px !important;
      padding: 20px 0;
      background-color: $sp-primary;
      // &.one-depth {
      //   width: 100% !important;
      // }
      .burger-wrapper {
        padding-left: 12px;
        margin-bottom: 40px;
        .burger-icon,
        .burger-title {
          color: white;
          opacity: 0.8;
          cursor: pointer;
        }
        .burger-button {
          &:hover {
            background-color: $sp-secondary;
          }
        }
        .burger-title {
          font-size: 0.85rem;
          margin-left: 5px;
        }
      }
      .title-wrapper {
        padding-left: 15px;
        padding-right: 15px;
        height: 66px;
        .logo-wrapper {
          padding: 15px 0;
          display: flex;
          align-items: center;
          margin: 0;
          width: 30px;
          height: 66px;

          .logo-image {
            filter: brightness(0) invert(1);
          }
        }
        .title-text {
          color: white;
          font-size: 1.25rem;
          margin-left: 10px;
          font-weight: bold;
          white-space: nowrap;
        }
        margin-bottom: 40px;
      }
      .image-wrapper {
        padding: 15px 0;
        opacity: 0.7;
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover {
          background-color: $sp-secondary;
          opacity: 1;
          .bottom-title {
            opacity: 1;
          }
        }
        &.isActive {
          background-color: $sp-secondary;
          opacity: 1;
          .bottom-title {
            opacity: 1;
          }
        }
        &.first-box {
          padding-top: 15px;
        }
        .bottom-image {
          margin: 0 20px;
          color: white;
        }
        .bottom-title {
          font-size: 1rem;
          color: #fff;
          opacity: 0.7;
          font-weight: 500;
        }
      }
      .bottom-footer {
        bottom: 20px;
        position: fixed;
        padding-left: 15px;
        color: white;
        opacity: 0.4;
        font-size: 0.7rem;
      }
    }
    .right-wrapper {
      background-color: $sp-quaternary;
      //width: 50%;
      width: 275px;
      padding: 15px 0px;
      padding-top: 201px !important;
      .right-title-wrapper {
        display: flex;
        align-items: center;
        padding: 15px 0;
        font-size: 1rem;
        color: #fff;
        opacity: 0.7;
        &:hover {
          cursor: pointer;
          background-color: $sp-secondary;
          opacity: 1;
        }
        &.isActive {
          background-color: $sp-secondary;
          opacity: 1;
          .bottom-title {
            opacity: 1;
          }
        }
        .link-wrapper {
          text-decoration: none;
          color: #fff;
          display: flex;
          align-items: center;
        }
        i {
          margin-left: 15px;
        }
        .name {
        }
      }
      .right-body-wrapper {
        .name-wrapper {
          color: #fff;
          font-size: 0.9rem;
          font-weight: bold;
          padding: 6px 0;
          text-indent: 30px;
          &:hover {
            cursor: pointer;
            background-color: $secondary;
            border-radius: 8px;
            opacity: 1;
          }
          .link-wrapper {
            color: inherit;
            text-decoration: none;
          }
        }
      }
    }
  }
}
.sp-admin-drawer-menu {
  &.v-navigation-drawer--mini-variant {
    width: 100px !important;
    .body-wrapper {
      .left-wrapper {
        .logo-wrapper {
          width: 30px;
          margin: auto;
          margin-bottom: 60px;
          height: 66px;
        }
      }
    }
    .burger-wrapper {
      padding: 0 !important;
      text-align: center;
    }
    .image-wrapper {
      justify-content: center;
      .bottom-image {
      }
    }
  }
  .v-navigation-drawer__border {
    background-color: transparent !important;
  }
}
</style>
