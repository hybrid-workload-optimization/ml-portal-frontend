<template>
  <div class="sp-project-card-title-with-detail">
    <!-- 컴포넌트 왼쪽 부분 Start,  -->
    <div class="title-left">
      <!-- <h2 class="card-title">{{ detailInfo.projectName }}</h2> -->

      <h2
        class="card-title"
        v-if="detailInfo.projectName && detailInfo.projectName.length <= 20"
      >
        {{ detailInfo.projectName }}
      </h2>
      <v-tooltip
        bottom
        v-if="detailInfo.projectName && detailInfo.projectName.length > 20"
      >
        <template v-slot:activator="{ on }">
          <h2 class="card-title" v-on="on">
            {{ lessenText(detailInfo.projectName, 20) }}
          </h2>
        </template>
        <span>{{ detailInfo.projectName }}</span>
      </v-tooltip>

      <span class="left-label">Manager</span>
      <span class="left-content"
        >{{ detailInfo.projectPmName }}({{ detailInfo.projectPmEmail }})</span
      >
      <span class="left-label">Created</span>
      <span class="left-content">{{ detailInfo.createdAt }}</span
      ><br />
      <div id="desc" class="left-label" style="height: 4.5em; overflow: auto">
        <!-- <span v-html="content"></span> -->
        <template v-for="(c, index) in content">
          {{ c }} <br :key="index" />
        </template>
      </div>
    </div>

    <div class="title-middle">
      <div class="middle-wrapper">
        <div class="middle-content">
          <v-icon class="content-icon">mdi-cloud-upload-outline</v-icon>
          <span class="content-name">Cluster</span>
        </div>

        <div class="middle-count">
          <span class="content-count">{{ detailInfo.clusterCount }}</span>
        </div>

        <div class="middle-content">
          <v-icon class="content-icon">mdi-account-multiple</v-icon>
          <span class="content-name">Member</span>
        </div>

        <div class="middle-count">
          <span class="content-count">{{ detailInfo.userCount }}</span>
        </div>
      </div>
    </div>

    <div class="title-right">
      <slot name="additional-buttons"></slot>
      <sp-button outlined class="list-button title-button" @click="onClickList"
        >List</sp-button
      >
      <template v-if="showButton">
        <!-- <sp-button
          outlined
          class="edit-button title-button"
          @click="onClickEdit"
          >Edit</sp-button
        > -->

        <!-- <sp-button
          outlined
          class="delete-button title-button"
          @click="onClickDelete"
          >Delete</sp-button
        > -->
      </template>
    </div>

    <!-- <modal
      class="popup-cluster"
      title-name="Project 삭제"
      modal-width="456"
      :dialog="isOpenModal"
      @close-modal="onClickCloseModal"
    > -->
    <!-- 어느 부분까지 컴포넌트로 뺼지 협의 필요 -->
    <!-- <template v-slot:content>
        <div class="popup-cluster__title-wrapper">
          <div class="popup-cluster__title">
            선택하신 Project를 삭제하시겠습니까?
          </div>
          <div class="popup-cluster__title">삭제하시면 복구할 수 없습니다.</div>
        </div>
        <delete-cluster />
      </template>
      <template v-slot:footer>
        <div class="popup-cluster__button-wrapper">
          <sp-button
            class="popup-cluster--button cancel"
            elevation="0"
            dense
            @click="onClickCloseModal"
          >
            Cancel
          </sp-button>
          <sp-button
            class="popup-cluster--button finish"
            elevation="0"
            dense
            @click="onClickConfirmModal"
          >
            Confirm
          </sp-button>
        </div>
      </template>
    </modal> -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
// import Modal from '@/components/modals/Modal.vue'
// import DeleteCluster from '@/views/project/popup/ProjectClusterDeletePop.vue'

