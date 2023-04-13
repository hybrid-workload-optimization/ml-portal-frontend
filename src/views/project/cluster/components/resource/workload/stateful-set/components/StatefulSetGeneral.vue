<template>
  <div>
    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Metadata</span>
      </div>
      <div class="content-wrapper">
        <!-- Name -->
        <label-with-text
          name="Name"
          :value="detailInfo.name"
          horizontal
          readonly
        />

        <!-- Namespace -->
        <label-with-text
          name="Namespace"
          :value="detailInfo.namespace"
          horizontal
          readonly
        />

        <!-- UID -->
        <label-with-text
          name="UID"
          :value="detailInfo.uid"
          horizontal
          readonly
        />

        <!-- Created At -->
        <label-with-text
          name="Created At"
          :value="detailInfo.createdAt"
          horizontal
          readonly
        />

        <label-with name="Labels" horizontal>
          <template v-slot:append-content v-if="detailInfo.label">
            <sp-chip v-for="value in detailInfo.label" :key="value">
              {{ value }}</sp-chip
            >
          </template>
        </label-with>

        <!-- Annotations -->
        <label-with name="Annotations" horizontal>
          <template v-slot:append-content>
            <sp-chip
              v-for="annotation in detailInfo.annotation"
              :key="annotation"
              >{{ annotation }}</sp-chip
            >
          </template>
        </label-with>
      </div>
    </div>

    <!-- Resource Info -->
    <div class="sp-detail-metadata resource-info">
      <div class="title-wrapper">
        <span class="title-text">Resource Info</span>
      </div>
      <div class="info-table justify-space-between">
        <template v-for="(head, index) in resourceInfoTitle">
          <label-with :name="head.text" :key="index">
            <template v-slot:append-content>
              {{ detailInfo.resourceInfo[head.value] || '-' }}
            </template>
          </label-with>
        </template>
      </div>
    </div>

    <!-- Pod State -->
    <div class="sp-detail-metadata pod-state">
      <div class="title-wrapper">
        <span class="title-text">Pod state</span>
      </div>
      <div class="info-table">
        <template v-for="(head, index) in podStateTitle">
          <label-with :name="head.text" :key="index">
            <template v-slot:append-content>
              {{ detailInfo.podState[head.value] || '-' }}
            </template>
          </label-with>
        </template>
      </div>
    </div>

    <!-- Pod Grid -->
    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Pod</span>
      </div>
      <div class="scrollable-table-wrapper table-wrapper">
        <sp-table
          :headers="headers"
          :options="options"
          :datas="podList"
          scrollOnly
          :itemsPerPage="podList.length"
          is-linked
          @click:row="moveToPodDetailPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import spTable from '@/components/dataTables/DataTable.vue'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWith from '@/components/molcule/LabelWith.vue'

const statefulSetMapUtils = createNamespacedHelpers('statefulSet')

export default {
  components: {
    spTable,
    LabelWithText,
    LabelWith,
  },
  data() {
    return {
      labelWithClass: {
        titleStyle: {
          fontWeight: 'bold',
          fontSize: '1rem',
          width: '150px',
        },
      },
      labelWithTextClass: {
        titleStyle: {
          fontWeight: 'bold',
          fontSize: '1rem',
          width: '150px',
        },
        inputStyle: {
          readonly: true,
          fontSize: '2rem',
          margin: '20px',
          borderRadius: '10px',
        },
      },
      detail: {},
      resourceInfoTitle: [{ text: 'Image', value: 'image' }],
      podStateTitle: [
        { text: 'Running', value: 'running' },
        { text: 'Desired', value: 'desired' },
      ],
      headers: [
        {
          text: 'Name',
          align: 'center',
          value: 'name',
          class: 'w-10',
        },
        {
          text: 'Namespace',
          align: 'center',
          value: 'namespace',
          class: 'w-10',
        },
        {
          text: 'Label',
          align: 'center',
          value: 'label',
          class: 'w-10',
        },
        {
          text: 'Node',
          align: 'center',
          value: 'node',
          class: 'w-10',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
          class: 'w-10',
        },
        {
          text: 'Created At',
          align: 'center',
          value: 'createdAt',
          class: 'w-10',
        },
      ],
      options: {
        hideFooter: true,
        hideHeader: false,
        dark: false,
        dense: false,
        disableFiltering: false,
        disablePagination: false,
        disableSort: false,
        fixedHeader: false,
        showSelect: false,
        itemKey: 'id',
      },
    }
  },

  computed: {
    ...statefulSetMapUtils.mapGetters(['detailInfo']), // 상세 정보 데이터 객체 반환(statefulSet.js)
    ...statefulSetMapUtils.mapGetters(['podList']), // 파드 리스트 객체 반환
  },
  methods: {
    moveToPodDetailPage(item) {
      this.$router.push(
        `/workload/pod/detail/${this.detailInfo.clusterIdx}/${item.namespace}/${item.name}`,
      )
    },
  },
}
</script>

<style lang="scss"></style>
