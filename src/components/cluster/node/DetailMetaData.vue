<template>
  <div class="sp-cluster-node-detail-metadata">
    <div class="title-wrapper">
      <span class="title-text">Metadata</span>
    </div>

    <div class="content-wrapper">
      <label-with-text
        horizontal
        name="Name"
        :value="metadata.name"
        background-color="F5F5F5"
        class="first-label-with-text"
        readonly
        disabled
      ></label-with-text>
      <label-with-text
        horizontal
        name="UID"
        :value="metadata.uid"
        background-color="F5F5F5"
        readonly
      ></label-with-text>

      <label-with-text
        horizontal
        name="Created At"
        :value="metadata.createdAt"
        background-color="F5F5F5"
        readonly
      ></label-with-text>

      <label-with name="Labels" horizontal>
        <template #append-content>
          <sp-chip v-for="label in metadata.labels" :key="label">{{
            label
          }}</sp-chip>
        </template>
      </label-with>
      <label-with name="Annotations" horizontal>
        <template #append-content>
          <sp-chip
            v-for="annotation in metadata.annotations"
            :key="annotation"
            >{{ annotation }}</sp-chip
          >
        </template>
      </label-with>
    </div>
  </div>
</template>

<script>
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWith from '@/components/molcule/LabelWith.vue'

export default {
  components: {
    LabelWithText,
    LabelWith,
  },

  data: () => ({
    metadata: {
      name: 'hostname01',
      uid: '5dk2lk33-0dd-233',
      labels: ['beta.kubernetes.ui/arch:amd64', 'beta.kubernetes.io/os:linux'],
      annotations: [
        'node.alpha.kubernetes.ui/ttl:0',
        'projectcalico.org/IPv4Address:172.16.10.118/16',
      ],
      createdAt: '2021-10-21 14:23:56',
    },
  }),
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-cluster-node-detail-metadata {
  .title-wrapper {
    margin-top: 30px;
    margin-bottom: 20px;
    .title-text {
      font-size: toRem(22);
      font-weight: bold;
      color: $sp-title;
    }
  }
  .content-wrapper {
    width: 100%;
    padding-left: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .sp-label-with-text {
      margin-bottom: 20px;
      width: 48%;
      .sp__input {
        width: 85%;
        font-family: $sub-font;
      }
      .sp__label {
        width: 15%;
      }
    }
    .sp-label-with {
      margin-bottom: 20px;
      width: 100%;
      .sp__label {
        width: 7.5%;
      }
      .sp__content {
        width: 82.5%;
        .chip {
          margin-right: 10px;
          background: $sp-body-bg-color !important;
          border-radius: 5px !important;
          font-family: $sub-font;
          color: $sp-title;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
