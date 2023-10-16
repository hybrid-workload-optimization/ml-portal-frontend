<template>
  <div>
    <div class="sp-pod-console-title">
      <div class="title-left">
        <h2 class="card-title">{{ name }}</h2>
      </div>
      <div class="title-right">
        <sp-button
          outlined
          v-if="!isConsole"
          class="download-button title-button"
          @click="onClickDownload"
          >Download</sp-button
        >
        <sp-button
          outlined
          class="close-button title-button"
          @click="moveToDetail"
          >Close</sp-button
        >
      </div>
    </div>

    <div class="sp-console-layout">
      <console
        :accessPath="accessPath"
        :console="isConsole"
        resourceType="pod-log"
      />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Console from '@/components/Console.vue'
import request from '@/lib/request'

const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    Console,
  },
  data() {
    return {
      accessPath: '',
    }
  },
  // 컴포넌트 생성 후 호출됨
  created() {
    const { params } = this.$route
    this.accessPath = `/pod/${params.type}/${params.clusterIdx}/${params.namespace}/${params.name}`
  },
  computed: {
    name() {
      return this.$route.params.name
    },
    isConsole() {
      return this.$route.params.type === 'exec'
    },
  },
  methods: {
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    moveToDetail() {
      this.$router.go(-1)
    },
    async onClickDownload() {
      const { params } = this.$route
      const requestParam = {
        clusterId: params.clusterIdx,
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

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';
.sp-pod-console-title {
  .title-left {
    display: inline-block;
    width: 60%;
    vertical-align: middle;
    .card-title {
      color: $sp-title;
      font-size: toRem(34);
    }
  }
  .title-right {
    width: 40%;
    display: inline-block;
    text-align: right;
    vertical-align: middle;

    .title-button {
      width: 120px;
      color: $sp-teriary;
      border-radius: 5px;
      border-width: thin;
      font-weight: bold;
    }

    .download-button {
      margin-right: 10px;
    }
  }
}

.sp-console-layout {
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>
