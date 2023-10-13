<template>
  <div class="sp-smart-search">
    <v-autocomplete
      ref="autoComp"
      class="sp-autocomplete"
      :style="{ width: width + 'px' }"
      :label="label"
      closable-chips
      :multiple="multiple"
      :items="filterItems"
      :filter="customFilter"
      :search-input="searchValue"
      :placeholder="placeholder"
      :menu-props="menuProps"
      hide-details
      @input="onUpdateInput"
      @update:search-input="updateModelValue"
      @keyup.enter.stop="onEnter"
    >
      <template #item="{ item }">
        <template v-if="item.subheader">
          <v-list-item
            class="item-subheader"
            style="border-bottom: 1px solid #eee"
            >{{ item.subheader }}</v-list-item
          >
        </template>

        <v-list-item v-else @click="onEnter($event, item.text, item.type)">
          {{ item.text }}
          <!-- <v-list-item-content>
            <v-list-item-title></v-list-item-title>
          </v-list-item-content> -->
        </v-list-item>
      </template>
    </v-autocomplete>
    <v-chip-group>
      <v-chip
        v-for="(item, index) in valuesItem"
        :key="'smart-search__value--' + index"
        @click:close="onDeleteSearchItem(index)"
        close
        ><strong>{{ item.text }}</strong> : {{ item.value }}</v-chip
      >
    </v-chip-group>
  </div>
</template>

<script>
/**
 * TODO 남은 업무
 * 1. 선택된 값 중 중복 선택 값 제거
 */

