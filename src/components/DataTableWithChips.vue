<template>
  <div class="sp-clusters">
    <sp-card class="clusters__edit-box" :class="{ added }" elevation="0">
      <div class="clusters__search-box">
        <sp-input
          placeholder="filter by cluster name"
          append-icon="mdi-magnify"
          single-line
          outlined
          rounded
          v-model="search"
          dense
          hide-details
          class="clusters__search"
        />
      </div>
      <div class="clusters__list-wrapper">
        <service-table
          :headers="data.headers"
          :datas="data.group"
          :search="search"
          :options="data.options"
          :selected-items="selectedItems"
          :items-per-page="itemsPerPage"
          :scroll-only="scrollOnly"
          :custom-slot-info="data.customSlotInfo"
          :isCustomBody="isCustomBody"
          @get-checked-box-item="getCheckedBoxItem"
          @click:row="onClickRow"
        >
          <template #job_custom="{ item }">
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
          {{ item.name }}
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
    onClickRow: {
      type: Function,
      default: () => {},
      description: '테이블 행 클릭 이벤트',
    },
    isCustomBody: {
      type: Boolean,
      default: false,
      description: '커스텀 바디 여부',
    },
    scrollOnly: {
      type: Boolean,
      default: false,
      description:
        'Pagination을 없애고 스크롤로 테이블의 내용을 확인하도록 변경 / rowsPerPage Props는 해당 데이터의 length 값으로 지정',
    },
    itemsPerPage: {
      type: Number,
      default: 10,
      description: '한 테이블에 출력될 데이터 갯수',
    },
  },
  data() {
    return {}
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
          border-radius: 18px;
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
