import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/',
    redirect: '/dashboard',
    name: 'LoginLayout',
    component: () => import('@/views/login/LoginLayout.vue'),
    children: [
      {
        path: '/ssoLogin',
        name: 'SSO Login',
        component: () => import('@/components/SsoLogin.vue'),
        meta: {
          isAuthRequired: !isAuthRequired,
        },
      },
      {
        path: '/ssoLogin2',
        name: 'SSO Login2',
        component: () => import('@/components/SsoLogin2.vue'),
        meta: {
          isAuthRequired: !isAuthRequired,
        },
      },
      {
        path: '/devLogin',
        name: 'Dev Login',
        component: () => import('@/views/login/Login.vue'),
        meta: {
          isAuthRequired: !isAuthRequired,
        },
      },
    ],
  },
]

export default resource
