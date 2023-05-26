<template>
  <div class="sp-cluster-storage-class-detail">
    <div class="title-wrapper">
      <h2 class="title-left">{{ detailInfo.name }}</h2>
      <div class="title-right">
        <sp-button outlined class="list-button title-button" @click="moveList()"
          >List</sp-button
        >
        <template v-if="isProjectAuth">
          <sp-button
            outlined
            class="edit-button title-button"
            @click="onClickEdit"
            >Edit</sp-button
          >
          <sp-button
            outlined
            class="delete-button title-button"
            @click="onClickDelete"
            >Delete</sp-button
          >
        </template>
      </div>
    </div>
    <div class="sp-detail-wrapper">
      <div class="sp-detail-metadata">
        <div class="title-wrapper">
          <span class="title-text">Metadata</span>
        </div>
        <div class="content-wrapper">
          <!-- Name -->
          <label-with-text name="Name" :value="detailInfo.name" horizontal />

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

          <!-- Annotations -->
          <label-with name="Annotations" horizontal>
            <template v-slot:append-content>
              <sp-chip
                v-for="(value, key) in detailInfo.annotation"
                :key="key + value"
                >{{ `${key}:${getChipText(value)}` }}</sp-chip
              >
            </template>
          </label-with>
        </div>
      </div>
      <div class="sp-detail-metadata">
        <!-- Resource Info -->
        <div class="title-wrapper">
          <span class="title-text">Resource Info</span>
        </div>
        <div class="info-table">
          <template v-for="(head, index) in resourceInfoTitle">
            <label-with :name="head.text" :key="index">
              <template v-slot:append-content>
                {{ resourceInfo[head.value] || '-' }}
              </template>
            </label-with>
          </template>
        </div>
        <div class="sp-detail-metadata">
          <!-- Persistent Volume -->
          <div class="title-wrapper">
            <span class="title-text">Persistent Volume</span>
          </div>
          <div class="scrollable-table-wrapper">
            <sp-table
              :headers="pvListHeaders"
              :datas="pvList"
              :options="getOptions"
              scroll-only
            />
          </div>
        </div>
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
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWith from '@/components/molcule/LabelWith.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import { checkProjectAuth } from '@/utils/mixins/checkProjectAuth'

const storageClassMapUtils = createNamespacedHelpers('clusterStorageClass')
const yamlEditModalMapUtils = createNamespacedHelpers('yamlEditModal')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')
const tableMapUtils = createNamespacedHelpers('dataTable')
const clusterMapUtils = createNamespacedHelpers('cluster')

