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
]

export default config
