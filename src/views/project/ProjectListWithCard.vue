<template>
  <div class="sp-list-content">
    <div class="search-wrapper">
      <search
        v-if="dataListSize"
        class="sp-basic-search"
        :title="'Total:'"
        :todoCount="dataListSize.toString()"
        @change="onProjectSearch"
        @input="onInputSearchValue"
        @click="onNewProject"
        button-text="New Project"
      >
        <template v-slot:btn-group>
          <v-btn-toggle
            slot="btn-group"
            v-model="toggleIdx"
            rounded
            mandatory
            dense
            class="sp-basic-toggle-button"
          >
            <sp-button class="sp-basic-toggle--click" @click="onClickList()">
              <v-icon class="icon__list-bullet">format_list_bulleted</v-icon>
            </sp-button>
            <sp-button class="sp-basic-toggle--click">
              <v-icon class="icon__web-asset">web_asset</v-icon>
            </sp-button>
          </v-btn-toggle></template
        >
      </search>
    </div>
    <div class="sp-project-wrapper">
      <project
        v-for="{
          id,
          projectName,
          clusterCount,
          userCount,
          projectUserName,
          updatedAt,
          owner,
          fresh,
        } in searching"
        :key="id"
        :id="id.toString()"
        :projectName="projectName"
        :clusterCount="clusterCount"
        :userCount="userCount"
        :projectUserName="projectUserName"
        :updatedAt="updatedAt"
        :owner="owner"
        :fresh="fresh"
      />
    </div>
    <confirm @confirm-modal="onProjectDeleteConfirm" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Search from '@/components/molcule/DataTableSearch.vue'
import Project from '@/views/project/ProjectCard.vue'
// import ProjectData from '@/assets/data/project'
// import Empty from '@/components/Empty.vue'
import Confirm from '@/components/molcule/Confirm.vue'

const projectMapUtils = createNamespacedHelpers('project')
const confirmMapUtils = createNamespacedHelpers('confirm')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    Search,
    Project,
    // Empty,
    Confirm,
  },
  data() {
    return {
      // project: ProjectData,
      toggleIdx: 1,
      createFailToast: false,
      createOkToast: false,
      searchValue: '',
      projectIdx: null,

      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
      headers: [
        {
          text: 'Project Name',
          align: 'center',
          value: 'projectName',
        },
        {
          text: 'Description',
          align: 'center',
          value: 'description',
        },
        {
          text: 'Cluster',
          align: 'center',
          value: 'clusterCount',
        },
        {
          text: 'Member',
          align: 'center',
          value: 'userCount',
        },
        {
          text: 'ProjectManager',
          align: 'center',
          value: 'projectUserName',
        },
        {
          text: 'Updated',
          align: 'center',
          value: 'updatedAt',
        },
      ],
      // 그리드 설정 값
      options: {
        hideFooter: false,
        hideHeader: false,
        dark: false,
        dense: false,
        disableFiltering: false,
        disablePagination: false,
        disableSort: false,
        fixedHeader: true,
        showSelect: false,
        itemKey: 'id',
      },
    }
  },

  created() {},

  computed: {
    ...projectMapUtils.mapGetters(['dataList']), // project.js에 저장된 dataList 값 반환(project.js)
    ...projectMapUtils.mapGetters(['dataListSize']), // project.js에 저장된 dataListSize 값 반환(project.js)

    searching() {
      if (!this.searchValue) return this.dataList
      const search = this.searchValue.toLowerCase()
      return this.dataList.filter(item => {
        const text = item.projectName.toLowerCase()
        return text.indexOf(search) > -1
      })
    },
  },

  mounted() {
    this.getListData()
  },

  methods: {
    ...confirmMapUtils.mapMutations(['openConfirm']),
    ...alertMapUtils.mapMutations(['openAlert']),
    ...projectMapUtils.mapActions(['getList']), // 리스트 조회 요청(project.js)
    ...projectMapUtils.mapActions(['deleteProject']),

    onInputSearchValue(value) {
      this.searchValue = value
    },

    // 리스트 조회 요청
    getListData() {
      // 조회 요청에서 필요한 parameter 세팅(호출한 api 파라미터 형태에 맞춰서 커스텀하게 생성)
      // 페이징 호출 관련 파라미터 세팅과 동작은 getList(project.js) 메서드와 common.js의 api 객체 참고
      const param = {
        userId: '22222',
        projectName: this.searchValue,
      }
      this.getList(param)
    },

    // Search 박스 입력값 변경 시 호출됨
    onProjectSearch(value) {
      this.searchValue = value
    },

    // New Project 버튼 클릭 시 호출됨
    onNewProject() {
      this.$router.push('/project/new')
    },

    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { id } = data

      if (id) {
        this.$router.push(`/project/detail/${id}`)
      }
    },

    onClickList() {
      this.$router.push('/project/list')
    },

    requestProjectDelete(projectName, id) {
      this.projectIdx = id
      const reqName = this.lessenText(projectName)
      this.openConfirm(`'${reqName}' 프로젝트를 삭제 하시겠습니까?`)
    },

    async onProjectDeleteConfirm() {
      const param = {
        projectIdx: this.projectIdx,
      }

      try {
        const response = await this.deleteProject(param)
        if (response.status === 200) {
          if (response.data.code === '10001') {
            this.openAlert({ title: response.data.message, type: 'info' })
            setTimeout(() => {
              // this.$router.push('/project/card')
              this.getListData()
            }, 1000)
          } else {
            this.openAlert({ title: response.data.message, type: 'error' })
          }
        } else {
          this.openAlert({ title: response.data.message, type: 'error' })
        }
      } catch (error) {
        this.openAlert({
          title: '프로젝트를 삭제하지 못했습니다.',
          type: 'error',
        })
      }
    },

    lessenText(text) {
      if (text.length > 12) {
        text = `${text.substr(0, 11)}...`
      }
      return text
    },
  },
}
</script>
<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-list-content {
  $this: 'form-layout';

  .sp-project-wrapper {
    padding-top: 15px;
    display: flex;
    flex-wrap: wrap;
  }
  .#{$this}__resource-box {
    .card-body {
      height: 100%;
    }
  }
  .sp-basic-search {
    .sp-basic-toggle-button {
      padding-right: 10px;
      .sp-basic-toggle--click {
        background-color: #f5f8fbcc;
        border: 1px solid rgba($color: #4b556680, $alpha: 1);
        &.v-item--active {
          background-color: $sp-teriary;
          .v-icon {
            @include set-text(normal, 20, rgba($color: #fff, $alpha: 0.2));
            color: #fff !important;
          }
        }

        .v-icon {
          @include set-text(
            normal,
            20,
            rgba($color: $sp-box-border, $alpha: 1)
          );
          color: $sp-sky-blue-500 !important;
        }
      }
    }
    .search-wrapper {
      width: 40%;
      @include desktop-small {
        width: 60%;
      }
    }
  }
}
</style>
