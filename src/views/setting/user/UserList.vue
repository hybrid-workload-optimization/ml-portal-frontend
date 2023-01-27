<template>
  <div class="sp-bar-layout">
    <multi-select
      class="margin-bottom-20"
      :btnName="'New User'"
      :firstSelectMeta="firstSelectMeta"
      :secondSelectMeta="secondSelectMeta"
      :isDisabled="currentMenuInfo.writableYn !== 'Y'"
      @clickBtn="onClickOpenLabelModal"
      @changeItem="onChangeItem"
    />
    <modal
      class="popup-cluster"
      title-name="New User"
      modal-width="670"
      :dialog="isOpenSignUpModal"
      @close-modal="onClickCloseLabelModal"
    >
      <!-- <sp-button
        slot="buttons"
        elevation="0"
        color="primary"
        dense
        @click="onClickOpenLabelModal"
      >
        New User
      </sp-button> -->

      <template v-slot:content>
        <SignupForm />
      </template>
    </modal>

    <search
      v-if="dataListSize"
      class="search-wrapper"
      :title="'Total:'"
      :todoCount="dataListSize.toString()"
      @input="onInputSearchValue"
    >
    </search>

    <sp-table
      v-if="dataListSize"
      :headers="headers"
      :datas="dataListForTable"
      :options="options"
      :search="searchValue"
      isLinked
      @click:row="moveToDetailPage"
    />

    <!-- 조회 내용이 존재하지 않을 때, 내용 표시(optionl) -->
    <empty v-else-if="!isLoading" title="User does not exist." description="" />

    <!-- <alert
      titleName="생성 실패"
      :dialog="createFailToast"
      @close-Alert="closeCreateFailToast"
    /> -->

    <!--
    <alert
      titleName="생성 성공"
      :dialog="createOkToast"
      @close-Alert="closeCreateOkToast"
    /> -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import MultiSelect from '@/components/MultiSelectForSeparate.vue'
import request from '@/lib/request'
import Empty from '@/components/Empty.vue'
import spTable from '@/components/dataTables/DataTable.vue'
import Modal from '@/components/modals/Modal.vue'
import SignupForm from '@/components/SignupForm.vue'
import Search from '@/components/molcule/DataTableSearch.vue'
import { form } from '@/utils/mixins/form'
import encrypt from '@/lib/encrypt'

// import Alert from '@/components/molcule/Alert.vue'

const userMapUtils = createNamespacedHelpers('user')
const multiSelectMapUtils = createNamespacedHelpers('multiSelectForSeparate')
const loginUserMapUtils = createNamespacedHelpers('loginUser')
// const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    Search,
    // Alert,
    Modal,
    spTable,
    Empty,
    MultiSelect,
    // MultiSelectForSeparate,
    SignupForm,
  },
  mixins: [form],
  data() {
    return {
      firstSelectMeta: {
        requestFunc: request.getProjectsUsingGET,
      },
      // 멑티셀렉트 컴포넌트에서 두번째 셀렉트 리스트를 가지고 오기 위한 메타데이터
      secondSelectMeta: {
        requestFunc: request.getUserRolesUsingGET,
      },
      createFailToast: false,
      createOkToast: false,
      isOpenUserModal: false,
      isOpenToast: false,
      isOpenMessage: false,
      searchValue: '',

      // 그리드 헤더
      headers: [
        {
          text: 'ID',
          // align: 'center',
          value: 'userId',
        },
        {
          text: 'User Name',
          // align: 'center',
          value: 'userName',
        },
        {
          text: 'E-mail',
          // align: 'center',
          value: 'email',
        },
        {
          text: 'Organization',
          // align: 'center',
          value: 'organization',
        },
        {
          text: 'Authority',
          // align: 'center',
          value: 'roleName',
        },
        {
          text: 'Status',
          align: 'center',
          value: 'status',
        },
        {
          text: 'Created At',
          align: 'center',
          value: 'createdAt',
        },
      ],
      // 그리드 설정 값
      options: {
        hideFooter: false,
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
  created() {
    this.isLoading = true
    // this.initMultiSelectState() // 멀티셀렉트 데이터 초기화
    this.initUserState() // 유저 목록 초기화
  },
  computed: {
    ...userMapUtils.mapGetters([
      'dataList',
      'dataListSize',
      'userRoleList',
      'dataListForTable',
      'isOpenSignUpModal',
    ]),
    ...loginUserMapUtils.mapState(['currentMenuInfo']),
  },

  mounted() {
    this.getListData()
    // this.getUserRoleList()
  },

  methods: {
    ...multiSelectMapUtils.mapGetters(['firstValue']), // 두번째 셀렉트 박스에서 선택된 항목의 value(multiSelect.js)
    ...multiSelectMapUtils.mapGetters(['secondValue']), // 두번째 셀렉트 박스에서 선택된 항목의 value(multiSelect.js)
    ...multiSelectMapUtils.mapMutations(['initMultiSelectState']), // state 데이터 초기화(multiSelect.js)

    ...userMapUtils.mapActions([
      'getList',
      'createUser',
      'updateUser',
      'deleteUser',
      'getUserRoleList',
    ]),
    ...userMapUtils.mapMutations(['initUserState', 'initUserDataList']),
    ...userMapUtils.mapMutations(['openSignUpModal', 'closeSignUpModal']),

    // ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈

    // 서치 박스의 버튼 클릭 시 호출됨
    onClickButton() {
      console.log('clicked button')
    },
    // 서치 박스 입력값 변경 시 호출됨
    onInputSearchValue(value) {
      this.searchValue = value
    },
    async getListData(param) {
      await this.getList(param)
      this.isLoading = false
    },
    getProjectList() {},
    openCreateUserPopup() {
      this.isOpenUserModal()
    },

    moveToDetailPage(data) {
      const { userId } = data
      // const id = encodeURIComponent(userId).replace(/\./g, '%2E')
      const id = encodeURIComponent(encrypt.encrypt(userId))
      if (id) {
        this.$router.push(`/setting/user/detail/${id}`)
      }
    },
    onChangeItem(value) {
      const param = {
        projectId: value.firstValue,
        authorityId: value.secondValue,
      }
      this.getListData(param)
    },
    onClickOpenLabelModal() {
      this.openSignUpModal()
    },
    onClickCloseLabelModal() {
      this.closeSignUpModal()
    },
    onClickCloseAlert() {
      this.isOpenToast = false
    },
  },
}
</script>
<style lang="scss" scoped>
.margin-bottom-20 {
  margin-bottom: 20px;
}
.margin-bottom-10 {
  margin-bottom: 10px;
}
.padding-10 {
  padding: 10px;
}
.search-wrapper {
  margin-bottom: 10px;
}
</style>
