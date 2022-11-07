import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/config',
    name: 'Config',
    component: () => import('@/views/Main'),
    redirect: '/config/persistent-volume-claim',
    children: [
      {
        path: 'persistent-volume-claim/list',
        name: 'ConfigPersistentVolumeClaim',
        component: () =>
          import(
            '@/views/config/persistent-volume-claim/PersistentVolumeClaimList'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'persistent-volume-claim/detail/:id',
        name: 'ConfigPersistentVolumeClaim Detail',
        component: () =>
          import(
            '@/views/config/persistent-volume-claim/PersistentVolumeClaimDetail'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'config-map',
        redirect: 'config-map/list',
      },
      {
        path: 'config-map/list',
        name: 'ConfigConfigMap',
        component: () => import('@/views/config/config-map/ConfigMapList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'config-map/detail/:id',
        name: 'ConfigConfigMap Detail',
        component: () => import('@/views/config/config-map/ConfigMapDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'secret',
        redirect: 'secret/list',
      },
      {
        path: 'secret/list',
        name: 'ConfigSecret',
        component: () => import('@/views/config/secret/SecretList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'secret/detail/:id',
        name: 'ConfigSecret Detail',
        component: () => import('@/views/config/secret/SecretDetail'),
        meta: {
          isAuthRequired,
        },
      },
    ],
  },
]

export default resource
