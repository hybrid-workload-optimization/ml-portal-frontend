const resource = [
  {
    path: '*',
    redirect: '/404',
  },
  {
    path: '/404',
    name: 'notFound',
    component: () => import('@/views/error/404Error.vue'),
  },
]

export default resource
