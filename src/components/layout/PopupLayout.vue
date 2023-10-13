<template>
  <div class="sp-popup-layout">
    <h1>프로젝트 삭제 팝업 #14 (완료)</h1>
    <modal
      class="popup-cluster"
      title-name="Project 삭제"
      modal-width="456"
      :dialog="isOpenModal"
      @close-modal="onClickCloseModal"
    >
      <sp-button
        slot="buttons"
        elevation="0"
        color="primary"
        dense
        @click="onClickOpenModal"
      >
        모달 + 컨펌 + 토스트
      </sp-button>

      <!-- 어느 부분까지 컴포넌트로 뺼지 협의 필요 -->
      <template #content>
        <div class="popup-cluster__title-wrapper">
          <div class="popup-cluster__title">
            선택하신 Project를 삭제하시겠습니까?
          </div>
          <div class="popup-cluster__title">삭제하시면 복구할 수 없습니다.</div>
        </div>
        <delete-cluster />
      </template>
      <template #footer>
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
    </modal>

    <confirm @confirm-modal="onClickConfirm" timeout="3000" />
    <alert
      :dialog="isOpenToast"
      titleName="메시지 에러"
      @close-Alert="onClickCloseAlert"
    />
    <div class="form-layout__description">
      <div>이벤트</div>
      - onClickCloseModal : 모달 닫기
      <br />
      - onClickOpenModal: 모달 열기
      <br />
      - onClickConfirmModal: 컨펌 열기
      <br />
      - onClickCancel: 컨펌 닫기
      <br />
      - onClickCloseAlert: 알림(토스트) 닫기
      <br />
      <br />
      <div>값</div>
      - isOpenModal : 모달 열림 여부
      <br />
      - isOpenMessage : 컨펌 열림 여부
      <br />
      - isOpenToast : 알림(토스트) 열림 여부
      <br />
      <br />
      <div>slot</div>
      - #content : 모달 컨텐츠 영역 > 원하는 컴포넌트 삽입
      <br />
      - #footer : 모달 푸터 영역 > 원하는 컴포넌트 삽입
      <br />
    </div>

    <h1>로딩 컴포넌트 #19 (완료)</h1>
    <sp-button
      slot="buttons"
      elevation="0"
      color="primary"
      dense
      @click="onClickOpenLoading"
    >
      로딩 컴포넌트
    </sp-button>
    <dimmed v-if="isOpenLoading"><loading /></dimmed>
    <div class="form-layout__description">
      <div>이벤트</div>
      - onClickOpenLoading : 로딩 컴포넌트 열기
      <br />
      <br />
      <div>값</div>
      - isOpenLoading : 로딩 열림 여부
      <br />
    </div>

    <h1>에디터 팝업</h1>
    <sp-button
      slot="buttons"
      elevation="0"
      color="primary"
      dense
      @click="onClickOpenEditor"
      >에디터 팝업</sp-button
    >
    <yaml-edit-modal></yaml-edit-modal>

    <h1>레이블 추가 양식 팝업 컴포넌트 #24 (완료)</h1>
    <modal
      class="popup-new-label"
      title-name="New Label"
      modal-width="446"
      :dialog="isOpenLabelModal"
      @close-modal="onClickCloseLabelModal"
    >
      <sp-button
        slot="buttons"
        elevation="0"
        color="primary"
        dense
        @click="onClickOpenLabelModal"
      >
        New Label
      </sp-button>

      <!-- 어느 부분까지 컴포넌트로 뺼지 협의 필요 -->
      <template #content>
        <label-form />
      </template>
      <template #footer>
        <div class="popup-new-label__button-wrapper">
          <sp-button
            class="popup-new-label--button cancel"
            elevation="0"
            dense
            @click="onClickCloseLabelModal"
          >
            취소
          </sp-button>
          <sp-button
            class="popup-new-label--button create"
            elevation="0"
            dense
            @click="onClickConfirmModal"
          >
            생성
          </sp-button>
        </div>
      </template>
    </modal>
    <div class="form-layout__description">
      <div>이벤트</div>
      - onClickCloseLabelModal : 모달 닫기
      <br />
      - onClickOpenLabelModal: 모달 열기
      <br />
      - onClickConfirmModal: 컨펌 열기
      <br />
      - onClickCancel: 컨펌 닫기
      <br />
      - onClickCloseAlert: 알림(토스트) 닫기
      <br />
      <br />
      <div>값</div>
      - isOpenLabelModal : 모달 열림 여부
      <br />
      - isOpenMessage : 컨펌 열림 여부
      <br />
      - isOpenToast : 알림(토스트) 열림 여부
      <br />
      <br />
      <div>slot</div>
      - #content : 모달 컨텐츠 영역 > 원하는 컴포넌트 삽입
      <br />
      - #footer : 모달 푸터 영역 > 원하는 컴포넌트 삽입
      <br />
    </div>

    <h1>End point 팝업 컴포넌트 #26 (완료)</h1>
    <modal
      class="popup-end-point"
      title-name="External Endpoint"
      modal-width="446"
      :dialog="isOpenEndPointModal"
      @close-modal="onClickCloseEndPointModal"
    >
      <sp-button
        slot="buttons"
        elevation="0"
        color="primary"
        dense
        @click="onClickOpenEndPointModal"
      >
        EndPoint
      </sp-button>

      <!-- 어느 부분까지 컴포넌트로 뺼지 협의 필요 -->
      <template #content>
        <end-point />
      </template>
      <template #footer>
        <div class="popup-end-point__button-wrapper">
          <sp-button
            class="popup-end-point--button cancel"
            elevation="0"
            dense
            @click="onClickCloseEndPointModal"
          >
            Cancel
          </sp-button>
        </div>
      </template>
    </modal>
    <div class="form-layout__description">
      <div>이벤트</div>
      - onClickCloseEndPointModal : 모달 닫기
      <br />
      - onClickOpenEndPointModal: 모달 열기
      <br />
      <br />
      <div>값</div>
      - isOpenEndPointModal : 모달 열림 여부
      <br />
      <br />
      <div>slot</div>
      - #content : 모달 컨텐츠 영역 > 원하는 컴포넌트 삽입
      <br />
      - #footer : 모달 푸터 영역 > 원하는 컴포넌트 삽입
      <br />
    </div>
  </div>
