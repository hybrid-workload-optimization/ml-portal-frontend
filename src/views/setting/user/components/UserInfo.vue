<template>
  <div class="sp-user-detail">
    <div class="sp-detail-metadata">
      <div class="title-wrapper">
        <span class="title-text">회원정보</span>
      </div>
      <!-- <span class="sub-title">회원정보</span> -->

      <div class="content-wrapper">
        <label-with-text
          name="UserName"
          :value="detailInfo.userName"
          :horizontal="true"
          :readonly="true"
        />
        <label-with-text
          name="User Email"
          :value="detailInfo.email"
          :horizontal="true"
          :readonly="true"
        />

        <label-with-text
          name="Contact"
          :placeholder="mode ? '(-)를 제외한 숫자만 입력해주세요.' : ''"
          :value="detailInfo.contact"
          :horizontal="true"
          :readonly="readOnly"
          @input="onChangeContact"
        />

        <label-with-text
          name="Organization"
          :value="detailInfo.organization"
          :horizontal="true"
          :readonly="readOnly"
          @input="onChangeOrganization"
        />

        <label-with-text
          name="Authority"
          :value="detailInfo.userRole.userRoleName"
          :horizontal="true"
          readonly
          v-if="readOnly"
        />
        <label-with-select
          v-if="mode"
          name="Authority"
          horizontal
          @input="onChangeRole"
          :items="selectRoles"
          item-text="text"
          item-value="value"
          :value="userRoleCode"
          :className="labelWithTextClass"
        >
        </label-with-select>

        <label-with-text
          name="Status"
          :value="detailInfo.useYn === 'Y' ? '활성' : '비활성'"
          :horizontal="true"
          readonly
          v-if="readOnly"
        />

        <!-- <label-with
          v-if="mode"
          name="Authority"
          horizontal
          :className="labelWithTextClass"
        >
          <template #append-content :className="authorityTemplate">
            <sp-select
              class="sp__input authority_select"
              background-color="#F5F5f5"
              hide-details="auto"
              outlined
              single-line
              flat
              dense
              :items="selectRoles"
              @input="onChangeRole"
              :value="detailInfo.userRole.userRoleCode"
            />
          </template>
        </label-with> -->
      </div>

      <div class="button-wrapper" v-if="mode">
        <sp-button class="cancel-button" outlined @click="onClickCancel">
          Cancel
        </sp-button>
        <sp-button class="edit-button" outlined @click="onClickUpdate">
          Save
        </sp-button>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import LabelWithText from '@/components/molcule/LabelWithText.vue'
import LabelWithSelect from '@/components/molcule/LabelWithSelect.vue'
import encrypt from '@/lib/encrypt'
// import LabelWith from '@/components/molcule/LabelWith.vue'

const userMapUtils = createNamespacedHelpers('user')
const authMapUtils = createNamespacedHelpers('authority')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  props: {
    readOnly: {
      type: Boolean,
      default: true,
      description: 'readonly 속성 여부',
    },
    mode: {
      type: Boolean,
      default: false,
      description: '모드에 따라 버튼 노출',
    },
  },
  components: {
    LabelWithText,
    LabelWithSelect,
    // LabelWith,
  },
  data() {
    return {
      labelWithTextClass: {
        inputStyle: {
          readonly: this.readOnly,
        },
        authList: [],
      },
      authorityTemplate: {
        contentStyle: {
          width: '100%',
          maxWidth: '100%',
        },
      },
      userId: '',
      userOrganization: '',
      userContact: '',
      userRoleCode: '',
      userInfo: {
        userId: '',
        organization: '',
        contact: '',
        userRole: {
          userRoleCode: '',
        },
      },
      roleList: [],
      failMsg: '변경에 실패하였습니다.',
      successMsg: '사용자 정보가 수정 되었습니다.',
    }
  },
  async mounted() {
    this.userId = encrypt.decrypt(decodeURIComponent(this.$route.params.id))
    this.userContact = this.detailInfo.contact
    this.userOrganization = this.detailInfo.organization
    this.userRoleCode = this.detailInfo.userRole.userRoleCode
    await this.defaultChangeInfo(this.detailInfo)
    this.getAuthList()
  },
  computed: {
    ...userMapUtils.mapGetters([
      'detailInfo',
      'changedInfo',
      'userRoleList',
      'selectRoleList',
      'selectRoles',
    ]),
  },
  methods: {
    ...authMapUtils.mapActions(['getAllListAuthority']),
    ...alertMapUtils.mapMutations(['openAlert']),
    ...userMapUtils.mapActions([
      'setChangeInfo',
      'updateUser',
      'changeInfo',
      'getUserRoleList',
      'getUserRoles',
    ]),
    ...userMapUtils.mapMutations(['changeInfo']),

    async getAuthList() {
      try {
        // await this.getUserRoleList()
        await this.getUserRoles()
      } catch (error) {
        console.log(error)
      }
    },
    defaultChangeInfo(payload) {
      console.log(payload)
      this.setChangeInfo(payload)
    },
    async onClickUpdate() {
      const params = {
        type: 'general',
        userId: this.detailInfo.email,
        organization: this.userOrganization,
        contact: this.userContact,
        userRole: {
          userRoleCode: this.userRoleCode,
        },
      }
      this.userInfo = params
      this.changeInfo(params)

      try {
        const response = await this.updateUser()
        if (response.status === 200) {
          this.openAlert({ title: this.successMsg, type: 'info' })
          const id = encodeURIComponent(encrypt.encrypt(this.userId))
          setTimeout(
            () => this.$router.push(`/setting/user/detail/${id}`),
            1000,
          )
          // this.$router.push(`/setting/user/detail/${this.userId}`)
        } else {
          this.openAlert({ title: this.failMsg, type: 'error' })
          console.log(response.data.message)
        }
      } catch (error) {
        this.openAlert({ title: this.failMsg, type: 'error' })
        console.log(error)
      }
    },
    onClickCancel() {
      const id = encodeURIComponent(encrypt.encrypt(this.userId))
      this.$router.push(`/setting/user/detail/${id}`)
    },
    onChangeContact(value) {
      this.userContact = value
    },
    onChangeOrganization(value) {
      this.userOrganization = value
    },
    onChangeRole(value) {
      console.log('input::', value)
      this.userRoleCode = value
      console.log('change:::', this.userRoleCode)
    },
  },
}
</script>

<style lang="scss">
.sp-user-detail {
  .button-wrapper {
    padding-top: 25px;
    text-align: right;
    .cancel-button,
    .edit-button {
      width: 120px;
      border-width: thin;
      border-radius: 5px;
      font-weight: bold;
      color: $sp-teriary;
    }

    .cancel-button {
      margin-right: 10px;
      color: $basic-button;
    }
  }
}
</style>
