<template>
  <div class="sp-authority-menu">
    <sp-card headered label="권한 메뉴" outlined elevation="0">
      <template v-slot:header>
        <sp-button
          outlined
          elevation="0"
          class="sp-authority-menu__reset-button"
          @click="initMenu"
        >
          <v-icon>refresh</v-icon> 초기화
        </sp-button>
      </template>

      <!-- 전체 열기/닫기 버튼 부분 -->
      <div class="sp-authority-menu__function-buttons-wrapper">
        <div class="button-wrapper">
          <sp-button icon @click="expandAll"
            ><v-icon>expand_more</v-icon></sp-button
          >
          <sp-button icon @click="expandNone"
            ><v-icon>expand_less</v-icon></sp-button
          >
        </div>
        <div class="text-wrapper">
          <span class="role-text">edit</span>
          <span class="role-text">view</span>
          <span class="role-text">none</span>
        </div>
      </div>

      <!-- 전체 그룹 -->
      <div class="sp-authority-menu__expansion-group-wrapper">
        <v-expansion-panels accordion multiple flat v-model="panel">
          <v-expansion-panel v-for="(data, index) in authMenu" :key="index">
            <v-expansion-panel-header>
              <template v-slot:actions>
                <v-icon class="expand-icon" v-show="data.subMenuList"
                  >$expand</v-icon
                >
              </template>
              <span class="expand-header">{{ data.menuName }}</span>
              <v-radio-group
                v-model="data.role"
                row
                hide-details="auto"
                class="expand-radio-button"
                @change="$store.commit('authority/setIsChanged')"
              >
                <v-radio value="edit" @click.stop="setAllEdit(data)"></v-radio>
                <v-radio value="view" @click.stop="setAllView(data)"></v-radio>
                <v-radio value="none" @click.stop="setAllNone(data)"></v-radio>
              </v-radio-group>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ul class="expand-list">
                <li
                  v-for="(group, i) in data.subMenuList"
                  :key="i"
                  class="expand-list-item"
                >
                  <v-icon class="expand-list-item-icon">description</v-icon
                  ><span class="expand-list-item-text">{{
                    group.menuName
                  }}</span>
                  <v-radio-group
                    v-model="group.role"
                    row
                    hide-details="auto"
                    @change="
                      $store.commit('authority/setIsChanged'),
                        setGroupAuthority(data)
                    "
                  >
                    <v-radio value="edit"></v-radio>
                    <v-radio value="view"></v-radio>
                    <v-radio value="none"></v-radio>
                  </v-radio-group>
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
import { createNamespacedHelpers } from 'vuex'

const authorityMapUtil = createNamespacedHelpers('authority')

export default {
  data: () => ({
    panel: [],
  }),
  methods: {
    ...authorityMapUtil.mapMutations(['setIsChanged']),
    ...authorityMapUtil.mapActions(['refrashMenu']),
    expandAll() {
      this.panel = [...Array(this.authMenu.length).keys()].map((k, i) => i)
    },
    expandNone() {
      this.panel = []
    },

    // 2depth의 권한에 따른 1depth의 권한 변경 함수
    setGroupAuthority(data) {
      if (data.subMenuList.some(group => group.role.includes('edit'))) {
        data.role = 'edit'
      } else if (data.subMenuList.some(group => group.role.includes('view'))) {
        data.role = 'view'
      } else {
        data.role = 'none'
      }
    },
    setAllEdit(group) {
      if (group.subMenuList && group.subMenuList.length > 0) {
        group.subMenuList.forEach(item => {
          item.role = 'edit'
        })
      }
    },
    setAllView(group) {
      if (group.subMenuList && group.subMenuList.length > 0) {
        group.subMenuList.forEach(item => {
          item.role = 'view'
        })
      }
    },
    setAllNone(group) {
      if (group.subMenuList && group.subMenuList.length > 0) {
        group.subMenuList.forEach(item => {
          item.role = 'none'
        })
      }
    },
    initMenu() {
      this.refrashMenu()
    },
  },
  computed: {
    authMenu() {
      return this.$store.getters['authority/getAuthMenu']
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
$this: 'sp-authority-menu';
.sp-authority-menu {
  .sp-card {
    min-height: 700px;
    .card-header {
      padding-left: 20px;
      justify-content: space-between;
      .card-title {
        font-size: toRem(15);
      }
    }
  }
  .#{$this}__reset-button {
    border-width: thin;
    border-radius: 5px;
    height: 30px !important;
    font-size: toRem(14);
    font-weight: bold;
    color: $sp-teriary;
    .v-icon {
      font-size: 14px;
    }
  }
  .#{$this}__function-buttons-wrapper {
    display: flex;
    padding-bottom: 10px;
    .button-wrapper {
      .v-icon {
        color: $sp-sky-blue-500;
      }
      flex: 1 1 auto;
    }
    .text-wrapper {
      display: block;
      align-self: center;
      .role-text {
        margin-right: 19px;
        font-family: $sub-font;
        font-size: toRem(14);
        color: $sp-grey-800;
        opacity: 0.5;
      }
    }
  }
  .#{$this}__expansion-group-wrapper {
    .v-expansion-panel-header {
      padding: 0;
      min-height: 40px;
      background-color: $sp-grey-200;
      border-top: 1px solid $sp-box-border;
      border-bottom: 1px solid $sp-box-border;
      color: $sp-title;
      .v-icon__svg {
        fill: $sp-sky-blue-500;
      }
    }
    .v-expansion-panel-header--active {
      min-height: 40px;
    }
    .v-expansion-panel-content__wrap {
      padding: 0;
    }
    .expand-icon {
      margin-left: 8px;
      order: 0;
    }
    .expand-header {
      margin-left: 15px;
      order: 1;
      font-size: toRem(15);
      font-family: $sub-font;
    }
    .expand-radio-button {
      order: 2;
      .v-input--radio-group__input {
        justify-content: right !important;
      }
    }
    .v-input--selection-controls {
      margin: 0;
      padding: 0;
    }
    .expand-list {
      padding-left: 25px;
      .expand-list-item {
        display: flex;
        list-style: none;
        font-size: toRem(13);
        color: $sp-title;
        padding: 8px 0px 8px 20px;
        border-radius: 5px;
        .v-input--selection-controls {
          margin: 0;
          padding: 0;
        }
        .v-icon {
          color: $sp-title;
          font-size: 18px;
        }
        .expand-list-button {
          max-width: 26px !important;
          border-radius: 50%;
          max-height: 26px;
          order: 2;
          border: 1px solid $sp-border-color;
          margin-right: 10px;
          .v-icon {
            font-size: 16px;
            font-weight: 100;
            color: $sp-grey-400;
          }
          color: white;
        }
        .expand-list-item-text {
          flex: 1 1 auto;
          margin-left: 5px;
          align-self: center;
        }
      }
    }
  }
}
</style>
