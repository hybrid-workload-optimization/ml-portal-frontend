<template>
  <div class="sp-authority-menu">
    <sp-card>
      <!-- 전체 그룹 -->
      <div class="sp-authority-menu__expansion-group-wrapper">
        <v-expansion-panels accordion multiple flat v-model="panel">
          <v-expansion-panel v-for="(tabName, index) in tabNames" :key="index">
            <v-expansion-panel-header>
              <template v-slot:actions>
                <v-icon class="expand-icon">$expand</v-icon>
              </template>
              <span class="expand-header">{{ tabName }}</span>
            </v-expansion-panel-header>

            <v-expansion-panel-content v-if="tabName === 'Cluster'">
              <ul class="expand-list">
                <li
                  v-for="(subtabs, i) in clusterSubTabs"
                  class="expand-list-item"
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
    </sp-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabNames: ['Cluster', 'Workload', 'Network', 'Config'], // 탭 명칭들
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
    }
  },
  created() {
    this.expandAll()
  },
  methods: {
    sendTabName(tabName) {
      console.log(tabName)
      this.$emit('sendTabName', tabName)
      // this.$router.replace(
      // `/cluster/detail/${this.$route.params.id}/${tabName}`,
      // )
    },
    expandAll() {
      this.panel = [...Array(this.tabNames.length).keys()].map((k, i) => i)
    },
  },
}
</script>
<style>
.expand-header {
  font-size: 23px;
}
.expand-list {
  list-style: none;
}
.expand-list > li:hover {
  background-color: #344a63;
  color: #fff;
  cursor: pointer;
}
.expand-list > li {
  padding-left: 5px;
  height: 30px;
}
.expand-list-item-text {
  font-size: 18px;
}
.v-expansion-panel-header__icon {
  display: inline !important;
  float: left !important;
}
.expand-icon {
  margin-left: 8px;
  order: 0;
}
</style>
