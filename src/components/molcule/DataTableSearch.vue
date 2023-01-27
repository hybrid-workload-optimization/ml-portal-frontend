<template>
  <div class="sp-data-table-search">
    <div class="common-table-col">
      <v-card-text class="card-message d-flex align-center pa-0">
        <slot name="title"></slot>
        <div class="title-wrapper">
          <span v-if="title"> {{ title }} </span>
          <span v-if="todoCount" class="group-count">{{ todoCount }}</span>
          <span v-if="subTitle"> {{ subTitle }}</span>
        </div>
      </v-card-text>
    </div>
    <div class="search-wrapper">
      <slot name="btn-group"></slot>
      <sp-input
        placeholder="Enter keywords to search for"
        append-icon="mdi-magnify"
        single-line
        @input="onInputSearch"
        :value="search"
        dense
        solo
        flat
        height="35px"
        hide-details
        class="search"
        v-if="!multiple"
      ></sp-input>
      <v-combobox
        label="Enter keywords to search for"
        placeholder="Enter keywords to search for"
        chips
        deletable-chips
        class="search"
        append-icon="arrow_drop_down"
        multiple
        height="35px"
        :value="searchChips"
        :items="multiData"
        @change="onChangeSearch"
        v-if="multiple"
        outlined
        dense
        rounded
        single-line
        hide-details="auto"
      />

      <sp-button
        class="search-wrapper--button"
        dense
        elevation="0"
        v-if="buttonText"
        :disabled="isDisabled"
        @click="onClickButton"
      >
        {{ buttonText }}
      </sp-button>
      <slot name="extend"></slot>
    </div>
  </div>
</template>

<script>
const tag = '[DataTableSearch]'

export default {
  props: {
    title: {
      type: String,
      default: '',
      description: '타이틀 텍스트',
    },
    subTitle: {
      type: String,
      default: '',
      description: '서브 타이틀 텍스트',
    },
    todoCount: {
      type: String,
      default: '0',
      description: '카운트 값',
    },
    search: {
      type: String,
      default: '',
      description: '검색어 값',
    },
    searchChips: {
      type: Array,
      default: undefined,
      description: '다중 검색어 입력 값 배열',
    },
    buttonText: {
      type: String,
      default: '',
      description: '버튼 텍스트 값',
    },
    multiple: {
      type: Boolean,
      default: false,
      description: '다중 검색 여부 on/off',
    },
    multiData: {
      type: Array,
      default: undefined,
      description: '다중 검색 시 기본 선택 값 배열',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClickButton() {
      console.log(tag, 'onClickButton')
      this.$emit('click')
    },
    onInputSearch(value) {
      console.log(tag, 'onInputSearch', value)
      this.$emit('input', value)
    },
    onChangeSearch(value) {
      console.log(tag, 'onChangeSearch', value)
      this.$emit('change', value)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-data-table-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .card-message {
    @include set-text(bold, 16, rgba($color: $sp-title, $alpha: 0.7));
    .group-count {
      @include set-text(bold, 24, rgba($color: $sp-title, $alpha: 1));
    }
  }
  .search-wrapper {
    display: flex;
    width: 40%;
    align-items: center;

    .search {
      // border-radius: 50px;
      border-radius: 5px;
      background: #fff;

      .v-input__slot {
        border: thin solid rgba($color: $sp-sky-blue-500, $alpha: 0.5);
      }
      fieldset {
        border: none;
      }
    }
    .search-wrapper--button {
      @include set-text(bold, 14, rgba($color: $sp-teriary, $alpha: 1));
      width: 210px;
      background: #fff;
      // border-radius: 50px;
      border-radius: 5px;
      margin-left: 14px;
      border: thin solid rgba($color: $sp-teriary, $alpha: 1);
    }
  }
}
</style>
