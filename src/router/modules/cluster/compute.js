import { isAuthRequired } from '@/App'

export const compute = [
  {
    path: 'detail/:id/node',
    name: 'Cluster List Node List',
    component: () =>
      import('@/views/cluster/components/resource/cluster/ClusterNodeList.vue'),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/node/:nodeName',
    name: 'Cluster List Node Detail',
    component: () =>
      import(
        '@/views/cluster/components/resource/cluster/ClusterNodeDetail.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/namespace',
    name: 'Cluster Detail Namespace List',
    component: () =>
      import(
        '@/views/cluster/components/resource/cluster/ClusterNamespaceList.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/namespace/:name',
    name: 'Cluster List Namespace Detail',
    component: () =>
      import(
        '@/views/cluster/components/resource/cluster/ClusterNamespaceDetail.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/persistent-volume',
    name: 'Cluster List Persistent Volume List',
    component: () =>
      import(
        '@/views/cluster/components/resource/cluster/ClusterPersistentVolumeList.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/persistent-volume/:name',
    name: 'Cluster List Persistent Volume Detail',
    component: () =>
      import(
        '@/views/cluster/components/resource/cluster/ClusterPersistentVolumeDetail.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/storage-class',
    name: 'Cluster Detail Storage Class List',
    component: () =>
      import(
        '@/views/cluster/components/resource/cluster/ClusterStorageClassList.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/storage-class/:name',
    name: 'Cluster Detail Storage Class Detail',
    component: () =>
      import(
        '@/views/cluster/components/resource/cluster/ClusterStorageClassDetail.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
]

export default compute
