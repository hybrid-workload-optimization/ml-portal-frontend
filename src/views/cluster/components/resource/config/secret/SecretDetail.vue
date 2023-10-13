<template>
  <div>
    <card-title
      :titleData="titleData"
      :showButtons="isProjectAuth"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    ></card-title>

    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Metadata</span>
      </div>
      <div class="content-wrapper">
        <!-- Name -->
        <label-with-text
          name="Name"
          :value="detailInfo.name"
          horizontal
          readonly
        />

        <!-- Namespace -->
        <label-with-text
          name="Namespace"
          :value="detailInfo.namespace"
          horizontal
          readonly
        />

        <!-- UID -->
        <label-with-text
          name="UID"
          :value="detailInfo.uid"
          horizontal
          readonly
        />

        <!-- Created At -->
        <label-with-text
          name="Created At"
          :value="detailInfo.createdAt"
          horizontal
          readonly
        />

        <!-- Labels -->
        <label-with name="Labels" horizontal>
          <template #append-content>
            <sp-chip v-for="label in detailInfo.label" :key="label">{{
              label
            }}</sp-chip>
          </template>
        </label-with>
      </div>
    </div>

    <!-- Resource Info -->
    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Data</span>
      </div>
      <div
        class="editor-wrapper"
        style="
          border-style: solid;
          border-color: rgba(26, 51, 80, 0.7);
          border-width: 0.1em;
        "
      >
        <editor :content="detailInfo.data" class="yaml-editor" readonly />
      </div>
    </div>

    <!-- 삭제 요청 확인 창 -->
    <confirm
      @confirm-modal="onClickDelConfirm"
      @cancel-modal="onClickDelCancel"
    />

    <!-- yaml 에디터 모달 창 -->
    <yaml-edit-modal @confirmed="onConfirmedFromEditModal" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Confirm from '@/components/molcule/Confirm.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWith from '@/components/molcule/LabelWith.vue'
import Editor from '@/components/Editor.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const secretUtils = createNamespacedHelpers('secret')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    Confirm,
    YamlEditModal,
    CardTitle,
    LabelWithText,
    LabelWith,
    Editor,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      isEncodingContent: true,

      labelWithClass: {
        titleStyle: {
          fontWeight: 'bold',
          fontSize: '1rem',
          width: '180px',
        },
      },
      labelWithTextClass: {
        titleStyle: {
          fontWeight: 'bold',
          fontSize: '1rem',
          width: '150px',
        },
        inputStyle: {
          readonly: true,
          fontSize: '2rem',
          margin: '20px',
          borderRadius: '10px',
        },
      },
      detail: {},
      options: {
        hideFooter: true,
        hideHeader: false,
        dark: false,
        dense: false,
        disableFiltering: false,
        disablePagination: false,
        disableSort: false,
        fixedHeader: false,
        showSelect: false,
        itemKey: 'secretIdx',
      },
      clusterIdx: null,
    }
  },

  async created() {
    this.clusterIdx = this.$route.params.id
    this.secretIdx = this.$route.params.rid
    await this.getDetail({ secretIdx: this.secretIdx })

    // mixin
    this.checkProjectAuth(this.detailInfo.projectIdx)
  },

  mounted() {},

  computed: {
    ...secretUtils.mapGetters(['detailInfo']),
    titleData() {
      return {
        title: `${this.detailInfo.name}`,
      }
    },
  },
  methods: {
    ...secretUtils.mapActions(['getDetail']),
    ...secretUtils.mapActions(['getYaml']),
    ...secretUtils.mapActions(['updateSecret']),
    ...secretUtils.mapActions(['deleteSecret']),

    ...yamlEditModalMapUtils.mapMutations(['openModal', 'closeModal']), // yaml에디트모달창 열기(yamlEditModal.js)
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    // [수정 버튼] 클릭 시
    async onClickEdit() {
      let text = ''
      // if (this.detailInfo.yaml) {
      //   text = this.detailInfo.yaml
      // } else {
      try {
        const response = await this.getYaml({
          secretIdx: this.secretIdx,
        })
        text = response.data.result
      } catch (error) {
        console.log(error)
      }
      // }

      this.openModal({
        editType: 'update',
        isEncoding: true,
        content: text,
        readOnlyKeys: ['kind', 'metadata.name', 'metadata.namespace'],
        title: 'Edit Secret',
      })
    },

    // [삭제 버튼] 클릭 시
    onClickDelete() {
      this.openConfirm(`${this.detailInfo.name} 을(를) 삭제하시겠습니까?`)
    },

    // [삭제 요청 확인창] 확인 클릭 시
    async onClickDelConfirm() {
      try {
        // 삭제 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.deleteSecret({
          secretIdx: this.secretIdx,
        })

        if (response.status === 200) {
          // 삭제 성공 시
          this.openAlert({ title: '리소스가 삭제 되었습니다.', type: 'info' })

          // 1초 후 리스트 화면으로 이동
          setTimeout(
            () =>
              this.$router.push(`/cluster/detail/${this.clusterIdx}/secret`),
            1000,
          )
        } else {
          // 삭제 실패 시
          this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
        }
      } catch (error) {
        this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
      }
    },

    // [삭제 요청 확인창] 취소 클릭 시
    onClickDelCancel() {},

    // 업데이트 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromEditModal(value) {
      const param = {
        secretIdx: this.secretIdx,
        yaml: value.encodedContent,
      }

      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.updateSecret(param)
        if (response.status === 200) {
          this.openAlert({ title: '리소스가 수정 되었습니다.', type: 'info' })
          this.getDetail({ secretIdx: this.secretIdx })
          this.closeModal()
        } else {
          this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
        }
      } catch (error) {
        this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
      }
    },
  },
}
</script>

<style lang="scss"></style>
