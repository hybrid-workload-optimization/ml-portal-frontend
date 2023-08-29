import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/cluster',
    component: () => import('@/views/Main'),
    redirect: '/cluster/list',
    children: [
      {
        path: 'list',
        name: 'clusterList',
        component: () => import('@/views/cluster/ClusterList'),
        meta: {
          isAuthRequired,
        },
      },
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

      {
        path: 'detail/:id/pod/:type/:namespace/:name',
        name: 'workloadPodLog2',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/pod/components/PodLog.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },

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
        path: 'detail/:id/node',
        name: 'Cluster Detail Node',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterNodeList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/namespace',
        name: 'Cluster Detail Namespace',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterNamespaceList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/persistent-volume',
        name: 'Cluster Detail Persistent Volume',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterPersistentVolumeList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/storage-class',
        name: 'Cluster Detail Storage Class',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterStorageClassList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/deployment',
        name: 'detailDeployment',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/deployment/DeploymentList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/stateful-set',
        name: 'detailStatefulSet',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/stateful-set/StatefulSetList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/pod',
        name: 'detailPod',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/pod/PodList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/cron-job',
        name: 'detailCronJob',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/cron-job/CronJobList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/job',
        name: 'Cluster Detail Job',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/job/JobList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/replica-set',
        name: 'replicaSet',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/replica-set/ReplicaSetList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/daemon-set',
        name: 'daemonSet',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/daemon-set/DaemonSetList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
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

      {
        path: 'detail/:id/node/v2/:nodeName',
        name: 'nodeDetail2',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterNodeDetail2.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },

      {
        path: 'detail/:id/namespace/v2/:namespace',
        name: 'namespaceDetail2',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterNamespaceDetail2.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },

      // Cluster > Resource > Resource Detail
      {
        path: 'detail/:id/node/:rid',
        name: 'nodeDetail',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterNodeDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/namespace/:rid',
        name: 'namespaceDetail',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterNamespaceDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/persistent-volume/:rid',
        name: 'persistentVolumeDetail',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterPersistentVolumeDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/storage-class/:rid',
        name: 'storageClassDetail',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterStorageClassDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/deployment/:rid',
        name: 'deploymentDetail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/deployment/DeploymentDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/stateful-set/:rid',
        name: 'statefulSetDetail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/stateful-set/StatefulSetDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/pod/:namespace/:name',
        name: 'podDetail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/pod/PodDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/cron-job/:rid',
        name: 'cronJobDetail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/cron-job/CronJobDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/job/:rid',
        name: 'jobDetail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/job/JobDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/replica-set/:rid',
        name: 'replicaSetDetail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/replica-set/ReplicaSetDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/daemon-set/:rid',
        name: 'DaemonSetDetail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/daemon-set/DaemonSetDetail.vue'
          ),
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
      {
        path: 'detail/:id/namespace/:namespace/:name',
        name: 'Cluster Detail Namespace Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterNamespaceDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/persistentVolume/:namespace/:name',
        name: 'Cluster Detail Persistent Volume Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterPersistentVolumeDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/storageClass/:namespace/:name',
        name: 'Cluster Detail Storage Class Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/cluster/ClusterStorageClassDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/deployment/:namespace/:name',
        name: 'Cluster Detail Deployment Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/deployment/DeploymentDetailWork.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/statefulSet/:namespace/:name',
        name: 'Cluster Detail Stateful Set Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/stateful-set/StatefulSetDetailWork.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/pod/:namespace/:name',
        name: 'Cluster Detail Pod Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/pod/PodDetailWork.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/cronJob/:namespace/:name',
        name: 'Cluster Detail Cron Job Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/cron-job/CronJobDetailWork.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/job/:namespace/:name',
        name: 'Cluster Detail Job Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/job/JobDetailWork.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/replicaSet/:namespace/:name',
        name: 'Cluster Detail Replica Set Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/replica-set/ReplicaSetDetailWork.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/daemonSet/:namespace/:name',
        name: 'Cluster Detail Daemon Set Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/daemon-set/DaemonSetDetailWork.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/service/:namespace/:name',
        name: 'nodeDetailName',
        component: () =>
          import(
            '@/views/cluster/components/resource/networking/service/ServiceDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/ingress/:namespace/:name',
        name: 'Cluster Detail Ingress Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/networking/ingress/IngressDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/persistentVolumeClaim/:namespace/:name',
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
        path: 'detail/:id/configMap/:namespace/:name',
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
        path: 'detail/:id/secret/:namespace/:name',
        name: 'secretDetailName',
        component: () =>
          import(
            '@/views/cluster/components/resource/config/secret/SecretDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
    ],
  },
]

export default resource
