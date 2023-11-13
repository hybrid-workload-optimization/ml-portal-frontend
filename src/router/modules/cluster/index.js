import { isAuthRequired } from '@/App'
import { compute } from './compute'
import { workload } from './workload'
import { network } from './network'
import { config } from './config'

const resource = [
  {
    path: '/cluster',
    name: 'Cluster',
    component: () => import('@/views/Main'),
    // redirect: '/cluster/list',
    children: [
      {
        path: 'new',
        name: 'clusterNew',
        component: () => import('@/views/cluster/ClusterForm'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'edit/:id',
        name: 'clusterEdit',
        component: () => import('@/views/cluster/ClusterForm'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'provisioning/:id/:provisioningStatus',
        name: 'clusterProvisioning',
        component: () => import('@/views/cluster/ClusterProvisioning'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'log/:id/:clusterName/:workJobIdx',
        name: 'provisioningLog',
        component: () => import('@/views/cluster/ClusterLog.vue'),
        meta: {
          isAuthRequired,
        },
      },
      ...compute,
      ...workload,
      ...network,
      ...config,
      // Cluster > Resource List
      {
        path: 'detail/:id/overview',
        name: 'detailOverview',
        component: () =>
          import('@/views/cluster/components/ClusterOverview.vue'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/catalog',
        name: 'detailCatalog',
        component: () =>
          import('@/views/cluster/components/ClusterAddonCardList.vue'),
        meta: {
          isAuthRequired,
        },
      },

      {
        path: 'detail/:id/service/:rid',
        name: 'nodeDetailService',
        component: () =>
          import(
            '@/views/cluster/components/resource/networking/service/ServiceDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/ingress/:rid',
        name: 'IngressDetailRid',
        component: () =>
          import(
            '@/views/cluster/components/resource/networking/ingress/IngressDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      // workload tab
      {
        path: 'detail/:id/workload',
        name: 'Cluster Workload list',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/workload/WorkloadList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
    ],
  },
]

export default resource
