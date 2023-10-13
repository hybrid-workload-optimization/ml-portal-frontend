<template>
  <div class="new-vSphere-cluster-wrapper">
    <v-form ref="clusterInfoForm">
      <line-button-title title="Cluster Info">
        <template #content>
          <label-with-select
            name="Template"
            :className="labelWithSelectClass"
            :items="templateList"
            item-text="templateName"
            item-value="templateName"
            v-model="saveData.templateName"
            @input="onChangeTemplate"
            :rules="regEx.required"
            required
          ></label-with-select>
          <label-with-text
            name="Control Plane IP"
            :className="labelWithTextClass"
            v-model="saveData.controlPlaneIp"
            placeholder="Enter Control Plane IP."
            :rules="regEx.requiredIP"
            required
          ></label-with-text>
          <!-- <label-with-group name="Ip Pool" :className="labelWithGroupClass">
            <template #append-content>
              <label-with-text
                name="Start"
                :className="labelWithInnerTextClass"
                v-model="saveData.ipPool.start"
                placeholder="Enter Start IP."
                :rules="regEx.requiredIP"
                required
                style="float: left; width: 48.5%; margin-right: 30px"
              ></label-with-text>
              <label-with-text
                name="End"
                :className="labelWithInnerTextClass"
                v-model="saveData.ipPool.end"
                placeholder="Enter End IP."
                :rules="regEx.requiredIP"
                required
              ></label-with-text>
            </template>
          </label-with-group> -->
        </template>
      </line-button-title>
      <line-button-title title="Node Info" style="padding-top: 5px !important">
        <template #content>
          <template>
            <v-radio-group
              v-model="isBasic"
              row
              hide-details="auto"
              class="expand-radio-button"
            >
              <v-radio label="Basic" :value="true"></v-radio>
              <v-radio label="Advanced" :value="false"></v-radio>
            </v-radio-group>
          </template>

          <template v-if="isBasic">
            <div class="nodeInfoWorkerClass">
              <label-with-text
                name="CPU(Core)"
                type="number"
                :className="labelWithInnerTextClass"
                v-model="saveData.workerSpec.cpu"
                placeholder="Enter CPU core."
                :rules="regEx.requiredCpuCore"
                required
              ></label-with-text>
              <label-with-text
                name="Memory(MB)"
                type="number"
                :className="labelWithInnerTextClass"
                v-model="saveData.workerSpec.memory"
                placeholder="Enter Memory."
                :rules="regEx.requiredMemorySize"
                required
              ></label-with-text>
              <label-with-text
                name="Disk(GB)"
                type="number"
                :className="labelWithInnerTextClass"
                v-model="saveData.workerSpec.storage"
                placeholder="Enter Disk."
                :rules="regEx.requiredDiskSize"
                required
              ></label-with-text>
              <label-with-text
                name="Count"
                type="number"
                :className="labelWithInnerTextClass"
                v-model="saveData.workerSpec.nodeCount"
                placeholder="Enter Node Count."
                :rules="regEx.requiredNodeCount"
                required
              ></label-with-text>
            </div>
          </template>
          <label-with
            name="Control Plane(Master)"
            :className="labelWithClass"
            v-if="!isBasic"
          >
            <template #append-content>
              <div class="nodeInfoMasterClass">
                <label-with-text
                  name="CPU(Core)"
                  type="number"
                  :className="labelWithInnerTextClass"
                  v-model="saveData.masterSpec.cpu"
                  placeholder="Enter CPU core."
                  :rules="regEx.requiredCpuCore"
                  required
                ></label-with-text>
                <label-with-text
                  name="Memory(MB)"
                  type="number"
                  :className="labelWithInnerTextClass"
                  v-model="saveData.masterSpec.memory"
                  placeholder="Enter Memory."
                  :rules="regEx.requiredMemorySize"
                  required
                ></label-with-text>
                <label-with-text
                  name="Disk(GB)"
                  type="number"
                  :className="labelWithInnerTextClass"
                  v-model="saveData.masterSpec.storage"
                  placeholder="Enter Disk."
                  :rules="regEx.requiredDiskSize"
                  required
                ></label-with-text>
                <label-with-text
                  name="Count"
                  type="number"
                  :className="labelWithInnerTextClass"
                  v-model="saveData.masterSpec.nodeCount"
                  placeholder="Enter Node Count."
                  :rules="regEx.requiredNodeCount"
                  required
                ></label-with-text>
              </div>
            </template>
          </label-with>
          <label-with name="Worker" :className="labelWithClass" v-if="!isBasic">
            <template #append-content>
              <div class="nodeInfoWorkerClass">
                <label-with-text
                  name="CPU(Core)"
                  type="number"
                  :className="labelWithInnerTextClass"
                  v-model="saveData.workerSpec.cpu"
                  placeholder="Enter CPU core."
                  :rules="regEx.requiredCpuCore"
                  required
                ></label-with-text>
                <label-with-text
                  name="Memory(MB)"
                  type="number"
                  :className="labelWithInnerTextClass"
                  v-model="saveData.workerSpec.memory"
                  placeholder="Enter Memory."
                  :rules="regEx.requiredMemorySize"
                  required
                ></label-with-text>
                <label-with-text
                  name="Disk(GB)"
                  type="number"
                  :className="labelWithInnerTextClass"
                  v-model="saveData.workerSpec.storage"
                  placeholder="Enter Disk."
                  :rules="regEx.requiredDiskSize"
                  required
                ></label-with-text>
                <label-with-text
                  name="Count"
                  type="number"
                  :className="labelWithInnerTextClass"
                  v-model="saveData.workerSpec.nodeCount"
                  placeholder="Enter Node Count."
                  :rules="regEx.requiredNodeCount"
                  required
                ></label-with-text>
              </div>
            </template>
          </label-with>
        </template>
      </line-button-title>
    </v-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import LabelWith from '@/components/molcule/LabelWith.vue'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWithSelect from '@/components/molcule/LabelWithSelect.vue'