export default {
  components: {
    Confirm,
    YamlEditModal,
    LabelWithText,
    LabelWith,
    spTable,
  },
  mixins: [checkProjectAuth],
  data() {
    return {
      StorageClassId: null,
      isEncodingContent: true,
      labelWithClass: {
        titleStyle: {
          fontWeight: 'bold',
          fontSize: '1rem',
          width: '150px',
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
      resourceInfoTitle: [
        { text: 'Provisioner', value: 'provider' },
        { text: 'Type', value: 'type' },
      ],
      pvListHeaders: [
        {
          text: 'Name',
          align: 'center',
          value: 'name',
        },
        {
          text: 'Capacity',
          align: 'center',
          value: 'size',
        },
        {
          text: 'Access Modes',
          align: 'center',
          value: 'accessMode',
        },
        {
          text: 'Reclaim Policy',
          align: 'center',
          value: 'reclaimPolicy',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
        },
        {
          text: 'Claim',
          align: 'center',
          value: 'claim',
        },
        {
          text: 'Age',
          align: 'center',
          value: 'createdAt',
        },
      ],
      clusterIdx: null,
    }
  },
  // 컴포넌트 생성 후 호출됨
  async created() {
    this.clusterIdx = this.$route.params.id
    this.storageClassId = this.$route.params.rid
    await this.getDetail({ id: this.storageClassId })
    this.checkProjectAuth()
  },
  computed: {
    ...clusterMapUtils.mapGetters(['dataDetail']),
    ...storageClassMapUtils.mapGetters([
      'detailInfo',
      'resourceInfo',
      'pvList',
    ]), // 상세 정보 데이터 객체 반환(clusterStorageClass.js)
    ...tableMapUtils.mapGetters(['getOptions']), // 상세 정보 데이터 객체 반환(clusterStorageClass.js)
    getChipText() {
      return value => (value.toString().length < 10 ? value : '...')
    },
  },
  methods: {
    ...storageClassMapUtils.mapActions([
      'getDetail',
      'deleteClusterStorageClass',
      'getClusterStorageClassYaml',
      'updateClusterStorageClass',
    ]),

    ...yamlEditModalMapUtils.mapMutations(['openModal', 'initModalContent']), // yaml에디트모달창 열기(yamlEditModal.js)

    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈

    // [수정 버튼] 클릭 시
    async onClickEdit() {
      try {
        const response = await this.getClusterStorageClassYaml({
          id: this.storageClassId,
          name: this.detailInfo.name,
        })
        if (response.status === 200) {
          const text = response.data.result

          // editType: 에디터 타입(create/update)
          // isEncoding: content가 인코딩 되어 있는지 여부
          // content: 에디터에 설정할 텍스트 초기값
          this.openModal({
            editType: 'update',
            isEncoding: true,
            content: text,
            readOnlyKeys: ['metadata.name'],
            title: 'Edit Storage Class',
          })
        } else {
          console.log(response.data.message)
        }
      } catch (error) {
        console.log(error)
      }
    },

    // [삭제 버튼] 클릭 시
    onClickDelete() {
      this.openConfirm(`${this.detailInfo.name} 을(를) 삭제하시겠습니까?`)
    },

    moveList() {
      // this.$router.push({
      //   name: this.$route.name,
      //   hash: '#Storage Class',
      // })
      this.$router.push(`/cluster/detail/${this.clusterIdx}/Storage Class`)
    },

    // [삭제 요청 확인창] 확인 클릭 시
    async onClickDelConfirm() {
      try {
        // 삭제 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        await this.deleteClusterStorageClass({
          id: this.storageClassId,
        })
        this.openAlert({ title: '삭제 성공했습니다.', type: 'info' })

        // 1초 후 리스트 화면으로 이동
        setTimeout(
          () =>
            // this.$router.push({
            //   name: this.$route.name,
            //   hash: '#storageClass',
            // }),
            this.$router.push(
              `/cluster/detail/${this.clusterIdx}/Storage Class`,
            ),
          1000,
        )
      } catch (error) {
        this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
      }
    },

    // [삭제 요청 확인창] 취소 클릭 시
    onClickDelCancel() {},

    // 업데이트 모달 창에서 '확인' 눌렀을 때 호출되는 이벤드 메서드
    async onConfirmedFromEditModal(value) {
      const param = {
        id: this.storageClassId,
        kubeConfigId: this.detailInfo.clusterId,
        yaml: value.encodedContent,
      }
      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        await this.updateClusterStorageClass(param)
        this.openAlert({ title: '업데이트 성공했습니다.', type: 'info' })
        this.getDetail({ id: this.storageClassId })
      } catch (error) {
        this.openAlert({ title: '업데이트 실패했습니다.', type: 'error' })
      }
    },
    movePath() {
      this.$router.push({
        name: this.$route.name,
        hash: '#storageClass',
      })
    },
  },
  beforeDestroy() {
    this.initModalContent()
  },
}
</script>

<style lang="scss">
.sp-cluster-storage-class-detail {
  .title-left {
    color: $sp-title;
    display: inline-block;
    width: 50%;
    vertical-align: middle;
  }

  .title-right {
    width: 50%;
    display: inline-block;
    text-align: right;
    vertical-align: middle;

    .title-button {
      width: 114px;
      color: $sp-teriary;
      border-radius: 5px;
      border-width: thin;
      font-weight: bold;
    }
    .list-button {
      color: $basic-button;
      margin-right: 10px;
    }
    .edit-button {
      margin-right: 10px;
    }
    .icon-button {
      min-width: 40px !important;
      width: 40px;
      margin-right: 10px;
    }
  }
  .sp-detail-wrapper {
    border: 1px solid $input-border;
    padding: 20px;
    border-radius: 5px;
    margin-top: 20px;
    .title-wrapper {
      margin-top: 0;
    }
  }
}
</style>
