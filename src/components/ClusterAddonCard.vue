<template>
  <div class="sp-cluster-addon-card">
    <sp-card
      class="cluster-addon-card"
      outlined
      :width="width"
      :height="height"
      :max-height="maxHeight"
      :max-width="maxWidth"
      :min-height="minHeight"
      :min-width="minWidth"
      :shadowed="shadowed"
      :elevation="elevation"
    >
      <div class="content-wrapper">
        <div class="chips-wrapper">
          <sp-chip class="installed-chip" v-if="addonData.installed"
            >Installed</sp-chip
          >
        </div>
        <div class="image-wrapper">
          <sp-image
            :srcUrl="`data:image/${addonData.icon.format}+xml;base64,${addonData.icon.data}`"
            class="addon-image"
            alt="addon image"
          />
        </div>
        <div class="title-wrapper">
          <span class="addon-title">{{ addonData.name }}</span>
        </div>
      </div>
      <v-divider></v-divider>
      <div class="description-wrapper">
        <span class="description-text">{{ addonData.desc }}</span>
      </div>
      <div class="button-wrapper">
        <sp-button
          depressed
          class="detail-button"
          @click="onClickOpenPopup(addonData)"
          >View Details</sp-button
        >
      </div>
    </sp-card>

    <!-- 팝업창 부분 -->
    <modal
      class="cluster-popup"
      :title-name="popupData.name"
      modal-width="700"
      modal-height="680"
      :dialog="isOpenPopup"
      @close-modal="onClickCloseModal"
    >
      <template v-slot:content>
        <div class="description-wrapper">
          <div class="description-image-wrapper">
            <sp-image
              :srcUrl="`data:image/${addonData.icon.format}+xml;base64,${addonData.icon.data}`"
              class="description-image"
              alt="description image"
            ></sp-image>
          </div>
          <span class="description-text">{{ popupData.desc }}</span>
        </div>
        <div class="cluster-info-wrapper">
          <span class="cluster-info-list">Package Info</span>

          <v-treeview
            transition
            expand-icon=""
            open-on-click
            dense
            :items="getPackageInfo(popupData.packages)"
            @update:active="checkIsOpen"
            class="package-treeview"
          >
            <template v-slot:prepend="{ item }">
              <span v-if="!item.children">-</span>
              <v-icon v-else>inventory_2</v-icon>
            </template>

            <template v-slot:append="{ item }">
              <span v-if="item.children && item.children.length"
                >------------------------------------------------------<v-icon
                  class="expand-icon"
                  >expand_more</v-icon
                ></span
              >
            </template>
          </v-treeview>
          <span class="cluster-info-list">Recommended Spec</span>
          <v-treeview
            transition
            expand-icon=""
            open-on-click
            dense
            :items="getRecommendedSpec(popupData.requiredSpec)"
          >
            <template v-slot:prepend="{ item }">
              <span v-if="!item.children">-</span>
              <v-icon v-else>computer</v-icon>
            </template>
            <template v-slot:append="{ item }">
              <span v-if="item.children && item.children.length"
                >------------------------------------------------------<v-icon
                  class="expand-icon"
                  >expand_more</v-icon
                ></span
              >
            </template>
          </v-treeview>

          <!-- TODO 모양 수정 -->
          <div
            class="cluster-info-configuration"
            v-if="!popupData.installed && isProjectAuth"
          >
            <div class="cluster-info-configuration__label-wrapper">
              <span class="cluster-info-configuration__label">Configure</span>
            </div>
            <v-form ref="form" @submit.prevent="onSubmit">
              <div class="cluster-info-configuration__content-wrapper">
                <label-with-text
                  horizontal
                  v-for="(param, index) in popupData.parameters"
                  :key="index"
                  :name="param.label"
                  :value="formData[param.name]"
                  :rules="popupDataRules(param)"
                  @input="value => (formData[param.name] = value)"
                />
                <!-- <label-with-text
                  type="password"
                  horizontal
                  name="grafana-admin-password"
                  :value="grafanaUserInfo.password"
                  :rules="rules.requiredAddonPw"
                  @input="value => (grafanaUserInfo.password = value)"
                />
                <label-with-text
                  horizontal
                  name="grafana-nodePort"
                  :value="grafanaUserInfo.nodePort"
                  :rules="rules.validatePortNumer"
                  @input="value => (grafanaUserInfo.nodePort = value)"
                />
                <label-with-text
                  horizontal
                  name="prometheus-pvc"
                  :value="grafanaUserInfo.prometheusPvc"
                  @input="value => (grafanaUserInfo.prometheusPvc = value)"
                /> -->
              </div>
            </v-form>
          </div>
        </div>

        <div class="button-wrapper" v-if="isProjectAuth">
          <sp-button
            class="cluster-addon-button install-button"
            v-if="!popupData.installed"
            depressed
            height="40px"
            @click="onClickInstall"
            ><sp-image
              src="icon_loading.gif"
              v-if="isClicked"
              class="button-image"
            />Install</sp-button
          >
          <sp-button
            class="cluster-addon-button uninstall-button"
            v-if="popupData.installed"
            depressed
            height="40px"
            @click="onClickUninstall"
            ><sp-image
              src="icon_loading.gif"
              v-if="isClicked"
              class="button-image"
            />Uninstall</sp-button
          >
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import Modal from '@/components/modals/Modal.vue'
import { createNamespacedHelpers } from 'vuex'
import { form } from '@/utils/mixins/form'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const clusterAddOnMapUtils = createNamespacedHelpers('clusterAddOn')
const clusterMapUtils = createNamespacedHelpers('cluster')

