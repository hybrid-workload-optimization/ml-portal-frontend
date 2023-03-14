import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/',
    redirect: '/dashboard',
    name: 'LoginLayout',
    component: () => import('@/views/login/LoginLayout.vue'),
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/components/Login.vue'),
        meta: {
          isAuthRequired: !isAuthRequired,
        },
      },
    ],
  },
]

export default resource