export default {
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      },
      description:
        'data table의 경우 header 값을 의미한다. 데이터 형태: { title: "", key: "" }, ',
    },
    label: {
      type: String,
      default: undefined,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '   속성 검색',
    },
    values: {
      type: Array,
      default: () => {
        return []
      },
    },
    datas: {
      type: Array,
      default: () => {
        return []
      },
    },
    density: {
      type: String,
      default: 'default',
    },
    variant: {
      type: String,
      default: 'outlined',
    },
    width: {
      type: [Number, String],
      default: 600,
    },
    searchTag: {
      type: Boolean,
      default: false,
      description:
        'tag 검색 기능을 사용할지에 대한 여부. true일 경우 datas의 모든 tag 값들을 items에 추가한다.',
    },
  },
  watch: {
    isValueSearch(val) {
      if (val) this.activeMenu()
    },
  },
  data() {
    return {
      searchValue: '',
      isValueSearch: false,
      isTagSearching: false,
      selectedKeyItem: null,
      valuesItem: this.values,
      menuProps: {
        closeOnClick: false,
        closeOnContentClick: false,
      },
    }
  },

  computed: {
    filterItems() {
      let optionItems = []

      if (this.isTagSearching) {
        optionItems.push({
          subheader: this.searchValue.split(':')[0],
          text: '',
        })
        optionItems = optionItems.concat(
          this.setOptionItemFormat(this.filterTagDatas('value'), 'tag'),
        )
        return optionItems
      }

      if (this.isValueSearch) {
        if (!this.datas.length) {
          return []
        }
        const setFilterDatas = new Set()
        this.datas.forEach(item => {
          if (item[this.selectedKeyItem]) {
            setFilterDatas.add(item[this.selectedKeyItem])
          }
        })
        const uniqueArr = [...setFilterDatas]
        optionItems.push({
          subheader: this.searchValue.split(':')[0],
          text: '',
        })
        optionItems = optionItems.concat(this.setOptionItemFormat(uniqueArr))
        return optionItems
      }

      optionItems.push({ subheader: '속성', text: '' })
      this.items.forEach(item => {
        if (item.align !== 'd-none') {
          optionItems.push(item)
        }
      })

      if (this.searchTag) {
        optionItems.push({ subheader: '태그', text: '' })
        optionItems = optionItems.concat(
          this.setOptionItemFormat(this.filterTagDatas('key'), 'tag'),
        )
      }

      return optionItems
    },
  },
  methods: {
    activeMenu() {
      setTimeout(() => {
        this.$refs.autoComp.focus()
        this.$refs.autoComp.activateMenu()
      }, 0)
    },
    onClear() {
      this.searchValue = ''
      this.isValueSearch = false
      this.isTagSearching = false
    },

    updateModelValue(event) {
      // console.log(event)
      if (!event) {
        this.onClear()
      } else this.searchValue = event
    },

    filterTagDatas(type) {
      const setFilterDatas = new Set()
      if (this.datas && this.datas.length) {
        this.datas.forEach(data => {
          if (data.tag && data.tag.length) {
            data.tag.forEach(tagObj => {
              if (tagObj[type] !== null) {
                setFilterDatas.add(tagObj[type])
              }
            })
          }
        })
      }

      const uniqueArr = [...setFilterDatas]
      return uniqueArr
    },

    setOptionItemFormat(arr, type) {
      const result = []
      arr.forEach(value => {
        if (Array.isArray(value)) {
          result.push({ text: value, value, type })
        } else {
          result.push({ text: value, value, type })
        }
      })
      return result
    },

    customFilter(item, queryText, itemText) {
      const searchText = queryText.toLowerCase()
      const splitSearchValue = searchText.split(':')
      let indexOfTargetText = ''
      if (splitSearchValue.length > 1) {
        indexOfTargetText = splitSearchValue[1].trim().toLowerCase()
      } else {
        indexOfTargetText = searchText.trim().toLowerCase()
      }

      if (typeof itemText === 'string') {
        return itemText.toLowerCase().indexOf(indexOfTargetText) > -1
      }
      return itemText.toLowerCase().indexOf(indexOfTargetText) > -1
    },

    onFindTitle(text) {
      let findTitle = ''
      let findKey = ''
      text = text.toString().split(':')[0].trim().toLowerCase()
      const sortItems = this.items.slice().sort((a, b) => {
        return a.text.localeCompare(b.text)
      })
      const result = sortItems.some(item => {
        const itemTitle =
          typeof item.text === 'object' ? item.text.value : item.text
        const itemKey =
          typeof item.value === 'object' ? item.value.value : item.value
        if (itemTitle.toLowerCase() === text) {
          findTitle = itemTitle
          findKey = itemKey
          return item
        }
        if (itemTitle.toLowerCase().indexOf(text) > -1) {
          findTitle = itemTitle
          findKey = itemKey
          return item
        }
        return false
      })

      if (!result) {
        findTitle = text
        findKey = text
        this.isTagSearching = true
      }

      return { result, findTitle, findKey }
    },

    setInputKey(value) {
      const { findKey, findTitle } = this.onFindTitle(value)
      /*
      if (!result || type === 'tag') {
        // items 목록에 없는 값을 입력 시 return
        onClear()
        return false
      }
      */
      // 선택된 key 정보 저장
      this.selectedKeyItem = findKey
      this.$emit('update:key', findKey)
      this.searchValue = `${findTitle}:`
      this.isValueSearch = true
    },

    onEnter(e, value, type) {
      let inputValue = ''
      // value 값
      const searchValueSplit = this.searchValue.split(':')
      const setValue =
        searchValueSplit.length > 1 && searchValueSplit[1].trim()
          ? this.searchValue.replace(`${this.searchValue.split(':')[0]}:`, '')
          : value?.toString().trim()
      if (!this.isValueSearch) {
        inputValue =
          searchValueSplit.length && searchValueSplit[0].trim()
            ? searchValueSplit[0]
            : value
      } else {
        // 키보드 이벤트 시 예외처리
        inputValue = searchValueSplit.length
          ? `${searchValueSplit[0]}: ${setValue}`
          : ''
      }
      // console.log(setValue)
      if (!this.isValueSearch) {
        inputValue =
          searchValueSplit.length && searchValueSplit[0].trim()
            ? searchValueSplit[0]
            : value
      } else {
        // 키보드 이벤트 시 예외처리
        inputValue = searchValueSplit.length
          ? `${searchValueSplit[0]}: ${setValue}`
          : ''
      }

      // key 값이 있을 때
      if (this.isValueSearch && setValue) {
        // key가 존재하는 값인지 확인
        const { findKey, findTitle } = this.onFindTitle(inputValue)

        // 선택된 key, value, title 정보 저장
        const addItem = {
          text: findTitle,
          value: setValue.trim(),
          key: findKey,
          type: this.isTagSearching ? 'tag' : null,
        }
        this.valuesItem.push(addItem)
        this.$emit('update:search', this.valuesItem)
        this.$emit('update:search-input', this.valuesItem) // 변경된 검색 데이터 목록
        this.$emit('update:target-item', addItem) // 추가된 아이템 이벤트
        // 이벤트 delay => 너무 빨라서 select items 목록이 안닫힘
        // setTimeout(() => {
        //   this.menuProps.closeOnClick = false
        //   this.menuProps.closeOnContentClick = false
        // }, 500)
        this.onClear()
        return
      }

      this.menuProps.closeOnClick = true
      this.menuProps.closeOnContentClick = true
      if (type) {
        this.isTagSearching = true
      }

      if (inputValue) {
        this.setInputKey(inputValue)
        return
      }

      this.isValueSearch = true
    },

    onUpdateInput(e) {
      console.log(e)
      if (e.data === ':') {
        this.isValueSearch = true
        this.onEnter()
      }
    },

    onDeleteSearchItem(index) {
      this.$emit('update:target-item', this.valuesItem[index])
      this.valuesItem.splice(index, 1)
      this.$emit('update:search', this.valuesItem)
      this.$emit('update:search-input', this.valuesItem)
    },
  },
}
</script>

<style lang="scss">
.sp-autocomplete {
  &.v-input--readonly,
  &.v-input--disabled {
    .v-input__control > .v-field {
      background: $input-bgcolor !important;
    }
  }
  .v-input__control {
    min-height: 35px !important;

    .v-field {
      font-size: 16px;
      padding-inline-end: 0 !important;
      .v-input__prepend-inner {
        padding: 16px 15px !important;
      }
      .v-field__input {
        padding-inline-start: 0 !important;
        min-height: 35px;
        padding-top: 0;
        padding-bottom: 0;
      }
      fieldset {
        border: 1px solid $sp-box-border;
        border-radius: 5px;
      }

      .v-text-field__slot {
        padding-right: 12px;
        input {
          padding: 0;
        }
      }
    }
  }

  .v-select__selections {
    padding: 0 6px;
  }

  &.border {
    &.bw-2 {
      .v-input__slot {
        fieldset {
          border-width: thin;
        }
      }
    }
  }
}
</style>
