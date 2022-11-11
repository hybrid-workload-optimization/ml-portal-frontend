<template>
  <div>
    <v-data-table
      class="sp-data-table"
      :class="{
        'sp-data-table--check': optionsProp['show-select'],
        'is-linked': isLinked,
      }"
      :checkbox-color="optionsProp['checkbox-color']"
      :hide-default-footer="optionsProp['hide-default-footer']"
      :hide-default-header="optionsProp['hide-default-header']"
      :show-select="optionsProp['show-select']"
      :item-key="optionsProp['item-key']"
      :headers="headers"
      :items="datas"
      :search="search"
      :items-per-page="Number(itemsPerPage)"
      :no-data-text="noDataText"
      :page.sync="page"
      @page-count="pageCount = $event"
      v-model="changeSelected"
      @click:btn="onClickButton"
      @click:row="onClickRow"
      fixed-header
    >
      <!-- 글자 수 15글자 넘어가면 말줄임표 및 툴팁 적용 -->
      <template
        v-for="(el, index) in headers"
        v-slot:[`item.${el.value}`]="{ item }"
      >
        <v-tooltip :key="index" bottom :disabled="!isOpenTooltipId">
          <template v-slot:activator="{ on }">
            <span
              v-if="
                `item.${el.text}` !== 'item.Action' ||
                `item.${el.value}` !== 'item.'
              "
              v-on="on"
              :data-id="item.id"
              @mouseover="onMouseOverText"
              @mouseleave="onMouseLeaveText"
            >
              {{ item[el.value] || '-' }}
            </span>
            <span
              v-if="
                `item.${el.text}` === 'item.Action' &&
                `item.${el.value}` === 'item.'
              "
              v-on="on"
              :data-id="item.id"
            >
              <sp-button
                class="list-delete-button"
                @click.stop="onClickButton(item)"
                elevation="0"
                dense
              >
                Delete
              </sp-button>
            </span>
          </template>
        </v-tooltip>
      </template>

      <template
        v-for="info in customSlotInfo"
        v-slot:[`item.${info.slotName}`]="{ item }"
      >
        <slot :name="`${info.name}_custom`" :item="item" />
      </template>
      <template v-if="isCustomBody" v-slot:item="{ item }">
        <slot name="body" :item="item" />
      </template>
    </v-data-table>
    <div
      class="text-center sp-data-table-pagination"
      v-if="!scrollOnly && pageCount !== 0"
    >
      <v-pagination v-model="page" :length="pageCount" circle></v-pagination>
    </div>
  </div>
</template>

<script>
const tag = '[dataTable]'

