import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/dashboard',
    name: 'Dashboard Layout',
    component: () => import('@/views/Main'),
    children: [
      {
        path: '',
        name: 'Dashboard',
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
