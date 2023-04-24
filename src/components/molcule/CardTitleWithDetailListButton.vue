<template>
  <div class="sp-card-title-with-detail">
    <!-- 컴포넌트 왼쪽 부분 Start,  -->
    <div
      class="title-left"
      v-if="!isMiddleTitle"
      :style="{ width: !isMiddleTitle ? '60%' : '40%' }"
    >
      <h2 class="card-title">{{ titleData.title }}</h2>
      <v-tooltip bottom v-if="titleData.status === 'Unhealthy'" color="#F4B740">
        <template v-slot:activator="{ on }">
          <div class="healthy-status" v-on="on">
            <sp-image
              class="healthy-image"
              contain
              :lazySrc="setImageState(titleData.status)"
              :src="setImageState(titleData.status)"
            />
            <span class="healthy-text">{{ titleData.status }}</span>
          </div>
        </template>
        <ul class="problem-list">
          <li v-for="(data, idx) in titleData.problem" :key="idx">
            {{ data }}
          </li>
        </ul>
      </v-tooltip>
      <div class="healthy-status" v-else>
        <sp-image
          class="healthy-image"
          contain
          :lazySrc="setImageState(titleData.status)"
          :src="setImageState(titleData.status)"
        />
        <span class="healthy-text">{{ titleData.status }}</span>
      </div>
      <span class="left-label" v-if="titleData.userRoleName">{{
        titleData.userRoleName
      }}</span>
      <span class="left-content" v-if="titleData.id">
        <template v-if="titleData.name">
          {{ titleData.name }}({{ titleData.id }})
        </template>
        <template v-if="!titleData.name && titleData.id">
          {{ titleData.id }}
        </template></span
      ><br />
      <span class="left-label" v-if="titleData.date">Created</span>
      <span class="left-content" v-if="titleData.date">{{
        titleData.date
      }}</span>
      <span class="left-label" v-if="titleData.update">Updated</span>
      <span class="left-content" v-if="titleData.update">{{
        titleData.update
      }}</span>
      <br v-if="titleData.date || titleData.update" />
      <span
        class="left-label"
        v-if="titleData.description && titleData.description.length <= 50"
      >
        {{ titleData.description }}
      </span>
      <v-tooltip
        bottom
        v-if="titleData.description && titleData.description.length > 50"
      >
        <template v-slot:activator="{ on }">
          <span class="left-label" v-on="on">{{
            lessenText(titleData.description)
          }}</span>
        </template>
        <span>{{ titleData.description }}</span>
      </v-tooltip>
    </div>

    <div
      class="title-middle"
      v-if="isMiddleTitle"
      :style="{ width: isMiddleTitle ? '20%' : '0' }"
    >
      <div class="middle-wrapper" v-if="titleData.clusterCount">
        <div class="middle-content">
          <v-icon class="content-icon">mdi-cloud-upload-outline</v-icon>
          <span class="content-name">Cluster</span>
        </div>

        <div class="middle-count">
          <span class="content-count">{{ titleData.clusterCount }}</span>
        </div>

        <div class="middle-content">
          <v-icon class="content-icon">mdi-account-multiple</v-icon>
          <span class="content-name">Member</span>
        </div>

        <div class="middle-count">
          <span class="content-count">{{ titleData.memberCount }}</span>
        </div>
      </div>
    </div>

    <div class="title-right">
      <slot name="additional-buttons"></slot>
      <template v-if="showButtons">
        <sp-button
          outlined
          class="List-button title-button"
          :disabled="isDisabled"
          @click="onClickList"
          >List</sp-button
        >
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titleData: {
      type: Object,
      default: undefined,
    },
    showButtons: {
      type: Boolean,
      default: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    deleteButtonName: {
      type: String,
      default: 'Delete',
    },
  },
  data: () => ({}),
  computed: {
    isMiddleTitle() {
      return (
        Object.keys(this.titleData).includes('clusterCount') ||
        Object.keys(this.titleData).includes('memberCount')
      )
    },
    setImageState() {
      // eslint-disable-next-line consistent-return
      return state => {
        switch (state) {
          case 'Deploying':
            return 'icon_loading.gif'
          case 'Unhealthy':
            return 'icon_unhealthy.svg'
          case 'Healthy':
            return 'icon_healthy.svg'
          case 'Fail':
            return 'icon_unhealthy.svg'
          case 'Error':
            return 'icon_unhealthy.svg'
          case 'Waiting':
            return 'icon_waiting.svg'
          case 'Deleting':
            return 'icon_loading.gif'
          case 'Scale in':
            return 'icon_loading.gif'
          case 'Scale out':
            return 'icon_loading.gif'
          default:
            break
        }
      }
    },
  },
  methods: {
    onClickList() {
      this.$emit('click-list')
    },
    // 50 글자 넘어가면 말줄임표 추가
    lessenText(text) {
      if (text.length > 50) {
        text = `${text.substr(0, 49)}...`
      }
      return text
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-card-title-with-detail {
  margin-bottom: 15px;
  .title-left {
    display: inline-block;
    width: 40%;
    vertical-align: middle;
    .card-title {
      color: $sp-title;
      font-size: toRem(34);
      display: inline-flex;
    }
    .healthy-status {
      margin-left: 20px;
      display: inline-flex;
      align-items: center;
      .healthy-image {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
      .healthy-text {
        color: black;
        opacity: 0.6;
        font-size: 0.8rem;
      }
    }
    .left-label {
      opacity: 0.8;
      font-size: 0.8rem;
      margin-right: 10px;
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
  }
}
</style>
