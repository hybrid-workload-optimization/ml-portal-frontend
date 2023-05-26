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
          :value="deploymentDetailInfo.name"
          horizontal
          readonly
        />

        <!-- Namespace -->
        <label-with-text
          name="Namespace"
          :value="deploymentDetailInfo.namespace"
          horizontal
          readonly
        />

        <!-- UID -->
        <label-with-text
          name="UID"
          :value="deploymentDetailInfo.uid"
          horizontal
          readonly
        />

        <!-- Created At -->
        <label-with-text
          name="Created At"
          :value="deploymentDetailInfo.createdAt"
          horizontal
          readonly
        />

        <!-- Labels -->
        <label-with name="Labels" horizontal>
          <template v-slot:append-content>
            <sp-chip v-for="label in deploymentDetailInfo.label" :key="label">{{
              label
            }}</sp-chip>
          </template>
        </label-with>

        <!-- Annotations -->
        <label-with name="Annotations" horizontal>
          <template v-slot:append-content>
            <sp-chip
              v-for="annotation in deploymentDetailInfo.annotation"
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
        <label-with :name="'Strategy'">
          <template v-slot:append-content>
            {{ deploymentDetailInfo.resourceInfo.strategy || '-' }}
          </template>
        </label-with>
        <label-with :name="'Selector'">
          <template v-slot:append-content>
            <sp-chip
              v-for="selector in deploymentDetailInfo.resourceInfo.selector"
              :key="selector"
              >{{ selector }}</sp-chip
            >
          </template>
        </label-with>
      </div>
    </div>

    <!-- Pod State -->
    <div class="sp-detail-metadata pod-state">
      <div class="title-wrapper">
        <span class="title-text">Pod state</span>
      </div>
      <div class="info-table">
        <label-with :name="'Updated'">
          <template v-slot:append-content>
            {{ deploymentDetailInfo.podState.updated || '-' }}
          </template>
        </label-with>
        <label-with :name="'Replicas'">
          <template v-slot:append-content>
            {{ deploymentDetailInfo.podState.replicas || '-' }}
          </template>
        </label-with>
        <label-with :name="'Ready'">
          <template v-slot:append-content>
            {{ deploymentDetailInfo.podState.ready || '-' }}
          </template>
        </label-with>
      </div>
    </div>

    <!-- RollingUpdate Strategy -->
    <div class="sp-detail-metadata rolling-update">
      <div class="title-wrapper">
        <span class="title-text">RollingUpdate Strategy</span>
      </div>
      <div class="info-table">
        <label-with :name="'최대 증가율(surge)'">
          <template v-slot:append-content>
            {{ deploymentDetailInfo.rollingUpdateStrategy.maxSurge || '-' }}
          </template>
        </label-with>
        <label-with :name="'최대 비가용(Max Unavilable)'">
          <template v-slot:append-content>
            {{
              deploymentDetailInfo.rollingUpdateStrategy.maxUnavailable || '-'
            }}
          </template>
        </label-with>
      </div>
    </div>

    <!-- Conditions Grid -->
    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Conditions</span>
      </div>
      <div class="table-wrapper scrollable-table-wrapper">
        <sp-table
          :headers="ConditionHeaders"
          :options="options"
          :datas="deploymentDetailInfo.condition"
          scrollOnly
          :itemsPerPage="deploymentDetailInfo.condition.length"
        />
      </div>
    </div>

    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Pod</span>
      </div>
      <div class="table-wrapper scrollable-table-wrapper">
        <sp-table
          :headers="Podheaders"
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

const deploymentMapUtils = createNamespacedHelpers('deployment')

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
      resourceInfoTitle: [
        { text: 'Strategy', value: 'strategy' },
        { text: 'Selector', value: 'selector' },
      ],
      rollingUpdateTitle: [
        { text: '최대 증가율(surge)', value: 'maxSurge' },
        { text: '최대 비가용(Max Unavilable)', value: 'maxUnavailable' },
      ],
      podStateTitle: [
        { text: 'Updated', value: 'updated' },
        { text: 'Replicas', value: 'replicas' },
        { text: 'Ready', value: 'ready' },
      ],
      ConditionHeaders: [
        {
          text: 'Type',
          align: 'center',
          value: 'type',
          class: 'w-10',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
          class: 'w-10',
        },
        {
          text: 'Last Update Time',
          align: 'center',
          value: 'lastUpdateTime',
          class: 'w-10',
        },
        {
          text: 'Last Transition Time',
          align: 'center',
          value: 'lastTransitionTime',
          class: 'w-10',
        },
        {
          text: 'Reason',
          align: 'center',
          value: 'reason',
          class: 'w-10',
        },
        {
          text: 'Message',
          align: 'center',
          value: 'message',
          class: 'w-10',
        },
      ],
      Podheaders: [
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
        fixedHeader: true,
        showSelect: false,
        itemKey: 'id',
      },
    }
  },

  computed: {
    ...deploymentMapUtils.mapGetters(['deploymentDetailInfo']),
    ...deploymentMapUtils.mapGetters(['podList']),
  },
  methods: {
    moveToPodDetailPage(item) {
      // this.$router.push(
      //   `/workload/pod/detail/${this.deploymentDetailInfo.clusterIdx}/${item.namespace}/${item.name}`,
      // )
      this.$router.push(
        `/cluster/detail/${this.deploymentDetailInfo.clusterIdx}/Pod/${item.namespace}/${item.name}`,
      )
    },
  },
}
</script>

<style lang="scss"></style>
