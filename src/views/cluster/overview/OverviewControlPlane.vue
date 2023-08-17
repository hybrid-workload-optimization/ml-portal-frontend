<template>
  <sp-card class="sp-overview" :class="{ isMini }" elevation="0">
    <div class="overview-header">Control Plane Component</div>

    <div class="overview-content">
      <div class="content-left">
        <div class="list-item" v-for="item in data" :key="item.uid">
          <div class="overview__image-wrapper">
            <sp-image
              v-if="item.health === 'Healthy'"
              contain
              lazySrc="icon_healthy.svg"
              src="icon_healthy.svg"
              width="22"
            />
            <sp-image
              v-else
              contain
              lazySrc="icon_unhealthy.svg"
              src="icon_unhealthy.svg"
              width="22"
            />
          </div>
          <span
            >{{ item.name }} ({{ item.podCountReady }}/{{
              item.podCountTotal
            }})</span
          >
        </div>
      </div>
    </div>
  </sp-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
    },
  },
  data() {
    return {}
  },
  computed: {
    isMini() {
      return this.$store.state.sideNav.isMini
    },
  },
  mounted() {
    console.log(this.data)
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.content-left {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .list-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    width: 50%;
    height: 40px;
  }
}
</style>
