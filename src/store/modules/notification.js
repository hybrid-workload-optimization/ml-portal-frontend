import request from '@/lib/request'

const resource = {
  namespaced: true,
  state: {
    notification: [],
    isShowNotification: false,
  },
  getters: {
    newNotificationSize(state) {
      return state.notification.filter(item => item.confirmYn === 'N').length
    },
  },
  mutations: {
    setDataList(state, payload) {
      state.notification = payload
    },
    updateShowNotification(state, payload) {
      state.isShowNotification = payload
    },
    changeNoti(state, payload) {
      const orderByNoti = Object.assign(state.notification)
      const idx = orderByNoti.findIndex(
        item => item.alertIdx === payload.alertIdx,
      )
      if (idx > -1) {
        orderByNoti[idx] = payload
      } else if (payload.alertIdx) {
        orderByNoti.unshift(payload)
      }
    },
    confirmNoti(state, payload) {
      const idx = state.notification.findIndex(
        item => item.alertIdx === payload.alertIdx,
      )
      if (idx > -1) {
        state.notification[idx].confirmYn = 'Y'
      }
    },
    deleteNoti(state, payload) {
      const idx = state.notification.findIndex(
        item => item.alertIdx === payload.alertIdx,
      )
      if (idx > -1) {
        state.notification.splice(idx, 1)
      }
    },
  },
  actions: {
    async getDataList({ commit }) {
      try {
        const response = await request.getAlertListUsingGET()
        commit('setDataList', response.data.result)
      } catch (error) {
        console.log(error)
      }
    },
    async updateNotification({ commit }, params) {
      try {
        const response = await request.confirmAlertUsingPUT(params)
        if (response.data.result) {
          commit('confirmNoti', params)
          return true
        }
        return false
      } catch (error) {
        console.error(error)
        return false
      }
    },
    async deleteNotification({ commit }, params) {
      try {
        await request.deleteAlertUsingDELETE(params)
        commit('deleteNoti', params)
      } catch (error) {
        console.error(error)
      }
    },
  },
}

export default resource
