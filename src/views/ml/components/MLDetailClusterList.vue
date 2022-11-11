<template>
  <div class="sp-project-detail-list">
    <div class="cluster-list__search-wrapper">
      <search
        class="cluster-list__search"
        :title="searchTitle"
        :todoCount="totalCount"
        :search="search"
        @input="onChangeSearch"
      />
    </div>
    <div class="cluster-list__data-table-wrapper">
      <cluster-list-table
        ref="spTable"
        :datas="data.group"
        :search="search"
        :options="options"
        :itemsPerPage="5"
        isCustomBody
      >
        <template v-slot:body="{ item }">
          <tr class="cluster-list__item-wrapper">
            <td class="cluster-list__name-wrapper">
              <div class="cluster-list__image-title-wrapper">
                <div
                  v-if="item.provisioningType"
                  class="cluster-list__image-wrapper"
                >
                  <sp-image
                    class="cluster-list__image"
                    contain
                    :lazySrc="setImgProvisioning(item.provisioningType)"
                    :src="setImgProvisioning(item.provisioningType)"
                  />
                </div>
                <div
                  v-if="item.clusterName"
                  class="cluster-list__title-wrapper"
                  @click="onClickClusterDetail(item)"
                >
                  <div class="cluster-list__title">{{ item.clusterName }}</div>
                  <div class="cluster-list__team">
                    {{ item.description }}
                  </div>
                </div>
                <div
                  v-if="item.userName"
                  class="cluster-list__title-wrapper"
                  @click="onClickMemberDetail(item)"
                >
                  <div class="cluster-list__title">
                    {{ item.userName }}({{ item.email }})
                  </div>
                  <div class="cluster-list__team">
                    {{ item.organization }}
                  </div>
                </div>
              </div>
            </td>
            <td class="cluster-list__provider-wrapper">
              <!--  -->
              <template>
                <div
                  v-if="item.status === 'Unhealthy'"
                  class="cluster-list__state-box"
                >
                  <div class="cluster-list__image-wrapper" style="width: 25px">
                    <sp-image
                      class="cluster-list__image"
                      contain
                      :lazySrc="setImageState(item.status)"
                      :src="setImageState(item.status)"
                    />
                  </div>
                  <label :class="item.state" class="statusLabel">{{
                    item.status
                  }}</label>
                </div>
                <div v-else class="cluster-list__state-box">
                  <div class="cluster-list__image-wrapper" style="width: 25px">
                    <sp-image
                      class="cluster-list__image"
                      contain
                      :lazySrc="setImageState(item.status)"
                      :src="setImageState(item.status)"
                    />
                  </div>
                  <label
                    v-if="item.status"
                    :class="item.status"
                    class="statusLabel"
                    >{{ item.status }}</label
                  >
                  <label
                    v-if="!item.status"
                    :class="item.status"
                    class="statusLabel"
                    >Scale 조정</label
                  >
                </div>
              </template>
            </td>
            <td class="cluster-list__nodepool-wrapper">
              <label v-if="item.vmType">NodePool</label>
              <div
                v-if="item.vmType && item.status"
                class="cluster-list__title"
              >
                {{ item.vmType }} ({{ item.nodeCount }})
              </div>
              <div v-else class="cluster-list__title">
                {{ item.vmType }} (?)
              </div>
            </td>
            <td class="cluster-list__provider-wrapper">
              <label v-if="item.provider">Provider</label>
              <div v-if="item.provider" class="cluster-list__title">
                {{ item.provider }}
              </div>
            </td>
            <td class="cluster-list__version-wrapper">
              <label v-if="item.providerVersion">Version</label>
              <div v-if="item.providerVersion" class="cluster-list__title">
                {{ item.providerVersion }}
              </div>
            </td>
            <td class="cluster-list__added-wrapper">
              <label v-if="item.createdAt">Added</label>
              <div v-if="item.createdAt" class="cluster-list__title">
                {{ item.createdAt }}
              </div>
            </td>
            <td class="cluster-list__button-wrapper">
              <sp-button
                @click="onClickEdit(item)"
                class="cluster-list--edit"
                elevation="0"
                dense
              >
                Edit
              </sp-button>
            </td>
          </tr>
        </template>
      </cluster-list-table>
    </div>

    <modal
      class="popup-cluster"
      title-name="Cluster 조정"
      modal-width="450"
      :dialog="isOpenEditScaleModal"
      @close-modal="onClickCloseLabelModal"
    >
      <template v-slot:content>
        <clusterscale-popup
          @closePopup="onClickCloseLabelModal"
          :item="vmData"
        />
      </template>
    </modal>

    <!-- 삭제 요청 확인 창 -->
    <!-- <confirm @confirm-modal="onClickDelConfirm" /> -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Search from '@/components/molcule/DataTableSearch.vue'