const projectMapUtils = createNamespacedHelpers('project')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    // Modal,
    // DeleteCluster,
  },

  props: {
    titleData: {
      type: Object,
      default: undefined,
    },
    showButton: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      projectIdx: null,
      isOpenModal: false,
      isOpenLabelModal: false,
      isOpenMessage: false,
      isOpenToast: false,
      isOpenLoading: false,
      isOpenEndPointModal: false,
    }
  },

  created() {
    this.projectIdx = this.$route.params.id
  },

  computed: {
    ...projectMapUtils.mapGetters(['detailInfo']),
    content() {
      // return this.detailInfo.description.split('\n').join('<br />')
      return this.detailInfo.description.split('\n')
    },
  },

  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...projectMapUtils.mapActions(['deleteProject']),

    onClickList() {
      this.$router.push('/project/list')
    },

    onClickEdit() {
      // this.$emit('on-click-edit')
      this.$router.push(`/project/edit/${this.projectIdx}`)
    },

    // 50 글자 넘어가면 말줄임표 추가
    lessenText(text, limit) {
      if (text.length > limit) {
        text = `${text.substr(0, limit - 1)}...`
      }
      return text
    },

    onClickDelete() {
      // this.$emit('on-click-delete')
      this.isOpenModal = true
      this.onClickCloseAlert()
      this.isOpenMessage = false
    },

    onClickCloseModal() {
      this.isOpenModal = false
    },
    onClickOpenModal() {
      this.isOpenModal = true
      this.onClickCloseAlert()
      this.isOpenMessage = false
    },
    onClickCloseLabelModal() {
      this.isOpenLabelModal = false
    },
    onClickOpenLabelModal() {
      this.isOpenLabelModal = true
      this.onClickCloseAlert()
      this.isOpenMessage = false
    },
    onClickCloseEndPointModal() {
      this.isOpenEndPointModal = false
    },
    onClickOpenEndPointModal() {
      this.isOpenEndPointModal = true
    },
    onClickConfirmModal() {
      this.isOpenMessage = true
      this.requestDeleteProject()
    },
    onClickConfirm() {
      this.isOpenMessage = false
      this.onClickCloseModal()
      this.onClickCloseLabelModal()
    },
    onClickCancel() {
      this.isOpenMessage = false
      this.isOpenToast = true
    },
    onClickCloseAlert() {
      this.isOpenToast = false
    },

    async requestDeleteProject() {
      this.onClickCloseModal()

      const param = {
        projectIdx: this.projectIdx,
        loginId: '33333',
        loginName: '테스터3',
        clusterList: this.$store.state.project.deleteClusterIdxs,
      }

      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.deleteProject(param)
        console.log('결과값 === ', response)
        if (response.status === 200) {
          if (response.data.code === '10001') {
            this.openAlert({ title: response.data.message, type: 'info' })
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
          title: '프로젝트를 삭제하지 못했습니다.',
          type: 'error',
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-project-card-title-with-detail {
  margin-bottom: 15px;
  .title-left {
    display: inline-block;
    width: 40%;
    vertical-align: middle;
    .card-title {
      color: $sp-title;
      font-size: toRem(34);
    }
    .left-label {
      opacity: 0.8;
      font-size: 0.8rem;
      margin-right: 10px;
      word-break: break-all;
    }
    .left-content {
      font-size: 0.8rem;
      margin-right: 20px;
    }
  }
  .title-middle {
    width: 20%;
    display: inline-block;
    vertical-align: middle;
    .middle-wrapper {
      display: flex;
      text-align: center;
      .middle-content {
        width: 50%;
        border-left: 1px solid $sp-box-border;
        padding: 20px;
        .content-icon {
          display: block;
          margin: auto;
        }
      }
      .middle-count {
        margin-right: 27px;
        padding-top: 20px;
        .content-count {
          font-size: 1.6rem;
        }
      }
    }
  }
  .title-right {
    width: 40%;
    display: inline-block;
    text-align: right;
    vertical-align: middle;

    .title-button {
      width: 120px;
      color: $sp-teriary;
      // border-radius: 50px;
      border-radius: 5px;
      border-width: thin;
      font-weight: bold;
    }
    .edit-button {
      margin-right: 10px;
    }
    .list-button {
      margin-right: 10px;
      color: $basic-button;
    }
  }
}

.popup-cluster__title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 25px 0;
  .popup-cluster__title {
    padding: 0;
    @include set-text(
      normal,
      16,
      rgba($color: $sp-title, $alpha: 1),
      false,
      true
    );
  }
}

.popup-cluster__button-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  .popup-cluster--button {
    border-radius: 100px;
    width: 114px;
    margin-top: 40px;
    margin-bottom: 25px;

    background-color: #fff !important;
    &.cancel {
      height: 44px;
      margin-right: 15px;
      @include set-text(bold, 13, rgba($color: $sp-sky-blue-500, $alpha: 1));
      border: thin solid rgba($color: $sp-sky-blue-500, $alpha: 1);
    }

    &.finish {
      height: 44px;
      @include set-text(bold, 13, rgba($color: $sp-teriary, $alpha: 1));
      border: thin solid rgba($color: $sp-teriary, $alpha: 1);
    }
  }
}

#desc::-webkit-scrollbar {
  width: 5px; /*스크롤바의 너비*/
}

#desc::-webkit-scrollbar-thumb {
  background-color: #c4c4c4; /*스크롤바의 색상*/
  border-radius: 5px;
}

.content {
  white-space: pre-line;
}
</style>
