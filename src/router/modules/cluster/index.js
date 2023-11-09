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
      // {
      //   path: 'list',
      //   name: 'clusterList',
      //   component: () => import('@/views/cluster/ClusterList'),
      //   meta: {
      //     isAuthRequired,
      //   },
      // },
      // {
      //   path: 'detail/:id',
      //   name: 'Cluster Detail',
      //   component: () => import('@/views/cluster/ClusterDetail'),
      //   meta: {
      //     isAuthRequired,
      //   },
      // },
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
      // {
      //   path: 'detail/:id/:resource',
      //   name: 'Cluster Detail Resource',
      //   component: () => import('@/views/cluster/ClusterDetail_v2'),
      //   meta: {
      //     isAuthRequired,
      //   },
      // },
      // {
      //   path: 'detail/:id',
      //   name: 'Cluster Detail',
      //   component: () => import('@/views/cluster/ClusterDetail_v2'),
      //   meta: {
      //     isAuthRequired,
      //   },
      // },
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
      {
        path: 'detail/:id/persistent-volume-claim/:rid',
        name: '[ersistentVolumeClaimDetailRid',
        component: () =>
          import(
            '@/views/cluster/components/resource/config/persistent-volume-claim/PersistentVolumeClaimDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/config-map/:rid',
        name: 'configMapDetailRid',
        component: () =>
          import(
            '@/views/cluster/components/resource/config/config-map/ConfigMapDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/secret/:rid',
        name: 'Cluster Detail Secret Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/config/secret/SecretDetail.vue'
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

      {
        path: 'detail/:id/node/:namespace/:name',
        name: 'Cluster Detail Node Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterNodeDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
    ],
  },
]

export default resource
