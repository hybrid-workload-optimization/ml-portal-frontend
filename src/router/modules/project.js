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
        name: 'Project Card',
        component: () => import('@/views/project/ProjectListWithCard'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'edit/:id',
        name: 'Project Edit',
        component: () => import('@/views/project/ProjectEdit'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id',
        name: 'Project Detail',
        component: () => import('@/views/project/ProjectDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/cluster/new',
        name: 'Project Cluster New',
        component: () => import('@/views/project/cluster/ClusterForm'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'detail/:id/cluster/edit/:cid',
        name: 'Project Cluster New',
        component: () => import('@/views/project/cluster/ClusterForm'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'new',
        name: 'Project New',
        component: () => import('@/views/project/ProjectNew'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'project',
        name: 'Project Layout',
        component: () => import('@/views/project/ProjectLayout'),
        meta: {
          isAuthRequired,
        },
      },
    ],
  },
]

export default resource
