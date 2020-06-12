/**
 * 系统通用模块路由
 */
export default[
  // {
  //   path: 'index',
  //   name: 'index',
  //   component: (resolve) => require(['@/components/Index'], resolve),
  // },
  {
    path: '/',
    name: 'HomePage',
    component: (resolve) => require(['@/views/common/HomePage'], resolve),
  },
  {
    path: 'index',
    name: 'PageIndex',
    component: (resolve) => require(['@/views/common/HomePage'], resolve),
  },
]
