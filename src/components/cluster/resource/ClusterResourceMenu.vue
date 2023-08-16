<template>
  <div class="cluster-resource-menu" style="background: #fff">
    <div class="cluster-resource-title-wrapper">
      <div class="cluster-resource-logo-wrapper">
        <sp-image
          class="sp-resource-menu__icon_resource-image"
          contain
          lazySrc="Strato logo.png"
          src="Strato logo.png"
        ></sp-image>
        <span class="cluster-resource-title">
          <div class="cluster-resource-title1">
            <span>Cluster</span>
          </div>
          <div class="cluster-resource-title2">
            <span class="cluster-resource-title2-text">with CoMP Portal</span>
          </div>
        </span>
      </div>
    </div>
    <!-- 전체 그룹 -->
    <div class="cluster-resource-menu__expansion-group-wrapper">
      <v-expansion-panels accordion multiple flat v-model="panel">
        <v-expansion-panel
          v-for="{ menuName, menuIdx, subMenuList } in menuItems"
          :key="menuIdx"
          style="background: #fff; color: #3f4254"
        >
          <v-expansion-panel-header>
            <template v-slot:actions>
              <v-icon
                class="custom-expand-icon"
                v-if="menuName === 'Workload'"
              ></v-icon>
              <v-icon class="expand-icon" v-else>$expand</v-icon>
            </template>

            <span
              v-if="menuName === 'Workload'"
              @click="workloadDetail()"
              class="expand-header custom-header"
              >{{ menuName }}</span
            >
            <span v-else class="expand-header">{{ menuName }}</span>
          </v-expansion-panel-header>

          <v-expansion-panel-content v-if="menuName !== 'Workload'">
            <ul class="expand-list">
              <li
                v-for="{ menuName, menuIdx } in subMenuList"
                class="expand-list-item"
                :class="{
                  active:
                    selectedMenu ===
                    menuName.toLowerCase().replace(/\s+/g, '-'),
                }"
                :key="menuIdx"
                @click="sendTabName(menuName)"
              >
                <span class="expand-list-item-text">{{ menuName }}</span>
              </li>
            </ul>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div class="bottom-footer" v-if="!mini">
      <span class="footer-text">Powered by</span><br />
      <span class="footer-text">STRATO Cloud Management Platform</span>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'

const loginUserMapUtil = createNamespacedHelpers('loginUser')

export default {
  data() {
    return {
      menuItems: [],
      defaultMenu: {
        menuName: 'General',
        subMenuList: [
          {
            menuName: 'Overview',
          },
          {
            menuName: 'Catalog',
          },
        ],
      },
      panel: [],
      isActive: 'overview',
    }
  },
  computed: {
    ...loginUserMapUtil.mapState({
      userMenuList: 'menuList',
      favoriteList: 'favoriteList',
      userInfo: 'userInfo',
    }),
    selectedMenu() {
      return this.$route.path.split('/')[4]
    },
  },
  created() {
    const currentMenu = this.$route.path.split('/')[4]
    this.isActive = currentMenu
    this.initMenu()
    this.expandAll()
  },
  methods: {
    sendTabName(tabName) {
      console.log(tabName)
      // const resourceHash = `#${tabName}`
      // this.$router.replace({
      //   path: `/cluster/detail/${this.$route.params.id}`,
      //   hash: resourceHash,
      // })
      const convertTabName = tabName.toLowerCase().replace(/\s+/g, '-')
      this.$router.push({
        path: `/cluster/detail/${this.$route.params.id}/${convertTabName}`,
      })

      this.isActive = convertTabName
    },
    expandAll() {
      this.panel = [...Array(this.menuItems.length).keys()].map((k, i) => i)
    },
    initMenu() {
      const menuList = this.userMenuList.map(menu => {
        // menu.icon = this.setMenuIcon(menu.menuIdx)
        return menu
      })

      // 클러스터 관련 메뉴는 메인페이지에서 삭제 처리
      const menuNamesToRemove = ['Dashboard', 'Service Group', 'Setting']
      const newMenuList = menuList.filter(menu => {
        if (
          !menuNamesToRemove.includes(menu.menuName) &&
          menu.useYn === 'Y' &&
          (menu.viewableYn === 'Y' || menu.writableYn === 'Y')
        ) {
          if (menu.subMenuList && menu.subMenuList.length) {
            menu.subMenuList = menu.subMenuList.filter(
              subMenu =>
                subMenu.useYn === 'Y' &&
                (subMenu.viewableYn === 'Y' || subMenu.writableYn === 'Y'),
            )
            return menu
          }
          return menu
        }
        return false
      })

      // newMenuList.forEach(menu => {
      //   if (menu.menuName === 'Workload') {
      //     const workloadSubMenu = {
      //       menuName: 'Workload',
      //     }
      //     menu.subMenuList.unshift(workloadSubMenu)
      //   }
      // })
      // General > Overview, Catalog 메뉴 추가
      newMenuList.unshift(this.defaultMenu)

      console.log(newMenuList)

      this.menuItems = newMenuList
    },
    workloadDetail() {
      const clusterIdx = this.$route.params.id
      this.$router.push(`/cluster/detail/${clusterIdx}/workload`)
    },
  },
}
</script>
<style>
.cluster-resource-menu {
  box-shadow: none !important;
  width: 290px !important;
  /* padding-right: 25px !important; */
  float: left;
  position: fixed;
  left: 0px;
  top: 0px;
  height: 100% !important;
  overflow-y: scroll;
}
.expand-header {
  font-size: 20px;
}
.expand-list {
  list-style: none;
}
.expand-list > li:hover {
  /* background-color: #344a63; */
  /* background-color: #125a90; */
  color: #04c8c8;
  cursor: pointer;
}
.expand-list > li {
  padding-left: 5px;
  height: 30px;
}
.expand-list-item-text {
  font-size: 15px;
}
.v-expansion-panel-header__icon {
  display: inline !important;
  float: left !important;
}
.expand-icon {
  margin-left: 8px;
  order: 0;
}

.custom-expand-icon {
  display: none !important;
}
.bottom-footer {
  bottom: 20px;
  position: fixed;
  padding-left: 15px;
  color: #3f4254;
  opacity: 0.4;
  font-size: 0.7rem;
}

.cluster-resource-menu__expansion-group-wrapper .expand-list li.active {
  /* background-color: #2a453b;
   */
  /* background-color: #04c8c8; */
  color: #04c8c8;
  font-weight: bold;
}

.cluster-resource-menu::-webkit-scrollbar {
  display: none;
}

.cluster-resource-title-wrapper {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 20px;
  height: 66px;
  margin-bottom: 25px;
}
.cluster-resource-logo-wrapper {
  padding: 15px 0;
  display: flex;
  align-items: center;
  margin: 0;
  width: 30px;
  height: 66px;
}
.sp-resource-menu__icon_resource-image {
  /* filter: brightness(0) invert(1); */
}
.cluster-resource-title {
  /* color: white; */
  color: #3b244a;
  font-size: 1.25rem;
  margin-left: 10px;
  font-weight: bold;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cluster-resource-title1 {
  position: relative;
}
.cluster-resource-title2 {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-130%, 60%);
}
.cluster-resource-title2-text {
  font-size: 10px;
  font-weight: 500;
}
</style>
