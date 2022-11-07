<template>
  <div class="sp-authority-basic-info">
    <sp-card headered label="권한그룹 기본 정보" outlined elevation="0">
      <div class="info-input-box authority-name">
        <label-with-text
          name="권한명"
          :value="authorityName"
          @input="setAuthorityName"
          placeholder="권한명"
          class="input-box"
          :className="{ inputStyle: { color: '#1A3350' } }"
          background-color="#F7F9FB"
        ></label-with-text>
      </div>
      <div class="info-input-box">
        <label-with-text
          name="권한 설명"
          lines="multi"
          :value="authorityDescription"
          @input="setDescription"
          class="input-box"
          placeholder="권한 설명"
          background-color="#F7F9FB"
          :className="{ inputStyle: { color: '#1A3350' } }"
        ></label-with-text>
      </div>
    </sp-card>
  </div>
</template>

<script>
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import { createNamespacedHelpers } from 'vuex'

const authorityMapUtil = createNamespacedHelpers('authority')

export default {
  components: { LabelWithText },
  data: () => ({}),
  computed: {
    authorityName() {
      const authGroup = this.$store.getters['authority/getAuthGroup']
      return authGroup.userRoleName ? authGroup.userRoleName : ''
    },
    authorityDescription() {
      const authGroup = this.$store.getters['authority/getAuthGroup']
      return authGroup.description ? authGroup.description : ''
    },
  },
  methods: {
    ...authorityMapUtil.mapMutations(['setIsChanged']),
    setAuthorityName(value) {
      this.setIsChanged()
      this.$store.commit('authority/setAuthorityName', value)
    },
    setDescription(value) {
      this.setIsChanged()
      this.$store.commit('authority/setDescription', value)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-authority-basic-info {
  .sp-card {
    min-height: 260px;
    .card-header {
      padding-left: 20px;
      height: 50px;
      .card-title {
        font-size: toRem(15);
      }
    }
    .card-body {
      padding: 20px;
    }
  }
  .authority-name {
    margin-bottom: 5px;
  }
  .info-input-box {
    .v-input,
    .v-input__slot {
      font-size: 15px !important;
    }
  }
}
</style>
