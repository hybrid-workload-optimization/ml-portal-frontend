<template>
  <sp-button depressed elevation="0" icon @click="openConsole">
    <v-icon dense color="#fff">terminal</v-icon>
  </sp-button>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const consoleMapUtils = createNamespacedHelpers('console')

export default {
  computed: {
    ...consoleMapUtils.mapGetters(['consoleModal']),
  },
  methods: {
    ...consoleMapUtils.mapMutations(['updateConsoleModal']),
    openConsole() {
      this.updateConsoleModal({ open: true })
    },
  },
}
</script>

<style lang="scss" scoped></style>
