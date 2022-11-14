<template>
  <div class="sp-project-card-title-with-detail">
    <!-- 컴포넌트 왼쪽 부분 Start,  -->
    <div class="title-left">
      <h2
        class="card-title"
        v-if="detailInfo.name && detailInfo.name.length <= 20"
      >
        {{ detailInfo.name }}
        <div class="card-title-status">
          <label :class="{ 'status-green': detailInfo.status }">
            {{ detailInfo.status }}
          </label>
        </div>
      </h2>
      <v-tooltip bottom v-if="detailInfo.name && detailInfo.name.length > 20">
        <template v-slot:activator="{ on }">
          <h2 class="card-title" v-on="on">
            {{ lessenText(detailInfo.name, 20) }}
          </h2>
        </template>
        <span>{{ detailInfo.name }}</span>
      </v-tooltip>

      <span class="left-label">Created By</span>
      <span class="left-content">{{ detailInfo.userId }}</span>
      <span class="left-label">Created</span>
      <span class="left-content">{{ detailInfo.createdAt }}</span
      ><br />
      <div id="desc" class="left-label" style="height: 4.5em; overflow: auto">
        <!-- <span v-html="content"></span> -->
        <template v-for="value in content">
          {{ value }}
        </template>
      </div>
    </div>
    <div class="title-right">
      <div class="right-title">Monitoring</div>
      <div>
        <span class="right-label">Prometheus URL :</span>
        <span class="right-content">
          <a :href="detailInfo.promethusUrl" target="_blank">{{
            detailInfo.promethusUrl
          }}</a>
        </span>
      </div>
      <div>
        <span class="right-label">Grafana URL :</span>
        <span class="right-content">
          <a :href="detailInfo.grafanaUrl" target="_blank">{{
            detailInfo.grafanaUrl
          }}</a>
        </span>
      </div>
    </div>
    <div class="title-middle"></div>
    <div class="title-right-btn">
      <slot name="additional-buttons"></slot>
      <sp-button outlined class="list-button title-button" @click="onClickList"
        >List</sp-button
      >
      <sp-button
        outlined
        class="delete-button title-button"
        @click="onClickDelete"
        >Delete</sp-button
      >
    </div>

    <modal
      class="popup-ml"
      title-name="Machine Learning 삭제"
      modal-width="456"
      :dialog="isOpenModal"
      @close-modal="onClickCloseModal"
    >
      <!-- 어느 부분까지 컴포넌트로 뺼지 협의 필요 -->
      <template v-slot:content>
        <div class="popup-ml__title-wrapper">
          <div class="popup-ml__title">
            선택하신 Machine learning을 삭제하시겠습니까?
          </div>
          <div class="popup-ml__title">이 작업은 되돌릴 수 없습니다.</div>
        </div>
        <delete-cluster />
      </template>
      <template v-slot:footer>
        <div class="popup-ml__button-wrapper">
          <sp-button
            class="popup-ml--button cancel"
            elevation="0"
            dense
            @click="onClickCloseModal"
          >
            Cancel
          </sp-button>
          <sp-button
            class="popup-ml--button finish"
            elevation="0"
            dense
            @click="onClickConfirmModal"
          >
            Confirm
          </sp-button>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Modal from '@/components/modals/Modal.vue'
import DeleteCluster from '@/views/ml/popup/MLClusterDeletePopup.vue'

const mlMapUtils = createNamespacedHelpers('ml')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    Modal,
    DeleteCluster,
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
    ...mlMapUtils.mapGetters(['detailInfo']),
    content() {
      // return this.detailInfo.description.split('\n').join('<br />')
      return this.detailInfo.description.split('\n')
    },
  },
  methods: {
    ...alertMapUtils.mapMutations(['openAlert']),
    ...mlMapUtils.mapActions(['deleteML']),

    onClickList() {
      this.$router.push('/ml/list')
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
      this.requestDeleteML()
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

    async requestDeleteML() {
      this.onClickCloseModal()

      const param = {
        deleteCluster: true,
        mlId: this.detailInfo.mlId,
      }

      try {
        // 업데이트 요청 (async로 선언된 메서드는 await로 받아야 한다. 그렇지 않으면 promise가 리턴된다)
        const response = await this.deleteML(param)
        if (response.status === 200) {
          if (response.data.code === '10001') {
            this.openAlert({ title: response.data.message, type: 'info' })
            setTimeout(() => {
              this.$router.push('/ml/list')
            }, 1000)
          } else {
            this.openAlert({ title: response.data.message, type: 'error' })
          }
        } else {
          this.openAlert({ title: response.data.message, type: 'error' })
        }
      } catch (error) {
        this.openAlert({
          title: '머신러닝을 삭제하지 못했습니다.',
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
      .card-title-status {
        display: inline-block;
        .status-green {
          background-color: #00e200;
          border: 0px;
          display: inline-block;
          font-size: toRem(20);
          color: white;
          font-family: none;
          text-align: center;
          vertical-align: middle;
          border-radius: 7px;
          margin-left: 1em;
          width: 100px;
          height: 35px;
        }
      }
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

  .title-right {
    display: inline-block;
    width: 30%;
    vertical-align: middle;
    .right-title {
      color: $sp-title;
      font-size: toRem(18);
      text-align: left;
    }
    .right-label {
      opacity: 0.8;
      font-size: 0.8rem;
      margin-right: 10px;
      word-break: break-all;
    }
    .right-content {
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
  .title-right-btn {
    width: 40%;
    display: inline-block;
    text-align: right;
    vertical-align: middle;
    float: right;

    .title-button {
      width: 120px;
      color: $sp-teriary;
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

.popup-ml__title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 25px 0;
  .popup-ml__title {
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

.popup-ml__button-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  .popup-ml--button {
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
