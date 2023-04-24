<template>
  <div class="sp-project-list">
    <div class="project-list__search-wrapper">
      <search
        class="project-list__search"
        :title="searchTitle"
        :todoCount="totalCount"
        :search="search"
        :isDisabled="currentMenuInfo.writableYn !== 'Y'"
        @input="onChangeSearch"
        :buttonText="'New Cluster'"
        @click="onClickButton"
      />
    </div>
    <div class="project-list__data-table-wrapper" v-if="clusterSize">
      <project-list-table
        :headers="data.headers"
        :datas="data.group"
        :search="search"
        :options="data.options"
        :itemsPerPage="8"
        isCustomBody
        isLinked
      >
        <template v-slot:body="{ item }">
          <tr
            class="project-list__item-wrapper"
            @click="onClickNewWindow(item)"
          >
            <td class="project-list__name-wrapper">
              <div class="project-list__image-title-wrapper">
                <div class="project-list__image-wrapper">
                  <sp-image
                    class="project-list__image"
                    contain
                    :lazySrc="item.img"
                    :src="item.img"
                  />
                </div>
                <div class="project-list__title-wrapper">
                  <div class="project-list__title">{{ item.clusterName }}</div>
                  <div class="project-list__team">
                    {{ item.description }}
                  </div>
                </div>
              </div>
            </td>
            <td class="project-list__state-wrapper">
              <v-tooltip bottom class="project-list__tooltip" color="#F4B740">
                <template v-slot:activator="{ on }">
                  <div
                    v-if="item.status === 'Unhealthy'"
                    class="project-list__state-box"
                    v-on="on"
                  >
                    <div
                      class="project-list__image-wrapper"
                      style="width: 25px"
                    >
                      <sp-image
                        class="project-list__image"
                        contain
                        :lazySrc="setImageState(item.status)"
                        :src="setImageState(item.status)"
                      />
                    </div>
                    <label :class="item.state">{{ item.status }}</label>
                  </div>
                  <div v-else class="project-list__state-box">
                    <div
                      class="project-list__image-wrapper"
                      style="width: 25px"
                    >
                      <sp-image
                        class="project-list__image"
                        contain
                        :lazySrc="setImageState(item.status)"
                        :src="setImageState(item.status)"
                      />
                    </div>
                    <label :class="item.state">{{ item.status }}</label>
                  </div>
                </template>
                <ul class="problem-list">
                  <li v-for="(data, idx) in item.problem" :key="idx">
                    {{ data }}
                  </li>
                </ul>
              </v-tooltip>
            </td>
            <td class="project-list__language-wrapper">
              <label>Node</label>
              <div class="project-list__title">{{ item.nodeCount }}</div>
            </td>
            <td class="project-list__provider-wrapper">
              <label v-if="item.provider">Provider</label>
              <div class="project-list__title">{{ item.provider }}</div>
            </td>
            <td class="project-list__version-wrapper">
              <label>Version</label>
              <div class="project-list__title">{{ item.providerVersion }}</div>
            </td>
            <td class="project-list__createdAt-wrapper">
              <label>Created</label>
              <div class="project-list__title">{{ item.createdAt }}</div>
            </td>

            <td class="project-list__icon-wrapper">
              <div class="project-list__icon_div-wrapper">
                <!-- <sp-image
                  class="sp-full-menu__new_window-image"
                  contain
                  lazySrc="icon_new_window.png"
                  src="icon_new_window.png"
                  @click="onClickNewWindow(item)"
                /> -->

                <sp-image
                  class="sp-full-menu__icon_delete-image"
                  contain
                  lazySrc="icon_delete.png"
                  src="icon_delete.png"
                  @click="onClickDelete(item, $event)"
                ></sp-image>
                <sp-image
                  class="sp-full-menu__icon_edit-image"
                  contain
                  lazySrc="icon_edit.png"
                  src="icon_edit.png"
                  @click="onClickEdit(item, $event)"
                ></sp-image>
              </div>
            </td>

            <!-- <td class="project-list__button-wrapper">
              <sp-button
                @click="onClickDelete(item)"
                class="project-list--delete"
                elevation="0"
                dense
              >
                Delete
              </sp-button>
            </td> -->
          </tr>
        </template>
      </project-list-table>
    </div>
    <!-- 조회 내용이 존재하지 않을 때, 내용 표시(optionl) -->
    <empty
      v-else-if="!isLoading"
      title="Cluster does not exist."
      description="Click the 'New Cluster' button to add a cluster."
    />
  </div>
