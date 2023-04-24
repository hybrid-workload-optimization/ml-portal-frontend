<template>
  <div class="sp-box-layout">
    <cluster-designed-list
      searchTitle="Cluster"
      :totalCount="String(clusterSize)"
      :data="setList"
      :search="searchValue"
      :isLoading="isLoading"
      @input="onInputSearchValue"
      @searchButton="onClickButton"
      @click-row="moveToDetailPage"
      @click-newwindow="moveToDetailPageNewWindow"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    />

    <!-- 팝업창 부분 -->
    <!-- <modal
      class="cluster-popup"
      title-name="Cluster Resource"
      modal-width="1600"
      modal-height="1360"
      :dialog="isOpenPopup"
      @close-modal="onClickCloseModal"
    >
      <template v-slot:content>
        <cluster-detail :clusterId="clusterId" />
      </template>
    </modal> -->

    <!-- 삭제 요청 확인 창 -->
    <confirm @confirm-modal="onClickDelConfirm" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import ClusterDesignedList from '@/views/project/cluster/components/ClusterDesignedList.vue'
import Confirm from '@/components/molcule/Confirm.vue'

// store > cluster > cluster.js
const clusterMapUtils = createNamespacedHelpers('cluster')
const alertMapUtils = createNamespacedHelpers('alert')
const projectMapUtils = createNamespacedHelpers('project')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    ClusterDesignedList,
    Confirm,
  },
  data() {
    return {
      projectIdx: null,
      searchValue: '',
      clusterIdx: null,
      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
      headers: [
        {
          text: '',
          align: 'center',
          value: 'clusterName',
          class: 'w-50',
        },
        {
          text: '',
          align: 'center',
          value: 'status',
          class: 'w-10',
        },
        {
          text: '',
          align: 'center',
          value: 'nodeCount',
          class: 'w-10',
        },
        {
          text: '',
          align: 'center',
          value: 'provider',
          class: 'w-10',
        },
        {
          text: '',
          align: 'center',
          value: 'providerVersion',
          class: 'w-10',
        },
        {
          text: '',
          align: 'center',
          value: 'createdAt',
          class: 'w-10',
        },
      ],
      // 그리드 설정 값
      options: {
        hideFooter: true,
        hideHeader: true,
        dark: false,
        dense: false,
        disableFiltering: false,
        disablePagination: false,
        disableSort: false,
        fixedHeader: true,
        showSelect: false,
        itemKey: 'clusterIdx',
      },
      isLoading: false,
    }
  },

  created() {
    // 믁록 초기화
    this.projectIdx = this.$route.params.id
    this.initDataList()
  },

  computed: {
    ...clusterMapUtils.mapState(['timeoutList']), // 목록
    ...clusterMapUtils.mapGetters(['dataList']), // 목록
    ...clusterMapUtils.mapGetters(['dataListSize']),
    // ...clusterMapUtils.mapGetters(['dataDetail']), // 상세
    // ...clusterMapUtils.mapGetters(['dataForm']), // 등록/수정
    ...projectMapUtils.mapGetters(['dataDetailClusterList', 'clusterSize']),

    todoCount() {
      if (this.clusterSize) {
        return this.clusterSize.toString()
      }
      return '0'
    },
    setList() {
      return {
        headers: this.headers,
        options: this.options,
        // group: this.dataList,
        group: this.dataDetailClusterList,
      }
    },
  },

  async mounted() {
    this.isLoading = true
    // 5분마다 재호출
    // await this.getDataList()
    await this.getDetailClusterList({ projectIdx: this.projectIdx })
    // 배포중인 클러스터의 데이터를 5분마다 주기적으로 재 호출
    this.startInterval()
    this.isLoading = false
  },

  methods: {
    ...clusterMapUtils.mapActions(['getDataList', 'getDataStatus']),
    ...clusterMapUtils.mapMutations(['initDataList', 'initTimeoutList']),
    ...projectMapUtils.mapActions(['getDetailClusterList']),
    ...projectMapUtils.mapActions(['deleteProjectCluster']),
    ...projectMapUtils.mapActions(['getDetail']),
    ...projectMapUtils.mapActions(['getDetailClusterList']),
    ...alertMapUtils.mapMutations(['openAlert']),
    ...confirmMapUtils.mapMutations(['openConfirm']),

    startInterval() {
      if (this.dataDetailClusterList.length) {
        this.dataDetailClusterList.forEach(item => {
          if (
            ['STARTED', 'FAILED', 'DELETING', 'SCALE_OUT', 'SCALE_IN'].includes(
              item.provisioningStatus,
            )
          ) {
            this.getDataStatus({
              params: { clusterIdx: item.clusterIdx },
              type: 'list',
            })
          }
        })
      }
    },

    // 서치 박스의 버튼 클릭 시 호출됨
    onClickButton() {
      this.$router.push(`/project/detail/${this.projectIdx}/cluster/new`)
    },
    // 서치 박스 입력값 변경 시 호출됨
    onInputSearchValue(value) {
      console.log('searchValue:', value)
      this.searchValue = value
    },

    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      console.log('data', data)
      console.log(data.provisioningType)
      this.clusterIdx = data.id

      if (
        ['KUBESPRAY', 'AKS', 'GKE', 'EKS', 'NKS'].includes(
          data.provisioningType,
        )
      ) {
        if (
          ['STARTED', 'FAILED', 'DELETING', 'SCALE_OUT', 'SCALE_IN'].includes(
            data.provisioningStatus,
          )
        ) {
          this.$router.push(
            `/cluster/provisioning/${this.clusterIdx}/${data.provisioningStatus}`,
          )
        } else if (data.provisioningStatus === 'FINISHED') {
          this.$router.push({
            path: `/cluster/detail/${this.clusterIdx}/Overview`,
            query: { projectIdx: this.projectIdx },
          })
        } else if (data.provisioningStatus === 'READY') {
          // 배포 대기 중
          this.openAlert({
            title: '클러스터 배포 대기 중 입니다.',
            type: 'info',
          })
        }
      } else {
        this.$router.push({
          path: `/cluster/detail/${this.clusterIdx}/Overview`,
          query: { projectIdx: this.projectIdx },
        })
      }
    },
    // 새탭으로 이동
    moveToDetailPageNewWindow(data) {
      console.log('data', data)
      console.log(data.provisioningType)
      this.clusterIdx = data.id

      if (
        ['KUBESPRAY', 'AKS', 'GKE', 'EKS', 'NKS'].includes(
          data.provisioningType,
        )
      ) {
        if (
          ['STARTED', 'FAILED', 'DELETING', 'SCALE_OUT', 'SCALE_IN'].includes(
            data.provisioningStatus,
          )
        ) {
          this.$router.push(
            `/cluster/provisioning/${data.clusterIdx}/${data.provisioningStatus}`,
          )
        } else if (data.provisioningStatus === 'FINISHED') {
          const baseUrl = process.env.BASE_URL
          const routeData = this.$router.resolve({
            path: `${baseUrl}cluster/detail/${this.clusterIdx}`,
            hash: '#Overview',
          })
          window.open(routeData.href)
          // this.isOpenPopup = true
        } else if (data.provisioningStatus === 'READY') {
          // 배포 대기 중
          this.openAlert({
            title: '클러스터 배포 대기 중 입니다.',
            type: 'info',
          })
        }
      } else {
        const baseUrl = process.env.BASE_URL
        const routeData = this.$router.resolve({
          path: `${baseUrl}cluster/detail/${this.clusterIdx}`,
          hash: '#Overview',
        })
        window.open(routeData.href)
        // this.isOpenPopup = true
      }
    },
    // onClickCloseModal() {
    //   if (this.$route.query.detail) {
    //     this.$router.replace({
    //       path: `/project/detail/${this.projectIdx}`,
    //     })
    //   }
    //   this.isOpenPopup = false
    // },

    // [수정 버튼] 클릭 시
    onClickEdit(item) {
      this.clusterIdx = item.id
      this.$router.push(
        `/project/detail/${this.projectIdx}/cluster/edit/${this.clusterIdx}`,
      )
    },
    onClickDelete(item) {
      console.log('delete click', item)
      // this.clusterIdx = null
      // if (item.job === 'Cluster') {
      //   this.openConfirm('이 클러스터를 삭제 하시겠습니까?')
      //   this.clusterIdx = item.id
      // }
      // this.job = item.job
    },
    onClickDelConfirm() {
      const param = {
        projectIdx: this.projectIdx,
      }
      if (this.job === 'Cluster') {
        param.clusterIdx = this.clusterIdx
        this.deleteCluster(param)
      }
    },
    async deleteCluster(param) {
      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.deleteProjectCluster(param)
        console.log('response === ', response)
        if (response.status === 200) {
          this.openAlert({ title: response.data.message, type: 'info' })
          /* setTimeout(() => {
            this.$router.push('/project/list')
          }, 1000) */
          await this.getDetail({ projectIdx: this.projectIdx }).then(
            await this.getDetailClusterList({
              projectIdx: this.projectIdx,
            }),
          )
        } else {
          this.openAlert({ title: response.data.message, type: 'error' })
        }
      } catch (error) {
        this.openAlert({
          title: 'Cluster를 삭제하지 못했습니다.',
          type: 'error',
        })
      }
    },
  },
  beforeDestroy() {
    this.timeoutList.forEach(idx => clearTimeout(idx))
    this.initTimeoutList()
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';

.authority-page__content-info {
  height: 1100px;
  overflow-y: auto;
  @include scroll();
  padding: 15px 15px;
}

.sp-project-list {
  width: 100%;
  $this: 'project-list';
  .#{$this}__search-wrapper {
    padding-bottom: 5px;
    @include set-text(normal, 15, rgba($color: $sp-title, $alpha: 1));
    .#{$this}__search {
      .search-wrapper {
        width: 40%;
      }
      .v-input__slot {
        fieldset {
          border-radius: 25px;
        }
      }
    }
  }
  .#{$this}__data-table-wrapper {
    width: 100%;

    .#{$this}__item-wrapper {
      width: 100%;

      .#{$this}__state-wrapper,
      .#{$this}__language-wrapper,
      .#{$this}__role-wrapper,
      .#{$this}__provider-wrapper,
      .#{$this}__button-wrapper,
      .#{$this}__createdAt-wrapper,
      .#{$this}__version-wrapper {
        width: 10%;

        .#{$this}__state-box {
          display: flex;
          align-items: center;
          .#{$this}__image-wrapper {
            width: 26px;
            margin-right: 14px;
          }
        }
        @include desktop-small(580px, 1750px) {
          width: 9%;
        }
        text-align: center;
        .#{$this}__title {
          @include set-text(
            500,
            15,
            rgba($color: $sp-title, $alpha: 1),
            false,
            true
          );
        }
        .#{$this}--delete {
          width: 108px;
          @include desktop-small(580px, 1750px) {
            width: 100px;
          }
          border: thin solid $sp-teriary;
          border-radius: 18px;
          @include set-text(
            bold,
            15,
            rgba($color: $sp-teriary, $alpha: 1),
            false,
            false
          );
        }
      }
      .#{$this}__button-wrapper {
      }

      label {
        @include set-text(
          500,
          14,
          rgba($color: $sp-title, $alpha: 0.5),
          false,
          true
        );
        &.Unhealthy {
          color: $sp-danger;
        }
        &.Healthy {
          color: $sp-success;
        }
      }

      .#{$this}__name-wrapper {
        width: 30%;
        @include desktop-small(580px, 1750px) {
          width: 15%;
        }
        .#{$this}__image-title-wrapper {
          display: flex;
          align-items: center;
          @include desktop-small {
            padding: 0 15px;
          }
          // justify-content: center;
          // padding: 0 50px;
          .#{$this}__image-wrapper {
            min-width: 90px;
            width: 90px;
            height: 70px;
            border-radius: 150px;
            background-color: transparent;
            // border: 1px solid $box-border;
            display: flex;
            align-items: center;
            justify-content: center;
            @include desktop-small {
              min-width: 50px;
              width: 50px;
            }
            .#{$this}__image {
              width: 32px;
              height: 32px;
            }
          }
          .#{$this}__title-wrapper {
            // margin-left: 24px;

            @include desktop-small {
              margin-left: 24px;
            }
            .#{$this}__title {
              @include set-text(
                bold,
                24,
                rgba($color: $sp-title, $alpha: 1),
                false,
                true
              );
            }

            .#{$this}__team {
              @include set-text(
                light,
                11,
                rgba($color: $sp-sky-blue-500, $alpha: 0.75),
                false,
                true
              );
            }
          }
        }
      }
    }

    table {
      border-spacing: 0 16px;
    }

    tr:nth-child(even),
    tr:nth-child(odd) {
      background-color: #f1f4f680 !important;
      height: 75px;
    }

    .theme--light.v-data-table
      > .v-data-table__wrapper
      > table
      > tbody
      > tr:not(:last-child)
      > td:not(.v-data-table__mobile-row),
    .theme--light.v-data-table
      > .v-data-table__wrapper
      > table
      > tbody
      > tr:not(:last-child)
      > th:not(.v-data-table__mobile-row)
      td {
      border-top: 1px solid $sp-box-border;
      border-bottom: 1px solid $sp-box-border !important;
    }

    td:first-child {
      border-left: 1px solid $sp-box-border;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      &:hover {
        border-top-left-radius: 10px !important;
        border-bottom-left-radius: 10px !important;
      }
    }

    td:last-child {
      border-right: 1px solid $sp-box-border;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      &:hover {
        border-top-right-radius: 10px !important;
        border-bottom-right-radius: 10px !important;
      }
    }

    tr:last-child td {
      border-bottom: 1px solid $sp-box-border;
      border-top: 1px solid $sp-box-border;
    }
  }
}
</style>
