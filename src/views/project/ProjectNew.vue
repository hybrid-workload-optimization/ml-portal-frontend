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
            <project-new-general v-if="tabName === 'General'" />
            <project-new-cluster v-if="tabName === 'Cluster'" />
            <project-new-members
              v-if="tabName === 'Member'"
              ref="projectMembers"
            />
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
import ProjectNewGeneral from '@/views/project/tabs/ProjectNewGeneral.vue'
import ProjectNewCluster from '@/views/project/tabs/ProjectNewCluster.vue'
import ProjectNewMembers from '@/views/project/tabs/ProjectNewMembers.vue'

const projectMapUtils = createNamespacedHelpers('project')
const alertMapUtils = createNamespacedHelpers('alert')
const loginUserMapUtils = createNamespacedHelpers('loginUser')

export default {
  components: {
    ProjectNewGeneral,
    ProjectNewCluster,
    ProjectNewMembers,
  },

  data() {
    return {
      id: null,
      tab: null,
      tabNames: ['General', 'Cluster', 'Member'], // 탭 명칭들,
      testName: '',
    }
  },

  created() {
    this.projectIdx = this.$route.params.id
    this.initProjectInfo()
    this.getUserRoleAllList()
    // this.$store.state.project.newProjectName = ''
    // this.$store.state.project.newPmUser = null
    // console.log('initName === ', this.$store.state.project.newProjectName)
    // console.log('initUser === ', this.$store.state.project.newPmUser)
  },

  computed: {
    ...projectMapUtils.mapGetters(['dataUserRoleAllList']),
    ...loginUserMapUtils.mapState(['currentMenuInfo']),
  },

  mounted() {
    // this.getClusterList({ projectIdx: this.projectIdx })
    this.getUserRoleListForSelect()
  },

  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...projectMapUtils.mapMutations(['initProjectInfo']),
    ...projectMapUtils.mapActions(['createProject']),
    ...projectMapUtils.mapActions(['getUserRoleListForSelect']),
    ...projectMapUtils.mapActions(['getUserRoleAllList']),

    /* getProjectMembers() {
      return this.$refs.projectMembers
    }, */

    onClickCancel() {
      this.openAlert({
        title: 'Project 생성이 취소 되었습니다.',
        type: 'error',
      })
      setTimeout(() => {
        this.$router.push('/project/list')
      }, 1000)
    },

    async onClickFinish() {
      if (
        this.$store.state.project.newProjectName === undefined ||
        this.$store.state.project.newProjectName === ''
      ) {
        this.openAlert({
          title: 'Project Name을 입력해 주세요.',
          type: 'error',
        })
        return
      }

      console.log('newPmUser === ', this.$store.state.project.newPmUser)
      if (
        this.$store.state.project.newPmUser === undefined ||
        this.$store.state.project.newPmUser === null
      ) {
        this.openAlert({
          title: 'Project Manager를 선택해 주세요.',
          type: 'error',
        })
        return
      }

      if (this.$store.state.project.newUserList !== undefined) {
        const roleList = this.$store.state.project.newUserList.filter(
          member => member.userRoleIdx === undefined,
        )

        if (roleList.length > 0) {
          this.openAlert({
            title: 'Project Member 의 권한을 선택해 주세요.',
            type: 'error',
          })
          return
        }

        const memberList = this.$store.state.project.newUserList.filter(
          member =>
            member.userRoleIdx !== this.getUserRoleIdx('PROJECT_MANAGER'),
        )
        this.$store.state.project.newUserList = []
        this.$store.state.project.newUserList = memberList
        this.$store.state.project.newUserList.push(
          this.$store.state.project.newPmUser,
        )
      } else {
        this.$store.state.project.newUserList = []
        this.$store.state.project.newUserList.push(
          this.$store.state.project.newPmUser,
        )
      }

      if (this.$store.state.project.newDescription !== '') {
        if (this.$store.state.project.newDescription.length > 200) {
          this.openAlert({
            title: 'Description 은 200자를 초과 입력할 수 없습니다.',
            type: 'error',
          })
          return
        }
      }

      const param = {
        // loginId: '22222',
        // loginName: '테스터',
        projectName: this.$store.state.project.newProjectName,
        description: this.$store.state.project.newDescription,
        clusterList: this.$store.state.project.newClusterList,
        userList: this.$store.state.project.newUserList,
      }

      console.log('new param === ', param)

      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.createProject(param)
        console.log('response === ', response)
        if (response.status === 201) {
          if (response.data.code === '10001') {
            this.openAlert({
              title: `${this.$store.state.project.newProjectName} Project 생성이 완료 되었습니다.`,
              type: 'info',
            })

            setTimeout(() => {
              this.$router.push('/project/list')
            }, 1000)
          } else {
            this.openAlert({ title: response.data.message, type: 'error' })
          }
        } else {
          this.openAlert({ title: response.data.message, type: 'error' })
        }
      } catch (error) {
        this.openAlert({
          title: '프로젝트를 생성하지 못했습니다.',
          type: 'error',
        })
      }

      // this.$refs.projectMembers.onClickFinish()

      /* console.log(
        'erewtwet4e4terte ter============ ',
        this.$store.state.newUserList,
      )
      if (this.$store.state.newUserList.length > 0) {
        for (const value of this.$store.state.newUserList) {
          console.log(value.projectUserRole)
          if (value.projectUserRole === undefined) {
            this.openAlert('프로젝트 사용자의 권한을 선택해 주세요.')
            return
          }
        }
      }

      this.openAlert('등록') */
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
    checkAuth() {
      if (this.currentMenuInfo && this.currentMenuInfo.writableYn !== 'Y') {
        this.$router.go(-1)
      }
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
