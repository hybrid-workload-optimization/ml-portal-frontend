<template>
  <div class="sp-cluster-register-page">
    <card-title :titleData="clusterTitle" :showButtons="false"></card-title>
    <!--
    @click-edit="onClickEdit"
    @click-delete="onClickDelete"
    -->

    <input-part
      :editable="isEditMode"
      :editData="editData"
      ref="clusterInfo"
    ></input-part>

    <v-tabs class="sp-cluster-register-page__tabs" v-model="tab" color="#000">
      <v-tabs-slider color="#000"></v-tabs-slider>
      <v-tab v-for="item in tabItems" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items class="sp-cluster-register-page__tab-item" v-model="tab">
      <v-tab-item v-for="item in tabItems" :key="item">
        <new-cluster
          :editable="isEditMode"
          :editData="editData"
          ref="provisioningType"
          v-if="item === 'new cluster' || item === 'nodes'"
        ></new-cluster>
        <import-cluster
          :editable="isEditMode"
          :editData="editData"
          ref="provisioningType"
          v-if="item === 'import cluster' || item === 'kube config'"
        ></import-cluster>
      </v-tab-item>
    </v-tabs-items>
    <div class="button-wrapper">
      <sp-button outlined @click="onCancel" class="button cancel-button"
        >Cancel</sp-button
      >
      <sp-button outlined @click="onSave" class="button save-button"
        >Save</sp-button
      >
    </div>
    <!-- 삭제 요청 확인 창 -->
    <confirm @confirm-modal="onClickCancelConfirm" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import InputPart from '@/views/cluster/components/ClusterRegInputPart.vue'
import NewCluster from '@/views/cluster/components/ClusterRegNewCluster.vue'
import ImportCluster from '@/views/cluster/components/ClusterRegImport.vue'
import Confirm from '@/components/molcule/Confirm.vue'

const tag = '[cluster-form]'

const clusterMapUtils = createNamespacedHelpers('cluster')
const alertMapUtils = createNamespacedHelpers('alert')
const loginUserMapUtils = createNamespacedHelpers('loginUser')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    CardTitle,
    InputPart,
    NewCluster,
    ImportCluster,
    Confirm,
  },
  data: () => ({
    isEditMode: false,
    clusterIdx: null,
    tab: null,
    editData: null,
  }),
  created() {
    this.initDataForm()
    this.clusterIdx = this.$route.params.id

    if (this.clusterIdx) {
      // 수정 모드
      this.isEditMode = true
      this.callDataForm()
    }
    console.log(tag, 'isEditMode=', this.isEditMode)
  },
  mounted() {
    //
  },
  computed: {
    ...clusterMapUtils.mapGetters(['dataForm']), // 등록/수정
    ...loginUserMapUtils.mapState(['currentMenuInfo']),

    clusterTitle() {
      return {
        title: this.isEditMode ? 'Edit Cluster' : 'New Cluster',
      }
    },
    tabItems() {
      return this.isEditMode ? ['nodes'] : ['new cluster', 'import cluster']
    },
  },
  methods: {
    ...clusterMapUtils.mapMutations(['initDataForm']),
    ...clusterMapUtils.mapActions(['getDataForm']),
    ...clusterMapUtils.mapActions(['createData']),
    ...clusterMapUtils.mapActions(['updateData']),

    ...alertMapUtils.mapMutations(['openAlert']),
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    async callDataForm() {
      const response = await this.getDataForm({ clusterIdx: this.clusterIdx })
      const { data } = response
      const { result } = data
      console.log('[getDataForm] response=', result)
      if (result) {
        this.editData = result
        this.tab = result.provisioningType === 'KUBECONFIG' ? 1 : 0
        console.log(tag, 'tab=', this.tab)
      }
    },
    onClickCancelConfirm() {
      if (this.isEditMode) {
        this.$router.push(`/project/detail/${this.clusterIdx}`)
      } else {
        this.$router.push('/project/detail')
      }
    },
    validateSave() {
      console.log(tag, 'validateSave')

      if (!this.$refs.clusterInfo.onSave()) {
        return false
      }
      if (!this.$refs.provisioningType[this.tab].onSave()) {
        return false
      }

      console.log(tag, 'validateSave dataForm=', this.dataForm)
      return true
    },
    onCancel() {
      console.log(tag, 'onCancel')
      const msg = this.isEditMode ? '수정' : '생성'
      this.openConfirm(
        `Cluster ${msg}을 취소하시겠습니까?\n취소 후 이전화면으로 이동합니다.`,
      )
    },
    onSave() {
      if (!this.validateSave()) return
      if (this.isEditMode) {
        this.onSaveByEdit()
      } else {
        this.onSaveByNew()
      }
    },
    async onSaveByNew() {
      try {
        if (this.dataForm.provider === 'Kubernetes') {
          const response = await this.createData(this.dataForm)

          if (response.status === 200) {
            if (this.dataForm.provisioningType === 'KUBESPRAY') {
              this.openAlert({
                title: 'Cluster 등록을 요청하였습니다.',
                type: 'info',
              })
            } else {
              this.openAlert({
                title: 'Cluster 등록 되었습니다.',
                type: 'info',
              })
            }
            setTimeout(() => {
              this.$router.push(`/project/detail/${this.projectIdx}`)
            }, 1000)
          } else {
            this.openAlert({
              title: 'Cluster 등록을 실패했습니다.',
              type: 'error',
            })
            console.log(response.data.message)
          }
        }
      } catch (error) {
        this.openAlert({
          title: 'Cluster 등록을 실패했습니다.',
          type: 'error',
        })
        console.log(error)
      }
    },
    async onSaveByEdit() {
      try {
        const response = await this.updateData(this.dataForm)

        if (response.status === 200) {
          this.openAlert({ title: 'Cluster가 수정 되었습니다.', type: 'info' })
          setTimeout(
            () => this.$router.push(`/project/detail/${this.clusterIdx}`),
            1000,
          )
        } else {
          this.openAlert({
            title: 'Cluster 수정을 실패했습니다.',
            type: 'error',
          })
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({
          title: 'Cluster 수정을 실패했습니다.',
          type: 'errpr',
        })
        console.log(error)
      }
    },
    checkAuth() {
      if (this.currentMenuInfo && this.currentMenuInfo.writableYn !== 'Y') {
        this.$router.go(-1)
      }
    },
  },
  beforeMount() {
    this.checkAuth()
  },
}
</script>

<style lang="scss">
$this: 'sp-cluster-register-page';
.sp-cluster-register-page {
  .#{$this}__tabs {
    padding-top: 20px;
  }
  .button-wrapper {
    padding-right: 15px;
    padding-top: 30px;
    text-align: right;
    .button {
      width: 114px;
      border-radius: 5px;
      border-width: thin;
      font-weight: bold;
    }
    .save-button {
      color: $sp-teriary;
      margin-left: 10px;
    }
  }
}
</style>
