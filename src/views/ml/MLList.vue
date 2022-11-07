<template>
  <div class="sp-list-content">
    <div class="list-search-wrapper">
      <search
        class="sp-basic-search"
        :title="'Total:'"
        :todoCount="dataListSize.toString()"
        :isDisabled="currentMenuInfo.writableYn !== 'Y'"
        @change="onSearch"
        @input="onInputSearchValue"
        @click="onNewML"
        button-text="New Machine Learning"
      >
      </search>
    </div>

    <!-- 조회 내용이 존재할 때, 그리드 표시 -->
    <sp-table
      v-if="dataListSize"
      class="table-wrapper"
      is-linked
      :headers="headers"
      :datas="dataList"
      :options="options"
      :search="searchValue"
      @click:row="moveToDetailPage"
    />
    <!-- 조회 내용이 존재하지 않을 때, 내용 표시(optionl) -->
    <empty
      v-else-if="!isLoading"
      class="table-wrapper"
      title="Machine Learning 워크로드가 존재하지 않습니다."
      description=""
    />

    <alert
      titleName="생성 실패"
      :dialog="createFailToast"
      @close-Alert="closeCreateFailToast"
    />

    <!-- 생성 성공 토스트 -->
    <alert
      titleName="생성 성공"
      :dialog="createOkToast"
      @close-Alert="closeCreateOkToast"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Search from '@/components/molcule/DataTableSearch.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import Empty from '@/components/Empty.vue'
import Alert from '@/components/molcule/Alert.vue'

const projectMapUtils = createNamespacedHelpers('ml')
const loginUserMapUtils = createNamespacedHelpers('loginUser')

export default {
  components: {
    Search,
    spTable,
    Empty,
    Alert,
  },
  data() {
    return {
      toggleIdx: 0,
      createFailToast: false,
      createOkToast: false,
      searchValue: '',

      // 그리드 헤더 설정(text: 화면에 표시할 속성명, value: 실제 조회된 속성값과 일치 시켜야 함)
      headers: [
        {
          text: 'Name',
          align: 'left',
          value: 'name',
          class: 'w-20',
        },
        {
          text: 'Description',
          align: 'left',
          value: 'description',
          class: 'w-20',
        },
        {
          text: 'ML Step',
          align: 'center',
          value: 'mlStepCode',
          class: 'w-20',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
          class: 'w-20',
        },
        {
          text: 'Created By',
          align: 'center',
          value: 'userId',
          class: 'w-20',
        },
        {
          text: 'Created At',
          align: 'center',
          value: 'createdAt',
          class: 'w-20',
        },
      ],
      // 그리드 설정 값
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
      isLoading: false,
    }
  },

  created() {},

  computed: {
    ...projectMapUtils.mapGetters(['dataList']), // ml.js에 저장된 dataList 값 반환(ml.js)
    ...projectMapUtils.mapGetters(['dataListSize']), // ml.js에 저장된 dataListSize 값 반환(ml.js)
    ...loginUserMapUtils.mapState(['currentMenuInfo']),
  },

  async mounted() {
    this.isLoading = true
    await this.getListData()
    this.isLoading = false
  },

  methods: {
    ...projectMapUtils.mapActions(['getList']), // 리스트 조회 요청(ml.js)

    onInputSearchValue(value) {
      this.searchValue = value
    },

    // 리스트 조회 요청
    async getListData() {
      // 조회 요청에서 필요한 parameter 세팅(호출한 api 파라미터 형태에 맞춰서 커스텀하게 생성)
      const param = {
        // userId: '22222',
        // projectName: this.searchValue,
      }
      await this.getList(param)
    },

    // alert창 close 이벤트
    closeCreateFailToast() {
      this.createFailToast = false
    },
    closeCreateOkToast() {
      this.createOkToast = false
    },

    // Search 박스 입력값 변경 시 호출됨
    onSearch(value) {
      this.searchValue = value
    },

    // New ML 버튼 클릭 시 호출됨
    onNewML() {
      this.$router.push('/project/new')
    },

    // 상세 페이지로 이동 요청
    moveToDetailPage(data) {
      const { mlId } = data
      if (mlId) {
        this.$router.push(`/ml/detail/${mlId}`)
      }
    },
  },
}
</script>
<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-list-content {
  width: 100%;
}
.sp-list-content {
  .sp-basic-search {
    .sp-basic-toggle-button {
      padding-right: 10px;
      .sp-basic-toggle--click {
        background-color: #f5f8fbcc;
        border: 1px solid rgba($color: #4b556680, $alpha: 1);
        &.v-item--active {
          background-color: $sp-teriary;
          .v-icon {
            @include set-text(normal, 20, rgba($color: #fff, $alpha: 0.2));
            color: #fff !important;
          }
        }

        .v-icon {
          @include set-text(
            normal,
            20,
            rgba($color: $sp-box-border, $alpha: 1)
          );
          color: $sp-sky-blue-500 !important;
        }
      }
    }
    .search-wrapper {
      width: 50%;
      @include desktop-small {
        width: 60%;
      }
    }
  }
}
</style>
