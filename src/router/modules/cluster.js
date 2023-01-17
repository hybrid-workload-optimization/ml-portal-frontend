import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/cluster',
    name: 'Cluster Layout',
    component: () => import('@/views/Main'),
    redirect: '/cluster/list',
    children: [
      {
        path: 'list',
        name: 'Cluster',
        component: () => import('@/views/cluster/ClusterList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id',
        name: 'Cluster Detail',
        component: () => import('@/views/cluster/ClusterDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'new',
        name: 'Cluster New',
        component: () => import('@/views/cluster/ClusterForm'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'edit/:id',
        name: 'Cluster Edit',
        component: () => import('@/views/cluster/ClusterForm'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'provisioning/:id/:provisioningStatus',
        name: 'Cluster Provisioning',
        component: () => import('@/views/cluster/ClusterProvisioning'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'log/:id/:clusterName/:workJobIdx',
        name: 'Cluster Provisioning Log',
        component: () => import('@/views/cluster/ClusterLog.vue'),
        meta: {
          isAuthRequired,
        },
      },
    ],
  },
]

export default resource
