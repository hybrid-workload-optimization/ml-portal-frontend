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
              item-text="text"
              item-value="value"
              :value="item.userRoleIdx"
              @input="onChangeRole"
              return-object
            />
          </div>
        </template>
      </member>
    </div>
    <!-- <confirm @confirm-modal="onClickFinishConfirm" /> -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Member from '@/views/project/tabs/DataTableProjectMember.vue'
// import Confirm from '@/components/molcule/Confirm.vue'

const projectMapUtils = createNamespacedHelpers('project')
const alertMapUtils = createNamespacedHelpers('alert')
const confirmMapUtils = createNamespacedHelpers('confirm')

export default {
  components: {
    Member,
    // Confirm,
  },

  data() {
    return {
      projectIdx: null,
      asIsSearch: '',
      toBeSearch: '',
      asIsRequesterSelected: [],
      toBeRequesterSelected: [],
      selectValue: '',
      selectRowData: '',
      /* memberRoleList: [
        {
          text: 'Developer',
          value: 'DE',
          disabled: false,
          divider: false,
        },
        {
          text: 'Project Manager',
          value: 'PM',
          disabled: false,
          divider: false,
        },
      ], */
      selectedIds: [],
      resultMemberList: [],
      asIsHeaders: [
        {
          text: '사용자명',
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
          text: '사용자명',
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

  created() {
    this.projectIdx = this.$route.params.id
    this.getMemberList({ projectIdx: this.projectIdx })
  },

  computed: {
    ...projectMapUtils.mapGetters(['detailInfo']),
    ...projectMapUtils.mapGetters(['dataUserRoleList']),

    originMember() {
      const filteredGroup1 = this.dataGridMemberList.filter(m => !m.isAdded)
      if (this.$store.state.project.editPmUser !== null) {
        const filteredGroup2 = filteredGroup1.filter(
          m => m.userId !== this.$store.state.project.editPmUser.userId,
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
      const filteredGroup = this.dataGridMemberList.filter(m => m.isAdded)
      return {
        group: filteredGroup,
      }
    },

    /* selectListMember() {
      return this.memberRoleList
    }, */

    ...projectMapUtils.mapGetters(['dataGridMemberList']),
  },

  mounted() {
    // this.getMemberList({ projectIdx: this.projectIdx })
  },

  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...confirmMapUtils.mapMutations(['openConfirm']),
    ...projectMapUtils.mapActions(['getMemberList']),
    ...projectMapUtils.mapActions(['updateProjectUser']),

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

      /* this.$store.commit({
        type: ADD_MEMBERS,
        payload: {
          selectedIds: this.changeIsAdded('asIsRequesterSelected'),
        },
      }) */

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

      /* this.$store.commit({
        type: REMOVE_MEMBERS,
        payload: {
          selectedIds: this.changeIsAdded('toBeRequesterSelected'),
        },
      }) */

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
        userRoleIdx: role.value,
      })
    },

    onClickRow(rowData) {
      this.selectRowData = rowData
    },

    /* onClickCancel() {
      // this.$router.push('/project/list')
      this.$router.go(-1)
    }, */

    /* onClickFinish() {
      const selectMemberList = this.dataGridMemberList.filter(
        member => member.isAdded,
      )

      const selRole = selectMemberList.filter(
        member =>
          member.userRoleIdx === undefined || member.userRoleIdx === null,
      )

      if (selRole.length > 0) {
        this.openAlert({ title: '사용자 권한을 선택해 주세요.', type: 'error' })
        return
      }

      this.resultMemberList = selectMemberList

      this.onSave()
    }, */

    /* onClickFinishConfirm() {
      this.onSave()
    }, */

    /* async onSave() {
      const param = {
        projectIdx: this.projectIdx,
        userList: this.resultMemberList,
      }

      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.updateProjectUser(param)
        if (response.status === 202) {
          this.openAlert({ title: response.data.message, type: 'info' })
          setTimeout(() => {
            this.$router.push(`/project/detail/${this.projectIdx}`)
          }, 1000)
        } else {
          this.openAlert({ title: response.data.message, type: 'error' })
        }
      } catch (error) {
        this.openAlert({
          title: '프로젝트 Members 정보를 수정하지 못했습니다.',
          type: 'error',
        })
      }
    }, */

    addMembers({ payload }) {
      payload.selectedIds.forEach(member => {
        const index = this.dataGridMemberList.findIndex(
          el => el.userId === member.userId,
        )
        this.dataGridMemberList[index].isAdded = true
      })

      this.changeUser()
    },

    removeMembers({ payload }) {
      payload.selectedIds.forEach(member => {
        const index = this.dataGridMemberList.findIndex(
          el => el.userId === member.userId,
        )
        this.dataGridMemberList[index].isAdded = false
      })

      this.changeUser()
    },

    changeUser() {
      const selectMemberList = this.dataGridMemberList.filter(
        member => member.isAdded,
      )

      this.$store.state.project.editUserList = null
      if (selectMemberList.length > 0) {
        this.$store.state.project.editUserList = selectMemberList
      }
    },

    changeRole(payload) {
      const index = this.dataGridMemberList.findIndex(
        el => el.userId === payload.userId,
      )
      this.dataGridMemberList[index].userRoleIdx = payload.userRoleIdx
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
      width: 114px;
      background-color: #fff;
      border-radius: 5px;
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
