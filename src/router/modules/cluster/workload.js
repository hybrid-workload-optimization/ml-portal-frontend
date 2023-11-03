import { isAuthRequired } from '@/App'

export const workload = [
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
  {
    path: 'detail/:id/deployment/:namespace/:name',
    name: 'deploymentDetail',
    component: () =>
      import(
        '@/views/cluster/components/resource/workload/deployment/DeploymentDetailWork.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/statefulset/:namespace/:name',
    name: 'statefulSetDetail',
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
    name: 'podDetail',
    component: () =>
      import(
        '@/views/cluster/components/resource/workload/pod/PodDetailWork.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/cronjob/:namespace/:name',
    name: 'Cluster Detail CronJob Detail',
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
    path: 'detail/:id/replicaset/:namespace/:name',
    name: 'Cluster Detail ReplicaSet Detail',
    component: () =>
      import(
        '@/views/cluster/components/resource/workload/replica-set/ReplicaSetDetailWork.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
  {
    path: 'detail/:id/daemonset/:namespace/:name',
    name: 'Cluster Detail DaemonSet Detail',
    component: () =>
      import(
        '@/views/cluster/components/resource/workload/daemon-set/DaemonSetDetailWork.vue'
      ),
    meta: {
      isAuthRequired,
    },
  },
]

export default workload