// import LabelWithGroup from '@/components/molcule/LabelWithGroup.vue'

import LineButtonTitle from '@/components/molcule/LineButtonTitle.vue'

const clusterMapUtils = createNamespacedHelpers('cluster')

export default {
  components: {
    LabelWith,
    LabelWithText,
    LabelWithSelect,
    // LabelWithGroup,
    LineButtonTitle,
  },
  data() {
    return {
      projectIdx: '',
      regEx: {
        required: [value => !!value || 'Please enter a value.'],
        requiredIP: [
          value => !!value || 'Please enter a value.',
          value =>
            /^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(value) ||
            'Please enter in IP format. ex) 192.168.10.1',
        ],
        requiredCpuCore: [
          value => !!Number(value) || 'Please enter a value.',
          value => Number(value) > 0 || 'CPU Core must be at least 1.',
          value =>
            Number.isInteger(Number(value)) ||
            'Only integer values can be entered for CPU Core.',
        ],
        requiredMemorySize: [
          value => !!Number(value) || 'Please enter a value.',
          value => Number(value) >= 256 || 'Memory must be at least 256 MB.',
          value =>
            Number.isInteger(Number(value)) ||
            'Only integer values can be entered for Memory Size.',
        ],
        requiredDiskSize: [
          value => !!Number(value) || 'Please enter a value.',
          value => Number(value) >= 10 || 'Disk Size must be at least 10 GiB.',
          value =>
            Number.isInteger(Number(value)) ||
            'Only integer values can be entered for Disk Size.',
        ],
        requiredNodeCount: [
          value => !!Number(value) || 'Please enter a value.',
          value => Number(value) > 0 || 'Node Count must be at least 1.',
          value =>
            !!Number.isInteger(Number(value)) ||
            'Only integer values can be entered for Node Count.',
        ],
      },
      message: {
        required: '{name} is a required value.',
      },
      apiUrl: {
        templateList: '/api/private/k8s/template/list',
      },
      templateList: [],
      saveData: {
        kubernetesVersion: '',
        templateName: '',
        controlPlaneIp: '',
        // ipPool: {
        //   start: '',
        //   end: '',
        // },
        masterSpec: {
          cpu: 2,
          memory: 4096,
          storage: 20,
          nodeCount: 1,
        },
        workerSpec: {
          cpu: 2,
          memory: 4096,
          storage: 20,
          nodeCount: 1,
        },
      },
      isBasic: true,
      labelWithSelectClass: {
        titleStyle: { color: '#1a3350b3' },
        inputStyle: {
          readonly: false,
          fontSize: '2rem',
          margin: '10px',
          borderRadius: '5px',
        },
      },
      labelWithTextClass: {
        titleStyle: {},
        inputStyle: {
          readonly: false,
          fontSize: '2rem',
          margin: '10px',
          borderRadius: '5px',
        },
      },
      labelWithClass: {
        titleStyle: {
          fontWeight: '550',
          marginTop: '10px',
          marginBottom: '10px',
        },
      },
      labelWithGroupClass: {
        titleStyle: {},
      },
      labelWithInnerTextClass: {
        titleStyle: { paddingLeft: '10px' },
        inputStyle: {
          readonly: false,
          fontSize: '2rem',
          margin: '10px',
          borderRadius: '5px',
        },
      },
    }
  },
  computed: {
    ...clusterMapUtils.mapGetters(['templates']),
  },
  created() {
    this.projectIdx = this.$route.params.id
  },
  mounted() {
    this.getTemplates()
  },
  methods: {
    ...clusterMapUtils.mapMutations(['setPrivateVsphereNewClusterForm']),
    ...clusterMapUtils.mapActions([
      'createPrivateVsphereCluster',
      'getTemplateList',
    ]),
    async getTemplates() {
      await this.getTemplateList({
        cspAccountUuid: 'test',
      })
      this.templateList = this.templates
    },
    getKubeVersion() {
      const template = this.saveData.templateName
      const kubeversion = template.split('-')[3]
      this.saveData.kubernetesVersion = kubeversion
    },
    onChangeTemplate() {},
    async onSubmit() {
      if (!this.$refs.clusterInfoForm.validate()) {
        return false
      }
      this.getKubeVersion()
      console.log('save data: ', this.saveData)

      if (this.isBasic) {
        this.saveData.masterSpec = null
      }
      this.setPrivateVsphereNewClusterForm(this.saveData)
      const result = await this.createPrivateVsphereCluster()
      console.log(result)

      if (result) {
        setTimeout(
          () => this.$router.push(`/project/detail/${this.projectIdx}`),
          1000,
        )
      }
      return true
    },
  },
}
</script>

<style lang="scss" scoped>
.new-vSphere-cluster-wrapper {
  > :nth-child(n - 1) {
    margin-bottom: 36px;
  }

  .expand-radio-button {
    margin: 10px;
  }

  .nodeInfoMasterClass {
    margin-right: 20px;
  }
  .content-warpper .sp-label-with {
    width: 50% !important;
    float: left;
  }
  .expand-radio-button {
    margin: 0px;
    margin-bottom: 10px;
  }
}
</style>
