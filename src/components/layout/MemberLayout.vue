<template>
  <div class="sp-member-layout">
    <!-- <h1>사용자/클러스터 추가/삭제 컴포넌트 #11 (완료)</h1> -->
    <div class="member__data-table-wrapper">
      <member
        class="member__data-table--as-is"
        :search="asIsSearch"
        :data="originMember"
        :selected-items="asIsRequesterSelected"
        :get-checked-box-item="onClickCheckedBoxAsIsItem"
        @click-delete-member="onClickDeleteAsIsMember"
        scroll-only
        :items-per-page="originMember.length"
      >
        <template v-slot:job_custom="{ item }">
          {{ item.job }}
        </template>
      </member>
      <div class="member__icon-wrapper">
        <div
          class="member__radius-box"
          elevation="0"
          dense
          @click="onClickAddMember"
        >
          <v-icon>forward</v-icon>
        </div>
        <div
          class="member__radius-box"
          elevation="0"
          dense
          @click="onClickRemoveMember"
        >
          <v-icon class="rotate">forward</v-icon>
        </div>
      </div>
      <member
        class="member__data-table--to-be"
        added
        :search="toBeSearch"
        :data="addedMember"
        :selected-items="toBeRequesterSelected"
        :get-checked-box-item="onClickCheckedBoxToBeItem"
        :on-click-row="onClickRow"
        @click-delete-member="onClickDeleteToBeMember"
        scroll-only
        :items-per-page="addedMember.length"
      >
        <template v-slot:job_custom="{ item }">
          <div class="member__job-wrapper">
            <!-- <div class="member__job-text">{{ item.job }}</div> -->
            <sp-select
              class="member__job-select"
              background-color="#F5F5f5"
              hide-details="auto"
              outlined
              single-line
              flat
              dense
              :items="selectListMember"
              item-text="text"
              item-value="value"
              :value="item.job"
              @input="onChangeJob"
              return-object
            />
          </div>
        </template>
      </member>
    </div>
    <div class="member__button-wrapper">
      <sp-button
        class="member__button member__button--cancel"
        elevation="0"
        dense
        @click="onClickCancel"
      >
        Cancel
      </sp-button>
      <sp-button
        class="member__button member__button--finish"
        elevation="0"
        dense
        @click="onClickFinish"
      >
        Finish
      </sp-button>
    </div>
  </div>
</template>

<script>
import Member from '@/components/DataTableWithChips.vue'
import {
  ADD_MEMBERS,
  REMOVE_MEMBERS,
  CHANGE_JOBS,
} from '@/store/modules/members/members'

const tag = '[MemberLayout]'

