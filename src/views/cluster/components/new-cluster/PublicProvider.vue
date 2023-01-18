<template>
  <div class="new-cluster-wrapper">
    <v-form ref="clusterInfoForm">
      <line-button-title title="Cluster Info">
        <template v-slot:content>
          <label-with-select
            name="Region"
            :className="labelWithSelectClass"
            :items="regionList"
            v-model="saveData.regionId"
            item-text="regionName"
            item-value="regionId"
            @input="onChangeRegion"
            :rules="regEx.required"
            required
          ></label-with-select>
          <template v-if="['Azure', 'GCP', 'Naver'].includes(cloudType)">
            <label-with-select
              ref="zone"
              name="Zone"
              :className="labelWithSelectClass"
              :items="zoneList"
              item-text="zoneName"
              item-value="zoneId"
              v-model="selectedZoneId"
              @input="appendZoneItem"
              :rules="regEx.requiredZoneItems"
            ></label-with-select>
          </template>
          <div>
            <template v-for="(data, index) in appendedZoneItems">
              <sp-chip
                :key="index"
                outlined
                close
                @click-close="removeZoneItem(index)"
                >{{ data.zoneName }}
              </sp-chip>
            </template>
          </div>
          <label-with-select
            name="Kubernetes Version"
            :className="labelWithSelectClass"
            :items="k8sVersionList"
            v-model="saveData.kubernetesVersion"
            item-text="k8sversion"
            item-value="k8sversion"
            @input="value => (saveData.kubernetesVersion = value)"
            :rules="regEx.required"
            required
          ></label-with-select>
        </template>
      </line-button-title>
      <line-button-title title="Node Pool Info">
        <template v-slot:content>
          <label-with-text
            name="Node Pool Name"
            :className="labelWithTextClass"
            :value="saveData.nodePool.nodePoolName"
            placeholder="Node Pool Name을 입력하세요."
            :rules="regEx.nodePoolName"
            @input="value => (saveData.nodePool.nodePoolName = value)"
            required
          ></label-with-text>
          <label-with-select
            name="Server Type"
            :className="labelWithSelectClass"
            :items="serverTypeList"
            v-model="saveData.nodePool.serverTypeId"
            item-text="serverTypeNameText"
            item-value="serverTypeId"
            :rules="regEx.required"
            @input="onChangeServerType"
            required
          >
          </label-with-select>
          <label-with-text
            name="Node Count"
            type="number"
            :className="labelWithTextClass"
            :value="saveData.nodePool.nodeCount"
            @input="value => (saveData.nodePool.nodeCount = value)"
            :rules="regEx.requiredNodeCount"
            required
          ></label-with-text>
          <template v-if="cloudType === 'GCP'">
            <label-with-select
              name="Server Image"
              :className="labelWithSelectClass"
              :items="serverImageList"
              v-model="saveData.nodePool.serverImage"
              item-text="osImageName"
              item-value="osImageId"
              @input="onChangeServerImage"
              :rules="regEx.required"
              required
            ></label-with-select>
            <!-- <label-with-select
              name="Disk Type"
              :className="labelWithSelectClass"
              :items="diskTypeList"
              v-model="saveData.nodePool.diskType"
              item-text="diskTypeName"
              item-value="diskTypeId"
              @input="onChangeDiskType"
              :rules="regEx.required"
              required
            ></label-with-select> -->
          </template>
          <template v-if="['AWS'].includes(cloudType)">
            <label-with-select
              name="Server Image"
              :className="labelWithSelectClass"
              :items="serverImageList"
              v-model="saveData.nodePool.serverImage"
              item-text="osImageName"
              item-value="osImageId"
              @input="onChangeServerImage"
              :rules="regEx.required"
              required
            ></label-with-select>
          </template>
          <template v-if="['AWS', 'GCP'].includes(cloudType)">
            <label-with-text
              name="Disk Size"
              :className="labelWithTextClass"
              :value="saveData.nodePool.diskSize"
              @input="value => (saveData.nodePool.diskSize = value)"
              suffix="GiB"
              :rules="regEx.requiredDiskSize"
              type="number"
              required
            ></label-with-text>
          </template>
        </template>
      </line-button-title>

      <line-button-title title="Network Info">
        <template v-slot:content>
          <label-with name="Network Setting">
            <template v-slot:append-content>
              <v-radio-group
                v-model="isNewNetwork"
                row
                hide-details="auto"
                class="expand-radio-button"
              >
                <v-radio label="New Network" :value="true" disabled></v-radio>
                <v-radio
                  label="Select Network"
                  :value="false"
                  disabled
                ></v-radio>
              </v-radio-group>
            </template>
          </label-with>
          <template v-if="isNewNetwork">
            <label-with-text
              name="DNS Name Prefix"
              :className="labelWithTextClass"
              :value="saveData.network.dnsPrefix"
              @input="value => (saveData.network.dnsPrefix = value)"
              :rules="regEx.dnsPrefix"
              required
            ></label-with-text>
          </template>
          <template v-else>
            <template v-if="cloudType">
              <label-with-select
                name="VPC"
                :className="labelWithSelectClass"
                :items="vpcList"
                v-model="saveData.network.networkKey"
                item-text="networkName"
                item-value="networkKey"
                @input="onChangeVpc"
                :rules="regEx.required"
                required
              ></label-with-select>
            </template>
            <template v-if="cloudType === 'Naver'">
              <label-with-select
                name="Network Type"
                :className="labelWithSelectClass"
                :items="networkTypeList"
                v-model="saveData.network.networkType"
                item-text="networkTypeName"
                item-value="networkTypeId"
                @input="onChangeNetworkType"
                :rules="regEx.required"
                required
              ></label-with-select>
            </template>

            <label-with-select
              name="Subnet"
              :className="labelWithSelectClass"
              :items="subnetList"
              v-model="selectedSubnetName"
              item-text="subnetNameText"
              item-value="subnetName"
              @input="appendSubnetItem"
              :rules="regEx.requiredSubnetItems"
            ></label-with-select>
            <div>
              <template v-for="(data, index) in appendedSubnetItems">
                <sp-chip
                  :key="index"
                  outlined
                  close
                  @click-close="removeSubnetItem(index)"
                  >{{ data.subnetName }}
                </sp-chip>
              </template>
            </div>
            <template v-if="cloudType === 'Naver'">
              <label-with-select
                name="LB Private Subnet"
                :className="labelWithSelectClass"
                :items="lbPrivateSubnetList"
                v-model="saveData.network.lbPrivateSubnetName"
                item-text="subnetName"
                item-value="subnetName"
                :rules="regEx.required"
                required
              ></label-with-select>
            </template>
          </template>
        </template>
      </line-button-title>
    </v-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import axios from 'axios'
