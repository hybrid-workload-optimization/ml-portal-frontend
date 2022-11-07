<template>
  <sp-card class="sp-kubespray-page">
    <v-tabs v-model="tab" color="#000">
      <v-tabs-slider color="#000"></v-tabs-slider>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items class="detail-tab-item" v-model="tab">
      <v-tab-item
        v-for="(item, index) in items"
        :key="index"
        @change="changeTab"
      >
        <div v-if="item === 'kubespray'">
          <div class="sp-detail-metadata">
            <div class="title-wrapper">
              <span class="title-text">Kubespray Version</span>
            </div>

            <sp-select
              hide-details="auto"
              outlined
              single-line
              flat
              dense
              placeholder="Kubespray Version을 선택하세요."
              label="Kubespray Version을 선택하세요."
              :value="tools.value"
              @input="onInputKubesprayVersion"
              :items="tools.kubesprayVersions"
            />

            <div
              class="title-wrapper setting-title"
              @click="onClickAdvancedLabel"
            >
              <span class="title-text">Advanced Setting</span>
              <div class="line-item">
                <div class="line-button"></div>
                <span class="ico-arrow">
                  <v-icon class="small" v-show="!advancedLabelFlag"
                    >arrow_drop_down</v-icon
                  >
                  <v-icon class="small" v-show="advancedLabelFlag"
                    >arrow_drop_up</v-icon
                  >
                </span>
              </div>
            </div>

            <div class="kubespray__content-wrapper">
              <v-form
                ref="form"
                class="kubespray__form"
                v-model="valid"
                lazy-validation
              >
                <div
                  v-for="(setting, index) in settings"
                  :key="index"
                  v-show="advancedLabelFlag"
                >
                  <label-with-text
                    v-if="setting.optionList == null"
                    :name="setting.key"
                    :value="setting.value"
                    :className="labelWithTextClass"
                    horizontal
                    @input="onInputSettingInput(setting.key, setting.value)"
                  />

                  <label-with-select
                    v-else
                    horizontal
                    :name="setting.key"
                    :label="setting.helpText"
                    :value="setting.value"
                    :className="labelWithSelectClass"
                    @input="onInputSettingSelect(setting.key, $event)"
                    :items="setting.optionList"
                  >
                  </label-with-select>
                </div>
                <div class="form-button-wrapper">
                  <sp-button class="reset-button" outlined @click="onReset">
                    Reset
                  </sp-button>
                  <sp-button
                    type="submit"
                    class="submit-button"
                    outlined
                    @click="saveAction"
                    :disabled="!valid"
                  >
                    Save
                  </sp-button>
                </div>
              </v-form>
            </div>
          </div>
        </div>
        <div v-if="item === 'cluster'">div -> cluster component</div>
      </v-tab-item>
    </v-tabs-items>
  </sp-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWithSelect from '@/components/molcule/LabelWithSelect.vue'

const toolsMapUtil = createNamespacedHelpers('tools')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    LabelWithText,
    LabelWithSelect,
  },
  data() {
    return {
      tab: '',
      items: ['kubespray'],
      valid: false,
      key: '',
      kubespray: {
        version: '',
      },
      isOpenLoading: false,
      advancedData: {},
      advancedLabelFlag: false,
      labelWithTextClass: {
        titleStyle: { width: '200px' },
      },
      labelWithSelectClass: {
        titleStyle: { width: '200px' },
        inputStyle: { marginLeft: '8px' },
      },
    }
  },
  computed: {
    ...toolsMapUtil.mapState(['tools', 'settings']),
  },
  async created() {
    // TODO show loading bar
    this.key = this.$route.params.id
    this.isOpenLoading = true

    const params = { type: 'TOOLS', key: this.key }
    await this.getTools({ params })
    this.kubespray.version = this.tools.value

    await this.getToolsAdvancedData({ version: this.kubespray.version })
    // TODO remove loading bar
  },
  // mounted() {
  //   console.log('####mounted')
  // },
  methods: {
    ...toolsMapUtil.mapMutations(['initData']),
    ...toolsMapUtil.mapActions([
      'getTools',
      'updateTools',
      'getToolsAdvancedData',
    ]),
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

    saveAction() {
      if (!this.kubespray.version) {
        console.log('not found version')
      } else {
        this.save()
      }
    },
    async save() {
      const params = {
        type: 'TOOLS',
        key: this.key,
        value: this.kubespray.version,
        setting: this.advancedData,
      }

      try {
        await this.updateTools(params)
        this.openAlert({
          title: '정보가 정상적으로 저장되었습니다.',
          type: 'info',
        })
      } catch (error) {
        this.openAlert({
          title: '서버 에러로 인해 변경에 실패하였습니다.',
          type: 'error',
        })
      }
    },
    changeTab(value) {
      console.log('changeTab: ', value)
      // this.tab = value
    },
    onInputKubesprayVersion(value) {
      this.kubespray.version = value
      this.getToolsAdvancedData({ version: this.kubespray.version })
    },
    onInputSettingInput(id, value) {
      this.advancedData[id] = value
    },
    onInputSettingSelect(id, value) {
      this.advancedData[id] = value
    },
    onClickAdvancedLabel() {
      if (this.advancedLabelFlag) {
        // advancedLabelFlag 이 true이면 false로 변경
        this.advancedLabelFlag = false
      } else {
        // advancedLabelFlag가 false면 true로 변경
        this.advancedLabelFlag = true
      }
    },
    onReset() {
      // 새로고침
      this.onInit()
    },
    async onInit() {
      this.key = this.$route.params.id
      this.isOpenLoading = true
      this.initData()

      // tools 초기 조회
      const params = { type: 'TOOLS', key: this.key }
      await this.getTools({ params })
      this.kubespray.version = this.tools.value

      await this.getToolsAdvancedData({ version: this.kubespray.version }) // advanced 초기 초회

      this.advancedData = {} // 변경데이터 변수 초기화
      this.advancedLabelFlag = false
    },
  },
}
</script>

<style lang="scss">
.title-wrapper {
  &.setting-title {
    display: flex;
    justify-content: space-between;
  }

  .title-text {
    width: 15%;
    cursor: pointer;
  }

  .line-item {
    display: flex;
    width: 85%;
    justify-content: flex-end;
    align-items: center;
    .line-button {
      width: 100%;
      border-top: 1px solid rgba($color: $sp-border-color, $alpha: 1);
    }

    .ico-arrow {
      margin-left: 30px;
      cursor: pointer;
    }
  }
}

.sp-kubespray-page {
  $this: 'kubespray';
  padding: 16px;
  .#{$this}__content-wrapper {
    .#{$this}__form {
      padding: 0 10px;
      .sp-label-with-text.horizontal {
        margin: 15px 0;
      }

      .form-button-wrapper {
        padding-top: 25px;
        text-align: right;
        .sp-button {
          border-width: thin;
          border-radius: 5px;
          font-weight: bold;
        }

        .submit-button {
          color: $basic-button;
        }

        .reset-button {
          margin-right: 10px;
          color: $basic-dark-button;
        }
      }
    }
  }
}
</style>