</template>

<script>
import Modal from '@/components/modals/Modal.vue'
import Confirm from '@/components/molcule/Confirm.vue'
import Alert from '@/components/molcule/Alert.vue'
import DeleteCluster from '@/components/modals/contents/DeleteCluster.vue'
import EndPoint from '@/components/modals/contents/EndPoint.vue'
import LabelForm from '@/components/LabelForm.vue'
import Loading from '@/components/Loading.vue'
import Dimmed from '@/components/molcule/Dimmed.vue'
import YamlEditModal from '@/components/molcule/YamlEditModal.vue'
import { createNamespacedHelpers } from 'vuex'

const confirmMapUtils = createNamespacedHelpers('confirm')

const tag = '[PopupLayout]'

export default {
  props: {},
  components: {
    Modal,
    Confirm,
    Alert,
    DeleteCluster,
    EndPoint,
    Loading,
    Dimmed,
    LabelForm,
    YamlEditModal,
  },
  data() {
    return {
      isOpenModal: false,
      isOpenLabelModal: false,
      isOpenMessage: false,
      isOpenToast: false,
      isOpenLoading: false,
      isOpenEndPointModal: false,
      isOpenEditor: false,
    }
  },
  methods: {
    ...confirmMapUtils.mapMutations(['openConfirm']),
    onClickCloseModal() {
      console.log(tag, 'onClickCloseModal')
      this.isOpenModal = false
    },
    onClickOpenModal() {
      console.log(tag, 'onClickOpenModal')
      this.isOpenModal = true
      this.onClickCloseAlert()
      this.isOpenMessage = false
    },
    onClickCloseLabelModal() {
      console.log(tag, 'onClickCloseLabelModal')
      this.isOpenLabelModal = false
    },
    onClickOpenLabelModal() {
      console.log(tag, 'onClickOpenLabelModal')
      this.isOpenLabelModal = true
      this.onClickCloseAlert()
      this.isOpenMessage = false
    },
    onClickCloseEndPointModal() {
      console.log(tag, 'onClickCloseEndPointModal')
      this.isOpenEndPointModal = false
    },
    onClickOpenEndPointModal() {
      console.log(tag, 'onClickOpenEndPointModal')
      this.isOpenEndPointModal = true
    },
    onClickConfirmModal() {
      console.log(tag, 'onClickConfirmModal')
      this.openConfirm('정말 삭제하시겠습니까?')
    },
    onClickConfirm() {
      console.log(tag, 'onClickConfirm')
      this.isOpenMessage = false
      this.onClickCloseModal()
      this.onClickCloseLabelModal()
    },
    onClickCancel() {
      console.log(tag, 'onClickCancel')
      this.isOpenMessage = false
      this.isOpenToast = true
    },
    onClickCloseAlert() {
      console.log(tag, 'onClickCloseAlert')
      this.isOpenToast = false
    },
    onClickOpenLoading() {
      console.log(tag, 'onClickOpenLoading')
      this.isOpenLoading = true
      setTimeout(() => {
        this.isOpenLoading = false
      }, 3000)
    },
    onClickOpenEditor() {
      console.log(tag, 'onClickOpenEditor')
      this.$store.commit('yamlEditModal/openModal', 'yaml')
    },
  },
}
</script>
<style lang="scss">
@import '@/styles/_mixin.scss';

.sp-popup-layout {
  border: 1px solid blue;
  width: 100%;
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
@include popup-buttons('popup-cluster', 'finish');
@include popup-buttons('popup-new-label', 'create');
@include popup-buttons('popup-end-point');
</style>
