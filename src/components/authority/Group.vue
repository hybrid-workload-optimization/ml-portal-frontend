<template>
  <div class="sp-authority-group">
    <sp-card headered label="권한 그룹" outlined elevation="0">
      <template v-slot:header v-if="isWritable">
        <sp-button
          outlined
          elevation="0"
          class="sp-authority-group__group-add-button"
          @click="popupAddEdit(0, null, 'Y', null)"
        >
          <v-icon>add</v-icon> 권한그룹 추가
        </sp-button>
      </template>

      <!-- 전체 그룹 -->
      <div class="sp-authority-group__expansion-group-wrapper">
        <v-expansion-panels accordion multiple flat v-model="panel">
          <v-expansion-panel v-for="(data, index) in authGroups" :key="index">
            <v-expansion-panel-content>
              <ul class="expand-list">
                <li
                  :key="index"
                  class="expand-list-item"
                  :class="{
                    isActive: selected.userRoleIdx === data.userRoleIdx,
                  }"
                  @click="selectGroup(data)"
                >
                  <v-icon class="expand-list-item-icon material-icons-outlined"
                    >people</v-icon
                  ><span class="expand-list-item-text">
                    {{ data.userRoleName }}
                  </span>
                  <sp-button
                    icon
                    class="expand-list-button"
                    @click.stop="
                      popupDelete(
                        group.userRoleName,
                        index,
                        i,
                        group.userRoleIdx,
                      )
                    "
                    v-if="isWritable && group.userDefinedYn == 'Y'"
                    ><v-icon>clear</v-icon></sp-button
                  >
                </li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <!-- 삭제 확인 팝업 -->
      <modal
        title-name="삭제 확인"
        modal-width="400"
        modal-height="250"
        :dialog="confirm"
        @close-modal="onClickCloseModal"
      >
        <template v-slot:content>
          <div class="confirm-wrapper">
            <authority-delete-item
              @close-modal="onClickCloseModal"
              @delete-item="deleteItem"
              :itemName="deleteItemName"
              :groupIndex="groupIndex"
              :itemIndex="itemIndex"
              :userRoleIdx="userRoleIdx"
              ref="deletePopup"
            ></authority-delete-item>
          </div>
        </template>
      </modal>

      <!-- 추가/수정 팝업 -->
      <modal
        :title-name="popupTitle"
        modal-width="400"
        modal-height="250"
        :dialog="addEditPopup"
        @close-modal="onClickCloseModal"
      >
        <template v-slot:content>
          <div class="add-edit-wrapper">
            <authority-add-edit-popup
              @close-modal="onClickCloseModal"
              @add-edit-item="addEditItem"
              :group="authGroups"
              :groupIndex="groupIndex"
              :itemIndex="itemIndex"
              :isEditOrAdd="isEditOrAdd"
              :groupYn="groupYn"
              :userRoleIdx="userRoleIdx"
            ></authority-add-edit-popup>
          </div>
        </template>
      </modal>
    </sp-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import Modal from '@/components/modals/Modal.vue'
import AuthorityDeleteItem from '@/components/modals/contents/AuthorityDeleteItem.vue'
import AuthorityAddEditPopup from '@/components/modals/contents/AuthorityAddEditPopup.vue'

const authorityMapUtil = createNamespacedHelpers('authority')
const alertMapUtils = createNamespacedHelpers('alert')

