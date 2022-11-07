import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/globalComponents'

Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV !== 'prod'

Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

export default new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
