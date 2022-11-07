<template>
  <div class="sp-sample-component">
    <!-- <h3>#은 ReadMe파일 > PPT 번호를 의미</h3>
    <h3>Props의 대한 설명은 해당 컴포넌트 파일에서 확인 - description 부분</h3> -->
    <v-tabs class="sample-component__tabs" v-model="tab" color="#000">
      <v-tabs-slider color="#000"></v-tabs-slider>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items
      class="sample-component__tab-item"
      :class="isFullPage"
      v-model="tab"
    >
      <v-tab-item v-for="item in items" :key="item">
        <form-layout v-if="item === 'form'" />
        <popup-layout v-if="item === 'popup'" />
        <bar-layout v-if="item === 'bar'" />
        <box-layout v-if="item === 'box'" />
        <table-layout v-if="item === 'table'" />
        <chart-layout v-if="item === 'chart'" />
        <editor-layout v-if="item === 'editor'" />
        <console-layout v-if="item === 'console'" />
        <cluster-layout v-if="item === 'cluster'" />
        <member-layout v-if="item === 'member'" />
        <general-layout v-if="item === 'general'" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import FormLayout from '@/components/layout/FormLayout.vue'
import PopupLayout from '@/components/layout/PopupLayout.vue'
import BarLayout from '@/components/layout/BarLayout.vue'
import BoxLayout from '@/components/layout/BoxLayout.vue'
import TableLayout from '@/components/layout/TableLayout.vue'
import ClusterLayout from '@/components/layout/ClusterLayout.vue'
import MemberLayout from '@/components/layout/MemberLayout.vue'
import EditorLayout from '@/components/layout/EditorLayout.vue'
import ConsoleLayout from '@/components/layout/ConsoleLayout.vue'
import ChartLayout from '@/components/layout/ChartLayout.vue'
import GeneralLayout from '@/components/layout/GeneralLayout.vue'

export default {
  components: {
    FormLayout,
    PopupLayout,
    BarLayout,
    BoxLayout,
    TableLayout,
    ClusterLayout,
    MemberLayout,
    EditorLayout,
    ConsoleLayout,
    ChartLayout,
    GeneralLayout,
  },
  data() {
    return {
      tab: null,
      items: [
        'form',
        'popup',
        'bar',
        'box',
        'cluster',
        'member',
        'console',
        'chart',
        'table',
        'general',
        'editor',
      ],
    }
  },
  computed: {
    isFullPage() {
      console.log(this.tab)
      switch (this.tab) {
        case 4:
          document
            .querySelector('html')
            .classList.add('sample-component__full-page')
          return 'sample-component__full-page'
        case 5:
          document
            .querySelector('html')
            .classList.add('sample-component__full-page')
          return 'sample-component__full-page'
        default:
          document
            .querySelector('html')
            .classList.remove('sample-component__full-page')
          return ''
      }
    },
  },
}
</script>

<style lang="scss">
.sp-sample-component {
  $this: 'sample-component';
  .#{$this}__tabs {
    margin-bottom: 28px;
    height: 48px;
    min-height: 48px;
  }
  .#{$this}__tab-item {
    &.#{$this}__full-page {
      height: calc(100vh - 76px - 142px);
      .v-window__container {
        height: 100%;
        .v-window-item {
          height: 100%;
        }
      }
    }
  }
}
</style>
