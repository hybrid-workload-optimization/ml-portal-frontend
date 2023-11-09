import Vue from 'vue'
import Vuex from 'vuex'

import sideNav from '@/store/modules/sideNav'
import multiSelect from '@/store/modules/multiSelect'
import notification from '@/store/modules/notification'
import project from '@/store/modules/project'
import cluster from '@/store/modules/cluster'
import members from '@/store/modules/members/members'
import authority from '@/store/modules/setting/authority'
import sample from '@/store/modules/sample/sample'
import auth from '@/store/modules/auth'
import clustersChart from '@/store/modules/clustersChart'
import dataTable from '@/store/modules/dataTable'
import workload from '@/store/modules/workload'
import setting from '@/store/modules/setting'
import yamlEditModal from '@/store/modules/yamlEditModal'
import alert from '@/store/modules/alert'
import confirm from '@/store/modules/confirm'
import networking from '@/store/modules/networking'
import multiSelectForSeparate from '@/store/modules/multiSelectForSeparate'
import loginUser from '@/store/modules/loginUser'
import loading from '@/store/modules/loading'
import dashboard from '@/store/modules/dashboard/dashboard'
import console from '@/store/modules/console'
import config from '@/store/modules/config'
import ml from '@/store/modules/ml'
import automl from '@/store/modules/automl'
import selectButton from '@/store/modules/selectButton'
import serviceGroup from '@/store/modules/serviceGroup'
import _ from 'lodash'

Vue.use(Vuex)

// TODO vuex 초기화 작업 필요
const initialStoreModules = {
  sideNav,
  multiSelect,
  selectButton,
  notification,
  ...project,
  members,
  authority,
  auth,
  sample,
  dataTable,
  clustersChart,
  ...workload,
  ...setting,
  yamlEditModal,
  confirm,
  ...networking,
  ...cluster,
  multiSelectForSeparate,
  loginUser,
  dashboard,
  console,
  ...config,
  ...ml,
  ...automl,
  serviceGroup,
}

export default new Vuex.Store({
  state: {},
  mutations: {
    resetState(state) {
      _.forOwn(initialStoreModules, (value, key) => {
        state[key] = _.cloneDeep(value.state)
      })
    },
  },
  actions: {},
  modules: {
    loading,
    alert,
    ..._.cloneDeep(initialStoreModules),
  },
})
