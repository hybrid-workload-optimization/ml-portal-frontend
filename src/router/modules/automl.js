import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/automl',
    name: 'AutoML Layout',
    component: () => import('@/views/Main'),
    redirect: '/automl/list',
    children: [
      {
        path: 'list',
        name: 'AutoMLlist',
        component: () => import('@/views/automl/AutoMLList'),
        meta: {
          isAuthRequired,
        },
      },
      // {
      //   path: 'new',
      //   name: 'AutoMLdetail',
      //   component: () => import('@/views/automl/AutoMLNew'),
      //   meta: {
      //     isAuthRequired,
      //   },
      // },
      {
        path: 'detail/:namespace/:name',
        name: 'AutoMLnew',
        component: () => import('@/views/automl/AutoMLDetail'),
        meta: {
          isAuthRequired,
        },
      },
    ],
  },
]

export default resource