</template>

<script>
import Search from '@/components/molcule/DataTableSearch.vue'
import ProjectListTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import { createNamespacedHelpers } from 'vuex'

const clusterMapUtils = createNamespacedHelpers('cluster')
const projectMapUtils = createNamespacedHelpers('project')
const loginUserMapUtils = createNamespacedHelpers('loginUser')

const tag = '[sp-project-cluster]'

export default {
  components: {
    Search,
    ProjectListTable,
    Empty,
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
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...clusterMapUtils.mapGetters(['dataListSize']),
    ...projectMapUtils.mapGetters(['clusterSize']),
    ...loginUserMapUtils.mapState(['currentMenuInfo']),
    setImageState() {
      // eslint-disable-next-line consistent-return
      return state => {
        switch (state) {
          case 'Deploying':
            return 'icon_loading.gif'
          case 'Unhealthy':
            return 'icon_unhealthy.svg'
          case 'Healthy':
            return 'icon_healthy.svg'
          case 'Fail':
            return 'icon_unhealthy.svg'
          case 'Error':
            return 'icon_unhealthy.svg'
          case 'Waiting':
            return 'icon_waiting.svg'
          case 'Deleting':
            return 'icon_loading.gif'
          case 'Scale in':
            return 'icon_loading.gif'
          case 'Scale out':
            return 'icon_loading.gif'
          default:
            break
        }
      }
    },
  },
  methods: {
    onChangeSearch(value) {
      console.log(tag, 'onChangeSearch')
      this.$emit('input', value)
    },
    onClickDelete(item) {
      console.log(tag, item, 'onClickDelete')
      this.$emit('click-delete', item)
    },
    onClickButton(item) {
      console.log(tag, item, '버튼클릭')
      this.$emit('searchButton', item)
    },
    onClickRow(item) {
      console.log(tag, item, '로우클릭')
      this.$emit('click-row', item)
    },
    onClickNewWindow(item) {
      console.log(tag, item, '새창클릭')
      this.$emit('click-newwindow', item)
    },
    onClickEdit(item, event) {
      console.log(tag, item, '수정클릭')
      this.$emit('click-edit', item)
      event.stopPropagation()
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';

.sp-project-list {
  width: 100%;
  $this: 'project-list';
  .#{$this}__search-wrapper {
    // padding-bottom: 30px;
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
          border: thin solid $sp-teriary;
          border-radius: 18px;
          @include set-text(
            bold,
            15,
            rgba($color: $sp-teriary, $alpha: 1),
            false,
            true
          );
        }
      }

      .#{$this}__tooltip {
        .problem-list {
          background: yellow;
        }
      }

      .#{$this}__createdAt-wrapper {
        width: 15%;
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
        .#{$this}__image-title-wrapper {
          display: flex;
          align-items: center;
          .#{$this}__image-wrapper {
            width: 55px;
            height: 90px;
            border-radius: 150px;
            background-color: transparent;
            // border: 1px solid $box-border;
            display: flex;
            align-items: center;
            justify-content: center;
            .#{$this}__image {
              width: 32px;
              height: 32px;

              &.people {
                width: 25px;
                height: 25px;
              }
            }
          }
          .#{$this}__title-wrapper {
            margin-left: 24px;
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
      height: 100px;
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

.sp-full-menu__new_window-image {
  width: 40px;
  height: 30px;
  object-fit: cover;
  float: left;
}

.sp-full-menu__icon_edit-image {
  width: 40px;
  height: 30px;
  object-fit: cover;
  float: right;
}

.sp-full-menu__icon_delete-image {
  width: 40px;
  height: 30px;
  object-fit: cover;
  float: right;
}

.project-list__icon-wrapper {
  width: 8% !important;
}
</style>
