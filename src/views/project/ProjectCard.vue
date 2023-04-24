<template>
  <sp-card class="sp-project" :class="{ isMini }" elevation="0">
    <div class="project__header-box">
      <div class="project__tag-box">
        <sp-chip v-if="fresh" class="project__tag NEW"> NEW </sp-chip>
        <sp-chip v-if="owner" class="project__tag Owner"> Owner </sp-chip>
      </div>
      <!-- <sp-menu>
        <template v-slot:item="slotProps">
          <div v-bind="slotProps.item.attrs" v-on="slotProps.item.on">
            <v-icon>more_horiz</v-icon>
          </div>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title
              style="font-size: 12px; cursor: pointer"
              @click="onProjectDetailView(id)"
              >상세보기</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              style="text-align: left; font-size: 12px; cursor: pointer"
              @click="onProjectEdit(id)"
              >수정</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              style="text-align: left; font-size: 12px; cursor: pointer"
              @click="onProjectDelete(projectName, id)"
              >삭제</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </sp-menu> -->
    </div>
    <div class="project__contents-box" style="margin-top: 8px">
      <div
        class="project__title"
        v-if="projectName && projectName.length <= 11"
        @click="moveToDetailPage(id)"
      >
        {{ projectName }}
      </div>
      <v-tooltip bottom v-if="projectName && projectName.length > 11">
        <template v-slot:activator="{ on }">
          <div class="project__title" v-on="on" @click="moveToDetailPage(id)">
            {{ lessenText(projectName) }}
          </div>
        </template>
        <span>{{ projectName }}</span>
      </v-tooltip>
      <div class="project__cluster-wrapper">
        <div class="project__long-box project__cluster-box">
          <div class="project__cluster-title">
            <div class="project__cluster__image-wrapper">
              <sp-image
                contain
                lazySrc="icon_cluster1.svg"
                src="icon_cluster1.svg"
              />
            </div>
            Clusters
          </div>
          <div class="project__cluster-num">{{ clusterCount }}</div>
        </div>
        <div class="project__long-box project__cluster-box">
          <div class="project__cluster-title">
            <div class="project__cluster__image-wrapper">
              <sp-image contain lazySrc="icon_users.svg" src="icon_users.svg" />
            </div>
            Members
          </div>
          <div class="project__cluster-num">{{ userCount }}</div>
        </div>
      </div>
    </div>
    <div class="project__footer-box">
      <div class="project__names-wrapper">
        <div class="project__owner">{{ projectUserName }}</div>
        <div class="project__authority-wrapper">
          <div class="project__authority">Project Manager</div>
          <div class="project__createdAt">{{ updatedAt }}</div>
        </div>
      </div>
    </div>
  </sp-card>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    projectName: {
      type: String,
      default: '',
    },
    clusterCount: {
      type: Number,
      default: 0,
    },
    userCount: {
      type: Number,
      default: 0,
    },
    projectUserName: {
      type: String,
      default: '',
    },
    updatedAt: {
      type: String,
      default: '',
    },
    owner: {
      type: String,
      default: '',
    },
    fresh: {
      type: String,
      default: '',
    },
  },

  data() {
    return {}
  },

  computed: {
    isMini() {
      return this.$store.state.sideNav.isMini
    },
  },

  methods: {
    onProjectDetailView(id) {
      this.$router.push(`/project/detail/${id}`)
    },

    onProjectEdit(id) {
      this.$router.push(`/project/edit/${id}`)
    },

    onProjectDelete(projectName, id) {
      this.$parent.requestProjectDelete(projectName, id)
    },

    lessenText(text) {
      if (text.length > 11) {
        text = `${text.substr(0, 10)}...`
      }
      return text
    },
    // 상세 페이지로 이동 요청
    moveToDetailPage(id) {
      if (id) {
        this.$router.push(`/project/detail/${id}`)
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-project {
  $this: 'project';

  width: 18.8%;
  margin-right: 1.5%;
  margin-bottom: 1.5%;

  &:nth-child(5n) {
    margin-right: 0;
  }

  &.isMini {
    width: 15.4%;
    margin-right: 1.5%;
    &:nth-child(6n) {
      margin-right: 0;
    }
  }

  .card-body {
    padding: 0 !important;
  }

  // height: 150px;
  // max-height: 150px;
  border: 1px solid rgba($color: $sp-box-border, $alpha: 1) !important;
  background: rgba($color: #fff, $alpha: 1) !important;

  .#{$this}__header-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    padding-top: 20px;
    .#{$this}__tag-box {
      display: flex;
      align-items: center;

      .#{$this}__tag {
        @include set-text(500, 11, rgba($color: #fff, $alpha: 1));
        padding: 0 15px;
        height: 21px;
        margin-right: 5px;
        &.NEW {
          background: $sp-cerise !important;
        }
        &.Owner {
          background: $sp-blue-400 !important;
        }
      }
    }
    .#{$this}--more {
      .v-btn__content {
        padding: 0;
        margin: 0;
      }
      background: transparent;
      padding: 0;
      height: 0;
      min-width: 0;
    }
  }
  .#{$this}__contents-box {
    width: 100%;
    padding-top: 11px;
    padding: 0 20px;
    .#{$this}__title {
      @include set-text(bold, 24, rgba($color: $sp-title, $alpha: 1));
      cursor: pointer;
    }
    .#{$this}__cluster-wrapper {
      padding-top: 24px;
      .#{$this}__long-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba($color: $sp-box-border, $alpha: 1);
        padding: 11px 2px;
        &:first-child {
          border-top: 1px solid rgba($color: $sp-box-border, $alpha: 1);
        }
        &.#{$this}__cluster-box {
          .#{$this}__cluster-title {
            display: flex;
            align-items: center;
            @include set-text(500, 13, rgba($color: $sp-title, $alpha: 1));
            .#{$this}__cluster__image-wrapper {
              width: 18px;
              height: 18px;
              margin-right: 21px;
            }
          }
          .#{$this}__cluster-num {
            @include set-text(bold, 16, rgba($color: $sp-title, $alpha: 1));
          }
        }
      }
    }
  }
  .#{$this}__footer-box {
    margin-top: 22px;
    padding-bottom: 13px;
    padding-top: 10px;
    border-top: 1px solid rgba($color: $sp-box-border, $alpha: 1);
    .#{$this}__names-wrapper {
      padding: 0 20px;
      .#{$this}__owner {
        @include set-text(500, 13, rgba($color: $sp-title, $alpha: 1));
      }
      .#{$this}__authority-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        @include set-text(500, 11, rgba($color: $sp-title, $alpha: 0.75));
      }
    }
  }
}

.v-list-item {
  min-height: 25px;
}
</style>
