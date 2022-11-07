import Vue from 'vue'
import spCard from '@/components/atoms/Card.vue'
import spTextFields from '@/components/atoms/TextFields.vue'
import spSelects from '@/components/atoms/Select.vue'
import spButtons from '@/components/atoms/Buttons.vue'
import spBreadcrumbs from '@/components/atoms/Breadcrumbs.vue'
import spMenu from '@/components/atoms/Menu.vue'
import spChip from '@/components/atoms/Chip.vue'
import spTextArea from '@/components/atoms/TextArea.vue'
import spAppBar from '@/components/atoms/AppBar.vue'
import spImage from '@/components/atoms/Images.vue'
import spVerticalProgressBar from '@/components/atoms/VerticalProgressBar.vue'
import spLoading from '@/components/atoms/Loading.vue'

Vue.component('sp-card', spCard)
Vue.component('sp-input', spTextFields)
Vue.component('sp-select', spSelects)
Vue.component('sp-button', spButtons)
Vue.component('sp-breadcrumbs', spBreadcrumbs)
Vue.component('sp-menu', spMenu)
Vue.component('sp-chip', spChip)
Vue.component('sp-textarea', spTextArea)
Vue.component('sp-app-bar', spAppBar)
Vue.component('sp-image', spImage)
Vue.component('sp-vertical-progress-bar', spVerticalProgressBar)
Vue.component('sp-loading', spLoading)
