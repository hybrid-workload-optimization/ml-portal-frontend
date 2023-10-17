import cluster from '@/store/modules/cluster/cluster'
import clusterNamespace from '@/store/modules/cluster/clusterNamespace'
import clusterNode from '@/store/modules/cluster/clusterNode'
import clusterPersistentVolume from '@/store/modules/cluster/clusterPersistentVolume'
import clusterStorageClass from '@/store/modules/cluster/clusterStorageClass'
import clusters from '@/store/modules/cluster/clusters'
import clusterAddOn from '@/store/modules/cluster/clusterAddOn'
import clusterWorkload from '@/store/modules/cluster/clusterWorkload'
import clusterMonitoring from '@/store/modules/cluster/clusterMonitoring'
import overview from '@/store/modules/cluster/overview'

export default {
  cluster,
  clusterNamespace,
  clusterNode,
  clusterPersistentVolume,
  clusterStorageClass,
  clusters,
  clusterAddOn,
  clusterWorkload,
  overview,
  clusterMonitoring,
}
