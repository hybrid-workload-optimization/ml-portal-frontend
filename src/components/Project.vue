<template>
  <sp-card class="sp-project" :class="{ isMini }" elevation="0">
    <div class="project__header-box">
      <div class="project__tag-box">
        <sp-chip v-if="isNew" class="project__tag NEW"> NEW </sp-chip>
        <sp-chip v-if="isOwner" class="project__tag Owner"> Owner </sp-chip>
      </div>
      <sp-menu left min-width="150px" max-width="200px">
        <template #item="slotProps">
          <sp-button
            v-bind="slotProps.item.attrs"
            v-on="slotProps.item.on"
            class="project--more"
            elevation="0"
          >
            <v-icon>more_horiz</v-icon>
          </sp-button>
        </template>
        <v-list class="project__list-wrapper">
          <v-list-item
            dense
            class="project__list-item-wrapper"
            v-for="(item, index) in userMenu"
            :key="index"
          >
            <v-list-item-title class="project__list-item-title">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </sp-menu>
    </div>
    <div class="project__contents-box">
      <div class="project__title">{{ title }}</div>
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
          <div class="project__cluster-num">{{ clustersNum }}</div>
        </div>
        <div class="project__long-box project__cluster-box">
          <div class="project__cluster-title">
            <div class="project__cluster__image-wrapper">
              <sp-image contain lazySrc="icon_users.svg" src="icon_users.svg" />
            </div>
            Members
          </div>
          <div class="project__cluster-num">{{ membersNum }}</div>
        </div>
      </div>
    </div>
    <div class="project__footer-box">
      <div class="project__names-wrapper">
        <div class="project__owner">{{ ownerName }}</div>
        <div class="project__authority-wrapper">
          <div class="project__authority">{{ authority }}</div>
          <div class="project__createdAt">{{ createdAt }}</div>
        </div>
      </div>
    </div>
  </sp-card>
</template>

<script>
const tag = '[sp-Project]'

export default {
  props: {
    id: {
      type: String,
      default: '',
      description: '프로젝트 id',
    },
    ownerName: {
      type: String,
      default: '',
      description: '프로젝트 ownerName',
    },
    isNew: {
      type: Boolean,
      default: false,
      description: '새로둔 프로젝트인지 여부',
    },
    isOwner: {
      type: Boolean,
      default: false,
      description: '프로젝트 관리자 여부',
    },
    title: {
      type: String,
      default: '',
      description: '프로젝트 title',
    },
    tags: {
      type: Array,
      default: () => [],
      description: '프로젝트 tags',
    },
    clustersNum: {
      type: String,
      default: '',
      description: '프로젝트 clustersNum',
    },
    membersNum: {
      type: String,
      default: '',
      description: '프로젝트 membersNum',
    },
    authority: {
      type: String,
      default: '',
      description: '프로젝트 authority',
    },
    createdAt: {
      type: String,
      default: '',
      description: '프로젝트 createdAt',
    },
  },
  data() {
    return {
      userMenu: [{ title: '옵션1' }, { title: '옵션2' }, { title: '옵션3' }],
    }
  },
  computed: {
    isMini() {
      console.log(tag, 'isMini')
      return this.$store.state.sideNav.isMini
    },
  },
  methods: {
    onClickMore() {
      console.log(tag, 'onChangeSearch')
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

  @include desktop-medium {
    &:nth-child(5n) {
      margin-right: 0;
    }
  }

  &.isMini {
    width: 15.4%;
    margin-right: 1.5%;
    @include desktop-medium {
      &:nth-child(6n) {
        margin-right: 0;
      }
    }
  }

  @include desktop-small {
    width: 23%;
    margin-right: 2.5%;
    margin-bottom: 2.5%;

    &:nth-child(4n) {
      margin-right: 0;
    }

    &.isMini {
      width: 18.4%;
      margin-right: 2%;
      &:nth-child(5n) {
        margin-right: 0;
      }
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
    .#{$this}__list-wrapper {
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
</style>
