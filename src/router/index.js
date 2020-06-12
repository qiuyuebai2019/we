import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


import common_routes from './common';//引入系统通用路由文件
import sys_routes from './sys';//引入系统通用路由文件
import website_routes from "./website";//


//  判断是否登录
function requireAuth(to, from, next) {
  console.log('via feathers method: ' + localStorage.getItem('token'))
  if (localStorage.getItem('jwt') === null) {
    next({
      path: '/login',
      query: {redirect: "/index"}
      // query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

let endRoute = [
  {
    path: '*',
    component: (resolve) => require(['@/components/NotFound'], resolve)
  }
];
let authRouteChild = new Set([
  ...sys_routes,
  ...common_routes,
  ...website_routes,
  ...endRoute,

]);
//引入系统通用路由文件
//```依次引入其他路由文件
let startRoute = [
  {
    path: '/login',
    name: 'login',
    component: (resolve) => require(['@/views/common/login'], resolve)
  }
];
let authRoute = [
  {
    path: '/',
    component: (resolve) => require(['@/layouts/LayoutIndex'], resolve),
    beforeEnter: requireAuth,
    children: Array.from(authRouteChild)
  }
]

let routes = new Set([
  ...startRoute,//将系统通用路由合并到主路由中
  ...authRoute
]);

export default new Router({
  routes: routes
})
