<template>
  <div class="cluster-resource-menu" style="background: #344a63; color: white">
    <div class="cluster-resource-title-wrapper">
      <div class="cluster-resource-logo-wrapper">
        <sp-image
          class="sp-resource-menu__icon_resource-image"
          contain
          lazySrc="Strato_logo_white.png"
          src="Strato_logo_white.png"
        ></sp-image>
        <span class="cluster-resource-title">CoMP Portal</span>
      </div>
    </div>
    <!-- 전체 그룹 -->
    <div class="cluster-resource-menu__expansion-group-wrapper">
      <v-expansion-panels accordion multiple flat v-model="panel">
        <v-expansion-panel
          v-for="(tabName, index) in tabNames"
          :key="index"
          style="background: #344a63; color: white"
        >
          <!-- #3c6355 -->
          <v-expansion-panel-header>
            <template v-slot:actions>
              <v-icon class="expand-icon">$expand</v-icon>
            </template>
            <span class="expand-header">{{ tabName }}</span>
          </v-expansion-panel-header>

          <v-expansion-panel-content v-if="tabName === 'General'">
            <ul class="expand-list">
              <li
                v-for="(subtabs, i) in generalSubTabs"
                class="expand-list-item"
                :class="{ active: isActive === subtabs }"
                :key="i"
                @click="sendTabName(subtabs)"
              >
                <span class="expand-list-item-text">{{ subtabs }}</span>
              </li>
            </ul>
          </v-expansion-panel-content>

          <v-expansion-panel-content v-if="tabName === 'Cluster'">
            <ul class="expand-list">
              <li
                v-for="(subtabs, i) in clusterSubTabs"
                class="expand-list-item"
                :class="{ active: isActive === subtabs }"
                :key="i"
                @click="sendTabName(subtabs)"
              >
                <span class="expand-list-item-text">{{ subtabs }}</span>
              </li>
            </ul>
          </v-expansion-panel-content>

          <v-expansion-panel-content v-if="tabName === 'Workload'">
            <ul class="expand-list">
              <li
                v-for="(subtabs, i) in workloadSubTabs"
                class="expand-list-item"
                :class="{ active: isActive === subtabs }"
                :key="i"
                @click="sendTabName(subtabs)"
              >
                <span class="expand-list-item-text">{{ subtabs }}</span>
              </li>
            </ul>
          </v-expansion-panel-content>

          <v-expansion-panel-content v-if="tabName === 'Network'">
            <ul class="expand-list">
              <li
                v-for="(subtabs, i) in networkSubTabs"
                class="expand-list-item"
                :class="{ active: isActive === subtabs }"
                :key="i"
                @click="sendTabName(subtabs)"
              >
                <span class="expand-list-item-text">{{ subtabs }}</span>
              </li>
            </ul>
          </v-expansion-panel-content>

          <v-expansion-panel-content v-if="tabName === 'Config'">
            <ul class="expand-list">
              <li
                v-for="(subtabs, i) in configSubTabs"
                class="expand-list-item"
                :class="{ active: isActive === subtabs }"
                :key="i"
                @click="sendTabName(subtabs)"
              >
                <span class="expand-list-item-text">{{ subtabs }}</span>
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
      tabNames: ['General', 'Cluster', 'Workload', 'Network', 'Config'], // 탭 명칭들
      generalSubTabs: ['Overview', 'Catalog'],
      clusterSubTabs: [
        'Node',
        'Namespace',
        'Persistent Volume',
        'Storage Class',
      ],
      workloadSubTabs: [
        'Deployment',
        'Stateful Set',
        'Pod',
        'Cron Job',
        'Job',
        'Replica Set',
        'Daemon Set',
      ],
      networkSubTabs: ['Service', 'Ingress', 'Ingress Controller'],
      configSubTabs: ['Persistent Volume Claim', 'Config Map', 'Secret'],
      panel: [],
      isActive: 'Overview',
      menuInfo: [
        {
          tabName: '',
          subTabName: '',
          useYn: '',
          viewableYn: '',
          writableYn: '',
        },
      ],
    }
  },
  computed: {
    ...loginUserMapUtil.mapState(['userInfo']),
    ...loginUserMapUtil.mapState(['menuList']),
    ...loginUserMapUtil.mapState(['flatMenuList']),
  },
  created() {
    this.expandAll()
    // this.initMenu()
  },
  methods: {
    sendTabName(tabName) {
      console.log(tabName)
      // this.$emit('sendTabName', tabName)
      const resourceHash = `#${tabName}`
      this.$router.replace({
        path: `/cluster/detail/${this.$route.params.id}`,
        hash: resourceHash,
      })
      this.isActive = tabName
    },
    expandAll() {
      this.panel = [...Array(this.tabNames.length).keys()].map((k, i) => i)
    },
    initMenu() {
      // API 메뉴 데이터를 Resource 메뉴로 가공
      for (let i = 0; i < this.menuList.length; i += 1) {
        // General
        if (this.menuList[i].menuName === 'Service Group') {
          if (this.menuInfo.useYn.push(this.menuList[i].useYn) === 'Y') {
            if (
              this.menuInfo.viewableYn.push(this.menuList[i].viewableYn) ===
                'Y' ||
              this.menuInfo.writableYn.push(this.menuList[i].viewableYn) === 'Y'
            ) {
              this.menuInfo.tabName.push('General')
              this.menuInfo.subTabName.push('Overview')
              this.menuInfo.useYn.push(this.menuList[i].useYn)
              this.menuInfo.viewableYn.push(this.menuList[i].viewableYn)
              this.menuInfo.writableYn.push(this.menuList[i].writableYn)

              this.menuInfo.tabName.push('General')
              this.menuInfo.subTabName.push('Catalog')
              this.menuInfo.useYn.push(this.menuList[i].useYn)
              this.menuInfo.viewableYn.push(this.menuList[i].viewableYn)
              this.menuInfo.writableYn.push(this.menuList[i].writableYn)
            }
          }
        } else if (
          this.menuList[i].menuName === 'Workload' ||
          this.menuList[i].menuName === 'Network' ||
          this.menuList[i].menuName === 'Workload' ||
          this.menuList[i].menuName === 'Config'
        ) {
          for (let j = 0; j < this.menuList.subMenuList.length; j += 1) {
            this.menuInfo.tabName.push(this.menuList[i].menuName)
            this.menuInfo.subTabName.push(
              this.menuList[i].subMenuList[j].menuName,
            )
            this.menuInfo.useYn.push(this.menuList[i].subMenuList[j].useYn)
            this.menuInfo.viewableYn.push(
              this.menuList[i].subMenuList[j].viewableYn,
            )
            this.menuInfo.writableYn.push(
              this.menuList[i].subMenuList[j].writableYn,
            )
          }
        }
      }
      console.log(this.menuInfo)
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
  background-color: #125a90;
  color: #fff;
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

.bottom-footer {
  bottom: 20px;
  position: fixed;
  padding-left: 15px;
  color: white;
  opacity: 0.4;
  font-size: 0.7rem;
}

.cluster-resource-menu__expansion-group-wrapper .expand-list li.active {
  /* background-color: #2a453b;
   */
  background-color: #125a90;
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
  filter: brightness(0) invert(1);
}
.cluster-resource-title {
  color: white;
  font-size: 1.25rem;
  margin-left: 10px;
  font-weight: bold;
  white-space: nowrap;
}
</style>