import _ from 'lodash'
import LabelWith from '@/components/molcule/LabelWith.vue'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWithSelect from '@/components/molcule/LabelWithSelect.vue'

import LineButtonTitle from '@/components/molcule/LineButtonTitle.vue'

const clusterMapUtils = createNamespacedHelpers('cluster')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    LabelWith,
    LabelWithText,
    LabelWithSelect,
    LineButtonTitle,
  },
  data() {
    return {
      regEx: {
        nodePoolName: [
          value => !!value || '값을 입력하세요.',
          value =>
            /^[a-zA-Z]([a-zA-Z0-9]){2,10}[a-z0-9]$/.test(value) ||
            '노드 풀 명은 영문, 숫자로만 구성되어야 하며, 첫글자는 영문이어야 합니다. 길이는 최소 3글자, 최대 11자까지 입력 가능합니다.',
        ],
        dnsPrefix: [
          value => !!value || '값을 입력하세요.',
          value =>
            /^[a-z]([a-z0-9-]){0,52}[a-z0-9]$/.test(value) ||
            'DNS 이름 접두사는 영문(소문자), 숫자, (-)으로만 구성되어야 하며, 첫글자는 영문이어야하고 끝은 영문 또는 숫자이어야 합니다. 최대 54자까지 입력 가능합니다.',
        ],
        required: [value => !!value || '값을 입력하세요.'],
        requiredNodeCount: [
          value => !!Number(value) || '값을 입력하세요.',
          value =>
            !!Number.isInteger(Number(value)) ||
            'Node Count 는 정수값만 입력이 가능합니다.',
        ],
        requiredDiskSize: [
          value => !!Number(value) || '값을 입력하세요.',
          value => value >= 10 || 'Disk Size는 10GiB 이상이어야 합니다.',
          value =>
            Number.isInteger(Number(value)) ||
            'Disk Size는 정수값만 입력이 가능합니다.',
        ],
        requiredZoneItems: [
          () =>
            this.provider === 'Azure'
              ? true
              : this.appendedZoneItems.length > 0 || '값을 추가해주세요.',
        ],
        requiredSubnetItems: [
          () => this.appendedSubnetItems.length > 0 || '값을 추가해주세요.',
          () =>
            this.checkAWSSubnet() ||
            '서로 다른 Zone의 Subnet이 2개 이상 추가되어야 합니다.',
        ],
      },
      message: {
        required: '{name}은 필수 값 입니다.',
        awsSubnet:
          '이 프로젝트는 서로 다른 존의 서브넷이 2개 이상 추가되어야 합니다.',
      },
      apiUrl: {
        k8sVersionList: '/config/public/k8s/version/list',
        regionList: '/config/public/region/list',
        zoneList: '/config/public/zone/list',
        diskTypeList: '/config/public/k8s/server-disk-type/list',
        serverTypeList: '/config/public/k8s/server-type/list',
        serverImageTypeList: '/config/public/k8s/image-type/list',
        vpcList: '/config/public/k8s/network/list',
        subnetList: '/config/public/k8s/subnet/list',
      },
      networkTypeList: [
        // 고정 값
        { networkTypeId: 'PRIVATE', networkTypeName: 'Private' },
        { networkTypeId: 'PUBLIC', networkTypeName: 'Public' },
      ],
      regionList: [],
      zoneList: [],
      k8sVersionList: [],
      diskTypeList: [],
      serverImageList: [],
      serverTypeList: [],
      vpcList: [],
      subnetList: [],
      lbPrivateSubnetList: [],
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
      appendedZoneItems: [],
      appendedSubnetItems: [],
      saveData: {
        nodePool: {},
        network: {},
      },
      isNewNetwork: true,
      selectedZoneId: null,
      selectedSubnetName: null,
      cloudTypeParamMap: {
        AWS: 'AWS',
        Naver: 'NAVER',
        GCP: 'GOOGLE',
        Azure: 'AZURE',
      },
    }
  },
  computed: {
    ...clusterMapUtils.mapGetters({
      publicNewClusterForm: 'publicNewClusterForm',
      firstData: 'pubClusterInit',
      secondData: 'nodePoolInit',
      thirdData: 'networkInit',
      provider: 'provider',
    }),
    cloudType() {
      return this.provider
    },
  },
  watch: {
    appendedZoneItems: {
      deep: true,
      handler() {
        this.getVpcList()
      },
    },
    cloudType(newVal) {
      this.setInitTargetData()
      this.getRegions()
      this.saveData = this.publicNewClusterForm
      this.appendedZoneItems = []
      this.appendedSubnetItems = []
      if (newVal !== 'Azure') {
        this.isNewNetwork = false
      } else {
        this.isNewNetwork = true
      }
    },
  },
  mounted() {
    if (this.cloudType !== 'Azure') {
      this.isNewNetwork = false
    }
    this.setInitTargetData()
    this.getRegions()
    this.saveData = this.publicNewClusterForm
    this.$refs.clusterInfoForm.resetValidation()
  },
  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...clusterMapUtils.mapMutations([
      'setInitTargetData',
      'setPublicNewClusterForm',
    ]),
    ...clusterMapUtils.mapActions(['createPublicCluster']),
    async getRegions() {
      const response = await axios.get(this.apiUrl.regionList, {
        params: {
          cloudType: this.cloudTypeParamMap[this.cloudType],
        },
      })
      this.regionList = response.data.body
    },
    async getZoneList() {
      this.zoneList = []
      const response = await axios.get(this.apiUrl.zoneList, {
        params: {
          regionId: this.saveData.regionId,
        },
      })
      this.zoneList = response.data.body
    },
    async getK8SVersionList() {
      this.k8sVersionList = []
      const response = await axios.get(this.apiUrl.k8sVersionList, {
        params: {
          cloudType: this.cloudTypeParamMap[this.cloudType],
          regionId: this.saveData.regionId,
        },
      })
      this.k8sVersionList = response.data.body
    },
    async getDiskTypeList() {
      this.diskTypeList = []
      if (!this.saveData.regionId) return
      const params = {
        cloudType: this.cloudTypeParamMap[this.cloudType],
        regionId: this.saveData.regionId,
      }
      if (this.appendedZoneItems.length) {
        params.zoneId = this.appendedZoneItems[0].zoneId
      }
      const response = await axios.get(this.apiUrl.diskTypeList, { params })
      this.diskTypeList = response.data.body
    },
    async getServerImageList() {
      this.serverImageList = []
      if (!this.saveData.regionId) return
      const response = await axios.get(this.apiUrl.serverImageTypeList, {
        params: {
          cloudType: this.cloudTypeParamMap[this.cloudType],
        },
      })
      this.serverImageList = response.data.body
    },
    async getServerTypeList() {
      this.serverTypeList = []
      if (!this.saveData.regionId) return
      const params = {
        cloudType: this.cloudTypeParamMap[this.cloudType],
        regionId: this.saveData.regionId,
        fromVcpu: 2,
        toVcpu: 4,
        fromMemoryGib: 2,
        toMemoryGib: 32,
        gpu: false,
      }
      if (this.cloudType === 'GCP') {
        if (!this.appendedZoneItems.length) {
          this.openAlert({
            title: '존을 선택해 주세요.',
            type: 'warn',
          })
          return
        }
        // eslint-disable-next-line prefer-destructuring
        params.zoneId = this.appendedZoneItems[0].zoneId
      }
      if (this.cloudType === 'Naver') {
        params.serverTypeName = 'SSD.B050'
        params.category = 'STAND'
      } else if (this.cloudType === 'AWS') {
        // TODO 임시
        params.category = 't3'
      }
      const response = await axios.get(this.apiUrl.serverTypeList, {
        params,
      })
      const sortedMemory = _.sortBy(response.data.body, 'memory').reverse()
      const sortedItems = _.sortBy(sortedMemory, 'category').reverse()

      this.serverTypeList = sortedItems.map(item => {
        const category = item.category ? `[${item.category}] ` : ''
        item.serverTypeNameText = `${category}${item.serverTypeName} ( vcore: ${
          item.vcpu
        } | memory: ${Math.round(item.memory / 1024)} )`

        return item
      })
    },
    async getVpcList() {
      this.vpcList = []
      const params = {
        cloudType: this.cloudTypeParamMap[this.cloudType],
        regionId: this.saveData.regionId,
      }
      const response = await axios.get(this.apiUrl.vpcList, { params })
      this.vpcList = response.data.body
    },
    async getSubnetList() {
      /**
       * Naver의 경우 서브넷 타입이 두가지로 분류 됨.
       * Subnet: GEN (General)
       * LB Private Subnet: LOADB (Loadbalancer)
       */
      this.subnetList = []
      if (!this.saveData.regionId || !this.saveData.network.networkKey) return
      const params = {
        cloudType: this.cloudTypeParamMap[this.cloudType],
        regionId: this.saveData.regionId,
        networkKey: this.saveData.network.networkKey,
      }
      if (this.cloudType === 'Naver') {
        if (!this.appendedZoneItems.length) {
          this.openAlert({
            title: '존을 선택해 주세요.',
            type: 'warn',
          })
          return
        }
        params.subnetType = this.saveData.network.networkType
        params.zoneId = this.appendedZoneItems[0].zoneId
        params.usageType = 'GEN'
      }
      const response = await axios.get(this.apiUrl.subnetList, { params })
      this.subnetList = response.data.body.map(item => {
        item.subnetNameText = `${item.subnetName} | ${
          item.zoneName ? item.zoneName : '-'
        }`
        return item
      })
    },
    async getLbPrivateSubnetList() {
      // Naver LB 서브넷 전용 API 호출(usageType 고정)
      this.lbPrivateSubnetList = []

      if (!this.appendedZoneItems.length) return

      const params = {
        cloudType: this.cloudTypeParamMap[this.cloudType],
        regionId: this.saveData.regionId,
        networkKey: this.saveData.network.networkKey,
        usageType: 'LOADB',
        zoneId: this.appendedZoneItems[0].zoneId,
      }

      const reponse = await axios.get(this.apiUrl.subnetList, { params })

      this.lbPrivateSubnetList = reponse.data.body
    },
    onChangeRegion() {
      /**
       * Region 변경 시
       * 1. zone 초기화 및 zone 목록 재호출
       * 2. k8s version 초기화 및 k8s version 목록 재호출
       * 3. 2. 2단계, 3단계 영역 초기화
       */
      console.log('region: ', this.saveData.regionId)
      this.saveData.regionName = null
      if (this.saveData.regionId) {
        this.regionList.some(item => {
          if (item.regionId === this.saveData.regionId) {
            this.saveData.regionName = item.regionName
            return item
          }
          return false
        })
      }

      this.appendedZoneItems = []
      this.selectedZoneId = null
      this.getZoneList()
      this.getK8SVersionList()
      // 2단계 데이터 초기화
      this.setInitTargetData(this.secondData)
      if (this.cloudType === 'GCP') {
        this.getDiskTypeList()
      }
      if (['AWS', 'GCP', 'Naver'].includes(this.cloudType)) {
        this.getServerImageList()
      }
      if (this.cloudType !== 'GCP') {
        this.getServerTypeList()
      }

      // 3단계 데이터 초기화
      this.setInitTargetData(this.thirdData)
      if (this.cloudType !== 'Azure') {
        this.getVpcList()
      }
    },
    onChangeAppendedZone() {
      /**
       * Naver의 경우 zone에 따라 subnet, LB private subnet의 목록 변동이 있음
       */
      if (this.cloudType === 'Naver') {
        this.saveData.network.lbPrivateSubnetName = null
        this.selectedSubnetName = null
        this.appendedSubnetItems = []

        this.getSubnetList()
        this.getLbPrivateSubnetList()
      }
      if (this.cloudType === 'GCP') {
        this.getServerTypeList()
      }
    },
    onChangeDiskType() {
      console.log('onChangeDiskType: ', this.saveData.nodePool.diskType)
      this.diskTypeList.some(item => {
        if (item.diskTypeId === this.saveData.nodePool.diskType) {
          this.saveData.nodePool.diskTypeName = item.diskTypeName
          return item
        }
        return false
      })
    },
    onChangeVpc() {
      console.log('onChangeVpc')
      this.saveData.network.networkName = null
      if (this.saveData.network.networkKey) {
        this.vpcList.some(item => {
          if (item.networkKey === this.saveData.network.networkKey) {
            this.saveData.network.networkName = item.networkName
            return item
          }
          return false
        })
      }
      this.appendedSubnetItems = []
      this.saveData.network.networkType = null
      this.selectedSubnetName = null
      this.saveData.network.lbPrivateSubnetName = null
      if (this.cloudType !== 'Naver') {
        // Naver의 경우 네트워크 타입까지 선택해야 서브넷 목록 호출 가능
        this.getSubnetList()
      }
    },
    onChangeNetworkType() {
      console.log('onChangeSubnetType')
      this.saveData.network.networkTypeName = null
      if (this.saveData.network.networkType) {
        this.vpcList.some(item => {
          if (item.networkType === this.saveData.network.networkType) {
            this.saveData.network.networkTypeName = item.networkTypeName
            return item
          }
          return false
        })
      }
      this.selectedSubnetName = null
      this.appendedSubnetItems = []
      this.saveData.network.lbPrivateSubnetName = null

      this.getLbPrivateSubnetList()
      this.getSubnetList()
    },
    onChangeServerImage() {
      console.log('onChangeServerImage: ', this.saveData.nodePool.serverImage)
      this.serverImageList.some(item => {
        if (item.osImageId === this.saveData.nodePool.serverImage) {
          this.saveData.nodePool.serverImageName = item.osImageName
          this.saveData.nodePool.k8sType = item.k8sType
          return item
        }
        return false
      })
    },
    onChangeServerType() {
      this.serverTypeList.some(item => {
        if (item.serverTypeId === this.saveData.nodePool.serverTypeId) {
          this.saveData.nodePool.serverTypeName = item.serverTypeName
          return item
        }
        return false
      })
    },
    checkAWSSubnet() {
      if (this.cloudType === 'AWS') {
        // 서로 다른 존의 서브넷 2개 이상 추가
        const removeDuplSubnet = _.uniqBy(this.appendedSubnetItems, 'zoneId')
        if (removeDuplSubnet.length < 2) {
          return false
        }
      }
      return true
    },
    appendZoneItem(selectedZoneId) {
      this.selectedZoneId = selectedZoneId
      /**
       * Zone: Azure(멀티 존 선택), Naver&GCP(단일 존 선택)
       */
      if (!selectedZoneId) {
        this.openAlert({
          title: '존을 선택해 주세요.',
          type: 'warn',
        })
        return
      }

      if (
        ['GCP', 'Naver'].includes(this.cloudType) &&
        this.appendedZoneItems.length
      ) {
        this.openAlert({
          title:
            '해당 Provider는 존을 하나만 추가할 수 있습니다. 선택된 존을 삭제하신 뒤 추가해주세요.',
          type: 'warn',
        })
        return
      }

      // 중복 제거
      const findIndex = this.appendedZoneItems.findIndex(item => {
        if (item && item.zoneId === selectedZoneId) {
          return item
        }
        return false
      })
      if (findIndex < 0) {
        this.zoneList.some(item => {
          if (item.zoneId === selectedZoneId) {
            this.appendedZoneItems.push(item)
            this.onChangeAppendedZone()
            return item
          }
          return false
        })
      }
    },
    appendSubnetItem() {
      /**
       * AWS의 경우 서로 다른 zone의 서브넷이 2개 이상 선택되어야 함
       */
      // 중복 제거
      const findIndex = this.appendedSubnetItems.findIndex(item => {
        if (item && item.subnetName === this.selectedSubnetName) {
          return item
        }
        return false
      })
      if (findIndex < 0) {
        this.subnetList.some(item => {
          if (item.subnetName === this.selectedSubnetName) {
            this.appendedSubnetItems.push(item)
            return item
          }
          return false
        })
      }
      this.selectedSubnetName = null
    },
    async onSubmit() {
      if (!this.$refs.clusterInfoForm.validate()) {
        return false
      }

      this.saveData.zoneNames = this.appendedZoneItems.map(item => {
        return item.zoneName
      })
      const subnetKeys = []
      this.saveData.network.subnetNames = this.appendedSubnetItems.map(item => {
        subnetKeys.push(item.subnetKey)
        return item.subnetName
      })
      this.saveData.network.subnetKeys = subnetKeys
      this.lbPrivateSubnetList.some(item => {
        if (this.saveData.network.lbPrivateSubnetName === item.subnetName) {
          this.saveData.network.lbPrivateSubnetKey = item.subnetKey
          return item
        }
        return false
      })
      console.log('save data: ', this.saveData)
      this.setPublicNewClusterForm(this.saveData)
      const result = await this.createPublicCluster()
      if (result) {
        setTimeout(() => this.$router.push('/cluster/list'), 1000)
      }
      return true
    },
    removeZoneItem(index) {
      this.selectedZoneId = 0
      this.appendedZoneItems.splice(index, 1)
      this.onChangeAppendedZone()
    },
    removeSubnetItem(index) {
      this.selectedSubnetName = 0
      this.appendedSubnetItems.splice(index, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.new-cluster-wrapper {
  > :nth-child(n - 1) {
    margin-bottom: 36px;
  }

  .expand-radio-button {
    margin: 10px;
  }
}
</style>
