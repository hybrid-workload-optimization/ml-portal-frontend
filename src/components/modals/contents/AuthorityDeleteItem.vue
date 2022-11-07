<template>
  <div class="sp-authority-delete-item">
    <div class="delete-text-wrapper">
      <v-icon class="material-icons-outlined">people</v-icon>
      <span class="delete-item-name"> {{ itemName }} </span><br />
      <span class="delete-confirm-text">정말 삭제하시겠습니까?</span>
    </div>

    <div class="delete-button-wrapper">
      <sp-button class="button cancel-button" outlined @click="closePopup"
        >아니오</sp-button
      >
      <sp-button class="button apply-button" outlined @click="deleteItem"
        >예</sp-button
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemName: {
      type: String,
      default: '',
      description: '지우려는 항목 이름',
    },
    itemIndex: {
      type: Number,
      default: null,
      description: '지우려는 항목 인덱스',
    },
    groupIndex: {
      type: Number,
      default: null,
      description: '지우려는 항목의 그룹 인덱스',
    },
    userRoleIdx: {
      type: Number,
      default: null,
      description: '지우려는 항목의 키값',
    },
  },
  data: () => ({}),
  methods: {
    deleteItem() {
      console.log('####userRoleIdx :: ', this.userRoleIdx)
      this.$emit(
        'delete-item',
        this.groupIndex,
        this.itemIndex,
        this.userRoleIdx,
      )
    },
    closePopup() {
      this.$emit('close-modal')
    },
  },
}
</script>

<style lang="scss">
.sp-authority-delete-item {
  padding: 15px;
  .delete-text-wrapper {
    text-align: center;
    color: $sp-primary;

    i {
      color: $sp-primary;
    }
    .delete-item-name,
    .delete-confirm-text {
      font-weight: 500;
    }
    .delete-confirm-text {
      display: block;
      padding-top: 30px;
    }
  }
  .delete-button-wrapper {
    margin-top: 35px;
    text-align: center;
    .button {
      width: 120px;
      border-radius: 5px;
      border-width: thin;
    }
    .cancel-button {
      color: $sp-primary;
      margin-right: 10px;
    }
    .apply-button {
      color: $sp-teriary;
    }
  }
}
</style>
