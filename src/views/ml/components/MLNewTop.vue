<!-- 기본 베이스 - new Project -->
<template>
  <div class="sp-project-new-general">
    <label-with-text
      name="Name"
      :horizontal="true"
      background-color="#F5F5f5"
      :className="labelWithTextClass"
      @input="onChangeMLName"
    />
    <label-with-text
      class="general-layout__label"
      name="Description"
      :horizontal="true"
      background-color="#F5F5f5"
      :className="labelWithTextClass"
      lines="multi"
      @input="onChangeDescription"
    />

    <label-with name="ML Step" horizontal :className="labelWithTextClass">
      <template #append-content class="authority_template">
        <sp-select
          class="sp__input authority_select"
          background-color="#fff"
          hide-details="auto"
          outlined
          single-line
          flat
          :items="dataMLStepList"
          @input="onChangeMLStep"
        />
      </template>
    </label-with>
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

  data() {
    return {
      labelWithTextClass: {
        inputStyle: {
          readonly: this.readOnly,
          fontSize: '2rem',
          borderRadius: '5px',
        },
      },
      // 임시데이터
      dataMLStepList: [
        {
          text: 'Pretreatment',
          value: 'ml-step-100',
        },
        {
          text: 'Verification',
          value: 'ml-step-200',
        },
        {
          text: 'Learning',
          value: 'ml-step-300',
        },
        {
          text: 'Inference',
          value: 'ml-step-400',
        },
        {
          text: 'Service',
          value: 'ml-step-500',
        },
      ],
    }
  },

  created() {},

  computed: {},

  mounted() {},

  methods: {
    // Machine Learning name 저장
    onChangeMLName(value) {
      this.$store.state.ml.newMLName = value
    },

    // Machine Learning name 저장
    onChangeDescription(value) {
      this.$store.state.ml.newDescription = value
    },

    onChangeMLStep(value) {
      this.$store.state.ml.newMLStepCode = value
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-project-new-general {
  $this: 'sp';
  .sp-label-with-text,
  .sp-label-with {
    margin-bottom: 20px;
  }

  .#{$this}__label {
    width: 10%;
  }
  .#{$this}__input {
    border-radius: 5px;
  }
  .sp-text-area {
    width: 70%;
    border: thin solid $sp-box-border;
    border-radius: 5px;
  }

  .sp-select {
    height: 40px;
    .v-input__append-inner {
      margin-top: 9px;
      margin-bottom: 8px;
    }
  }

  .sp__content {
    width: 90%;
  }

  .sp-box-layout {
    margin: 10px 0;

    .sub-title {
      font-weight: bold;
      line-height: 2.5rem;
      font-size: 1.2rem;
    }

    .info-table {
      display: flex;
      padding: 0 20px;

      .info-item {
        display: flex;
        flex-direction: column;
        padding: 0 10px;
        min-width: 150px;

        .info-item__label {
          color: rgba(26, 51, 80, 0.5);
          font-weight: bold;
          align-self: center;
        }
        .info-item__value {
          align-self: center;
        }
      }
    }
  }

  $this: 'project';
  .#{$this}__button-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 33px;
    height: 44px;

    .#{$this}__button {
      width: 114px;
      background-color: #fff;
      border-radius: 5px;
      padding: 8px 20px;
      &.#{$this}__button--cancel {
        margin-right: 8px;
        border: thin solid $sp-sky-blue-500;
        @include set-text(
          bold,
          15,
          rgba($color: $sp-sky-blue-500, $alpha: 0.8)
        );
      }
      &.#{$this}__button--finish {
        border: thin solid $sp-teriary;
        @include set-text(bold, 15, rgba($color: $sp-teriary, $alpha: 1));
      }
    }
  }
}
</style>
