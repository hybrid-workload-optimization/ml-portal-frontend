<template>
  <div class="sp-box-layout">
    <div>
      <!-- 상단 탭 명칭 설정 -->
      <v-tabs v-model="tab">
        <v-tabs-slider></v-tabs-slider>
        <v-tab v-for="tabName in tabNames" :key="tabName">
          {{ tabName }}
        </v-tab>
      </v-tabs>

      <!-- 탭별 아이템 설정 -->
      <v-tabs-items v-model="tab" style="padding-top: 15px">
        <div class="sp-box-layout">
          <v-tab-item v-for="tabName in tabNames" :key="tabName">
            <!-- <project-edit-general v-if="tabName === 'General'" /> -->
            <project-edit-cluster v-if="tabName === 'Cluster'" />
            <!-- <project-edit-members v-if="tabName === 'Member'" /> -->
          </v-tab-item>
        </div>
      </v-tabs-items>
    </div>
    <div class="project__button-wrapper">
      <sp-button
        class="project__button project__button--cancel"
        elevation="0"
        dense
        @click="onClickCancel"
      >
        Cancel
      </sp-button>
      <sp-button
        class="project__button project__button--finish"
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
import { createNamespacedHelpers } from 'vuex'
// import ProjectEditGeneral from '@/views/project/tabs/ProjectEditGeneral.vue'
import ProjectEditCluster from '@/views/project/tabs/ProjectEditCluster.vue'
// import ProjectEditMembers from '@/views/project/tabs/ProjectEditMembers.vue'

const projectMapUtils = createNamespacedHelpers('project')
const loginUserMapUtils = createNamespacedHelpers('loginUser')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    // ProjectEditGeneral,
    ProjectEditCluster,
    // ProjectEditMembers,
  },

  data() {
    return {
      id: null,
      tab: null,
      // tabNames: ['General', 'Cluster', 'Member'], // 탭 명칭들
      tabNames: ['Cluster'], // 탭 명칭들
    }
  },

  created() {
    this.projectIdx = this.$route.params.id
    this.initProjectInfo()
    this.getUserRoleAllList()
  },

  computed: {
    ...projectMapUtils.mapGetters(['dataUserRoleAllList']),
    ...loginUserMapUtils.mapState(['currentMenuInfo']),
  },

  async mounted() {
    this.getDetail({ projectIdx: this.projectIdx, type: 'edit' })
    this.getClusterAllList({ projectIdx: this.projectIdx })
    this.getMemberAllList({ projectIdx: this.projectIdx })
    this.getUserRoleListForSelect()

    this.getCurrentClusterList({ projectIdx: this.projectIdx })
    this.getCurrentMemberList({ projectIdx: this.projectIdx })
  },

  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...projectMapUtils.mapMutations(['initProjectInfo']),
    ...projectMapUtils.mapActions(['getDetail']),
    ...projectMapUtils.mapActions(['getClusterAllList']),
    ...projectMapUtils.mapActions(['getMemberAllList']),
    ...projectMapUtils.mapActions(['getUserRoleListForSelect']),
    ...projectMapUtils.mapActions(['getUserRoleAllList']),
    ...projectMapUtils.mapActions(['updateProject']),
    ...projectMapUtils.mapActions(['getUserRoleAllList']),

    ...projectMapUtils.mapActions(['getCurrentClusterList']),
    ...projectMapUtils.mapActions(['getCurrentMemberList']),
    checkAuth() {
      if (this.currentMenuInfo && this.currentMenuInfo.writableYn !== 'Y') {
        this.$router.go(-1)
      }
    },

    onClickCancel() {
      this.$router.go(-1)
    },

    async onClickFinish() {
      // Project General
      // if (
      //   this.$store.state.project.editProjectName === undefined ||
      //   this.$store.state.project.editProjectName === ''
      // ) {
      //   this.openAlert({
      //     title: 'Project Name을 입력해 주세요.',
      //     type: 'error',
      //   })
      // }

      /* if (
        this.$store.state.project.editPmUser === undefined ||
        this.$store.state.project.editPmUser === null
      ) {
        this.openAlert({
          title: 'Project Manager를 선택해 주세요.',
          type: 'error',
        })
      } */

      // if (this.$store.state.project.editDescription !== '') {
      //   if (this.$store.state.project.editDescription.length > 200) {
      //     this.openAlert({
      //       title: 'Description 은 200자를 초과 입력할 수 없습니다.',
      //       type: 'error',
      //     })
      //   }
      // }

      // Project Member
      if (
        this.$store.state.project.editUserList !== undefined &&
        this.$store.state.project.editUserList !== null
      ) {
        // const roleList = this.$store.state.project.editUserList.filter(
        //   member => member.userRoleIdx === undefined,
        // )

        // if (roleList.length > 0) {
        //   this.openAlert({
        //     title: 'Project Member 의 권한을 선택해 주세요.',
        //     type: 'error',
        //   })
        //   return
        // }

        const memberList = this.$store.state.project.editUserList.filter(
          member =>
            member.userRoleIdx !== this.getUserRoleIdx('PROJECT_MANAGER'),
        )
        this.$store.state.project.editUserList = []
        this.$store.state.project.editUserList = memberList
        /* this.$store.state.project.editUserList.push(
          this.$store.state.project.editPmUser,
        ) */
      } else {
        this.$store.state.project.editUserList = null
        /* this.$store.state.project.editUserList.push(
          this.$store.state.project.editPmUser,
        ) */
      }

      const param = {
        projectIdx: this.projectIdx,
        projectName: this.$store.state.project.editProjectName,
        description: this.$store.state.project.editDescription,
        clusterList: this.$store.state.project.editClusterList,
        userList: this.$store.state.project.editUserList,
        projectManager: this.$store.state.project.editPmUser,
      }

      console.log('edit param === ', param)

      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.updateProject(param)
        console.log('response === ', response)
        if (response.status === 202) {
          if (response.data.code === '10001') {
            this.openAlert({
              title: `${this.$store.state.project.editProjectName} Service Group 이 수정되었습니다.`,
              type: 'info',
            })

            setTimeout(() => {
              this.$router.push(`/project/detail/${this.projectIdx}`)
            }, 1000)
          } else {
            this.openAlert({ title: response.data.message, type: 'error' })
          }
        } else {
          this.openAlert({ title: response.data.message, type: 'error' })
        }
      } catch (error) {
        this.openAlert({
          title: 'Service Group 을 수정하지 못했습니다.',
          type: 'error',
        })
      }
    },

    getUserRoleIdx(userRoleCode) {
      let result = 0
      const roleList = this.dataUserRoleAllList
      for (const role of roleList) {
        if (role.userRoleCode === userRoleCode) {
          result = role.userRoleIdx
          break
        }
      }

      return result
    },
  },

  beforeMount() {
    this.checkAuth()
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-box-layout {
  $this: 'project';
  .#{$this}__button-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 33px;
    height: 44px;
    //margin-right: 20px;

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
