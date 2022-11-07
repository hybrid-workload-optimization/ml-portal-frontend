<template>
  <div class="sp-project-edit-general">
    <label-with-text
      name="Project Name"
      :horizontal="true"
      background-color="#F5F5f5"
      :className="labelWithTextClass"
      :value="detailInfo.projectName"
      @input="onChangeProjectName"
    />

    <label-with
      name="Project Manager"
      horizontal
      :className="labelWithTextClass"
    >
      <template #append-content class="authority_template">
        <sp-select
          class="sp__input authority_select"
          background-color="#fff"
          hide-details="auto"
          outlined
          single-line
          flat
          :value="detailInfo.projectPmId"
          :items="dataManagerUserList"
          @input="onChangeProjectManager"
        />
      </template>
    </label-with>

    <label-with-text
      class="general-layout__label"
      name="Description"
      :horizontal="true"
      background-color="#F5F5f5"
      :className="labelWithTextClass"
      lines="multi"
      :value="detailInfo.description"
      @input="onChangeProjectDesc"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWith from '@/components/molcule/LabelWith.vue'

const projectMapUtils = createNamespacedHelpers('project')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    LabelWithText,
    LabelWith,
  },

  computed: {
    // ...projectMapUtils.mapGetters(['dataUserAllListForSelect']),
    ...projectMapUtils.mapGetters(['detailInfo']),
    ...projectMapUtils.mapGetters(['dataUserRoleAllList']),
    ...projectMapUtils.mapGetters(['dataManagerUserList']),
  },

  data() {
    return {
      projectIdx: null,
      projectName: '',
      description: '',

      labelWithTextClass: {
        // titleStyle: {
        //  fontWeight: 'bold',
        //  fontSize: '1rem',
        //  width: '200px',
        // },
        inputStyle: {
          readonly: this.readOnly,
          fontSize: '2rem',
          borderRadius: '5px',
        },
        authList: [],

        selectPmUser: [],
      },
    }
  },

  created() {
    // this.getUserAllListForSelect()
    this.projectIdx = this.$route.params.id
    this.onChangeProjectName(this.detailInfo.projectName)
    this.onChangeProjectDesc(this.detailInfo.description)
    this.getUserWithManagerList({ projectIdx: this.projectIdx })
  },

  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    // ...projectMapUtils.mapActions(['getUserAllListForSelect']),
    ...projectMapUtils.mapActions(['updateProject']),
    ...projectMapUtils.mapActions(['getUserWithManagerList']),

    onChangeProjectName(value) {
      // this.projectName = value
      this.$store.state.project.editProjectName = value
    },

    onChangeProjectManager(value) {
      // const list = []
      const managerInfo = {
        userId: value,
        userRoleIdx: this.getUserRoleIdx('PROJECT_MANAGER'),
      }

      console.log('managerInfo === ', managerInfo)

      this.$store.state.project.editPmUser = managerInfo
    },

    onChangeProjectDesc(value) {
      // this.description = value
      this.$store.state.project.editDescription = value
    },

    /* onClickCancel() {
      this.$router.go(-1)
    }, */

    /* async onClickFinish() {
      if (this.projectName === '') {
        this.openAlert({
          title: 'Project Name을 입력해 주세요.',
          type: 'error',
        })
        return
      }

      if (this.description !== '') {
        if (this.description.length > 200) {
          this.openAlert({
            title: 'Description 은 200자를 초과 입력할 수 없습니다.',
            type: 'error',
          })
          return
        }
      }

      if (this.selectPmUser === undefined) {
        this.selectPmUser = null
      }

      const param = {
        projectIdx: this.projectIdx,
        projectName: this.projectName,
        description: this.description,
        userList: this.selectPmUser,
        // loginId: '22222',
        // loginNmae: '테스터',
      }

      console.log('param === ', param)

      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.updateProject(param)
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
          title: '프로젝트 General 정보를 수정하지 못했습니다.',
          type: 'error',
        })
      }
    }, */

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
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-project-edit-general {
  $this: 'sp';

  .sp-label-with-text,
  .sp-label-with {
    margin-bottom: 20px;
  }

  .#{$this}__label {
    width: 10%;
  }
  .#{$this}__input {
    border-radius: 5px;
  }
  .sp-text-area {
    width: 70%;
    border: thin solid $sp-box-border;
    border-radius: 5px;
  }

  .sp-select {
    height: 40px;
    .v-input__append-inner {
      margin-top: 9px;
      margin-bottom: 8px;
    }
  }

  .sp__content {
    width: 90%;
  }

  .sp-box-layout {
    margin: 10px 0;

    .sub-title {
      font-weight: bold;
      line-height: 2.5rem;
      font-size: 1.2rem;
    }

    .info-table {
      display: flex;
      padding: 0 20px;

      .info-item {
        display: flex;
        flex-direction: column;
        padding: 0 10px;
        min-width: 150px;

        .info-item__label {
          color: rgba(26, 51, 80, 0.5);
          font-weight: bold;
          align-self: center;
        }
        .info-item__value {
          align-self: center;
        }
      }
    }
  }

  $this: 'project';
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
