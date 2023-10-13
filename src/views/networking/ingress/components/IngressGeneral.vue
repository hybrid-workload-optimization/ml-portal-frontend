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

        <!-- ingressClass -->
        <label-with-text
          name="Ingress Controller"
          :value="detailInfo.ingressClass"
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
      </div>
    </div>

    <!-- Rules -->
    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">Rules</span>
      </div>
      <div class="scrollable-table-wrapper">
        <sp-table
          :headers="ruleListHeaders"
          :datas="ruleList"
          :options="options"
          :customSlotInfo="customSlotInfo"
          scroll-only
          :itemsPerPage="ruleList.length"
        >
          <template #endpoint_custom="item">
            <sp-button
              elevation="0"
              color="primary"
              dense
              @click="onClickOpenEndPointModal(item)"
            >
              EndPoint
            </sp-button>
          </template>
        </sp-table>
      </div>
    </div>

    <div>
      <modal
        class="popup-end-point"
        title-name="External Endpoint"
        modal-width="446"
        modalHeight="380"
        :dialog="isOpenEndPointModal"
        @close-modal="onClickCloseEndPointModal"
      >
        <!-- 어느 부분까지 컴포넌트로 뺼지 협의 필요 -->
        <template #content>
          <end-point />
        </template>
        <template #footer>
          <div class="popup-end-point__button-wrapper">
            <sp-button
              class="popup-end-point--button cancel"
              elevation="0"
              dense
              @click="onClickCloseEndPointModal"
            >
              Cancel
            </sp-button>
          </div>
        </template>
      </modal>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import spTable from '@/components/dataTables/DataTable.vue'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import EndPoint from '@/views/networking/ingress/components/ingressEndPoint.vue'
import Modal from '@/components/modals/Modal.vue'

const ingressMapUtils = createNamespacedHelpers('ingress')
const tableMapUtils = createNamespacedHelpers('dataTable')

export default {
  components: {
    spTable,
    LabelWithText,
    EndPoint,
    Modal,
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
      isOpenEndPointModal: false,
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
      ruleListHeaders: [
        {
          text: 'Host',
          align: 'center',
          value: 'host',
        },
        {
          text: 'Protocol',
          align: 'center',
          value: 'protocol',
        },
        {
          text: 'Path',
          align: 'center',
          value: 'path',
        },
        {
          text: 'Path Type',
          align: 'center',
          value: 'pathType',
        },
        {
          text: 'Service',
          align: 'center',
          value: 'service',
        },
        {
          text: 'Port',
          align: 'center',
          value: 'port',
        },
        {
          text: 'Endpoint',
          align: 'center',
          value: 'endpoint',
        },
      ],
      customSlotInfo: [{ name: 'endpoint', slotName: 'endpoint' }],
    }
  },

  computed: {
    ...ingressMapUtils.mapGetters(['detailInfo']),
    ...ingressMapUtils.mapGetters(['ruleList']),
    ...tableMapUtils.mapGetters(['getOptions']),
  },

  methods: {
    onClickOpenEndPointModal(data) {
      const { item } = data
      this.$store.commit('ingress/setSeletedItem', item)
      this.isOpenEndPointModal = true
    },
    onClickCloseEndPointModal() {
      this.isOpenEndPointModal = false
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-end-point {
  $this: 'end-point';
  // padding: 0 21px;
  max-height: 190px;
  @include scroll();
  overflow-y: auto;
  padding: 0 27px;
  padding-top: 34px;

  .#{$this}__list-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba($color: $sp-box-border, $alpha: 1);
    margin-bottom: 8px;

    .#{$this}__url {
      @include set-text(500, 16, rgba($color: $sp-title, $alpha: 1));
    }

    .#{$this}__button-wrapper {
      display: flex;
      align-items: center;
      padding-bottom: 8px;
      .#{$this}--button {
        &:first-child {
          margin-right: 8px;
        }
        background-color: #ffffffcc;
        padding: 0;
        min-width: 40px;
        border: 1px solid rgba($color: $sp-box-border, $alpha: 1);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        .#{$this}__image-wrapper {
          width: 15px;
          height: 15px;
        }
      }
    }
  }
}
</style>
