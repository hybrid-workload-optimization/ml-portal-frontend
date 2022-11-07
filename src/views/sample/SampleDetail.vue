<template>
  <sp-card class="demo-card">
    <v-tabs v-model="tab" color="#000">
      <v-tabs-slider color="#000"></v-tabs-slider>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(item, index) in items" :key="index">
        <div class="px-5 py-5" v-if="item === 'general'">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="saveProjectInfo"
          >
            <v-row class="align-center no-gutters">
              <v-col cols="1">
                <label class="label-name">Project name</label>
              </v-col>
              <v-col cols="11">
                <sp-input
                  name="Project name"
                  placeholder="Project name을 입력하세요."
                  background-color="#F5F5f5"
                  v-model="project.name"
                  :rules="nameRules"
                />
              </v-col>
              <v-col cols="1">
                <label class="label-name">Description</label>
              </v-col>
              <v-col cols="11">
                <sp-input
                  name="Description"
                  placeholder="Description을 입력하세요."
                  background-color="#F5F5f5"
                  v-model="project.description"
                />
              </v-col>
              <!-- align center -->
            </v-row>
            <!-- label-with-text는 값을 받을 수 없는지 물어보기 -->
            <div class="d-flex flex-row-reverse mt-5">
              <sp-button
                type="submit"
                color="blue"
                @click="saveProjectInfo"
                :disabled="!valid"
              >
                Save
              </sp-button>
              <sp-button color="grey lighten-4" @click="onCancel" class="mr-2">
                Cancel
              </sp-button>
            </div>
          </v-form>
        </div>
        <div v-if="item === 'cluster'">div -> cluster component</div>
        <div v-if="item === 'members'">div -> members component</div>
      </v-tab-item>
    </v-tabs-items>
  </sp-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const sampleMapUtil = createNamespacedHelpers('sample')

export default {
  components: {},
  data() {
    return {
      tab: 'general',
      items: ['general', 'cluster', 'members'],
      valid: false,
      nameRules: [
        value => !!value || 'Name is required',
        value =>
          (value && value.length <= 2) || 'Name must be less than 2 characters',
      ],
      project: {},
    }
  },
  computed: {
    ...sampleMapUtil.mapGetters(['projectInfo']),
  },
  async created() {
    // TODO show loading bar
    const params = { resourceType: 'pod' }
    await this.getProjectInfo({ params })
    // TODO remove loading bar
  },
  methods: {
    ...sampleMapUtil.mapActions(['getProjectInfo', 'updateProjectInfo']),
    async saveProjectInfo() {
      await this.updateProjectInfo(this.project)
      this.$router.push('/sample/list')
    },
    onCancel() {
      this.$refs.form.reset()
    },
  },
}
</script>

<style lang="scss" scoped>
.demo-card {
  margin-bottom: 50px;
}
</style>
