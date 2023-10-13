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
      </div>
    </div>

    <!-- Resource Info -->
    <div class="sp-detail-metadata resource-info">
      <div class="title-wrapper">
        <span class="title-text">Resource Info</span>
      </div>
      <div class="info-table">
        <label-with :name="'Status'">
          <template #append-content>
            {{ detailInfo.status || '-' }}
          </template>
        </label-with>
        <label-with :name="'Storage Class'">
          <template #append-content>
            {{ detailInfo.storageClass || '-' }}
          </template>
        </label-with>
        <label-with :name="'Access Type'">
          <template #append-content>
            {{ detailInfo.accessType || '-' }}
          </template>
        </label-with>
      </div>
    </div>

    <!-- <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Resource Info</span>
      </div>
      <div class="content-wrapper">

        <label-with-text
          name="Status"
          :value="detailInfo.status"
          horizontal
          readonly
        />


        <label-with-text
          name="Storage Class"
          :value="detailInfo.storageClass"
          horizontal
          readonly
        />


        <label-with-text
          name="Access Type"
          :value="detailInfo.accessType"
          horizontal
          readonly
        />
      </div>
    </div> -->

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
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const pvcMapUtils = createNamespacedHelpers('persistentVolumeClaim')
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
      /* headers: [
        {
          text: 'Name',
          align: 'center',
          value: 'name',
        },
        {
          text: 'Namespace',
          align: 'center',
          value: 'namespace',
        },
        {
          text: 'Label',
          align: 'center',
          value: 'label',
        },
        {
          text: 'Node',
          align: 'center',
          value: 'node',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
        },
        {
          text: 'Created At',
          align: 'center',
          value: 'createAt',
        },
      ], */
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
        itemKey: 'persistentVolumeClaimIdx',
      },
    }
  },

  async created() {
    this.persistentVolumeClaimIdx = this.$route.params.id
    await this.getDetail({
      persistentVolumeClaimIdx: this.persistentVolumeClaimIdx,
    })

    // mixin
    this.checkProjectAuth(this.detailInfo.projectIdx)
  },

  mounted() {},

  computed: {
    ...pvcMapUtils.mapGetters(['detailInfo']),
    titleData() {
      return {
        title: `${this.detailInfo.clusterName} / ${this.detailInfo.name}`,
      }
    },
  },
  methods: {
    ...pvcMapUtils.mapActions(['getDetail']),
    ...pvcMapUtils.mapActions(['getYaml']),
    ...pvcMapUtils.mapActions(['updatePersistentVolumeClaim']),
    ...pvcMapUtils.mapActions(['deletePersistentVolumeClaim']),

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
          persistentVolumeClaimIdx: this.persistentVolumeClaimIdx,
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
        title: 'Edit Persistent Volume Claim',
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
        const response = await this.deletePersistentVolumeClaim({
          persistentVolumeClaimIdx: this.persistentVolumeClaimIdx,
        })

        if (response.status === 200) {
          // 삭제 성공 시
          this.openAlert({ title: '리소스가 삭제 되었습니다.', type: 'info' })

          // 1초 후 리스트 화면으로 이동
          setTimeout(
            () => this.$router.push('/config/persistent-volume-claim/list'),
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
        persistentVolumeClaimIdx: this.persistentVolumeClaimIdx,
        yaml: value.encodedContent,
      }

      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        console.log('request param === ', param)
        const response = await this.updatePersistentVolumeClaim(param)
        if (response.status === 200) {
          this.openAlert({ title: '리소스가 수정 되었습니다.', type: 'info' })
          this.getDetail({
            persistentVolumeClaimIdx: this.persistentVolumeClaimIdx,
          })
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
