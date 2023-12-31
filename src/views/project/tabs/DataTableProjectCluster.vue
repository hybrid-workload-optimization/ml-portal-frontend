<template>
  <div class="sp-clusters">
    <sp-card class="clusters__edit-box" :class="{ added }" elevation="0">
      <div class="clusters__search-box">
        <sp-input
          placeholder="filter by cluster name"
          append-icon="mdi-magnify"
          single-line
          outlined
          v-model="search"
          dense
          hide-details
          class="clusters__search"
        />
      </div>
      <div class="clusters__list-wrapper">
        <service-table
          :headers="headers"
          :datas="data.group"
          :search="search"
          :options="options"
          :selected-items="selectedItems"
          :custom-slot-info="data.customSlotInfo"
          @get-checked-box-item="getCheckedBoxItem"
        >
          <template v-slot:job_custom="{ item }">
            <slot name="job_custom" :item="item"></slot>
          </template>
        </service-table>
      </div>
      <div class="clusters__chips-wrapper">
        <sp-chip
          v-for="(item, index) in selectedItems"
          :key="index"
          close
          outlined
          class="clusters__chips"
          @click:close="$emit('click-delete-clusters', item)"
        >
          {{ item.clusterName }}
        </sp-chip>
      </div>
    </sp-card>
  </div>
</template>

<script>
import ServiceTable from '@/components/dataTables/DataTable.vue'

export default {
  components: {
    ServiceTable,
  },
  props: {
    added: {
      type: Boolean,
      default: false,
      description: '추가 여부 표시',
    },
    data: {
      description: '테이블 데이터',
    },
    selectedItems: {
      type: Array,
      default: () => [],
      description: '선택된 테이블 데이터',
    },
    search: {
      type: String,
      default: undefined,
      description: '검색 값',
    },
    getCheckedBoxItem: {
      type: Function,
      default: () => {},
      description: '선택된 테이블 데이터',
    },
  },
  data() {
    return {
      headers: [
        {
          text: '클러스터명',
          align: 'left',
          value: 'clusterName',
          class: 'w-30',
        },
        {
          text: '설명',
          align: 'left',
          value: 'description',
          class: 'w-70',
        },
      ],
      // 그리드 설정 값
      options: {
        hideFooter: true,
        hideHeader: false,
        dark: false,
        dense: false,
        disableFiltering: false,
        disablePagination: false,
        disableSort: false,
        fixedHeader: false,
        showSelect: true,
        itemKey: 'clusterIdx',
      },
    }
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-clusters {
  width: 100%;
  height: 100%;
  $this: 'clusters';
  .#{$this}__edit-box {
    width: 100%;
    height: 100%;
    border: 1px solid $sp-box-border;
    .card-body {
      padding: 15px;
      height: 100%;
    }
    &.added {
      background-color: $sp-grey-200;
    }
    .#{$this}__search-box {
      height: 35px;
      margin-bottom: 24px;
      .#{$this}__search {
        fieldset {
          border-radius: 5px !important;
          background: #fff;
          border: thin solid rgba($color: $sp-sky-blue-500, $alpha: 0.5);
        }
        .v-icon {
          font-size: toRem(20);
          color: rgba($color: $sp-sky-blue-500, $alpha: 0.5);
        }
      }
    }
    .#{$this}__list-wrapper {
      // max-height: calc(50% - 35px - 24px);
      max-height: 70%;
      overflow-y: auto;
      @include scroll();
    }

    .#{$this}__chips-wrapper {
      padding-top: 17px;
      height: 30%;
      overflow-y: auto;
      @include scroll();
      .#{$this}__chips {
        border: 1px solid $sp-box-border;
        margin-right: 10px;
        margin-bottom: 10px;
        @include set-text(500, 13, rgba($color: $sp-title, $alpha: 1));
        .v-icon {
          color: rgba($color: $sp-title, $alpha: 0.5);
        }
      }
    }
  }
}
</style>
