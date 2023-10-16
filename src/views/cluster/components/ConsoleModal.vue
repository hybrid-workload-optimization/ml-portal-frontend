<template>
  <MinimizeModal
    modal-width="1200"
    modal-height="620"
    body-height="560px"
    :dialog="consoleModal.open"
    @close-modal="onCloseModal"
  >
    <template #content>
      <Console
        :accessPath="accessPath"
        console
        resourceType="kubectl"
      ></Console>
    </template>
  </MinimizeModal>
</template>

<script>
import MinimizeModal from '@/components/modals/MinimizeModal.vue'
import Console from '@/components/Console.vue'
import { createNamespacedHelpers } from 'vuex'

const consoleMapUtils = createNamespacedHelpers('console')

export default {
  data() {
    return {
      accessPath: '',
      clusterId: null,
    }
  },
  components: { MinimizeModal, Console },
  computed: {
    ...consoleMapUtils.mapGetters(['consoleModal']),
  },
  mounted() {
    this.clusterId = this.$route.params.id
    this.setAccessPath()
  },
  methods: {
    ...consoleMapUtils.mapMutations(['updateConsoleModal']),
    setAccessPath() {
      this.accessPath = `/kubectl/${this.clusterId}`
    },
    onCloseModal() {
      this.updateConsoleModal({ open: false })
    },
  },
}
</script>

<style lang="scss" scoped></style>
