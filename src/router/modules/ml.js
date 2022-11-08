import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/ml',
    name: 'ML Layout',
    component: () => import('@/views/Main'),
    redirect: '/ml/list',
    children: [
      {
        path: 'list',
        name: 'ML',
        component: () => import('@/views/ml/MLList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'new',
        name: 'MachinLearning New',
        component: () => import('@/views/ml/MLNew'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id',
        name: 'Detail',
        component: () => import('@/views/ml/MLDetail'),
        meta: {
          isAuthRequired,
        },
      },
    ],
  },
]

export default resource
