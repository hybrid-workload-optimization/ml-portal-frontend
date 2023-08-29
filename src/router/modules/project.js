import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/project',
    name: 'Project',
    component: () => import('@/views/Main'),
    redirect: '/project/list',
    children: [
      // {
      //   path: 'list',
      //   name: 'Project List',
      //   component: () => import('@/views/project/ProjectList'),
      //   meta: {
      //     isAuthRequired,
      //   },
      // },
      {
        path: 'list',
        name: 'projectCard',
        component: () => import('@/views/project/ProjectListWithCard'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'edit/:id',
        name: 'projectEdit',
        component: () => import('@/views/project/ProjectEdit'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id',
        name: 'projectDetail',
        component: () => import('@/views/project/ProjectDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/cluster/new',
        name: 'projectClusterNew',
        component: () => import('@/views/project/cluster/ClusterForm'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/cluster/edit/:cid',
        name: 'ProjectClusteEdit',
        component: () => import('@/views/project/cluster/ClusterForm'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'new',
        name: 'projectNew',
        component: () => import('@/views/project/ProjectNew'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'project',
        name: 'projectLayout',
        component: () => import('@/views/project/ProjectLayout'),
        meta: {
          isAuthRequired,
        },
      },
    ],
  },
]

export default resource
