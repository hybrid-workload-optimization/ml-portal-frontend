<template>
  <div class="sp-cluster-log-detail">
    <card-title :titleData="getTitle" :showButtons="false">
      <template #additional-buttons>
        <sp-button
          outlined
          class="close-button title-button"
          @click="moveToList"
          >Close</sp-button
        >
        <sp-button
          v-if="dataDetail.provisioningStatus === 'FAILED'"
          outlined
          class="delete-button title-button"
          @click="onClickDelete"
          >Delete</sp-button
        >
      </template>
    </card-title>

    <div class="sp-cluster-console-layout">
      <div class="cluster-console__title-wrapper">
        <div class="cluster-console__title">{{ getStatus }}</div>
      </div>
      <console
        :accessPath="accessPath"
        :useWebSocket="useWebSocket"
        :style="{ height: '60vh' }"
        resourceType="cluster-log"
      />
    </div>
    <confirm @confirm-modal="onClickDelConfirm" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import CardTitle from '@/components/molcule/CardTitleWithDetail.vue'
import Console from '@/views/cluster/ConsoleForCluster.vue'
import Confirm from '@/components/molcule/Confirm.vue'
import request from '@/lib/request'

const alertMapUtils = createNamespacedHelpers('alert')
const clusterMapUtils = createNamespacedHelpers('cluster')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    CardTitle,
    Console,
    Confirm,
  },
  data() {
    return {
      accessPath: '',
      useWebSocket: false,
    }
  },
  // 컴포넌트 생성 후 호출됨
  async created() {
    const { params } = this.$route
    this.accessPath = `/cluster/log/${params.clusterName}/${params.workJobIdx}`
    if (!this.dataDetail.provisioningStatus) {
      await this.getDataDetail({ clusterIdx: this.$route.params.id })
    }
    if (this.dataDetail.provisioningStatus !== 'STARTED') {
      this.$store.commit(
        'console/setConsoleText',
        this.dataDetail.provisioningLog,
      )
    } else {
      this.$store.commit('console/setConsoleText', '')
      this.useWebSocket = true
    }
  },
  computed: {
    ...clusterMapUtils.mapGetters(['dataDetail']), // 상세
    name() {
      return this.$route.params.clusterName
    },
    isConsole() {
      return this.$route.params.type === 'exec'
    },
    getTitle() {
      return {
        title: this.$route.params.clusterName,
        description: this.$route.query.description,
        date: this.$route.query.date,
        status: this.dataDetail.status,
      }
    },
    getStatus() {
      if (this.dataDetail.provisioningStatus === 'STARTED') {
        return 'Cluster deployment is in progress.'
      }
      if (this.dataDetail.provisioningStatus === 'DELETING') {
        return 'Cluster deletion is in progress.'
      }
      if (this.dataDetail.provisioningStatus === 'SCALE_OUT') {
        return 'Cluster Scale Out이 진행 중입니다.'
      }
      if (this.dataDetail.provisioningStatus === 'SCALE_IN') {
        return 'Cluster Scale In이 진행 중입니다.'
      }
      if (this.dataDetail.provisioningStatus === 'FAILED') {
        return 'Cluster deployment failed.'
      }
      return ''
    },
  },
  methods: {
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    ...clusterMapUtils.mapActions(['getDataDetail']),
    ...confirmMapUtils.mapMutations(['openConfirm']), // confirm 오픈
    moveToList() {
      this.$router.go(-1)
    },
    onClickDelete() {
      this.openConfirm(
        `${this.dataDetail.clusterName} 을(를) 삭제하시겠습니까?`,
      )
    },

    // [삭제 요청 확인창] 확인 클릭 시
    async onClickDelConfirm() {
      try {
        const response = await this.deleteData({
          clusterIdx: this.clusterIdx,
        })

        if (response.status === 200) {
          // 삭제 성공 시
          this.openAlert({ title: '삭제 성공했습니다.', type: 'info' })

          // 1초 후 리스트 화면으로 이동
          setTimeout(() => {
            // this.$router.push('/cluster/list')
            this.$router.go(-1)
          }, 1000)
        } else {
          // 삭제 실패 시
          this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({ title: '삭제 실패했습니다.', type: 'error' })
        console.log(error)
      }
    },
    async onClickDownload() {
      const { params } = this.$route
      const requestParam = {
        clusterId: params.id,
        namespace: params.namespace,
        name: params.name,
      }
      try {
        const response = await request.getPodLogDownloadUsingGET(requestParam)
        this.forceFileDownload(response)
      } catch (errpr) {
        this.openAlert({ title: '다운로드 실패하였습니다.', type: 'error' })
      }
    },
    forceFileDownload(response) {
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      const contentDisposition = response.headers['content-disposition']
      link.setAttribute(
        'download',
        contentDisposition.split(';').filter(str => str.includes('filename')),
      )
      link.href = URL.createObjectURL(blob)
      document.body.appendChild(link)
      console.log(link)
      link.click()
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-cluster-log-detail {
  .close-button.title-button,
  .download-button.title-button {
    margin-right: 10px;
  }
}

.sp-cluster-console-layout {
  margin-top: 30px;
  margin-bottom: 20px;
  $this: 'cluster-console';

  .#{$this}__title-wrapper {
    height: 60px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 4px;
    .#{$this}__title {
      @include set-text(bold, 16, rgba($color: $sp-title, $alpha: 1));
      margin-left: 10px;
    }
    .#{$this}__image-wrapper {
      .#{$this}__image {
        width: 32px;
        height: 32px;
      }
    }
  }
}
</style>
