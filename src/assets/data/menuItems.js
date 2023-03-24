export const PaaSMenuItems = [
  {
    icon: 'star_border',
    alt: 'favorite',
    name: 'Favorite',
    path: '',
    subMenuItem: [],
  },
  {
    icon: 'dashboard',
    alt: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    subMenuItem: [],
  },
  {
    icon: 'create_new_folder',
    alt: 'Machine Learning',
    name: 'Machine Learning',
    path: '/ml',
    subMenuItem: [],
  },
  {
    icon: 'create_new_folder',
    alt: 'Service Group',
    name: 'Service Group',
    path: '/project/list',
    subMenuItem: [
      // {
      //   name: 'Overview',
      //   path: '/project/list',
      //   categories: [],
      // },
      // {
      //   name: 'Project(임시)',
      //   path: '/project/project',
      //   categories: [],
      // },
      // {
      //   name: 'Member',
      //   path: '',
      //   categories: [],
      // },
    ],
  },
  {
    icon: 'hub',
    alt: 'cluster',
    name: 'Cluster',
    path: '/cluster/list',
    subMenuItem: [],
  },
  {
    icon: 'dvr',
    alt: 'workload',
    name: 'Workload',
    path: '',
    subMenuItem: [
      {
        name: 'Deployment',
        path: '/workload/deployment/list',
        categories: [],
      },
      {
        name: 'Stateful Set',
        path: '/workload/stateful-set/list',
        categories: [],
      },
      {
        name: 'Pod',
        path: '/workload/pod/list',
        categories: [],
      },
      {
        name: 'Cron Job',
        path: '/workload/cron-job/list',
        categories: [],
      },
      {
        name: 'Job',
        path: '/workload/job/list',
        categories: [],
      },
      {
        name: 'Replica Set',
        path: '/workload/replica-set/list',
        categories: [],
      },
      {
        name: 'Daemon Set',
        path: '/workload/daemon-set/list',
        categories: [],
      },
    ],
  },
  {
    icon: 'lan',
    alt: 'networking',
    name: 'Network',
    path: '',
    subMenuItem: [
      {
        name: 'Service',
        path: '/networking/service/list',
        categories: [],
      },
      {
        name: 'Ingress',
        path: '/networking/ingress/list',
        categories: [],
      },
      {
        name: 'Ingress Controller',
        path: '/networking/ingress-controller/list',
        categories: [],
      },
    ],
  },
  {
    icon: 'build',
    alt: 'config',
    name: 'Config',
    path: '',
    subMenuItem: [
      {
        name: 'Persistent Volume Claim',
        path: '/config/persistentVolumeClaim/list',
        categories: [],
      },
      {
        name: 'Config Map',
        path: '',
        categories: [],
      },
      {
        name: 'Secret',
        path: '',
        categories: [],
      },
    ],
  },
  {
    icon: 'settings',
    alt: 'setting',
    name: 'Setting',
    path: '',
    subMenuItem: [
      {
        name: 'General',
        path: '/setting/general',
        categories: [],
      },
      {
        name: 'User',
        path: '/setting/user/list',
        categories: [],
      },
      {
        name: 'Authority',
        path: '/setting/authority',
        categories: [],
      },
      {
        name: 'Code Mgmt.',
        path: '/setting/codeMgmt',
        categories: [],
      },
      {
        name: 'Tool',
        path: '/setting/tools/detail/kubespray',
        categories: [],
      },
    ],
  },
]
