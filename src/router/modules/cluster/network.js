import { isAuthRequired } from '@/App'

export const network = [
  {
    path: 'detail/:id/service',
    name: 'detailService',
    component: () =>
      import(
        '@/views/cluster/components/resource/networking/service/ServiceList.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/ingress',
    name: 'detailIngress',
    component: () =>
      import(
        '@/views/cluster/components/resource/networking/ingress/IngressList.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/ingress-controller',
    name: 'ingressController',
    component: () =>
      import(
        '@/views/cluster/components/resource/networking/ingress-controller/IngressControllerList.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
]

export default network
