<template>
  <div class="sp-member-layout">
    <div class="member__data-table-wrapper">
      <member
        class="member__data-table--as-is"
        :search="asIsSearch"
        :headers="asIsHeaders"
        :data="originMember"
        :selected-items="asIsRequesterSelected"
        :get-checked-box-item="onClickCheckedBoxAsIsItem"
        @click-delete-member="onClickDeleteAsIsMember"
      >
        <!-- <template v-slot:job_custom="{ item }">
          {{ item.job }}
        </template> -->
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
        :headers="toBeHeaders"
        :data="addedMember"
        :selected-items="toBeRequesterSelected"
        :get-checked-box-item="onClickCheckedBoxToBeItem"
        :on-click-row="onClickRow"
        @click-delete-member="onClickDeleteToBeMember"
      >
        <template v-slot:userRoleIdx_custom="{ item }">
          <div class="member__job-wrapper">
            <!-- <div class="member__job-text">{{ item.projectUserRole }}</div> -->
            <sp-select
              class="member__job-select"
              background-color="#F5F5f5"
              hide-details="auto"
              outlined
              single-line
              flat
              dense
              :items="dataUserRoleList"
              :value="item.userRoleIdx"
              @input="onChangeRole"
              return-object
              selected
            />
          </div>
        </template>
      </member>
    </div>
    <!-- <div class="member__button-wrapper">
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
    </div> -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Member from '@/views/project/tabs/DataTableProjectMember.vue'

const projectMapUtils = createNamespacedHelpers('project')
const alertMapUtils = createNamespacedHelpers('alert')

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
      /* memberRoleList: [
        {
          text: 'Project Member',
          value: 5,
          disabled: false,
          divider: false,
        },
      ], */
      // filterResult: [],
      asIsHeaders: [
        {
          text: 'User Name',
          align: 'left',
          value: 'userName',
          class: 'w-30',
        },
        {
          text: 'Email',
          align: 'left',
          value: 'email',
          class: 'w-30',
        },
      ],
      toBeHeaders: [
        {
          text: 'User Name',
          align: 'left',
          value: 'userName',
          class: 'w-30',
        },
        {
          text: 'Email',
          align: 'left',
          value: 'email',
          class: 'w-30',
        },
        {
          text: 'Authority',
          align: 'left',
          value: 'userRoleIdx',
          class: 'w-40',
        },
      ],
    }
  },

  created() {},

  computed: {
    ...projectMapUtils.mapGetters(['dataUserRoleList']),

    originMember() {
      const filteredGroup1 = this.dataUserAllList.filter(m => !m.isAdded)
      if (this.$store.state.project.newPmUser !== null) {
        const filteredGroup2 = filteredGroup1.filter(
          m => m.userId !== this.$store.state.project.newPmUser.userId,
        )
        return {
          group: filteredGroup2,
        }
      }
      return {
        group: filteredGroup1,
      }
    },

    addedMember() {
      const filteredGroup = this.dataUserAllList.filter(m => m.isAdded)
      return {
        group: filteredGroup,
      }
    },

    /* selectListMember() {
      return this.memberRoleList
    }, */

    ...projectMapUtils.mapGetters(['dataUserAllList']),
  },

  mounted() {
    this.getUserAllList()
  },

  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...projectMapUtils.mapActions(['getUserAllList']),

    initSelected(selected) {
      this[selected] = []
    },

    changeIsAdded(m) {
      return this[m].map(item => ({
        ...item,
        isAdded: !item.isAdded,
      }))
    },

    onClickAddMember() {
      this.toBeRequesterSelected = [
        ...this.toBeRequesterSelected,
        ...this.changeIsAdded('asIsRequesterSelected'),
      ]

      this.addMembers({
        payload: {
          selectedIds: this.changeIsAdded('asIsRequesterSelected'),
        },
      })

      this.initSelected('asIsRequesterSelected')
      this.initSelected('toBeRequesterSelected')
    },

    onClickRemoveMember() {
      this.asIsRequesterSelected = [
        ...this.asIsRequesterSelected,
        ...this.changeIsAdded('toBeRequesterSelected'),
      ]

      this.removeMembers({
        payload: {
          selectedIds: this.changeIsAdded('toBeRequesterSelected'),
        },
      })

      this.initSelected('toBeRequesterSelected')
      this.initSelected('asIsRequesterSelected')
    },

    onClickDeleteAsIsMember(m) {
      this.asIsRequesterSelected = this.asIsRequesterSelected.filter(
        item => item.userId !== m.userId,
      )
    },

    onClickCheckedBoxAsIsItem(selected) {
      this.asIsRequesterSelected = selected
    },

    onClickCheckedBoxToBeItem(selected) {
      this.toBeRequesterSelected = selected
    },

    onClickDeleteToBeMember(m) {
      this.toBeRequesterSelected = this.toBeRequesterSelected.filter(
        item => item.userId !== m.userId,
      )
    },

    onChangeRole(role) {
      this.changeRole({
        userId: this.selectRowData.userId,
        // projectUserRole: role.value,
        userRoleIdx: role.value,
      })
    },

    onClickRow(rowData) {
      this.selectRowData = rowData
    },

    onClickCancel() {
      this.openAlert({
        title: 'Project 생성이 취소 되었습니다.',
        type: 'error',
      })
      setTimeout(() => {
        this.$router.push('/project/list')
      }, 1000)
    },

    /* onClickFinish() {
      this.openAlert('여기를 탄다...')
    }, */

    addMembers({ payload }) {
      payload.selectedIds.forEach(member => {
        const index = this.dataUserAllList.findIndex(
          el => el.userId === member.userId,
        )
        this.dataUserAllList[index].isAdded = true
      })

      this.changeUser()
    },

    removeMembers({ payload }) {
      payload.selectedIds.forEach(member => {
        const index = this.dataUserAllList.findIndex(
          el => el.userId === member.userId,
        )
        this.dataUserAllList[index].isAdded = false
      })

      this.changeUser()
    },

    changeRole(payload) {
      const index = this.dataUserAllList.findIndex(
        el => el.userId === payload.userId,
      )
      // this.dataUserAllList[index].projectUserRole = payload.projectUserRole
      this.dataUserAllList[index].userRoleIdx = payload.userRoleIdx
    },

    changeUser() {
      const selectMemberList = this.dataUserAllList.filter(
        member => member.isAdded,
      )

      // const getList = []
      /* selectMemberList.forEach(e => {
        const item = {
          userId: e.userId,
          projectUserRole: e.projectUserRole,
          // projectUserRole: 'DE',
        }

        getList.push(item)
      }) */

      this.$store.state.project.newUserList = selectMemberList
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
    align-items: flex-start;
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
      align-self: center;
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
