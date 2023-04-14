<template>
  <div class="sp-end-point">
    <template v-for="item in ruleList">
      <div
        class="end-point__text-box"
        v-if="item.endpoints.length < 1"
        :key="item.endpoints.epIndex"
      >
        <p class="end-point__text">
          Endpoint가 존재하지 않습니다. <br />
          Ingress Controller를 설치하려면 <br /><span class="bold-text"
            >[Ingress Controller 설치하기]</span
          >
          를 클릭하시기 바랍니다.
        </p>
      </div>
      <div
        class="end-point__list-box"
        :key="epIndex"
        v-for="(endpoint, epIndex) in item.endpoints"
      >
        <div class="end-point__url">
          {{ endpoint }}
        </div>
        <div class="end-point__button-wrapper">
          <sp-button
            title="바로가기"
            @click="onClickLink(endpoint)"
            class="end-point--button"
            elevation="0"
            dense
          >
            <div class="end-point__image-wrapper">
              <sp-image
                contain
                lazySrc="icon_link.svg"
                src="icon_link.svg"
                alt="바로가기"
              />
            </div>
          </sp-button>
          <sp-button
            title="복사"
            @click="onClickCopy(endpoint)"
            class="end-point--button"
            elevation="0"
            dense
          >
            <div class="end-point__image-wrapper">
              <sp-image
                contain
                lazySrc="icon_copy.svg"
                src="icon_copy.svg"
                alt="복사"
              />
            </div>
          </sp-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import EndPoint from '@/assets/data/endPoint'

const ingressMapUtils = createNamespacedHelpers('ingress')
export default {
  data() {
    return {
      endPoint: EndPoint,
    }
  },
  methods: {
    getUrl(item) {
      return `${item.protocol}://${item.host}:${item.port}${item.path}`
    },
    onClickLink(url) {
      window.open(url, '_blank')
      return url
    },
    onClickCopy(url) {
      navigator.clipboard.writeText(url).then(() => console.log('Copy'))
      this.$store.commit('alert/openAlert', {
        title: '복사되었습니다.',
        type: 'info',
      })
      return url
    },
  },
  computed: {
    ...ingressMapUtils.mapGetters(['detailInfo']),
    ...ingressMapUtils.mapGetters(['ruleList']),
  },
}
</script>
<style lang="scss">
@import '@/styles/_mixin.scss';

.sp-popup-layout {
  border: 1px solid blue;
  width: 100%;
}

.end-point__text-box {
  width: 100%;
  padding: 15px;
  border: 1px solid $box-border;
  border-radius: 5px;
  p {
    @include set-text(normal, 18, rgba($sp-title, $alpha: 1));
    .bold-text {
      font-weight: bold;
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
@include popup-buttons('popup-cluster', 'finish');
@include popup-buttons('popup-new-label', 'create');
@include popup-buttons('popup-end-point');
</style>
