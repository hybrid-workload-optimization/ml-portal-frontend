<template>
  <div class="new-cluster-provider">
    <private-provider
      v-if="provider === 'Kubernetes'"
      ref="privateProvider"
      :edit-data="editData"
      :editable="editable"
    />
    <public-provider
      ref="publicProvider"
      v-else-if="['AWS', 'Naver', 'Azure', 'GCP'].includes(provider)"
    />
    <empty v-else description="Provider를 선택해 주세요."></empty>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import PrivateProvider from '@/views/cluster/components/new-cluster/PrivateProvider.vue'
import PublicProvider from '@/views/cluster/components/new-cluster/PublicProvider.vue'
import Empty from '@/components/Empty.vue'

const tag = '[cluster-reg-new-cluster]'

const clusterMapUtils = createNamespacedHelpers('cluster')

export default {
  components: { PrivateProvider, PublicProvider, Empty },
  props: {
    editable: {
      type: Boolean,
      default: false,
      description: '수정 가능 여부',
    },
    editData: {
      type: Object,
      default: {},
      description: '수정 데이터',
    },
  },
  mounted() {
    console.log(tag)
  },
  methods: {
    onSave() {
      // 이벤트 전달
      if (this.provider === 'Kubernetes') {
        return this.$refs.privateProvider.onSave()
      }
      return this.$refs.publicProvider.onSubmit()
    },
  },
  computed: {
    ...clusterMapUtils.mapGetters(['provider']),
  },
}
</script>

<style lang="scss">
.new-cluster-provider {
  padding: 20px 15px;

  .title-wrapper {
    .title-text {
      font-size: toRem(20);
      color: $sub-title;
    }
  }
}
</style>
