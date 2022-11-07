<template>
  <div class="sp-notification" :class="isMore ? 'more' : ''">
    <div class="notification__header-box">Notifications</div>
    <template v-if="notification.length">
      <div
        ref="notificationRef"
        class="notification__contents-box"
        :class="isMore ? 'more' : ''"
      >
        <div
          class="notification__content"
          v-for="noti in notification"
          :key="noti.alertIdx"
          @mouseenter="toggleDeleteButton(noti.alertIdx)"
          @mouseleave="showDeleteButtonIdx = ''"
          @click="onClickNotification(noti)"
        >
          <div class="notification__title-wrapper">
            <div class="notification__title">
              <span>{{ getTitle(noti) }}</span>
            </div>
            <div class="notification__message">
              <span>{{ noti.workJobStatus }}</span>
              <span class="created">{{ createdAt(noti.createdAt) }}</span>
            </div>
          </div>
          <div
            v-if="noti.confirmYn === 'Y'"
            class="notification__check-wrapper"
          >
            <v-icon class="notification__check-icon" contain>check</v-icon>
          </div>
          <!-- TODO Delete button (임시) -->
          <div
            v-show="showDeleteButtonIdx === noti.alertIdx"
            class="notification__delete-wrapper"
            @click.stop="onClickDeleteNoti(noti.alertIdx)"
          >
            <v-icon class="notification__delete-icon" contain>cancel</v-icon>
          </div>
        </div>
      </div>
      <div class="notification__footer-box" v-if="!isMore" @click="onClickMore">
        More
      </div>
      <div class="notification__footer-box" v-if="isMore" @click="onClickLess">
        Less
      </div>
    </template>
    <div class="notification-no-item" v-else>알림 내역이 없습니다.</div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import moment from 'moment'

const notificationMapUtil = createNamespacedHelpers('notification')
const tag = '[sp-notification]'

export default {
  props: {},
  data() {
    return {
      isMore: false,
      showDeleteButtonIdx: '',
    }
  },
  computed: {
    ...notificationMapUtil.mapState(['notification']),
    createdAt() {
      return value => (value ? moment(value).format('YYYY-MM-DD hh:mm:ss') : '')
    },
  },
  methods: {
    ...notificationMapUtil.mapMutations(['updateShowNotification']),
    ...notificationMapUtil.mapActions([
      'updateNotification',
      'deleteNotification',
    ]),
    getTitle(noti) {
      let type
      switch (noti.workJobType) {
        case 'CLUSTER_CREATE':
          type = '생성'
          break
        case 'CLUSTER_SCALE':
          type = '스케일 조정'
          break
        case 'CLUSTER_DELETE':
          type = '삭제'
          break
        default:
          type = ''
          break
      }
      let status
      switch (noti.workJobStatus) {
        case 'STARTED':
          status = '시작!'
          break
        case 'SUCCESS':
          status = '완료!'
          break
        case 'FAIL':
          status = '실패!'
          break
        default:
          // WAITING
          status = ''
          break
      }
      return `${noti.clusterName} 클러스터 ${type} ${status}`
    },
    async onClickNotification(noti) {
      const result = await this.updateNotification({ alertIdx: noti.alertIdx })
      if (result) {
        await this.updateShowNotification(false)
        if (
          // 클러스터의 최신 상태가 삭제 완료가 아닐 때 detail 화면으로 이동
          !this.notification.some(
            item =>
              ['SUCCESS'].includes(item.workJobStatus) &&
              item.workJobType === 'CLUSTER_DELETE' &&
              item.clusterIdx === noti.clusterIdx,
          )
        ) {
          this.$router
            .push(`/cluster/detail/${noti.clusterIdx}`)
            .catch(() => {})
        }
      } else {
        this.$store.commit('alert/openAlert', {
          title: '다시 선택해 주세요.',
          type: 'warn',
        })
      }
    },
    onClickMore() {
      console.log(tag, 'onClickMore')
      this.isMore = true
    },
    onClickLess() {
      console.log(tag, 'onClickLess')
      this.$refs.notificationRef.scrollTop = 0
      this.isMore = false
    },
    toggleDeleteButton(id) {
      this.showDeleteButtonIdx = id
    },
    onClickDeleteNoti(id) {
      this.deleteNotification({ alertIdx: id })
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-notification {
  $this: 'notification';
  width: 300px;
  height: 350px;
  padding: 15px;
  padding-bottom: 11px;
  border: 1px solid $sp-box-border;
  border-radius: 5px;
  background-color: #fff;
  @include box-shadow(5px, 5px, 10px, 0, #8a8a8a1a);

  &.more {
    height: 380px;
  }
  .#{$this}__header-box {
    padding-top: 6px;
    padding-bottom: 10px;
    height: calc(21px + 26px);
    @include set-text(bold, 17, rgba($color: $sp-black-700, $alpha: 1));
    border-bottom: 1px solid $sp-box-border;
  }
  .#{$this}__contents-box {
    width: 100%;
    height: calc(100% - 39px - 41px);
    overflow: hidden;
    &.more {
      @include scroll();
      overflow-y: auto;
    }
    .#{$this}__content {
      padding: 10px 0;
      border-bottom: 1px solid $sp-box-border;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      .#{$this}__title {
        @include set-text(500, 15, rgba($color: $sp-black-500, $alpha: 1));
      }
      .#{$this}__message {
        @include set-text(normal, 12, rgba($color: $sp-grey-400, $alpha: 1));

        .created {
          margin-left: 10px;
        }
      }
      .#{$this}__title-wrapper {
        width: 85%;
      }
      .#{$this}__check-wrapper {
        width: 17px;
        height: 17px;
        border-radius: 150px;
        background-color: #32b931;
        display: flex;
        align-items: center;
        justify-content: center;
        .#{$this}__check-icon {
          @include set-text(normal, 14, rgba($color: #fff, $alpha: 1));
        }
      }
      .#{$this}__delete-wrapper {
        width: 17px;
        height: 17px;
        border-radius: 150px;
        background-color: $sp-grey-300;
        display: flex;
        align-items: center;
        justify-content: center;
        .#{$this}__delete-icon {
          @include set-text(normal, 14, rgba($color: #fff, $alpha: 1));
          font-size: 1rem;
        }
      }
    }
  }
  .#{$this}-no-item {
    display: flex;
    height: 85%;
    align-items: center;
    justify-content: center;
  }
  .#{$this}__footer-box {
    width: 100%;
    height: calc(11px + 28px);
    text-align: center;
    padding-top: 10px;
    border-top: 1px solid $sp-box-border;
    cursor: pointer;
    @include set-text(bold, 15, rgba($color: $sp-teriary, $alpha: 1));
  }
}
</style>
