import request from '@/lib/request'

const resource = {
  namespaced: true,
  state: {
    generalSettings: [
      {
        idx: null,
        type: null,
        key: null,
        value: null,
        description: null,
      },
    ],
  },
  getters: {
    getSetting: state => {
      return state.generalSettings[0]
    },

    getValue: state => {
      return state.generalSettings[0].value
    },
  },
  mutations: {
    setSettingValue(state, payload) {
      state.value = payload
    },

    setSettings(state, payload) {
      state.generalSettings = payload
    },
  },
  actions: {
    async getSettings({ commit }) {
      try {
        const response = await request.getGeneralSettingListUsingGET()
        commit('setSettings', response.data.result)
      } catch (error) {
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    async putSettings({ dispatch, commit }, payload) {
      try {
        await request.putGeneralSettingUsingPUT(payload)

        await dispatch('getSettings')

        commit(
          'alert/openAlert',
          { title: '데이터를 저장 했습니다.', type: 'info' },
          {
            root: true,
          },
        )
      } catch (error) {
        commit('alert/openAlert', '데이터를 저장에 실패했습니다.', {
          root: true,
        })
      }
    },
  },
}

export default resource
