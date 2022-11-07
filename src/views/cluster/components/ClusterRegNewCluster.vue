<template>
  <div class="new-cluster-part">
    <label-with-text
      class="cluster-user-input"
      name="User"
      placeholder="user (ex: root)"
      :className="labelWithTextClass"
      :value="formData.provisioningUser"
      @input="onChangeUser"
    ></label-with-text>
    <!-- :placeholder="placeholder" -->

    <div class="cluster-detail-wrapper">
      <div class="host-name">
        <span class="detail-titles">Host name</span>
      </div>
      <div class="ip-detail">
        <span class="detail-titles">IP</span>
      </div>
      <div class="role-part">
        <span class="detail-titles">Role</span>
      </div>
    </div>
    <div
      class="input-wrapper"
      v-for="(data, index) in formData.nodes"
      :key="index"
    >
      <div class="host-name">
        <sp-input
          outlined
          dense
          hide-details
          v-model="data.name"
          placeholder="host name"
        ></sp-input>
      </div>
      <div class="ip-detail">
        <sp-input
          outlined
          dense
          hide-details
          v-model="data.ip"
          placeholder="0.0.0.0"
        ></sp-input>
      </div>
      <div class="role-part">
        <v-combobox
          v-model="data.nodeTypes"
          chips
          multiple
          append-icon="arrow_drop_down"
          :items="roleData"
          outlined
          dense
          single-line
          hide-details
          class="role-combobox"
        ></v-combobox>
      </div>
      <div class="icon-button-wrapper">
        <!--
        <sp-button
          @click="addHost"
          icon
          v-if="index === formData.nodes.length - 1"
          ><v-icon>add</v-icon></sp-button
        >
        <sp-button
          @click="removeHost(index)"
          icon
          v-if="index != formData.nodes.length - 1"
          ><v-icon>remove</v-icon></sp-button
        >
        -->
        <sp-button
          @click="addHost"
          icon
          v-if="index === formData.nodes.length - 1"
          ><v-icon>add</v-icon></sp-button
        >
        <sp-button
          @click="removeHost(index)"
          icon
          v-if="index < formData.nodes.length - 1"
          ><v-icon>remove</v-icon></sp-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import LabelWithText from '@/components/molcule/LabelWithText.vue'

const tag = '[cluster-reg-new-cluster]'

const clusterMapUtils = createNamespacedHelpers('cluster')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  props: {
    editable: {
      type: Boolean,
      default: false,
      description: '수정 가능 여부',
    },
    editData: {
      type: Object,
      default: {},
      description: '수정 데이터',
    },
  },
  components: {
    LabelWithText,
  },
  data() {
    return {
      formData: {
        provisioningUser: '',
        nodes: [
          {
            name: '',
            ip: '',
            nodeTypes: [],
          },
        ],
        originalNodes: [
          {
            name: '',
            ip: '',
            nodeTypes: [],
          },
        ],
      },
      // roleData: ['master', 'worker', 'network'], // TODO 임시
      roleData: ['master', 'worker'],
      labelWithTextClass: {
        titleStyle: {},
        inputStyle: {
          readonly: false,
          fontSize: '2rem',
          margin: '10px',
          borderRadius: '5px',
          width: '600px',
        },
      },
      labelWithClass: {
        titleStyle: {
          fontWeight: 'bold',
          fontSize: '1rem',
          width: '180px',
        },
      },
    }
  },
  watch: {
    editData(value) {
      this.formData = value
      this.formData.originalNodes = value.nodes.slice()
    },
  },
  methods: {
    ...clusterMapUtils.mapMutations(['setDataFormKubespray']),
    ...clusterMapUtils.mapMutations(['initDataFormKubeConfig']),
    ...alertMapUtils.mapMutations(['openAlert']),

    addHost() {
      this.formData.nodes.push({
        name: '',
        ip: '',
        nodeTypes: [],
      })
    },
    removeHost(index) {
      this.formData.nodes.splice(index, 1)
    },

    onChangeUser(e) {
      console.log(tag, 'onChangeUser=', e)
      this.formData.provisioningUser = e
    },
    validateDataForm() {
      if (this.formData.provisioningUser === '') {
        this.openAlert({ title: 'User를 입력하십시오.', type: 'error' })
        return false
      }

      if (this.formData.nodes.length < 1) {
        this.openAlert({
          title: '노드 정보(Host name/IP/Role)를 최소 1개 이상 입력하십시오',
          type: 'warn',
        })
        return false
      }

      let needInputNode = false
      let needInputMaster = true
      let countInputMaster = 0

      this.formData.nodes.forEach(e => {
        // console.log(tag, 'nodes=', e)
        if (e.name === '' || e.ip === '') {
          needInputNode = true
        }
        e.nodeTypes.forEach(ee => {
          // console.log(tag, 'nodeTypes=', ee)
          if (ee === 'master') {
            needInputMaster = false
            countInputMaster += 1
          }
        })
      })

      if (needInputNode) {
        this.openAlert({
          title:
            '노드 정보(Host name/IP)를 입력하십시오(입력되지 않은 항목이 있습니다.)',
          type: 'warn',
        })
        return false
      }
      if (needInputMaster) {
        this.openAlert({
          title: '노드 정보(Role)에서 최소 1개의 Master가 선택되어야 합니다.',
          type: 'warn',
        })
        return false
      }
      if (!(countInputMaster % 2)) {
        this.openAlert({
          title:
            '노드 정보(Role)에서 Master의 개수는 홀수로 설정되어야 합니다.',
          type: 'warn',
        })
        return false
      }

      // 중복 체크 (Host name, IP)
      const nameMap = new Map()
      const ipMap = new Map()
      const isDup = this.formData.nodes.some(item => {
        // console.log(item.name, nameMap.get(item.name))
        const nameCnt = nameMap.get(item.name) || 0
        const ipCnt = ipMap.get(item.ip) || 0
        if (nameMap.get(item.name) > 0) {
          this.openAlert({
            title: '노드 정보(Role)에서 Host name에 중복값이 있습니다.',
            type: 'warn',
          })
          return item
        }
        if (ipMap.get(item.ip) > 0) {
          this.openAlert({
            title: '노드 정보(Role)에서 IP에 중복값이 있습니다.',
            type: 'warn',
          })
          return item
        }
        nameMap.set(item.name, nameCnt + 1)
        ipMap.set(item.ip, ipCnt + 1)
        return false
      })
      if (isDup) {
        return false
      }

      return true
    },
    onSave() {
      if (this.validateDataForm()) {
        this.setDataFormKubespray(this.formData)
        this.initDataFormKubeConfig()
        return true
      }
      return false
    },
  },
  computed: {
    //
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.new-cluster-part {
  padding-top: 20px;

  .cluster-detail-wrapper {
    .detail-titles {
      @include set-text(normal, 14, rgba($color: $sp-title, $alpha: 0.7));
    }
    .host-name {
      width: 30%;
    }
    .ip-detail {
      width: 30%;
    }
    .role-part {
      width: 40%;
    }
    padding: 5px 15px;
    align-items: center;

    display: flex;
  }
  .input-wrapper {
    display: flex;
    align-items: center;
    padding: 5px 15px;

    .host-name {
      width: 29%;
    }
    .ip-detail {
      margin-left: 1%;
      width: 29%;
    }
    .role-part {
      margin-left: 1%;
      width: 36%;
      .role-combobox {
        .v-input__slot {
          border-radius: 5px !important;
          fieldset {
            border-radius: 5px !important;
          }
        }
      }
    }
    .icon-button-wrapper {
      width: 4%;
      align-content: center;
      text-align: center;
    }
  }
}
</style>
