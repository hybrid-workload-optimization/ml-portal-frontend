<template>
  <div class="sp-smart-search">
    <v-autocomplete
      ref="autoComp"
      class="sp-autocomplete"
      :style="{ width: width + 'px' }"
      :label="label"
      closable-chips
      :multiple="multiple"
      :density="density"
      :variant="variant"
      :items="filterItems"
      :search="searchValue"
      :custom-filter="customFilter"
      :placeholder="placeholder"
      :menu-props="menuProps"
      hide-details
      @input="onUpdateInput"
      @update:search="updateModelValue"
      @keyup.enter.stop="onEnter"
    >
      <template v-slot:item="{ item }">
        <template v-if="item.raw.subheader">
          <v-list-subheader>{{ item.raw.subheader }}</v-list-subheader>
          <hr />
        </template>

        <v-list-item
          v-else
          :title="item?.props?.title"
          @click="onEnter($evnet, item?.raw.title, item?.raw.type)"
        ></v-list-item>
      </template>
    </v-autocomplete>
    <v-chip-group>
      <v-chip
        closable
        v-for="(item, index) in valuesItem"
        :key="'smart-search__value--' + index"
        @click:close="onDeleteSearchItem(index)"
        ><strong>{{ item.title }}</strong> : {{ item.value }}</v-chip
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
      default: 'Input key:value',
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
          title: '',
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
          title: '',
        })
        optionItems = optionItems.concat(this.setOptionItemFormat(uniqueArr))
        return optionItems
      }

      optionItems.push({ subheader: '속성', title: '' })
      this.items.forEach(item => {
        if (item.align !== 'd-none') {
          optionItems.push(item)
        }
      })

      if (this.searchTag) {
        optionItems.push({ subheader: '태그', title: '' })
        optionItems = optionItems.concat(
          this.setOptionItemFormat(this.filterTagDatas('key'), 'tag'),
        )
      }

      return optionItems
    },
  },
  methods: {
    onClear() {
      this.searchValue = ''
      this.isValueSearch = false
      this.isTagSearching = false
    },

    updateModelValue(event) {
      if (!event) {
        this.onClear()
      }
      this.searchValue = event
    },

    filterTagDatas(type) {
      const setFilterDatas = new Set()
      if (this.props.datas && this.props.datas.length) {
        this.props.datas.forEach(data => {
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
          result.push({ title: value, value, type })
        } else {
          result.push({ title: value, value, type })
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

      if (typeof itemText?.value === 'string') {
        return itemText.value.toLowerCase().indexOf(indexOfTargetText) > -1
      }
      return (
        itemText?.value?.value.toLowerCase().indexOf(indexOfTargetText) > -1
      )
    },

    onFindTitle(title) {
      let findTitle = ''
      let findKey = ''
      title = title.toString().split(':')[0].trim().toLowerCase()
      const sortItems = this.props.items.slice().sort((a, b) => {
        return a.title.localeCompare(b.title)
      })
      const result = sortItems.some(item => {
        const itemTitle =
          typeof item.title === 'object' ? item.title.value : item.title
        const itemKey = typeof item.key === 'object' ? item.key.value : item.key
        if (itemTitle.toLowerCase() === title) {
          findTitle = itemTitle
          findKey = itemKey
          return item
        }
        if (itemTitle.toLowerCase().indexOf(title) > -1) {
          findTitle = itemTitle
          findKey = itemKey
          return item
        }
        return false
      })

      if (!result) {
        findTitle = title
        findKey = title
        this.isTagSearching = true
      }

      return { result, findTitle, findKey }
    },

    setInputKey(value) {
      const { findKey, findTitle } = this.onFindTitle(value)

      this.selectedKeyItem = findKey
      this.$emit('update:key', findKey)
      this.searchValue = `${findTitle}:`
      this.isValueSearch = true
    },

    onEnter(e, value, type) {
      let inputValue = ''
      const searchValueSplit = this.searchValue.split(':')
      const setValue =
        searchValueSplit.length > 1 && searchValueSplit[1].trim()
          ? this.searchValue.replace(`${searchValueSplit[0]}:`, '')
          : value?.toString().trim()

      if (!this.isValueSearch) {
        inputValue =
          searchValueSplit.length && searchValueSplit[0].trim()
            ? searchValueSplit[0]
            : value
      } else {
        inputValue = searchValueSplit.length
          ? `${searchValueSplit[0]}: ${setValue}`
          : ''
      }

      if (this.isValueSearch && setValue) {
        const { findKey, findTitle } = this.onFindTitle(inputValue)
        const addItem = {
          title: findTitle,
          value: setValue.trim(),
          key: findKey,
          type: this.isTagSearching ? 'tag' : null,
        }

        this.valuesItem.push(addItem)
        this.$emit('update:search', this.valuesItem)
        this.$emit('update:target-item', addItem)

        setTimeout(() => {
          this.menuProps.closeOnClick = false
          this.menuProps.closeOnContentClick = false
        }, 500)

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
      if (e.data === ':') {
        this.isValueSearch = true
        this.onEnter()
      }
    },

    onDeleteSearchItem(index) {
      this.$emit('update:target-item', this.valuesItem[index])
      this.valuesItem.splice(index, 1)
      this.$emit('update:search', this.valuesItem)
    },
  },
}
</script>

<style lang="scss">
@mixin set-text($font-weight, $font-size, $color) {
  font-weight: $font-weight;
  font-size: $font-size;
  color: $color;
}

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
      font-size: toRem(13);
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
      .v-icon {
        @include set-text(
          bold,
          20,
          rgba($color: $sp-sky-blue-500, $alpha: 0.5)
        );
        margin-right: 12px;
      }
      ::placeholder {
        font-size: toRem(13);
      }
      .v-text-field__slot {
        padding-right: 12px;
        input {
          padding: 0;
        }
      }
    }
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
