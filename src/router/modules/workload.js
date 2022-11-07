import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/workload',
    name: 'Workload',
    component: () => import('@/views/Main'),
    redirect: '/workload/deployment',
    children: [
      {
        path: 'deployment',
        redirect: 'deployment/list',
      },
      {
        path: 'deployment/list',
        name: 'WorkloadDeployment',
        component: () => import('@/views/workload/deployment/DeploymentList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'deployment/detail/:id',
        name: 'WorkloadDeployment Detail',
        component: () => import('@/views/workload/deployment/DeploymentDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'stateful-set',
        redirect: 'stateful-set/list',
      },
      {
        path: 'stateful-set/list',
        name: 'WorkloadStatefulSet',
        component: () =>
          import('@/views/workload/stateful-set/StatefulSetList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'stateful-set/detail/:id',
        name: 'WorkloadStatefulSet Detail',
        component: () =>
          import('@/views/workload/stateful-set/StatefulSetDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'pod',
        redirect: 'pod/list',
      },
      {
        path: 'pod/list',
        name: 'WorkloadPod',
        component: () => import('@/views/workload/pod/PodList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'pod/detail/:clusterIdx/:namespace/:name',
        name: 'WorkloadPod Detail',
        component: () => import('@/views/workload/pod/PodDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'pod/detail/:clusterIdx/:type/:namespace/:name',
        name: 'WorkloadPod Log',
        component: () => import('@/views/workload/pod/components/PodLog'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'cron-job',
        redirect: 'cron-job/list',
      },
      {
        path: 'cron-job/list',
        name: 'WorkloadCronJob',
        component: () => import('@/views/workload/cron-job/CronJobList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'cron-job/detail/:id',
        name: 'WorkloadCronJob Detail',
        component: () => import('@/views/workload/cron-job/CronJobDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'job',
        redirect: 'job/list',
      },
      {
        path: 'job/list',
        name: 'WorkloadJob',
        component: () => import('@/views/workload/job/JobList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'job/detail/:id',
        name: 'WorkloadJob Detail',
        component: () => import('@/views/workload/job/JobDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'replica-set',
        redirect: 'replica-set/list',
      },
      {
        path: 'replica-set/list',
        name: 'WorkloadReplicaSet',
        component: () => import('@/views/workload/replica-set/ReplicaSetList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'replica-set/detail/:id',
        name: 'WorkloadReplicaSet Detail',
        component: () =>
          import('@/views/workload/replica-set/ReplicaSetDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'daemon-set',
        redirect: 'daemon-set/list',
      },
      {
        path: 'daemon-set/list',
        name: 'WorkloadDaemonSet',
        component: () => import('@/views/workload/daemon-set/DaemonSetList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'daemon-set/detail/:id',
        name: 'WorkloadDaemonSet Detail',
        component: () => import('@/views/workload/daemon-set/DaemonSetDetail'),
        meta: {
          isAuthRequired,
        },
      },
    ],
  },
]

export default resource
