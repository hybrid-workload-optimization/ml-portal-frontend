<template>
  <div class="sp-end-point">
    <div class="end-point__text-box" v-if="endPoint.length < 1">
      <p class="end-point__text">
        Endpoint가 존재하지 않습니다. <br />
        Ingress Controller를 설치하려면 [Ingress Controller 설치하기] 를
        클릭하시기 바랍니다.
      </p>
    </div>
    <div class="end-point__list-box" v-for="{ id, url } in endPoint" :key="id">
      <div class="end-point__url">{{ url }}</div>
      <div class="end-point__button-wrapper">
        <sp-button
          @click="onClickLink"
          class="end-point--button"
          elevation="0"
          dense
        >
          <div class="end-point__image-wrapper">
            <sp-image contain lazySrc="icon_link.svg" src="icon_link.svg" />
          </div>
        </sp-button>
        <sp-button
          @click="onClickCopy"
          class="end-point--button"
          elevation="0"
          dense
        >
          <div class="end-point__image-wrapper">
            <sp-image contain lazySrc="icon_copy.svg" src="icon_copy.svg" />
          </div>
        </sp-button>
      </div>
    </div>
  </div>
</template>

<script>
import EndPoint from '@/assets/data/endPoint'

const tag = '[EndPoint]'

export default {
  data() {
    return {
      endPoint: EndPoint,
    }
  },
  methods: {
    onClickLink() {
      console.log(tag, 'onClickLink')
    },
    onClickCopy() {
      console.log(tag, 'onClickCopy')
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-end-point {
  $this: 'end-point';
  // padding: 0 21px;
  max-height: 190px;
  @include scroll();
  overflow-y: auto;
  padding: 0 27px;
  padding-top: 34px;

  .#{$this}__list-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba($color: $sp-box-border, $alpha: 1);
    margin-bottom: 8px;

    .#{$this}__url {
      @include set-text(500, 16, rgba($color: $sp-title, $alpha: 1));
    }

    .#{$this}__button-wrapper {
      display: flex;
      align-items: center;
      padding-bottom: 8px;
      .#{$this}--button {
        &:first-child {
          margin-right: 8px;
        }
        background-color: #ffffffcc;
        padding: 0;
        min-width: 40px;
        border: 1px solid rgba($color: $sp-box-border, $alpha: 1);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        .#{$this}__image-wrapper {
          width: 15px;
          height: 15px;
        }
      }
    }
  }
}
</style>