export default {
  props: {
    headers: {
      type: Array,
      default: () => [],
      description: '테이블 헤더',
    },
    datas: {
      type: Array,
      default: () => [],
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
    options: {
      type: Object,
      default: () => {},
      description: '테이블 옵션',
    },
    customSlotInfo: {
      type: Array,
      default: () => [],
      description: '커스텀 슬롯 정보',
    },
    itemsPerPage: {
      type: Number,
      default: 10,
      description: '한 테이블에 출력될 데이터 갯수',
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
    isLinked: {
      type: Boolean,
      default: false,
      description: '연결할 path 값 유무',
    },
  },
  data: () => ({
    selected: [],
    page: 1,
    pageCount: 0,
    isOpenTooltipId: false,
    paddingWidth: 16,
    noDataText: '표시할 데이터가 존재하지 않습니다.', // 표시할 데이터가 존재하지 않습니다. || 데이터를 가져오고 있습니다.
  }),
  computed: {
    /*
        @brief 옵션 추가하고 싶다면 props로 받아서 추가하는 함수
        @date 2021/11/02
        @return
            - https://vuetifyjs.com/en/api/v-data-table/ 참고
        @param
    */
    optionsProp() {
      console.log(tag, 'optionsProp')
      return {
        'hide-default-footer': true,
        'hide-default-header': this.options.hideHeader,
        dark: this.options.dark,
        dense: this.options.dense,
        'disable-filtering': this.options.disableFiltering,
        'disable-pagination': this.options.disablePagination,
        'disable-sort': this.options.disableSort,
        'fixed-header': this.options.fixedHeader,
        'show-select': this.options.showSelect,
        'item-key': this.options.itemKey,
      }
    },
    changeSelected: {
      /*
        @brief 체크박스 get 함수
        @date 2021/11/02
        @return
            - anonymous: Array(선택자 정보)
        @param
      */
      get() {
        console.log(tag, 'changeSelected/get')

        let selected = []
        if (this.selectedItems?.length) {
          selected = this.selectedItems
        }
        return selected
      },
      /*
        @brief 체크박스 set 함수
        @date 2021/11/02
        @return
        @param
            - item: Array(선택한 row 데이터)
      */
      set(item) {
        console.log(tag, 'changeSelected/set')
        console.log('selected item : ', item)
        this.$emit('get-checked-box-item', item)
        this.selected = item
      },
    },
  },
  mounted() {
    console.log(tag, 'mounted')
  },
  updated() {
    console.log(tag, 'updated', this.datas)
  },
  methods: {
    onClickButton(data) {
      console.log(tag, 'onClickButton')
      this.$emit('click:btn', data)
    },
    onClickRow(data) {
      console.log(tag, 'onClickRow')
      this.$emit('click:row', data)
    },

    onMouseOverText(event) {
      console.log(tag, 'onMouseOverText')
      const spanWidth = event.target.offsetWidth
      const tdWidth =
        event.target.parentElement.offsetWidth - this.paddingWidth * 2

      if (spanWidth > tdWidth) {
        this.isOpenTooltipId = true
      }
    },
    onMouseLeaveText() {
      console.log(tag, 'onMouseLeaveText')
      this.isOpenTooltipId = false
    },

    // 15 글자 넘어가면 말줄임표 추가
    lessenText(text) {
      if (text.length > 15) {
        text = `${text.substr(0, 13)}...`
      }
      return text
    },
    onDataBinding() {
      this.noDataText = '데이터를 가져오고 있습니다.'
    },
    setNoDataText() {
      if (!this.datas.length) {
        this.noDataText = '표시할 데이터가 존재하지 않습니다.'
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.list-delete-button {
  border: 1px solid #036eb8 !important;
  width: 80px !important;
  color: #036eb8 !important;
  border-radius: 5px !important;
  border-width: thin !important;
  font-weight: bold !important;
  z-index: 10000 !important;
}
.sp-data-table-pagination {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.sp-data-table {
  &.is-linked {
    tr {
      cursor: pointer;
    }
  }

  table {
    table-layout: fixed;
  }

  &.sp-data-table--check {
    thead {
      tr {
        th {
          &:first-child {
            width: 10% !important;
            .v-data-table__checkbox {
              text-align: center;
            }
          }
        }
      }
    }
    tbody {
      tr {
        td {
          &:first-child {
            width: 10% !important;
            .v-data-table__checkbox {
              text-align: center;
            }
          }
        }
      }
    }
  }
  .v-data-table__wrapper {
    thead {
      background-color: #cddfeb;
      tr {
        th {
          &.w-0 {
            display: none;
          }
          &.w-5 {
            width: 5%;
          }
          &.w-10 {
            width: 10%;
          }
          &.w-20 {
            width: 20%;
          }
          &.w-25 {
            width: 25%;
          }
          &.w-30 {
            width: 30%;
          }
          &.w-40 {
            width: 40%;
          }
          &.w-50 {
            width: 50%;
          }
          &.w-60 {
            width: 60%;
          }
          &.w-70 {
            width: 70%;
          }
          &.w-80 {
            width: 80%;
          }
          &.w-90 {
            width: 90%;
          }
          &.w-100 {
            width: 100%;
          }
          @include one-line-ellipsis(100%);
          @include set-text(bold, 14, rgba($color: $sp-title, $alpha: 0.8));
          border-bottom: 1px solid rgba($color: #fff, $alpha: 0.3) !important;
          .v-simple-checkbox {
            .v-icon {
              color: $sp-teriary;
            }
          }
        }
      }
    }
    tbody {
      tr {
        &:nth-child(odd) {
          background-color: #fbfbfb;
        }

        &:nth-child(even) {
          background-color: #fff;
        }
        td {
          @include one-line-ellipsis(100%);
          @include set-text(400, 15, rgba($color: #14142b, $alpha: 0.8));
          border-bottom: 1px solid rgba($color: #707070, $alpha: 0.1) !important;
          .v-simple-checkbox {
            .v-icon {
              color: $sp-teriary;
            }
          }
        }
      }
    }
  }
}
</style>
