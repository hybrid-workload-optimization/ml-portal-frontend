<template>
  <div class="sp-table-layout">
    <h1>데이터 테이블 컴포넌트 + ToolTip #21 (완료)</h1>

    <sp-button class="mb-5 blue" @click="onClickUpdateCombo">
      {{ isCombo ? '일반 검색' : '콤보 검색' }}
    </sp-button>
    <div class="search-wrapper">
      <sp-input
        v-if="!isCombo"
        placeholder="검색할 키워드를 입력하세요"
        append-icon="mdi-magnify"
        single-line
        @input="onInputSearch"
        @enterUp="onSearchData"
        :value="search"
        dense
        solo
        flat
        height="35px"
        hide-details
        class="search"
      ></sp-input>
      <!-- 다중 검색 부분 시작 -->
      <v-combobox
        v-if="isCombo"
        v-model="model"
        class="search"
        label="검색할 키워드를 입력하세요"
        placeholder="검색할 키워드를 입력하세요"
        small-chips
        multiple
        height="35px"
        outlined
        single-line
        hide-details="auto"
        :items="items"
        :filter="filter"
        :hide-no-data="!search"
        hide-selected
      >
        <template v-slot:no-data>
          <v-list-item>
            <span class="subheading">Create</span>
            <v-chip :color="`${colors[nonce - 1]} lighten-3`" label small>
              {{ search }}
            </v-chip>
          </v-list-item>
        </template>
        <template v-slot:selection="{ attrs, item, parent, selected }">
          <v-chip
            v-if="item === Object(item)"
            v-bind="attrs"
            :color="`${item.color} lighten-3`"
            :input-value="selected"
            label
            small
          >
            <span class="pr-2">
              {{ item.text }}
            </span>
            <v-icon small @click="parent.selectItem(item)"> $delete </v-icon>
          </v-chip>
        </template>
        <template v-slot:item="{ index, item }">
          <v-text-field
            v-if="editing === item"
            v-model="editing.text"
            autofocus
            flat
            background-color="transparent"
            hide-details
            solo
            @keyup.enter="edit(index, item)"
          ></v-text-field>
          <v-chip v-else :color="`${item.color} lighten-3`" dark label small>
            {{ item.text }}
          </v-chip>
          <v-spacer></v-spacer>
          <v-list-item-action @click.stop>
            <v-btn icon @click.stop.prevent="edit(index, item)">
              <v-icon>{{
                editing !== item ? 'mdi-pencil' : 'mdi-check'
              }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </template>
      </v-combobox>
    </div>
    <!-- 다중 검색 부분 종료 -->

    <service-table
      isLinked
      :headers="dataTable.headers"
      :datas="filteredItems"
      :search="search"
      :options="dataTable.options"
      :custom-slot-info="dataTable.customSlotInfo"
      :items-per-page="10"
    >
      <template v-slot:status_custom="slotProps">
        <sp-chip
          :color="getChipEachColor(slotProps.item.status)"
          class="status-chip"
        >
          {{ slotProps.item.status }}
        </sp-chip>
      </template>
      <template v-slot:management_custom="slotProps">
        <sp-chip outlined class="management-chip">
          {{ slotProps.item.management }}
        </sp-chip>
      </template>
    </service-table>
    <div class="form-layout__description">
      <div>이벤트</div>
      - onChangeSearch: 다중 검색 이벤트 (입력시)
      <br />
      <br />
      <div>값</div>
      - searchChips : 다중 검색 값
      <br />
      - multiData : 다중 검색 데이터
      <br />
      - dataTable.headers : 테이블 헤더
      <br />
      - filteredItems : 테이블 데이터
      <br />
      - dataTable.options : 테이블 옵션
      <br />
      - dataTable.customSlotInfo : 테이블 커스텀 슬롯 정보
      <br />
      <br />
      <div>slot</div>
      - v-slot:${value}_custom : 테이블 커스텀 슬롯을 받아 원하는 UI를 구현할 수
      있음.
      <br />
      - v-slot:footer : 모달 푸터 영역 > 원하는 컴포넌트 삽입
      <br />
    </div>
  </div>
</template>

<script>
import ServiceTable from '@/components/dataTables/DataTable.vue'
import { getChipColor } from '@/lib/dataTable'

const tag = '[TableLayout]'

export default {
  components: {
    ServiceTable,
  },
  data() {
    return {
      /* 다중 검색에 필요한 데이터 */
      searchChips: [],
      isCombo: true,
      activator: null,
      attach: null,
      colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
      editing: null,
      editingIndex: -1,
      items: [{ header: 'Select an option or create one' }],
      nonce: 1,
      menu: false,
      model: [],
      x: 0,
      search: null,
      y: 0,
      /* 여기까지 */
    }
  },

  /* 다중 검색에 필요한 부분 */
  watch: {
    model(val, prev) {
      if (val.length === prev.length) return
      this.model = val.map(v => {
        if (typeof v === 'string') {
          v = {
            text: v,
            color: this.colors[this.nonce - 1],
          }

          this.items.push(v)

          // eslint-disable-next-line no-plusplus
          this.nonce++
        }

        return v
      })
    },
  },
  /* 여기까지 */
  computed: {
    dataTable() {
      console.log(tag, 'dataTable')
      return this.$store.state.dataTable.dataTable
    },
    getChipEachColor() {
      console.log(tag, 'getChipColor')
      return status => getChipColor(status)
    },
    filteredItems() {
      if (this.searchChips.length) {
        return this.dataTable.group.filter(item => {
          const searchTerms = this.searchChips.map(chip => chip.toLowerCase())
          const itemName = item.category.toLowerCase()
          return searchTerms.includes(itemName)
        })
      }
      return this.dataTable.group
    },
    multiData() {
      return this.dataTable.group.map(item => item.category)
    },
  },
  methods: {
    onChangeSearch(value) {
      console.log(tag, value, 'onChangeSearch')
      // this.search = value
    },
    onClickUpdateCombo() {
      console.log(tag, 'onClickUpdateCombo')
      if (!this.isCombo) {
        console.log(tag, 'onClickUpdateCombo - 콤보 검색')
        this.search = ''
      } else {
        console.log(tag, 'onClickUpdateCombo - 일반 검색')
        this.search = ''
      }
      this.isCombo = !this.isCombo
    },
    onSearchData(event) {
      this.search = event.target.value
    },
    onInputSearch(value) {
      if (value === '') {
        this.search = ''
      }
    },
    /* 다중 검색에 필요한 함수 */
    edit(index, item) {
      if (!this.editing) {
        this.editing = item
        this.editingIndex = index
      } else {
        this.editing = null
        this.editingIndex = -1
      }
    },
    filter(item, queryText, itemText) {
      if (item.header) return false

      const hasValue = val => (val != null ? val : '')

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return (
        text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      )
    },
    /* 여기까지 */
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-table-layout {
  width: 100%;
  .sp-data-table {
    tr {
      border-color: blue !important;
    }
  }
  .search-wrapper {
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom: 15px;

    .search {
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

  .status-chip {
    span {
      @include one-line-ellipsis(100%);
    }
  }
  .management-chip {
    @include one-line-ellipsis(100%);
  }
}
</style>
