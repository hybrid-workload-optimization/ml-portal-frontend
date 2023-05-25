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
        path: '/detail/:id/pod/:type/:namespace/:name',
        name: 'WorkloadPod Log',
        component: () => import('@/views/workload/pod/components/PodLog'),
        meta: {
          isAuthRequired,
        },
      },

      // Cluster > Resource List
      {
        path: 'detail/:id/Overview',
        name: 'Cluster Detail Overview',
        component: () =>
          import('@/views/cluster/components/ClusterOverview.vue'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Catalog',
        name: 'Cluster Detail Catalog',
        component: () =>
          import('@/views/cluster/components/ClusterAddonCardList.vue'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Node',
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
        path: 'detail/:id/Namespace',
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
        path: 'detail/:id/Persistent Volume',
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
        path: 'detail/:id/Storage Class',
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
        path: 'detail/:id/Deployment',
        name: 'Cluster Detail Deployment',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/deployment/DeploymentList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Stateful Set',
        name: 'Cluster Detail Stateful Set',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/stateful-set/StatefulSetList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Pod',
        name: 'Cluster Detail Pod',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/pod/PodList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Cron Job',
        name: 'Cluster Detail Cron Job',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/cron-job/CronJobList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Job',
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
        path: 'detail/:id/Replica Set',
        name: 'Cluster Detail Replica Set',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/replica-set/ReplicaSetList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Daemon Set',
        name: 'Cluster Detail Daemon Set',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/daemon-set/DaemonSetList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Service',
        name: 'Cluster Detail Service',
        component: () =>
          import(
            '@/views/cluster/components/resource/networking/service/ServiceList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Ingress',
        name: 'Cluster Detail Ingress',
        component: () =>
          import(
            '@/views/cluster/components/resource/networking/ingress/IngressList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Ingress Controller',
        name: 'Cluster Detail Ingress Controller',
        component: () =>
          import(
            '@/views/cluster/components/resource/networking/ingress-controller/IngressControllerList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Persistent Volume Claim',
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
        path: 'detail/:id/Config Map',
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
        path: 'detail/:id/Secret',
        name: 'Cluster Detail Secret',
        component: () =>
          import(
            '@/views/cluster/components/resource/config/secret/SecretList.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },

      // Cluster > Resource > Resource Detail
      {
        path: 'detail/:id/Node/:rid',
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
        path: 'detail/:id/Namespace/:rid',
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
        path: 'detail/:id/Persistent Volume/:rid',
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
        path: 'detail/:id/Storage Class/:rid',
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
        path: 'detail/:id/Deployment/:namespace/:name',
        name: 'Cluster Detail Deployment Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/deployment/DeploymentDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Stateful Set/:rid',
        name: 'Cluster Detail Stateful Set Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/stateful-set/StatefulSetDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Pod/:namespace/:name',
        name: 'Cluster Detail Pod Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/pod/PodDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Cron Job/:rid',
        name: 'Cluster Detail Cron Job Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/cron-job/CronJobDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Job/:rid',
        name: 'Cluster Detail Job Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/job/JobDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Replica Set/:rid',
        name: 'Cluster Detail Replica Set Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/replica-set/ReplicaSetDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Daemon Set/:rid',
        name: 'Cluster Detail Daemon Set Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/workload/daemon-set/DaemonSetDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Service/:rid',
        name: 'Cluster Detail Node Detail',
        component: () =>
          import(
            '@/views/cluster/components/resource/networking/service/ServiceDetail.vue'
          ),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/Ingress/:rid',
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
        path: 'detail/:id/Persistent Volume Claim/:rid',
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
        path: 'detail/:id/Config Map/:rid',
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
        path: 'detail/:id/Secret/:rid',
        name: 'Cluster Detail Secret Detail',
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
