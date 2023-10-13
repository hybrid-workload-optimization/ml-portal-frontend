<template>
  <div class="sp-service-add-approver">
    <div class="approver__search-wrapper">
      <sp-input
        class="approver--search"
        placeholder="사용자 이름을 입력하세요"
        append-icon="mdi-magnify"
        single-line
        outlined
        @input="onInputSearch"
        @enterUp="onSearchUser"
        dense
        hide-details
        v-model="searchName"
      ></sp-input>
    </div>
    <div class="approver__table-wrapper">
      <service-table
        :headers="headers"
        :datas="tableData"
        :search="search"
        :options="options"
        :custom-slot-info="customSlotInfo"
        :selected-items="selectedItems"
        @get-checked-box-item="getCheckedBoxItem"
      >
        <template #userRole_custom="{ item }">
          {{ item.userRole.userRoleName }}
        </template>
      </service-table>
    </div>

    <!-- 기존 cmp 와 다른부분 임시 주석 -->
    <!-- <div class="approver__chips-wrapper">
      <sp-chip
        close
        v-for="(item, index) in selectedItems"
        :key="index"
        close
        outlined
        class="approver__chip"
        @click:close="$emit('click-delete-approver', item)"
      >
        {{ item.userName }}/{{ item.organization }}
      </sp-chip>
    </div> -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import ServiceTable from '@/components/dataTables/DataTable.vue'

const authorityMapUtil = createNamespacedHelpers('authority')

export default {
  components: {
    ServiceTable,
  },
  props: {
    tableData: Array,
    getCheckedBoxItem: Function,
    selectedItems: Array,
  },
  data: () => ({
    search: '',
    headers: [
      {
        text: '이름',
        align: 'center',
        value: 'userName',
        class: 'w-40',
      },
      {
        text: '부서',
        align: 'center',
        value: 'organization',
        class: 'w-30',
      },
      {
        text: '권한',
        align: 'center',
        value: 'userRole',
        class: 'w-30',
      },
    ],
    customSlotInfo: [{ name: 'userRole', slotName: 'userRole' }],
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
      itemKey: 'userId',
    },
    searchName: '',
  }),
  computed: {
    ...authorityMapUtil.mapState(['initUserPopup']),
  },
  watch: {
    initUserPopup() {
      if (this.initUserPopup) {
        this.searchName = ''
        this.search = ''
      }
    },
  },
  methods: {
    onSearchUser(event) {
      this.search = event.target.value
    },
    onInputSearch(value) {
      this.search = value
      if (value === '') {
        this.search = ''
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-service-add-approver {
  $this: 'approver';
  padding: 0 22px;

  .#{$this}__search-wrapper {
    padding: 0 200px;
    padding-top: 26px;
    padding-bottom: 32px;

    .#{$this}--search {
      border-radius: 5px;
      background: #fff;

      .v-input__slot {
        border: thin solid rgba($color: $sp-sky-blue-500, $alpha: 0.5);
      }
      fieldset {
        border: none;
      }
    }
  }
  .#{$this}__table-wrapper {
    width: 100%;

    .v-data-table__wrapper {
      height: 500px;
      @include scroll();
      overflow-y: auto;
    }
  }
  .#{$this}__chips-wrapper {
    width: 100%;
    height: 90px;
    @include scroll();
    overflow-y: auto;
    border: 1px solid red;

    .#{$this}__chip {
      width: 139px;
      margin-bottom: 10px;
      margin-right: 10px;
      .v-chip__content {
        display: block;
        height: auto;
        @include one-line-ellipsis();
      }
    }
  }
}
</style>
