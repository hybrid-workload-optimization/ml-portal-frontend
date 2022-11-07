import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/network',
    name: 'Network',
    component: () => import('@/views/Main'),
    redirect: '/network/service/list',
    children: [
      {
        path: 'service',
        redirect: 'service/list',
      },
      {
        path: 'service/list',
        name: 'NetworkService',
        component: () => import('@/views/networking/service/ServiceList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'service/detail/:id',
        name: 'NetworkService Detail',
        component: () => import('@/views/networking/service/ServiceDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'ingress',
        redirect: 'ingress/list',
      },
      {
        path: 'ingress/list',
        name: 'NetworkIngress',
        component: () => import('@/views/networking/ingress/IngressList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'ingress/detail/:id',
        name: 'NetworkIngress Detail',
        component: () => import('@/views/networking/ingress/IngressDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'ingress-controller',
        redirect: 'ingress-controller/list',
      },
      {
        path: 'ingress-controller/list',
        name: 'NetworkIngressController',
        component: () =>
          import('@/views/networking/ingress-controller/IngressControllerList'),
        meta: {
          isAuthRequired,
        },
      },
    ],
  },
]

export default resource
