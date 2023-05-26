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
          :value="serviceDetailInfo.name"
          horizontal
          readonly
        />

        <!-- Namespace -->
        <label-with-text
          name="Namespace"
          :value="serviceDetailInfo.namespace"
          horizontal
          readonly
        />

        <!-- Labels -->
        <label-with name="Labels" horizontal>
          <template v-slot:append-content>
            <sp-chip v-for="label in serviceDetailInfo.labels" :key="label">{{
              label
            }}</sp-chip>
          </template>
        </label-with>

        <!-- Annotations -->
        <label-with name="Annotations" horizontal>
          <template v-slot:append-content>
            <sp-chip
              v-for="annotation in serviceDetailInfo.annotations"
              :key="annotation"
              >{{ annotation }}</sp-chip
            >
          </template>
        </label-with>

        <!-- Selectors -->
        <label-with name="Selector" horizontal>
          <template v-slot:append-content>
            <sp-chip
              v-for="selector in serviceDetailInfo.selectors"
              :key="selector"
              >{{ selector }}</sp-chip
            >
          </template>
        </label-with>

        <!-- Created At -->
        <label-with-text
          name="Created At"
          :value="serviceDetailInfo.createdAt"
          horizontal
          readonly
        />

        <!-- Cluster IP -->
        <label-with-text
          name="Cluster IP"
          :value="serviceDetailInfo.clusterIp"
          horizontal
          readonly
        />

        <!-- Internal Endpoint -->
        <label-with-text
          name="Endpoint"
          :value="serviceDetailInfo.internalEndpoint"
          horizontal
          readonly
        />
      </div>
    </div>

    <!-- Resource info -->
    <!-- <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Resource Info</span>
      </div>
      <div>
        <sp-table
          :headers="resourceInfoHeaders"
          :options="options"
          :datas="serviceDetailInfo.resourceInfo"
          scrollOnly
        />
      </div>
    </div> -->

    <div class="sp-detail-metadata resource-info">
      <div class="title-wrapper">
        <span class="title-text">Resource Info</span>
      </div>
      <div class="info-table">
        <label-with :name="'Type'">
          <template v-slot:append-content>
            {{ serviceDetailInfo.resourceInfo.type || '-' }}
          </template>
        </label-with>
        <label-with :name="'Cluster IP'">
          <template v-slot:append-content>
            {{ serviceDetailInfo.resourceInfo.clusterIp || '-' }}
          </template>
        </label-with>
        <label-with :name="'Session Affinity'">
          <template v-slot:append-content>
            {{ serviceDetailInfo.resourceInfo.sessionAffinity || '-' }}
          </template>
        </label-with>
      </div>
    </div>

    <div class="sp-detail-metadata">
      <!-- Endpoint -->
      <div class="title-wrapper">
        <span class="title-text">Endpoint</span>
      </div>
      <div>
        <sp-table
          :headers="endpointHeaders"
          :options="options"
          :datas="endpointList"
          scrollOnly
          :itemsPerPage="endpointList.length"
        />
      </div>
    </div>

    <div class="sp-detail-metadata">
      <!-- Pod -->
      <div class="title-wrapper">
        <span class="title-text">Pod</span>
      </div>
      <div class="scrollable-table-wrapper">
        <sp-table
          :headers="podHeaders"
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

const serviceMapUtils = createNamespacedHelpers('service')

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
      options: {
        hideFooter: true,
        hideHeader: false,
        dark: false,
        dense: false,
        disableFiltering: true,
        disablePagination: true,
        disableSort: true,
        fixedHeader: true,
        showSelect: false,
        itemKey: 'id',
      },
      resourceInfoHeaders: [
        {
          text: 'Type',
          align: 'center',
          value: 'type',
          class: 'w-10',
        },
        {
          text: 'Cluster IP',
          align: 'center',
          value: 'clusterIp',
          class: 'w-10',
        },
        {
          text: 'Session Affinity',
          align: 'center',
          value: 'sessionAffinity',
          class: 'w-10',
        },
      ],
      endpointHeaders: [
        {
          text: 'Host',
          align: 'center',
          value: 'host',
          class: 'w-10',
        },
        {
          text: 'Name',
          align: 'center',
          value: 'name',
          class: 'w-10',
        },
        {
          text: 'Port',
          align: 'center',
          value: 'port',
          class: 'w-10',
        },
        {
          text: 'Protocol',
          align: 'center',
          value: 'protocol',
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
      ],
      podHeaders: [
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
    }
  },

  computed: {
    ...serviceMapUtils.mapGetters(['serviceDetailInfo']),
    ...serviceMapUtils.mapGetters(['endpointList']),
    ...serviceMapUtils.mapGetters(['podList']),
  },
  methods: {
    moveToPodDetailPage(item) {
      // this.$router.push(
      //   `/workload/pod/detail/${this.serviceDetailInfo.clusterIdx}/${item.namespace}/${item.name}`,
      // )
      this.$router.push(
        `/cluster/detail/${this.serviceDetailInfo.clusterIdx}/Pod/${item.namespace}/${item.name}`,
      )
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
</style>
