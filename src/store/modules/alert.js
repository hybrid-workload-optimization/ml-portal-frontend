const resource = {
  namespaced: true,
  state: {
    title: 'message title',
    showAlert: false,
    color: '#DE0655',
    timeout: -1,
    isClose: true,
  },
  getters: {
    showAlert: state => {
      return state.showAlert
    },
    alertTitle: state => {
      return state.title
    },
    alertOptions: state => {
      return {
        timeout: state.timeout,
        isClose: state.isClose,
        color: state.color,
      }
    },
  },
  mutations: {
    openAlert(state, payload) {
      state.showAlert = true
      console.log(payload)
      if (payload) {
        state.title = payload.title
        if (!state.title) {
          state.title = payload
          state.color = '#DE0655'
          state.timeout = -1
          state.isClose = true
        }
        if (payload.type === 'info') {
          state.color = '#29AA54'
          state.timeout = 3000
          state.isClose = false
        } else if (payload.type === 'error') {
          state.color = '#DE0655'
          state.timeout = -1
          state.isClose = true
        } else if (payload.type === 'warn') {
          state.timeout = 3000
          state.isClose = false
          state.color = '#FF8000'
        }
      }
    },
    closeAlert(state) {
      state.showAlert = false
    },
  },
  actions: {},
}

export default resource