export default {
  components: {
    Modal,
    LabelWithText,
  },
  mixins: [form, checkProjectAuth],
  props: {
    width: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 넓이를 설정',
    },
    height: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 높이를 설정',
    },
    maxHeight: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최대 높이를 설정',
    },
    maxWidth: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최대 가로를 설정',
    },
    minHeight: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최소 높이를 설정',
    },
    minWidth: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최소 가로를 설정',
    },
    elevation: {
      type: [Number, String],
      description: '카드의 입체감 조절 0~24까지 가능',
      default: 0,
    },
    shadowed: {
      type: Boolean,
      description: '카드에 그림자 효과 부여 on/off',
      default: false,
    },
    addonData: {
      type: Object,
      description: '애드온 카드에 들어갈 데이터',
      default: undefined,
    },
  },
  mounted() {
    this.checkProjectAuth(this.dataDetail.projectIdx)
    // 필요 없는 쿼리 삭제
    if (this.$router.query) {
      this.$router.replace({ hash: '#add-on', query: null })
      // mixin
    }
  },
  watch: {
    $route(value) {
      // General로부터 Install cluster monitoring 버튼을 눌렀을 때 팝업 노출
      if (value.query && value.query.target) {
        if (this.addonData.addonType === value.query.target) {
          this.onClickOpenPopup(this.addonData)
        }
      }
    },
  },
  data: () => ({
    isOpenPopup: false,
    popupData: {},
    grafanaUserInfo: {
      user: 'admin',
      password: 'admin',
      nodePort: 30004,
      prometheusPvc: '',
    },
    isClicked: false,
    iscConfigOpen: false,
    formData: {},
  }),
  computed: {
    ...clusterMapUtils.mapGetters(['dataDetail']),
    getParameters() {
      return {
        clusterIdx: Number(this.$route.params.id),
        addonId: this.popupData.addonId,
      }
    },
  },
  methods: {
    ...clusterAddOnMapUtils.mapActions([
      'postInstall',
      'deleteInstall',
      'getList',
    ]),
    ...clusterMapUtils.mapActions(['getClusterMonotoring']),
    popupDataRules(param) {
      let result = []
      if (param.required) {
        result = this.rules.required
      }

      if (param.type === 'integer') {
        result = [...result, ...this.rules.validateNumber]
      }
      return result
    },
    onClickOpenPopup(data) {
      console.log('[onClickOpenPopup]', data)
      this.isOpenPopup = true
      this.popupData = data
      if (!this.popupData.installed) {
        this.popupData.parameters.forEach(item => {
          this.formData[item.name] = item.defaultValue
        })
      }
    },
    onClickCloseModal() {
      this.isOpenPopup = false
      this.iscConfigOpen = false
    },
    checkIsOpen(item) {
      const treeNode = document
        .querySelector('.package-treeview')
        .querySelector('.v-treeview-node')
      const isOpen = treeNode.ariaExpanded
      console.log('펼침 상태', isOpen)

      console.log('펼쳐진 내용', item)
    },

    async onClickInstall() {
      this.isClicked = true
      const params = this.getParameters
      // Cluster Monitoring 설치 시에 계정 정보 입력
      if (this.popupData.addonType === 'cluster-monitoring') {
        const parameters = this.formData
        params.parameters = parameters
      }

      await this.postInstall(params)
      await this.getDataList()
      this.isClicked = false
      this.isOpenPopup = false
      // this.onClickCloseModal()
    },
    async onClickUninstall() {
      this.isClicked = true
      await this.deleteInstall(this.getParameters)
      await this.getDataList()
      this.isClicked = false
      this.isOpenPopup = false
    },
    async getDataList() {
      const params = {
        clusterIdx: Number(this.$route.params.id),
      }
      this.getList(params)
      await this.getClusterMonotoring(params)
    },
    getPackageInfo(packages) {
      const result = []
      if (packages && packages.length) {
        packages.forEach(item => {
          const pushItem = {
            name: item.name,
            children: [{ name: `version: ${item.version}` }],
          }

          if (item.desc) {
            pushItem.children.push({ name: item.desc })
          }
          result.push(pushItem)
        })
      }
      return result
    },
    getRecommendedSpec(specObj) {
      const specList = []
      for (const key in specObj) {
        if (Object.prototype.hasOwnProperty.call(specObj, key)) {
          specList.push({ name: `${key}: ${specObj[key]}` })
        }
      }
      return specList
    },
    setImagePath(path) {
      return process.env.VUE_APP_BASE_API + path
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-cluster-addon-card {
  .cluster-addon-card {
    .card-body {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .content-wrapper {
      text-align: center;
      align-content: center;
      justify-content: center;
      .chips-wrapper {
        min-height: 25px;
        text-align: right;
        .installed-chip {
          @include set-text(500, 11, rgba($color: #fff, $alpha: 1));
          padding: 0 15px;
          height: 21px;
          margin-right: 5px;
          background: $sp-orange !important;
        }
      }
      .image-wrapper {
        padding-top: 30px;
        display: inline-flex;
        align-content: center;
        justify-content: center;
        text-align: center;
        .addon-image {
          width: 50px;
        }
      }
      .title-wrapper {
        padding-top: 10px;
        padding-bottom: 15px;
        .addon-title {
          font-weight: bold;
        }
      }
    }
    .description-wrapper {
      height: 150px;
      overflow-y: auto;
      @include scroll();
      padding: 15px 15px;
      .description-text {
        font-size: toRem(14);
      }
    }
    .button-wrapper {
      text-align: center;
      margin-top: auto;
      .detail-button {
        width: 130px;
        @include set-text(500, 11, rgba($color: #fff, $alpha: 1));
        background: $sp-teriary !important;
      }
    }
  }
}

/* 팝업쪽 스타일 */
.v-dialog {
  .card-body {
    .description-wrapper {
      padding: 20px;
      display: flex;
      .description-image-wrapper {
        min-width: 70px;
        max-width: 70px;
        .description-image {
          width: 100%;
        }
      }
      .description-text {
        align-self: center;
        margin-left: 20px;
        font-size: toRem(14);
      }
    }
    .cluster-info-wrapper {
      padding: 20px;
      height: 430px;
      overflow-y: scroll;
      @include scroll();
      .cluster-info-list {
        font-weight: bold;
      }
      .package-list {
        .v-treeview-node__root {
          .v-treeview-node__content {
            .v-treeview-node__append {
              .expand-icon {
              }
            }
          }
        }
      }
      .cluster-info-configuration {
        $this: 'cluster-info-configuration';
        .#{$this}__label-wrapper {
          display: flex;
          justify-content: space-between;
          // cursor: pointer;
          .#{$this}__label {
            color: $primary;
            font-weight: bold;
          }
        }
        .#{$this}__content-wrapper {
          .sp-label-with-text {
            margin: 10px 30px;
            .sp__label {
              width: 35%;
            }
          }
        }
      }
    }

    .button-wrapper {
      padding: 20px;
      text-align: center;
      .cluster-addon-button {
        width: 130px;
        @include set-text(500, 11, rgba($color: #fff, $alpha: 1));
        .button-image {
          max-width: 20px;
          max-height: 20px;
          margin-right: 10px;
        }
      }
      .install-button {
        background: $sp-teriary;
      }
      .uninstall-button {
        background: $sp-cerise;
      }
    }
  }
}
</style>
