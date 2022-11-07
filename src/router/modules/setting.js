import { isAuthRequired } from '@/App'

const resource = [
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@/views/Main'),
    children: [
      {
        path: 'tools/detail/:id',
        name: 'SettingTool',
        component: () => import('@/views/setting/tools/ToolsDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'authority',
        name: 'SettingAuthority',
        component: () => import('@/views/setting/Authority'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'codeMgmt',
        name: 'SettingCodeMgmt',
        component: () => import('@/views/setting/CodeMgmt'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'user',
        redirect: 'user/list',
      },
      {
        path: 'user/list',
        name: 'SettingUser',
        component: () => import('@/views/setting/user/UserList'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'user/detail/:id',
        name: 'SettingUser Detail',
        component: () => import('@/views/setting/user/UserDetail'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'user/edit/:id',
        name: 'SettingUser Edit',
        component: () => import('@/views/setting/user/UserEdit'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'user/password/:id',
        name: 'UserPassword',
        component: () => import('@/views/setting/user/UserPassword'),
        meta: {
          isAuthRequired,
        },
      },
      {
        path: 'general',
        name: 'SettingGeneral',
        component: () => import('@/views/setting/General'),
        meta: {
          isAuthRequired,
        },
      },
    ],
  },
]

export default resource