import ClusterListTable from '@/components/dataTables/DataTable.vue'
import encrypt from '@/lib/encrypt'
import Modal from '@/components/modals/Modal.vue'
import ClusterscalePopup from '@/views/ml/popup/MLClusterScalePopup.vue'

const mlMapUtils = createNamespacedHelpers('ml')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')
const projectMapUtils = createNamespacedHelpers('project')

export default {
  components: {
    Search,
    ClusterListTable,
    ClusterscalePopup,
    Modal,
  },

  props: {
    searchTitle: {
      type: String,
      default: '',
      description: 'Search title',
    },
    totalCount: {
      type: String,
      default: '0',
      description: 'totalCount',
    },
    data: {
      type: Object,
      default: () => {},
      description: 'data',
    },
    search: {
      type: String,
      default: '',
      description: 'Search data',
    },
    isAuth: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      vmData: {},
      options: {
        hideFooter: true,
        hideHeader: true,
        dark: false,
        dense: false,
        disableFiltering: false,
        disablePagination: false,
        disableSort: false,
        fixedHeader: false,
        showSelect: false,
        itemKey: 'id',
      },

      // // searchValue: '',
      // projectIdx: null,
      // clusterIdx: null,
      // userId: null,
      // job: null,
    }
  },

  created() {},
  mounted() {},
  updated() {},

  computed: {
    ...mlMapUtils.mapGetters(['detailInfo']),
    ...mlMapUtils.mapGetters(['isOpenEditScaleModal']),
    ...projectMapUtils.mapGetters(['dataUserMenuList']),
  },

  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...confirmMapUtils.mapMutations(['openConfirm']),
    ...mlMapUtils.mapMutations(['openEditScaleModal', 'closeEditScaleModal']),

    setImgProvisioning(value) {
      if (value.toLowerCase() === 'aks') {
        return 'icon_aks.svg'
      }
      if (value.toLowerCase() === 'gke') {
        return 'icon_gke.svg'
      }
      if (value.toLowerCase() === 'eks') {
        return 'icon_eks.svg'
      }
      return 'icon_naver.svg'
    },
    setImageState(value) {
      // 클러스터 vm edit 수정후 state가 null로 나옴
      // vmCount 변경이 안됨
      if (value === null) {
        return 'icon_waiting.svg'
      }
      if (value.toLowerCase() === 'healthy') {
        return 'icon_healthy.svg'
      }
      if (value.toLowerCase() === 'unhealthy') {
        return 'icon_unhealthy.svg'
      }
      return 'icon_waiting.svg'
    },

    onChangeSearch(value) {
      this.$emit('input', value)
    },

    onClickEdit(item) {
      this.vmData = item
      this.openEditScaleModal()
    },

    onClickCloseLabelModal() {
      this.closeEditScaleModal()
    },
    onClickDelConfirm() {
      const param = {
        projectIdx: this.projectIdx,
      }
      if (this.job === 'Cluster') {
        param.clusterIdx = this.clusterIdx
        this.deleteCluster(param)
      } else {
        param.userId = this.userId
        this.deleteUser(param)
      }
    },

    async deleteCluster(param) {
      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.deleteProjectCluster(param)
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

    async deleteUser(param) {
      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.deleteProjectUser(param)
        if (response.status === 200) {
          this.openAlert({ title: response.data.message, type: 'info' })
          /* setTimeout(() => {
            this.$router.push('/project/list')
          }, 1000) */
          await this.getDetail({ projectIdx: this.projectIdx }).then(
            await this.getDetailUserList({
              projectIdx: this.projectIdx,
            }),
          )
        } else {
          this.openAlert({ title: response.data.message, type: 'error' })
        }
      } catch (error) {
        this.openAlert({
          title: 'Member를 삭제하지 못했습니다.',
          type: 'error',
        })
      }
    },

    onClickClusterDetail(data) {
      // const authority = 'Y'
      let authority = 'N'

      const menuList = this.dataUserMenuList
      for (const menu of menuList) {
        if (menu.menuName === 'User') {
          if (menu.writableYn === 'Y') {
            authority = 'Y'
          } else if (menu.viewableYn === 'Y') {
            authority = 'Y'
          }
        }
      }

      if (authority === 'Y') {
        if (data.provisioningType === 'KUBESPRAY') {
          if (
            data.provisioningStatus === 'STARTED' ||
            data.provisioningStatus === 'FAILED'
          ) {
            this.$router.push(
              `/cluster/provisioning/${data.id}/${data.provisioningStatus}`,
            )
          } else if (data.provisioningStatus === 'FINISHED') {
            this.$router.push(`/cluster/detail/${data.id}`)
          } else {
            this.openAlert({ title: '배포중입니다.', type: 'info' })
          }
        } else {
          this.$router.push(`/cluster/detail/${data.id}`)
        }
      } else {
        this.openAlert({ title: '접근권한이 없습니다.', type: 'error' })
      }
    },

    onClickMemberDetail(data) {
      let authority = 'N'

      const menuList = this.dataUserMenuList
      for (const menu of menuList) {
        if (menu.menuName === 'User') {
          if (menu.writableYn === 'Y') {
            authority = 'Y'
          } else if (menu.viewableYn === 'Y') {
            authority = 'Y'
          }
        }
      }

      if (authority === 'Y') {
        const id = encodeURIComponent(encrypt.encrypt(data.id))
        if (id) {
          this.$router.push(`/setting/user/detail/${id}`)
        }
      } else {
        this.openAlert({ title: '접근권한이 없습니다.', type: 'error' })
      }
    },

    getUserRoleIdx(userRoleCode) {
      let result = 0
      const roleList = this.dataUserRoleAllList
      for (const role of roleList) {
        if (role.userRoleCode === userRoleCode) {
          result = role.userRoleIdx
          break
        }
      }

      return result
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';

.project-layout__member-list {
  $this: 'cluster-list';
  .#{$this}__state-wrapper,
  .#{$this}__language-wrapper,
  .#{$this}__role-wrapper,
  .#{$this}__provider-wrapper,
  .#{$this}__createdAt-wrapper,
  .#{$this}__version-wrapper,
  .#{$this}__nodepool-wrapper,
  .#{$this}__added-wrapper,
  .#{$this}__button-wrapper {
    width: 15% !important;
    @include desktop-small(580px, 1750px) {
      width: 9%;
    }
  }
}

