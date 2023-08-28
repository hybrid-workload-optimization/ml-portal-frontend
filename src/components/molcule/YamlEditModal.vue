<template>
  <modal
    popup-card-class="yaml-popup-card"
    :title-name="title"
    modal-width="900"
    body-height="1000"
    :dialog="isOpenModal"
    @close-modal="onClickCloseModal"
    @click-template="onClickTemplate"
    :isTemplateBtn="isTemplateBtn"
  >
    <!-- 컨텐츠 -->
    <template v-slot:content>
      <editor @input="setContent" :content="yamlContent" class="yaml-editor" />
      <v-textarea
        v-if="errorMessage"
        filled
        background-color="red lighten-2"
        class="mt-1"
        readonly
        :value="errorMessage"
        hide-details
      ></v-textarea>
    </template>

    <!-- 하단 -->
    <template v-slot:footer>
      <div class="popup__button-wrapper">
        <sp-button
          class="cancel-button"
          elevation="0"
          dense
          outlined
          @click="onClickCloseModal"
        >
          Cancel
        </sp-button>
        <sp-button
          class="save-button"
          elevation="0"
          dense
          outlined
          @click="onClickSaveModal"
          :disabled="disableSaveBtn"
        >
          {{ btnSave }}
        </sp-button>
      </div>
    </template>

    <v-alert
      :titleName="alertTitle"
      :dialog="showAlert"
      @close-Alert="closeAlert"
    ></v-alert>
  </modal>
</template>

<script>
import Modal from '@/components/modals/Modal.vue'
import Editor from '@/components/Editor.vue'
import { createNamespacedHelpers } from 'vuex'
import { diff } from '@/utils/common'
import VAlert from '@/components/molcule/Alert.vue'
import { teamplate } from '@/utils/template'
// import yamljs from 'yamljs'

const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    Modal,
    Editor,
    VAlert,
  },
  props: {
    // title: {
    //   type: String,
    //   default: () => 'New Resource',
    //   description: '타이틀 명칭',
    // },
    // firstSelectMeta: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       requestFunc: request.getClustersUsingGET, // 클러스터 id 조회
    //     }
    //   },
    //   description:
    //     '첫번째 조회할 항목의 메타 데이터({requestFunc: 호출할 메서드, parameters: 호출 시 넘길 파라미터})',
    // },
  },
  data() {
    return {
      // title: '',
      btnSave: 'Create',
      errorMessage: '',
    }
  },
  created() {},
  computed: {
    ...yamlEditModalMapUtils.mapGetters(['resourceType']),
    ...yamlEditModalMapUtils.mapGetters(['title']),
    ...yamlEditModalMapUtils.mapGetters(['yamlContent']), // 저장된 content 내용 가져오기(yamlEditModal.js)
    ...yamlEditModalMapUtils.mapGetters(['orginYamlContent']), // 모달 오픈 시 전달받은 최초 yaml content 내용
    ...yamlEditModalMapUtils.mapGetters(['isOpenModal']), // 모달 오픈 여부
    ...yamlEditModalMapUtils.mapGetters(['readOnlyKeys']), // yaml 내용 중 수정되면 안되는 속성 키 리스트
    // ...yamlEditModalMapUtils.mapGetters(['firstSelectVal']), // 첫번째 selectbox 선택된 값 가져오기
    // ...yamlEditModalMapUtils.mapGetters(['firstSelectItems']), // 첫번째 selectbox 리스트 가져오기
    ...yamlEditModalMapUtils.mapGetters(['editType']), // 에디트 타입
    ...alertMapUtils.mapGetters(['showAlert', 'alertTitle']),
    disableSaveBtn() {
      if (
        this.editType === 'create' &&
        this.yamlContent &&
        this.yamlContent.length > 0
      ) {
        return false
      }

      if (
        this.editType === 'update' &&
        this.yamlContent &&
        this.yamlContent.length > 0
      ) {
        return false
      }
      return true
    },
    isTemplateBtn() {
      if (this.editType === 'create') {
        return true
      }
      return false
    },
  },
  watch: {
    isOpenModal(value) {
      if (value) {
        // this.title =
        //   this.editType === 'update' ? 'Edit Resource' : 'New Resource'
        this.btnSave = this.editType === 'update' ? 'Update' : 'Create'
      }
      if (value && this.editType === 'create') {
        // select box 조회
        // this.requestGetFirstSelectItems({
        //   requestFunc: request.getClustersUsingGET,
        // })
      }
    },
  },
  methods: {
    ...yamlEditModalMapUtils.mapMutations(['changeFirstSelectVal']), // firstSelectVal 값 변경
    ...yamlEditModalMapUtils.mapMutations(['changeContent']), // 저장된 content 내용 변경(yamlEditModal.js)
    ...yamlEditModalMapUtils.mapMutations(['closeModal']), // yaml에디트 모달창 닫기(yamlEditModal.js)
    ...yamlEditModalMapUtils.mapActions(['requestGetFirstSelectItems']), // 첫번째 셀렉트 박스 리스트 가져오기
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    ...alertMapUtils.mapMutations(['openAlert', 'closeAlert']),

    setContent(value) {
      this.changeContent(value)
    },
    onClickCloseModal() {
      this.closeModal()
    },
    async onClickSaveModal() {
      if (this.editType === 'update') {
        if (this.readOnlyKeys && this.readOnlyKeys.length > 0) {
          const isDiff = diff.yamlDiffData(
            this.readOnlyKeys,
            this.yamlContent,
            this.orginYamlContent,
          )
          if (isDiff) {
            this.openAlert(
              `[${this.readOnlyKeys}] 해당 정보는 변경할 수 없습니다.`,
            )
            return
          }
        }
      }

      const encodedContent = Buffer.from(this.yamlContent, 'utf8').toString(
        'base64',
      )
      const value = {
        encodedContent,
      }
      // if (this.editType === 'create') {
      //   value.firstSelectVal = this.firstSelectVal
      // }
      this.$emit('confirmed', value)
      // this.closeModal()
    },
    onChangeFirstSelect(value) {
      this.changeFirstSelectVal(value)
    },
    onClickTemplate() {
      const content = teamplate.getK8sResourceTemplate(this.resourceType)
      this.changeContent(content)
    },
  },
}
</script>

<style lang="scss">
$this: 'popup';
.yaml-popup-card {
  .card-body {
    max-height: 900px;
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
    padding: 0;
    .yaml-editor {
      .sp-editor__code-box {
        .CodeMirror-gutter-wrapper {
          left: -38px !important;
        }
        .CodeMirror-gutters {
          left: 0 !important;
        }
      }
    }
  }
}

.#{$this}__button-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 15px;
  .cancel-button {
    width: 114px;
    color: $sp-title;
    border-width: thin;
    font-weight: bold;
    border-radius: 5px;
  }
  .save-button {
    width: 114px;
    color: $sp-teriary;
    border-width: thin;
    font-weight: bold;
    margin-left: 10px;
    border-radius: 5px;
  }
}

// .CodeMirror-sizer {
//   margin-left: 30px;
//   margin-bottom: -17px;
//   border-right-width: 33px;
//   min-height: 32px;
//   padding-right: 0px;
//   padding-bottom: 0px;
// }
</style>