export default {
  components: {
    Member,
  },
  data() {
    return {
      asIsSearch: '',
      toBeSearch: '',
      asIsRequesterSelected: [],
      toBeRequesterSelected: [],
      selectValue: '',
      selectRowData: '',
    }
  },
  computed: {
    originMember() {
      console.log(tag, 'originMember')
      const filteredGroup = this.$store.state.members.members.group.filter(
        m => !m.isAdded,
      )
      const filteredHeader = this.$store.state.members.members.headers.filter(
        m => m.value !== 'email',
      )
      return {
        ...this.$store.state.members.members,
        headers: filteredHeader,
        group: filteredGroup,
      }
    },
    addedMember() {
      console.log(tag, 'addedMember')
      const filteredGroup = this.$store.state.members.members.group.filter(
        m => m.isAdded,
      )
      return {
        ...this.$store.state.members.members,
        group: filteredGroup,
      }
    },
    selectListMember() {
      console.log(tag, 'selectListMember')
      return this.$store.state.members.membersSelectList
    },
  },
  methods: {
    initSelected(selected) {
      console.log(tag, 'initSelected')
      this[selected] = []
    },

    changeIsAdded(m) {
      console.log(tag, 'changeIsAdded')
      return this[m].map(item => ({
        ...item,
        isAdded: !item.isAdded,
      }))
    },

    onClickAddMember() {
      console.log(tag, 'onClickAddMember')

      this.toBeRequesterSelected = [
        ...this.toBeRequesterSelected,
        ...this.changeIsAdded('asIsRequesterSelected'),
      ]

      this.$store.commit({
        type: ADD_MEMBERS,
        payload: {
          selectedIds: this.changeIsAdded('asIsRequesterSelected'),
        },
      })

      this.initSelected('asIsRequesterSelected')
      this.initSelected('toBeRequesterSelected')
    },

    onClickRemoveMember() {
      console.log(tag, 'onClickRemoveMember')
      this.asIsRequesterSelected = [
        ...this.asIsRequesterSelected,
        ...this.changeIsAdded('toBeRequesterSelected'),
      ]

      this.$store.commit({
        type: REMOVE_MEMBERS,
        payload: {
          selectedIds: this.changeIsAdded('toBeRequesterSelected'),
        },
      })

      this.initSelected('toBeRequesterSelected')
      this.initSelected('asIsRequesterSelected')
    },

    onClickDeleteAsIsMember(m) {
      console.log(tag, 'onClickDeleteAsIsMember')

      this.asIsRequesterSelected = this.asIsRequesterSelected.filter(
        item => item.id !== m.id,
      )
    },

    onClickCheckedBoxAsIsItem(selected) {
      console.log(tag, 'onClickCheckedBoxAsIsItem')

      this.asIsRequesterSelected = selected
    },

    onClickCheckedBoxToBeItem(selected) {
      console.log(tag, 'onClickCheckedBoxToBItem')

      this.toBeRequesterSelected = selected
    },

    onClickDeleteToBeMember(m) {
      console.log(tag, 'onClickDeleteToBeMember')

      this.toBeRequesterSelected = this.toBeRequesterSelected.filter(
        item => item.id !== m.id,
      )
    },

    onChangeJob(value) {
      console.log(tag, this.selectRowData, 'onChangeJob')

      this.$store.commit({
        type: CHANGE_JOBS,
        payload: {
          id: this.selectRowData.id,
          job: value.value,
        },
      })
    },
    onClickRow(rowData) {
      console.log(tag, 'onClickRow')
      this.selectRowData = rowData
    },

    onClickCancel() {
      console.log(tag, 'onClickCancel')
    },

    onClickFinish() {
      console.log(tag, 'onClickFinish')
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-member-layout {
  $this: 'member';
  height: 100%;
  .#{$this}__data-table-wrapper {
    width: 100%;
    height: calc(100% - 77px);
    display: flex;
    align-items: center;
    .#{$this}__data-table--as-is {
      width: 40%;
    }

    .#{$this}__data-table--to-be {
      width: 60%;

      .w-30 {
        width: 30% !important;
      }
      .w-70 {
        width: 80%;
      }
    }

    .#{$this}__job-wrapper {
      display: flex;
      align-items: center;
      .#{$this}__job-text {
        width: 60%;
      }
      .#{$this}__job-select {
        width: 40%;
        .v-select__selection {
          @include set-text(normal, 14, rgba($color: $sp-grey-400, $alpha: 1));
        }
      }
    }

    .#{$this}__icon-wrapper {
      padding: 0 56px;
      .#{$this}__radius-box {
        margin: 24px 0;
        width: 58px;
        height: 58px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: $sp-teriary;
        border-radius: 50%;
        cursor: pointer;
        &:active {
          background: $sp-primary;
        }
        i {
          font-size: 40px;
          color: #fff;
          &.rotate {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
  .#{$this}__button-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 33px;
    height: 44px;

    .#{$this}__button {
      background-color: #fff;
      border-radius: 20px;
      padding: 8px 20px;
      &.#{$this}__button--cancel {
        margin-right: 8px;
        border: thin solid $sp-sky-blue-500;
        @include set-text(
          bold,
          15,
          rgba($color: $sp-sky-blue-500, $alpha: 0.8)
        );
      }
      &.#{$this}__button--finish {
        border: thin solid $sp-teriary;
        @include set-text(bold, 15, rgba($color: $sp-teriary, $alpha: 1));
      }
    }
  }
}
</style>