.sp-project-detail-list {
  width: 100%;
  $this: 'cluster-list';
  .#{$this}__search-wrapper {
    padding-bottom: 5px;
    @include set-text(normal, 15, rgba($color: $sp-title, $alpha: 1));
    .#{$this}__search {
      .search-wrapper {
        width: 30%;
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
      width: 110%;

      .#{$this}__state-wrapper,
      .#{$this}__language-wrapper,
      .#{$this}__role-wrapper,
      .#{$this}__provider-wrapper,
      .#{$this}__button-wrapper,
      .#{$this}__createdAt-wrapper,
      .#{$this}__version-wrapper,
      .#{$this}__nodepool-wrapper,
      .#{$this}__added-wrapper,
      .#{$this}__button-wrapper {
        width: 10%;
        @include desktop-small(580px, 1750px) {
          width: 12%;
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
        .#{$this}--edit {
          width: 108px;
          @include desktop-small(580px, 1750px) {
            width: 100px;
          }
          border: thin solid $sp-teriary;
          border-radius: 5px;
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
        @include desktop-small(580px, 1366px) {
          font-size: toRem(13);
        }
      }
      label {
        @include set-text(
          500,
          14,
          rgba($color: $sp-title, $alpha: 0.5),
          false,
          true
        );
      }

      .#{$this}__name-wrapper {
        width: 30%;
        @include desktop-small(580px, 1750px) {
          width: 40%;
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
            width: 55px;
            height: 70px;
            border-radius: 150px;
            background-color: transparent;
            // border: 1px solid $box-border;
            display: flex;
            align-items: center;
            justify-content: center;
            .#{$this}__image {
              width: 32px;
              height: 32px;
            }
          }
          .#{$this}__title-wrapper {
            margin-left: 24px;

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

            cursor: pointer;
          }
        }
      }
      // .ml-status__image {
      //   width: 45px;
      //   height: 45px;
      //   margin-right: 10px;
      //   float: left;
      // }
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

  .cluster-list__state-box {
    display: flex;
  }
}
</style>
