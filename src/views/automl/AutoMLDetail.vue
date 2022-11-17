<template>
  <div class="sp-list-content">
    <div class="list-search-wrapper">
      <search
        class="sp-basic-search"
        :title="'Total:'"
        :todoCount="detailListSize.toString()"
        :isDisabled="currentMenuInfo.writableYn !== 'Y'"
        @change="onSearch"
        @input="onInputSearchValue"
      >
      </search>
    </div>

    <!-- 조회 내용이 존재할 때, 그리드 표시 -->
    <sp-table
      v-if="detailListSize"
      class="table-wrapper"
      is-linked
      :headers="headers"
      :datas="detailList"
      :options="options"
      :search="searchValue"
      @page-count="15"
    />
    <!-- 조회 내용이 존재하지 않을 때, 내용 표시(optionl) -->
    <empty
      v-else-if="!isLoading"
      class="table-wrapper"
      title="Suggestion이 존재하지 않습니다."
      description=""
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Search from '@/components/molcule/DataTableSearch.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'

const automlMapUtils = createNamespacedHelpers('automl')
const loginUserMapUtils = createNamespacedHelpers('loginUser')

export default {
  components: {
    Search,
    spTable,
    Empty,
  },
  data() {
    return {
      dialog: false,

      searchValue: '',

      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
      headers: [
        {
          text: 'Name',
          align: 'left',
          value: 'name',
          class: 'w-20',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
          class: 'w-10',
        },
        {
          text: 'Successful trials',
          align: 'center',
          value: 'successful',
          class: 'w-10',
        },
        {
          text: 'Running trials',
          align: 'center',
          value: 'running',
          class: 'w-10',
        },
        {
          text: 'Failed trials',
          align: 'center',
          value: 'failed',
          class: 'w-10',
        },
        {
          text: 'Optimal trial',
          align: 'center',
          value: 'metric',
          class: 'w-10',
        },
        {
          text: 'Age',
          align: 'center',
          value: 'age',
          class: 'w-20',
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
        fixedHeader: true,
        showSelect: false,
        itemKey: 'id',
      },
      isLoading: false,
    }
  },

  created() {},

  computed: {
    ...automlMapUtils.mapGetters(['detailList', 'detailListSize']),
    ...loginUserMapUtils.mapState(['currentMenuInfo']),
  },

  async mounted() {
    this.isLoading = true
    await this.getDetailData()
    this.isLoading = false
  },

  methods: {
    ...automlMapUtils.mapActions(['getDetail']),

    onInputSearchValue(value) {
      this.searchValue = value
    },

    // 리스트 조회 요청
    async getDetailData() {
      await this.getDetail()
    },

    // Search 박스 입력값 변경 시 호출됨
    onSearch(value) {
      this.searchValue = value
    },
  },
}
</script>
<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-list-content {
  width: 100%;
}
.sp-list-content {
  .sp-basic-search {
    .search-wrapper--button {
      width: 20em;
    }
    .sp-basic-toggle-button {
      padding-right: 10px;
      .sp-basic-toggle--click {
        background-color: #f5f8fbcc;
        border: 1px solid rgba($color: #4b556680, $alpha: 1);
        &.v-item--active {
          background-color: $sp-teriary;
          .v-icon {
            @include set-text(normal, 20, rgba($color: #fff, $alpha: 0.2));
            color: #fff !important;
          }
        }

        .v-icon {
          @include set-text(
            normal,
            20,
            rgba($color: $sp-box-border, $alpha: 1)
          );
          color: $sp-sky-blue-500 !important;
        }
      }
    }
    .search-wrapper {
      width: 50%;
      @include desktop-small {
        width: 60%;
      }
    }
  }
}
</style>
