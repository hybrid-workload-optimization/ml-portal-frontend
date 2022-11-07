<template>
  <div class="sp-bar-layout">
    <sp-card class="demo-card">
      <search>
        <v-btn-toggle
          slot="btn-group"
          v-model="toggleIdx"
          rounded
          mandatory
          dense
          class="toggle-btn list-arrange-select mr-5"
        >
          <v-btn @click="toggleIdx = 0">
            <v-icon>format_list_bulleted</v-icon>
          </v-btn>
          <v-btn @click="toggleIdx = 1">
            <v-icon>web_asset</v-icon>
          </v-btn>
        </v-btn-toggle>
      </search>
    </sp-card>
    <div class="sp-box-layout">
      <sp-table
        v-if="getClusterLength && toggleIdx === 0"
        :headers="clusterHeader"
        :datas="getClusters"
        :options="{}"
        @click:row="movePage"
      />
      <project v-else-if="getClusterLength && toggleIdx === 1" />
      <empty
        v-else
        title="Cluster가 존재하지 않습니다."
        description="Cluster를 추가하려면 Add Cluster 버튼을 클릭하시기 바랍니다."
      />
    </div>
  </div>
</template>

<script>
import Search from '@/components/molcule/DataTableSearch.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import Project from '@/components/Project.vue'
import Empty from '@/components/Empty.vue'
import { createNamespacedHelpers } from 'vuex'

const sampleMapUtils = createNamespacedHelpers('sample')

export default {
  components: {
    Search,
    spTable,
    Project,
    Empty,
  },
  data() {
    return {
      toggleIdx: 0,
      clusterHeader: [
        { text: '구분', value: 'category' },
        { text: '클러스터명', value: 'name' },
        { text: '내용', value: 'description' },
      ],
    }
  },
  computed: {
    ...sampleMapUtils.mapGetters(['getClusters']),
    getClusterLength() {
      return this.getClusters ? this.getClusters.length : 0
    },
  },
  async created() {
    // await this.fetchClustList()
  },
  methods: {
    // ...sampleMapUtils.mapActions(['fetchClustList']),
    movePage(item) {
      this.$router.push(`/sample/detail/${item.id}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.sp-bar-layout {
  border: 1px solid blue;
  width: 100%;
  .demo-card {
    margin-bottom: 50px;
  }
}

.sp-box-layout {
  border: 1px solid blue;
  width: 100%;
}
</style>
