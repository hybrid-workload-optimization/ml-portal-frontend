const basic = 'sideNav'

export const SET_MINI = `${basic}/setIsMini`

const tag = '[SideNav]'

const sideNav = {
  namespaced: true,
  state: {
    onDrawer: false,
    isMini: false,
  },
  getters: {
    getOnDrawer(state) {
      return state.onDrawer
    },
  },
  mutations: {
    setOnDrawer(state, status) {
      console.log(tag, 'setOnDrawer')
      state.onDrawer = status
    },
    setIsMini(state, { payload }) {
      console.log(tag, 'SET_MINI')
      state.isMini = payload.isMini
    },
  },
}

export default sideNav
