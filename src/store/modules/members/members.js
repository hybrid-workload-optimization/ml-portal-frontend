import { MembersList, MembersSelectList } from '@/assets/data/members.js'

const basic = 'members'

export const ADD_MEMBERS = `${basic}/addMembers`
export const REMOVE_MEMBERS = `${basic}/removeMembers`
export const CHANGE_JOBS = `${basic}/changeJob`

const tag = '[Store_Members]'

const resource = {
  namespaced: true,
  state: {
    // data
    members: MembersList,
    membersSelectList: MembersSelectList,
  },
  getters: {
    getMembers(state) {
      return state.members
    },
    getMembersSelectList(state) {
      return state.membersSelectList
    },
  },
  mutations: {
    addMembers(state, { payload }) {
      console.log(tag, 'ADD_MEMBERS')

      payload.selectedIds.forEach(member => {
        const index = state.members.group.findIndex(el => el.id === member.id)
        state.members.group[index].isAdded = true
      })
    },
    removeMembers(state, { payload }) {
      console.log(tag, 'REMOVE_MEMBERS')
      payload.selectedIds.forEach(member => {
        const index = state.members.group.findIndex(el => el.id === member.id)
        state.members.group[index].isAdded = false
      })
    },
    changeJob(state, { payload }) {
      console.log(tag, payload, 'CHANGE_JOB')
      const index = state.members.group.findIndex(el => el.id === payload.id)
      state.members.group[index].job = payload.job
    },
  },
  actions: {},
}

export default resource
