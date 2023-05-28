<template>
  <div class="new-cluster-provider">
    <private-provider
      v-if="provider === 'Kubernetes'"
      ref="privateProvider"
      :editData="editData"
    />
    <private-provider-vsphere
      v-else-if="provider === 'VMware'"
      ref="privateProviderVsphere"
    />
    <public-provider
      ref="publicProvider"
      v-else-if="['AWS', 'Naver', 'Azure', 'GCP'].includes(provider)"
    />
    <empty v-else description="Please select a Provider."></empty>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import PrivateProviderVsphere from '@/views/project/cluster/components/new-cluster/PrivateProviderVsphere.vue'
import PrivateProvider from '@/views/project/cluster/components/new-cluster/PrivateProvider.vue'
import PublicProvider from '@/views/project/cluster/components/new-cluster/PublicProvider.vue'
import Empty from '@/components/Empty.vue'

const tag = '[cluster-reg-new-cluster]'

const clusterMapUtils = createNamespacedHelpers('cluster')

export default {
  components: {
    PrivateProvider,
    PublicProvider,
    PrivateProviderVsphere,
    Empty,
  },
  props: {
    editable: {
      type: Boolean,
      default: false,
      description: '수정 가능 여부',
    },
    editData: {
      type: Object,
      default() {
        return {
          clusterName: '',
          provider: '',
          cspAccount: '',
          description: '',
        }
      },
      description: '수정 데이터',
    },
  },
  data() {
    return {}
  },
  created() {
    console.log(tag)
    // console.log(this.provider)
  },
  methods: {
    onSave() {
      // 이벤트 전달
      if (this.provider === 'Kubernetes') {
        return this.$refs.PrivateProvider.onSubmit()
      }
      if (this.provider === 'VMware') {
        return this.$refs.privateProviderVsphere.onSubmit()
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
