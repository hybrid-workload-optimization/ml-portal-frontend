import { isAuthRequired } from '@/App'

export const config = [
  {
    path: 'detail/:id/persistent-volume-claim',
    name: 'Cluster Detail Persistent Volume Claim',
    component: () =>
      import(
        '@/views/cluster/components/resource/config/persistent-volume-claim/PersistentVolumeClaimList.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/persistent-volume-claim/:namespace/:name',
    name: 'Cluster Detail Persistent Volume Claim Detail',
    component: () =>
      import(
        '@/views/cluster/components/resource/config/persistent-volume-claim/PersistentVolumeClaimDetail.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/config-map',
    name: 'Cluster Detail Config Map',
    component: () =>
      import(
        '@/views/cluster/components/resource/config/config-map/ConfigMapList.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    /* http://localhost:3000/cluster/detail/674/config-map/argocd/argocd-notifications-cm */
    path: 'detail/:id/config-map/:namespace/:name',
    name: 'Cluster Detail Config Map Detail',
    component: () =>
      import(
        '@/views/cluster/components/resource/config/config-map/ConfigMapDetail.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/secret',
    name: 'Cluster Detail Secret',
    component: () =>
      import(
        '@/views/cluster/components/resource/config/secret/SecretList.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/secret/:namespace/:name',
    name: 'Cluster Detail Secret Detail',
    component: () =>
      import(
        '@/views/cluster/components/resource/config/secret/SecretDetail.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
]

export default config
