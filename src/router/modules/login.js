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
        component: () => import('@/views/login/Login.vue'),
        meta: {
          isAuthRequired: !isAuthRequired,
        },
      },
      {
        path: '/signup',
        name: 'SignUp',
        component: () => import('@/views/login/SignUp.vue'),
        meta: {
          isAuthRequired: !isAuthRequired,
        },
      },
      {
        path: '/find-password',
        name: 'Find Password',
        component: () => import('@/views/login/FindPassword.vue'),
        meta: {
          isAuthRequired: !isAuthRequired,
        },
      },
      {
        path: '/change-password',
        name: 'Change Password',
        component: () => import('@/views/login/ChangePassword.vue'),
        meta: {
          isAuthRequired: !isAuthRequired,
        },
      },
    ],
  },
]

export default resource
