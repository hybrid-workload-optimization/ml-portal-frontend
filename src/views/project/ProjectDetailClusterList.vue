<template>
  <div class="sp-project-detail-list">
    <div class="project-list__search-wrapper">
      <search
        class="project-list__search"
        :title="searchTitle"
        :todoCount="totalCount"
        :search="search"
        @input="onChangeSearch"
      />
    </div>
    <div class="project-list__data-table-wrapper">
      <project-list-table
        ref="spTable"
        :headers="headers"
        :datas="data.group"
        :search="search"
        :options="options"
        :itemsPerPage="5"
        isCustomBody
      >
        <template v-slot:body="{ item }">
          <tr class="project-list__item-wrapper">
            <td class="project-list__name-wrapper">
              <div class="project-list__image-title-wrapper">
                <div
                  v-if="item.clusterName"
                  class="project-list__image-wrapper"
                >
                  <sp-image
                    class="project-list__image"
                    contain
                    :lazySrc="item.img"
                    :src="item.img"
                  />
                </div>
                <div
                  v-if="item.clusterName"
                  class="project-list__title-wrapper"
                  @click="onClickClusterDetail(item)"
                >
                  <div class="project-list__title">{{ item.clusterName }}</div>
                  <div class="project-list__team">
                    {{ item.description }}
                  </div>
                </div>
                <div
                  v-if="item.userName"
                  class="project-list__title-wrapper"
                  @click="onClickMemberDetail(item)"
                >
                  <div class="project-list__title">
                    {{ item.userName }}({{ item.email }})
                  </div>
                  <div class="project-list__team">
                    {{ item.organization }}
                  </div>
                </div>
              </div>
            </td>
            <td
              v-if="item.job === 'Cluster'"
              class="project-list__provider-wrapper"
            >
              <label>Node</label>
              <div v-if="item.nodeCount" class="project-list__title">
                {{ item.nodeCount }}
              </div>
              <div v-else class="project-list__title">0</div>
            </td>
            <td class="project-list__version-wrapper">
              <label v-if="item.provider">Provider</label>
              <div v-if="item.provider" class="project-list__title">
                {{ item.provider }}
              </div>
            </td>
            <td class="project-list__role-wrapper">
              <label v-if="item.providerVersion">Version</label>
              <div v-if="item.providerVersion" class="project-list__title">
                {{ item.providerVersion }}
              </div>
              <label v-if="item.userRoleName">Role</label>
              <div v-if="item.userRoleName" class="project-list__title">
                {{ item.userRoleName }}
              </div>
            </td>
            <td class="project-list__createdAt-wrapper">
              <label>Added</label>
              <div class="project-list__title">{{ item.addedAt }}</div>
            </td>
            <td class="project-list__button-wrapper">
              <!-- <sp-button
                @click="onClickDelete(item)"
                class="project-list--delete"
                elevation="0"
                dense
                v-if="isAuth"
              >
                Delete
              </sp-button> -->
            </td>
          </tr>
        </template>
      </project-list-table>
    </div>

    <!-- 삭제 요청 확인 창 -->
    <confirm @confirm-modal="onClickDelConfirm" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Search from '@/components/molcule/DataTableSearch.vue'
import ProjectListTable from '@/components/dataTables/DataTable.vue'
import Confirm from '@/components/molcule/Confirm.vue'
import encrypt from '@/lib/encrypt'

const projectMapUtils = createNamespacedHelpers('project')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    Search,
    ProjectListTable,
    Confirm,
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
      headers: [
        {
          text: '',
          align: 'left',
          value: 'clusterName',
          // class: 'w-30',
        },
        {
          text: '',
          align: 'left',
          value: 'description',
          // class: 'w-30',
        },
        {
          text: '',
          align: 'left',
          value: 'userName',
          // class: 'w-30',
        },
        {
          text: '',
          align: 'left',
          value: 'email',
          // class: 'w-30',
        },
        {
          text: '',
          align: 'left',
          value: 'organization',
          // class: 'w-30',
        },
        {
          text: '',
          align: 'left',
          value: 'provider',
          // class: 'w-40',
        },
        {
          text: '',
          align: 'left',
          value: 'providerVersion',
          // class: 'w-40',
        },
        {
          text: '',
          align: 'left',
          // value: 'projectUserRole',
          value: 'userRoleIdx',
          // class: 'w-40',
        },
        {
          text: '',
          align: 'left',
          // value: 'projectUserRoleNm',
          value: 'userRoleName',
          // class: 'w-40',
        },
        {
          text: '',
          align: 'left',
          value: 'createdAt',
          // class: 'w-40',
        },
      ],
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

      // searchValue: '',
      projectIdx: null,
      clusterIdx: null,
      userId: null,
      job: null,
    }
  },

  async created() {
    this.projectIdx = this.$route.params.id
    await this.getUserMenuList()
  },
  mounted() {
    this.$refs.spTable.onDataBinding()
  },
  updated() {
    this.$refs.spTable.setNoDataText()
  },

  computed: {
    ...projectMapUtils.mapGetters(['dataUserRoleAllList']),
    ...projectMapUtils.mapGetters(['dataUserMenuList']),

    /* searching() {
      if (!this.searchValue) return this.dataList
      const search = this.searchValue.toLowerCase()
      return this.dataList.filter(item => {
        const text = item.projectName.toLowerCase()
        return text.indexOf(search) > -1
      })
    }, */
  },

  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...confirmMapUtils.mapMutations(['openConfirm']),
    ...projectMapUtils.mapActions(['deleteProjectCluster']),
    ...projectMapUtils.mapActions(['deleteProjectUser']),
    ...projectMapUtils.mapActions(['getDetail']),
    ...projectMapUtils.mapActions(['getDetailClusterList']),
    ...projectMapUtils.mapActions(['getDetailUserList']),
    ...projectMapUtils.mapActions(['getUserMenuList']),

    onChangeSearch(value) {
      this.$emit('input', value)
    },

    /* onInputSearchValue(value) {
      this.searchValue = value
    }, */

    onClickDelete(item) {
      this.clusterIdx = null
      this.userId = null

      if (item.job === 'Cluster') {
        this.openConfirm('이 클러스터를 삭제 하시겠습니까?')
        this.clusterIdx = item.id
      } else {
        if (item.userRoleIdx === this.getUserRoleIdx('PROJECT_MANAGER')) {
          this.openAlert({
            title: 'Project Manager는 삭제할 수 없습니다.',
            type: 'error',
          })
          return
        }
        this.openConfirm('이 Member를 삭제 하시겠습니까?')
        this.userId = item.id
      }
      this.job = item.job
    },

    /* async onClickDelConfirm() {
      this.openAlert('삭제 성공')
    }, */

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
  $this: 'project-list';
  .#{$this}__state-wrapper,
  .#{$this}__language-wrapper,
  .#{$this}__role-wrapper,
  .#{$this}__provider-wrapper,
  .#{$this}__createdAt-wrapper,
  .#{$this}__version-wrapper,
  .#{$this}__button-wrapper {
    width: 15% !important;
    @include desktop-small(580px, 1750px) {
      width: 9%;
    }
  }
}

.sp-project-detail-list {
  width: 100%;
  $this: 'project-list';
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
      width: 100%;

      .#{$this}__state-wrapper,
      .#{$this}__language-wrapper,
      .#{$this}__role-wrapper,
      .#{$this}__provider-wrapper,
      .#{$this}__button-wrapper,
      .#{$this}__createdAt-wrapper,
      .#{$this}__version-wrapper,
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
        .#{$this}--delete {
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
        width: 50%;
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
