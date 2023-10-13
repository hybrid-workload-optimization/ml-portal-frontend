<template>
  <div class="sp-project-list">
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
        :headers="data.headers"
        :datas="data.group"
        :search="search"
        :options="data.options"
        :items-per-page="5"
        isCustomBody
      >
        <template #body="{ item }">
          <tr class="project-list__item-wrapper" @click="onClickRow">
            <td class="project-list__name-wrapper">
              <div class="project-list__image-title-wrapper">
                <div v-if="item.img" class="project-list__image-wrapper">
                  <sp-image
                    class="project-list__image"
                    contain
                    :lazySrc="item.img"
                    :src="item.img"
                  />
                </div>
                <div class="project-list__title-wrapper">
                  <div class="project-list__title">{{ item.name }}</div>
                  <div class="project-list__team">
                    {{ item.department }} / {{ item.team }}
                  </div>
                </div>
              </div>
            </td>
            <td class="project-list__state-wrapper">
              <div class="project-list__state-box">
                <div v-if="item.img" class="project-list__image-wrapper">
                  <sp-image
                    class="project-list__image"
                    contain
                    :lazySrc="setImageState(item.state)"
                    :src="setImageState(item.state)"
                  />
                </div>
                <label :class="item.state">{{ item.state }}</label>
              </div>
            </td>
            <td class="project-list__language-wrapper">
              <label>{{ item.language }}</label>
              <div class="project-list__title">{{ item.serverNumber }}</div>
            </td>
            <td class="project-list__provider-wrapper">
              <label v-if="item.provider">Provider</label>
              <div class="project-list__title">{{ item.provider }}</div>
            </td>
            <td class="project-list__version-wrapper">
              <label v-if="item.version">Version</label>
              <div class="project-list__title">{{ item.version }}</div>
            </td>
            <td class="project-list__role-wrapper">
              <span class="project-list__title">{{ item.role }}</span>
            </td>
            <td class="project-list__createdAt-wrapper">
              <label>Added</label>
              <div class="project-list__title">{{ item.createdAt }}</div>
            </td>
            <td class="project-list__button-wrapper">
              <sp-button
                @click="onClickDelete(item)"
                class="project-list--delete"
                elevation="0"
                dense
              >
                Delete
              </sp-button>
            </td>
          </tr>
        </template>
      </project-list-table>
    </div>
  </div>
</template>

<script>
import Search from '@/components/molcule/DataTableSearch.vue'
import ProjectListTable from '@/components/dataTables/DataTable.vue'

const tag = '[sp-project-cluster]'

export default {
  components: {
    Search,
    ProjectListTable,
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
  },
  computed: {
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
      this.$emit('click', item)
    },
    onClickRow(item) {
      console.log(tag, item, 'onClickRow')
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
            width: 90px;
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
