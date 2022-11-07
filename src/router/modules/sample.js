import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/sample',
    name: 'SampleLayout',
    component: () => import('@/views/SampleLayout.vue'),
    children: [
      {
        path: '',
        name: 'Components',
        component: () => import('@/views/sample/SampleComponent.vue'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'list',
        name: 'SampleList',
        component: () => import('@/views/sample/SampleList.vue'),
      },
      {
        path: 'detail/:id',
        name: 'SampleDetail',
        component: () => import('@/views/sample/SampleDetail.vue'),
      },
      {
        path: 'vuex-sample',
        name: 'VuexSample',
        component: () => import('@/views/sample/VuexSample.vue'),
      },
    ],
  },
]

export default resource
