<template>
  <div class="sp-authority-user">
    <sp-card headered label="사용자" outlined elevation="0">
      <template v-slot:header v-if="isWritable">
        <sp-button
          outlined
          elevation="0"
          class="sp-authority-user__user-add-button"
          :disabled="userAddable"
          @click="onClickOpenModal"
        >
          <v-icon>add</v-icon> 사용자 추가
        </sp-button>
      </template>
      <div class="sp-authority-user__search-box-wrapper">
        <sp-input
          label="사용자를 검색하세요"
          class="multi-search"
          append-icon="mdi-magnify"
          multiple
          v-model="search"
          dense
          rounded
          single-line
          hide-details
        />
      </div>
      <div class="sp-authority-user__total-count-wrapper">
        <span class="count-text">총 </span>
        <span class="count-number">{{ userCount }}</span>
        <span class="count-text"> 명의 사용자가 등록 되었습니다.</span>
      </div>
      <div class="sp-authority-user__registered-user-chips-wrapper">
        <template v-for="(data, index) in searching">
          <sp-chip
            v-if="data.type == null || data.type == 'N'"
            :key="index"
            outlined
            class="registered-user-chips"
            :close="isWritable"
            @click-close="deleteUser(index)"
            >{{ data.userName }}/{{ data.organization }}
          </sp-chip>
        </template>
      </div>
    </sp-card>
    <!-- 팝업 모달 부분 -->
    <modal
      title-name="사용자 추가"
      modal-width="921"
      modal-height="805"
      body-height="750px"
      :dialog="dialog"
      @close-modal="onClickCloseModal"
    >
      <template v-slot:content>
        <div class="service-wrapper">
          <service-add-approver
            :table-data="userList"
            :search="requesterSearch"
            :get-checked-box-item="onClickCheckedBoxItem"
            :selected-items="requesterSelected"
            @click-delete-approver="onClickDeleteApprover"
          />
        </div>
      </template>
      <template v-slot:footer>
        <div class="popup-authority__button-wrapper">
          <sp-button
            class="popup-authority--button cancel"
            outlined
            elevation="0"
            @click="onClickCloseModal"
          >
            취소</sp-button
          >
          <sp-button
            class="popup-authority--button create"
            outlined
            elevation="0"
            @click="onClickAddApprover"
          >
            확인</sp-button
          >
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Modal from '@/components/modals/Modal.vue'
import ServiceAddApprover from '@/components/modals/contents/ServiceAddApprover.vue'

const authorityMapUtil = createNamespacedHelpers('authority')
const userMapUtil = createNamespacedHelpers('user')

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Modal,
    // eslint-disable-next-line vue/no-unused-components
    ServiceAddApprover,
  },
  props: {
    isWritable: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    search: '',
    requesterSelected: [],
    reqData: {},
    requesterSelectedId: '',
    requesterSearch: '',
    dialog: false,
  }),
  created() {},
  methods: {
    ...userMapUtil.mapActions({ getAllUserList: 'getList' }),

    deleteUser(index) {
      this.$store.commit('authority/deleteAuthUser', index)
      this.search = ''
    },
    async onClickOpenModal() {
      const params = {
        notAuthorityId: this.selected.userRoleCode,
      }
      await this.getAllUserList(params)
      this.requesterSelected = []
      this.dialog = true
      this.$store.commit('authority/initUserPopup', true)
    },
    onClickCloseModal() {
      this.dialog = false
      this.$store.commit('authority/initUserPopup', false)
    },
    onClickCheckedBoxItem(selected) {
      this.requesterSelected = selected
    },
    onClickDeleteApprover(approver) {
      this.requesterSelected = this.requesterSelected.filter(
        item =>
          item.userName !== approver.userName &&
          item.organization !== approver.organization,
      )
    },
    addApprover() {
      this.$store.commit('authority/addAuthUser', this.requesterSelected)
    },
    onClickAddApprover() {
      this.addApprover()
      this.requesterSelected = []
      this.onClickCloseModal()
    },
    setCheckedUser() {
      this.requesterSelected = this.registeredUsers
    },
    onSearchUser(value) {
      console.log(value, '-----')
    },
  },
  computed: {
    ...authorityMapUtil.mapState(['authGroup', 'initUserPopup', 'selected']),
    ...userMapUtil.mapState({ userList: 'dataList' }),
    searching() {
      if (!this.search || this.search.length < 1) return this.registeredUsers

      const searchTerm = this.search.toLowerCase()

      return this.registeredUsers.filter(item => {
        const text = item.userName.toLowerCase()

        return text.indexOf(searchTerm) > -1
      })
    },
    registeredUsers() {
      return this.$store.getters['authority/getAuthUser']
    },
    userCount() {
      return this.registeredUsers.length
    },
    getCount() {
      // return this.tableData.group.length
      return this.registeredUsers.length
    },
    userAddable() {
      let flag = false
      if (this.authGroup.userRoleIdx) {
        flag = false
      } else {
        flag = true
      }
      return flag
    },
  },
}
</script>

