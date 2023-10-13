<template>
  <div class="sp-new-ingress-controller">
    <v-form ref="form" @submit.prevent="onSubmit">
      <label-with-select
        horizontal
        name="Ingress Controller"
        :readonly="isEditMode"
        :value="provider"
        @input="value => (provider = value)"
        :items="providers"
      ></label-with-select>
      <label-with-text
        horizontal
        name="Replicas"
        v-model="replicas"
        @blur="onBlurReplicas"
        :rules="rules.validateNumber"
        type="number"
      ></label-with-text>
      <label-with horizontal name="Default">
        <template #append-content>
          <v-checkbox
            v-model="isDefault"
            hide-details="auto"
            @change="onChangeDefault"
          ></v-checkbox>
        </template>
      </label-with>
      <label-with horizontal name="Service Type">
        <template #append-content>
          <v-radio-group v-model="serviceType" row hide-details="auto">
            <v-radio label="NodePort" value="NodePort"></v-radio>
            <v-radio label="ExternalIps" value="ExternalIPs"></v-radio>
          </v-radio-group>
        </template>
      </label-with>

      <div class="node-port-select-wrapper" v-if="serviceType === 'NodePort'">
        <label-with-text
          horizontal
          name="Http Port"
          v-model="httpPort"
          @blur="onBlurHttpPort"
          :rules="rules.validatePortNumer"
          type="number"
        ></label-with-text>
        <label-with-text
          horizontal
          name="Https Port"
          v-model="httpsPort"
          @blur="onBlurHttpsPort"
          :rules="rules.validatePortNumer"
          type="number"
        ></label-with-text>
      </div>

      <div class="external-ips-wrapper" v-if="serviceType === 'ExternalIPs'">
        <div
          class="input-set-wrapper"
          v-for="(data, index) in externalIp"
          :key="index"
        >
          <sp-input
            outlined
            hide-details="auto"
            class="external-ip-input"
            v-model="data.ipAddress"
            :rules="rules.validateIpAddress"
            dense
          ></sp-input>
          <sp-button
            icon
            @click="onClickAddItem"
            v-if="index === externalIp.length - 1"
            ><v-icon>add_circle_outline</v-icon></sp-button
          >
          <sp-button icon @click="onClickDeleteItem(index)" v-else
            ><v-icon>remove_circle_outline</v-icon></sp-button
          >
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
import LabelWithSelect from '@/components/molcule/LabelWithSelect.vue'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWith from '@/components/molcule/LabelWith.vue'
import { createNamespacedHelpers } from 'vuex'
import { form } from '@/utils/mixins/form'

const ingressControllerMapUtil = createNamespacedHelpers('ingressController')
const multiSelectMapUtils = createNamespacedHelpers('multiSelect')

export default {
  components: {
    LabelWithSelect,
    LabelWithText,
    LabelWith,
  },
  mixins: [form],
  props: {
    mode: {
      type: String,
      default: 'new',
    },
  },
  data: () => ({
    id: '',
    isDefault: false,
    replicas: 1,
    serviceType: 'NodePort',
    externalIp: [
      {
        ipAddress: '',
      },
    ],
    provider: '',
    httpPort: '',
    httpsPort: '',
  }),
  computed: {
    ...multiSelectMapUtils.mapGetters(['secondValue']),
    ...ingressControllerMapUtil.mapGetters(['providers', 'selectedItem']),
    isEditMode() {
      return this.mode === 'edit'
    },
  },
  mounted() {
    if (this.isEditMode) {
      this.setData()
    } else {
      this.initData()
    }
  },
  methods: {
    ...ingressControllerMapUtil.mapActions([
      'createItem',
      'updateItem',
      'getProviderList',
      'checkIsExistDefault',
    ]),
    setData() {
      this.id = this.selectedItem.id
      this.serviceType = this.selectedItem.serviceType
      this.replicas = this.selectedItem.replicas
      this.isDefault = this.selectedItem.default
      this.provider = this.selectedItem.name
      this.httpPort = this.selectedItem.httpPort
      this.httpsPort = this.selectedItem.httpsPort
      this.externalIp =
        this.selectedItem.externalIp && this.selectedItem.externalIp.length
          ? this.selectedItem.externalIp.map(item => {
              return { ipAddress: item }
            })
          : [{ ipAddress: '' }]
    },
    onClickAddItem() {
      this.externalIp.push({ ipPort: '' })
    },
    onClickDeleteItem(index) {
      this.externalIp.splice(index, 1)
    },
    onBlurReplicas(value) {
      if (value.toString().length > 1) {
        // TODO 나중에 정규식 수정
        this.replicas = value.replace(/(^0+)/, '')
        this.replicas = value.replace(/[^0-9]/g, '')
      }
    },
    onBlurHttpPort(value) {
      if (value.toString().length > 1) {
        // TODO 나중에 정규식 수정
        this.httpPort = value.replace(/(^0+)/, '')
        this.httpPort = value.replace(/[^0-9]/g, '')
      }
    },
    onBlurHttpsPort(value) {
      if (value.toString().length > 1) {
        // TODO 나중에 정규식 수정
        this.httpsPort = value.replace(/(^0+)/, '')
        this.httpsPort = value.replace(/[^0-9]/g, '')
      }
    },
    async onChangeDefault() {
      if (this.isDefault) {
        const response = await this.checkIsExistDefault({
          clusterIdx: this.secondValue,
        })
        if (response) {
          this.isDefault = false
        }
      }
    },
    async onSubmit() {
      if (!this.$refs.form.validate()) return
      const params = {
        clusterIdx: Number(this.secondValue),
        isDefault: this.isDefault,
        replicas: Number(this.replicas),
        serviceType: this.serviceType,
        name: this.provider,
      }
      if (this.serviceType === 'ExternalIPs') {
        params.externalIp = this.externalIp
          .map(item => item.ipAddress)
          .join(',')
      } else {
        params.httpPort = Number(this.httpPort)
        params.httpsPort = Number(this.httpsPort)
      }
      if (this.isEditMode) {
        params.id = this.id
        await this.updateItem(params)
      } else {
        await this.createItem(params)
      }
    },
    initData() {
      this.id = ''
      this.provider = ''
      this.isDefault = false
      this.serviceType = 'NodePort'
      this.replicas = 1
      this.httpPort = ''
      this.httpsPort = ''
      this.externalIp = [{ ipAddress: '' }]
      this.getProviderList({ clusterIdx: this.secondValue })
      this.$refs.form.resetValidation()
    },
  },
}
</script>

<style lang="scss">
.sp-new-ingress-controller {
  height: 410px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: $scroll-width;
    height: $scroll-width;
  }
  &::-webkit-scrollbar-thumb {
    height: $scroll-height;
    background-color: $scroll-background-color;
    border-radius: $scroll-border-radius;
  }
  padding: 20px 10px;
  .horizontal {
    margin-bottom: 20px;
  }
  .sp-text-field.horizontal {
    margin-bottom: 0;
  }
  .sp__label {
    width: 20%;
  }
  .sp-select {
    width: 80%;
  }
  .node-port-select-wrapper,
  .external-ips-wrapper {
    padding: 15px;
    .input-set-wrapper {
      margin-bottom: 10px;
      .external-ip-input {
        width: 95%;
        display: inline-block;
      }
    }
  }
  .v-input--selection-controls {
    margin: 0;
    padding: 0;
  }
}
</style>