export default {
  components: {
    Modal,
    AuthorityDeleteItem,
    AuthorityAddEditPopup,
  },
  props: {
    isWritable: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    panel: [],
    confirm: false,
    popupTitle: '',
    deleteItemName: '',
    itemIndex: null,
    groupIndex: null,
    isEditOrAdd: '',
    groupYn: 'N',
    userRoleIdx: null,
  }),
  async created() {
    await this.getAllListAuthority()
    console.log(this.authGroups)
    this.expandAll()
    if (this.authGroups.length) {
      this.selectGroup(this.authGroups[0])
    }
  },
  computed: {
    ...authorityMapUtil.mapState(['authGroups', 'addEditPopup']),
    ...authorityMapUtil.mapGetters(['selected']),
  },
  methods: {
    ...authorityMapUtil.mapMutations([
      'setSelectedGroup',
      'changeAddEditPopup',
    ]),
    ...authorityMapUtil.mapActions([
      'getAllListAuthority',
      'registAuthority',
      'patchAuthority',
      'deleteAuthority',
    ]),
    ...alertMapUtils.mapMutations(['openAlert', 'initAuthData']), // alert 오픈
    expandAll() {
      this.panel = [...Array(this.authGroups.length).keys()].map((k, i) => i)
    },
    expandNone() {
      this.panel = []
    },
    async selectGroup(newGroup) {
      await this.getAllListAuthority()
      this.$store.dispatch('authority/getMenuFromSelect', newGroup)
      this.$emit('select-group')
      this.setSelectedGroup(newGroup)
      this.groupIndex = 1
    },
    makeParamAuthority(d1, d2, d3, d4, d5) {
      const p = {
        userRoleName: d1,
        description: d2,
        groupYn: d3,
        parentUserRoleIdx: d4,
        userRoleIdx: d5,
      }

      return p
    },
    async regist(params) {
      try {
        await this.registAuthority(params)
        this.getAllListAuthority() // 다시 조회
        this.initAuthData()
        this.openAlert({
          title: '정보가 정상적으로 저장되었습니다.',
          type: 'info',
        })
      } catch (error) {
        this.openAlert({
          title: '서버 에러로 인해 변경에 실패하였습니다.',
          type: 'error',
        })
      }
    },
    async modify(params) {
      try {
        await this.patchAuthority(params)
        this.getAllListAuthority() // 다시 조회
        this.initAuthData()
        this.openAlert({
          title: '정보가 정상적으로 저장되었습니다.',
          type: 'info',
        })
      } catch (error) {
        this.openAlert({
          title: '서버 에러로 인해 변경에 실패하였습니다.',
          type: 'error',
        })
      }
    },
    async delete(params) {
      try {
        await this.deleteAuthority(params)
        this.getAllListAuthority() // 다시 조회
        this.initAuthData()
        this.openAlert({
          title: '정보가 정상적으로 저장되었습니다.',
          type: 'info',
        })
      } catch (error) {
        this.openAlert({
          title: '서버 에러로 인해 변경에 실패하였습니다.',
          type: 'error',
        })
      }
    },
    addEditItem(itemName, groupIndex, groupYn, userRoleIdx) {
      if (this.isEditOrAdd === 'add') {
        if (groupIndex == null) {
          const params = this.makeParamAuthority(itemName, null, groupYn)
          this.regist(params)
        } else {
          const params = this.makeParamAuthority(
            itemName,
            null,
            groupYn,
            userRoleIdx,
          )
          this.regist(params)
        }
      } else if (this.isEditOrAdd === 'edit') {
        const params = this.makeParamAuthority(
          itemName,
          null,
          groupYn,
          null,
          userRoleIdx,
        )
        this.modify(params)
      }
      this.changeAddEditPopup(false)
      this.itemName = ''
      this.groupIndex = null
      this.isEditOrAdd = ''
      this.userRoleIdx = null
      this.groupYn = 'N'
    },
    deleteItem(groupIndex, itemIndex, userRoleIdx) {
      if (itemIndex != null) {
        console.log('아이템 삭제(권한)', itemIndex)
      } else {
        console.log('그룹 삭제', itemIndex)
      }

      const params = this.makeParamAuthority(
        null,
        null,
        null,
        null,
        userRoleIdx,
      )

      this.delete(params)

      this.selectGroup([])
      this.confirm = false
      this.groupIndex = null
      this.itemIndex = null
      this.userRoleIdx = null
      this.groupYn = 'N'
      this.$emit('deleted-group')
    },
    popupDelete(itemName, groupIndex, itemIndex, userRoleIdx) {
      this.setDeleteItem(itemName, groupIndex, itemIndex, userRoleIdx)
      this.confirm = true
    },
    popupAddEdit(title, groupIndex, groupYn, userRoleIdx) {
      if (title === 0) {
        this.popupTitle = '권한 그룹 등록'
        this.isEditOrAdd = 'add'
      } else if (title === 1) {
        this.popupTitle = '권한 추가'
        this.groupIndex = groupIndex
        this.isEditOrAdd = 'add'
      } else if (title === 2) {
        this.popupTitle = '권한 이름 변경'
        this.groupIndex = groupIndex
        this.isEditOrAdd = 'edit'
      }
      this.groupYn = groupYn // 해당 변경이 그룹변경인지 확인하기 위함.
      this.userRoleIdx = userRoleIdx // 선택 데이터의 실제 idx값

      this.changeAddEditPopup(true)
    },
    // 지우려는 항목 세팅
    setDeleteItem(itemName, groupIndex, itemIndex, userRoleIdx) {
      this.deleteItemName = itemName
      this.groupIndex = groupIndex
      this.itemIndex = itemIndex
      this.userRoleIdx = userRoleIdx
    },
    onClickCloseModal() {
      this.confirm = false
      this.changeAddEditPopup(false)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
$this: 'sp-authority-group';
.sp-authority-group {
  .sp-card {
    min-height: 700px;
    .card-header {
      justify-content: space-between;
      padding-left: 20px;
      .card-title {
        font-size: toRem(15);
      }
    }
  }
  .#{$this}__group-add-button {
    border-width: thin;
    border-radius: 5px;
    font-size: toRem(14);
    font-weight: bold;
    height: 30px !important;
    color: $sp-teriary;
    .v-icon {
      font-size: 14px;
    }
  }
  .#{$this}__function-buttons-wrapper {
    padding-bottom: 10px;
    .v-icon {
      color: $sp-sky-blue-500;
    }
  }
  .#{$this}__expansion-group-wrapper {
    .v-expansion-panel-header {
      padding: 0;
      min-height: 40px;
      background-color: $sp-grey-400;
      color: white;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      .v-icon__svg {
        fill: white;
      }
    }
    .v-expansion-panel-header--active {
      min-height: 40px;
    }
    .v-expansion-panel-content__wrap {
      padding: 0;
    }
    .expand-icon {
      margin-left: 8px;
      order: 0;
    }
    .expand-header {
      margin-left: 15px;
      order: 1;
      font-size: toRem(15);
    }
    .expand-button {
      max-width: 26px !important;
      border-radius: 50%;
      max-height: 26px;
      order: 2;
      background-color: #687687;
      margin-right: 10px;
      .v-icon {
        font-size: 16px;
        font-weight: 100;
      }
      color: white;
    }
    .expand-list {
      padding-left: 25px;
      .expand-list-item {
        height: 40px;
        display: flex;
        list-style: none;
        font-size: toRem(13);
        color: $sp-title;
        padding: 8px 0px 8px 20px;
        margin-top: 3px;
        margin-bottom: 3px;
        border-radius: 5px;
        .v-icon {
          color: $sp-title;
          font-size: 18px;
        }
        .expand-list-button {
          max-width: 26px !important;
          border-radius: 50%;
          max-height: 26px;
          order: 2;
          border: 1px solid $sp-border-color;
          margin-right: 10px;
          .v-icon {
            font-size: 16px;
            font-weight: 100;
            color: $sp-grey-400;
          }
          color: white;
        }
        .expand-list-item-text {
          align-self: center;
          flex: 1 1 auto;
          margin-left: 5px;
        }
        &:hover {
          background-color: $sp-title;
          color: white;
          cursor: pointer;
          .v-icon {
            color: white;
          }
        }
        &.isActive {
          background-color: $sp-title;
          color: white;
          cursor: pointer;
          .v-icon {
            color: white;
          }
        }
      }
    }
  }
}
</style>
