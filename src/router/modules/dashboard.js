import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/dashboard',
    component: () => import('@/views/Main'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Dashboard'),
        meta: {
          isAuthRequired,
        },
      },
    ],
    // path: '/dashboard',
    // name: 'Dashboard',
    // component: () => import('@/views/dashboard/Dashboard.vue'),
    // meta: {
    //   isAuthRequired,
    // },
  },
]

export default resource
