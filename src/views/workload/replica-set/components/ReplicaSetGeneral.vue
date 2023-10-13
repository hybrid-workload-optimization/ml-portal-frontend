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
          <template #append-content v-if="detailInfo.label">
            <sp-chip v-for="value in detailInfo.label" :key="value">
              {{ value }}</sp-chip
            >
          </template>
        </label-with>

        <!-- Annotations -->
        <label-with name="Annotations" horizontal>
          <template #append-content>
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
      <div class="info-table">
        <label-with :name="'Image'">
          <template #append-content>
            {{ detailInfo.image || '-' }}
          </template>
        </label-with>
      </div>
    </div>

    <div class="sp-detail-metadata pod-state">
      <div class="title-wrapper">
        <span class="title-text">Pod State</span>
      </div>
      <div class="info-table">
        <label-with :name="'Running'">
          <template #append-content>
            {{ detailInfo.runningPod || '-' }}
          </template>
        </label-with>
        <label-with :name="'Desired'">
          <template #append-content>
            {{ detailInfo.desiredPod || '-' }}
          </template>
        </label-with>
      </div>
    </div>

    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Pod</span>
      </div>
      <div class="table-wrapper scrollable-table-wrapper">
        <sp-table
          :headers="headers"
          :options="options"
          :datas="detailInfo.podList"
          scrollOnly
          :itemsPerPage="detailInfo.podList.length"
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

const replicaSetMapUtils = createNamespacedHelpers('replicaSet')

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
          width: '180px',
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
      headers: [
        {
          text: 'Name',
          align: 'center',
          value: 'name',
        },
        {
          text: 'Namespace',
          align: 'center',
          value: 'namespace',
        },
        {
          text: 'Label',
          align: 'center',
          value: 'label',
        },
        {
          text: 'Node',
          align: 'center',
          value: 'node',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
        },
        {
          text: 'Created At',
          align: 'center',
          value: 'createAt',
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
        itemKey: 'replicaSetIdx',
      },
    }
  },

  computed: {
    ...replicaSetMapUtils.mapGetters(['detailInfo']), // 상세 정보 데이터 객체 반환(replicaSet.js)
    ...replicaSetMapUtils.mapGetters(['podList']), // 파드 리스트 객체 반환
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

<style lang="scss" scoped></style>