<style lang="scss" scoped>
.v-dialog {
  overflow: hidden;

  .sp-card {
    .card-body {
      height: 750px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: $scroll-width;
        height: $scroll-width;
      }
      &::-webkit-scrollbar-thumb {
        height: $scroll-height;
        background-color: $scroll-background-color;
        border-radius: $scroll-border-radius;
      }
    }
  }
}
</style>
<style lang="scss">
@import '@/styles/_mixin.scss';
$this: 'sp-authority-user';
.sp-authority-user {
  .#{$this}__search-box-wrapper {
    justify-content: center;
    padding-top: 10px;
    .multi-search {
      border: thin solid $sp-box-border;
      background-color: $sp-grey-200;
      border-radius: 5px;
      width: 98%;
      margin: auto;
      .v-chip {
        border: thin solid $sp-box-border !important;
        background-color: $sp-grey-200 !important;
        button {
          color: $sp-grey-300;
        }
      }
      .v-input__append-inner {
        margin-top: 8px;
      }
    }
  }
  .sp-card {
    min-height: 391px;
    .card-header {
      padding-left: 20px;
      justify-content: space-between;
      .card-title {
        font-size: toRem(15);
      }
    }
    .card-body {
      padding: 20px;
    }
    .#{$this}__user-add-button {
      border-width: thin;
      border-radius: 5px;
      height: 30px !important;
      font-size: toRem(14);
      font-weight: bold;
      color: $sp-teriary;
      .v-icon {
        font-size: 14px;
      }
    }
    .#{$this}__total-count-wrapper {
      padding: 10px 10px;
      .count-text {
        color: $sp-title;
        font-size: toRem(16);
        font-weight: bold;
        font-family: $sub-font;
        opacity: 0.7;
      }
      .count-number {
        color: $sp-title;
        font-size: toRem(24);
        font-weight: bold;
      }
    }
    .#{$this}__registered-user-chips-wrapper {
      height: 200px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: $scroll-width;

        height: $scroll-width;
      }
      &::-webkit-scrollbar-thumb {
        height: $scroll-height;
        background-color: $scroll-background-color;
        border-radius: $scroll-border-radius;
      }
      padding: 0;
      .sp-editor__code-box {
        .CodeMirror-gutter-wrapper {
          left: -30px !important;
        }
        .CodeMirror-gutters {
          left: 0px !important;
        }
      }
      .registered-user-chips {
        height: 40px;
        background-color: $sp-grey-200 !important;
        width: 48%;
        margin: 5px;
        display: inline-block;
        font-family: $sub-font;
        color: $sp-title;
        border-radius: 5px;
        .v-chip__content {
          width: 100%;
          justify-content: space-between;
        }
        button {
          color: $sp-grey-300;
        }
      }
    }
  }
}
@include popup-buttons('popup-authority', 'create');
</style>
