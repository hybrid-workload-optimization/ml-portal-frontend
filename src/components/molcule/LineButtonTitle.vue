<template>
  <div class="line-button-title-wrapper">
    <div class="title-wrapper" @click="onClickLabel">
      <span class="title-text">{{ title }}</span>
      <div class="line-item">
        <span class="ico-arrow">
          <v-icon class="small" v-show="!flag">arrow_drop_down</v-icon>
          <v-icon class="small" v-show="flag">arrow_drop_up</v-icon>
        </span>
      </div>
    </div>

    <v-slide-y-transition>
      <div class="content-warpper" v-if="flag">
        <slot name="content"></slot>
      </div>
    </v-slide-y-transition>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      flag: true,
    }
  },
  methods: {
    onClickLabel() {
      if (this.flag) {
        // advancedLabelFlag 이 true이면 false로 변경
        this.flag = false
        this.$emit('change', this.flag)
      } else {
        // advancedLabelFlag가 false면 true로 변경
        this.flag = true
        this.$emit('change', this.flag)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.line-button-title-wrapper {
  &:nth-child(n-1) {
    margin-bottom: 32px;
  }
  .title-wrapper {
    display: flex;
    cursor: pointer;
    margin-bottom: 10px;

    .title-text {
      width: 15%;
    }

    .line-item {
      display: flex;
      flex-basis: 100%;
      align-items: center;

      &::before {
        content: '';
        flex-grow: 1;
        margin: 0 30px;
        background-color: rgba(0, 0, 0, 0.35);
        height: 1px;
        font-size: 0;
        line-height: 0;
      }

      .ico-arrow {
        margin-left: 30px;
        cursor: pointer;
      }
    }
  }
  .content-warpper {
    padding: 0 10px;
    transition: 0.2s;
  }
}
</style>
