const resource = {
  namespaced: true,
  state: {
    options: {
      hideFooter: true,
      hideHeader: false,
      dark: false,
      dense: false,
      disableFiltering: false,
      disablePagination: false,
      disableSort: false,
      fixedHeader: false,
      showSelect: false,
      itemKey: 'id',
    },
  },
  getters: {
    getOptions: state => {
      return state.options
    },
  },
  mutations: {},
  actions: {},
}

export default resource
