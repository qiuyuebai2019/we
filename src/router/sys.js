/**
 * 系统通用模块路由
 */

export default[
  {//标签数据接收日志
    path: '/sys/receive/bqReceiveLog',
    name: 'BqReceiveLog',
    component: (resolve) => require(['@/views/sys/receive/BqReceiveLog'], resolve),
  },
  {//自动解除报警日志
    path: '/sys/receive/bqJcbjLog',
    name: 'BqJcbjLog',
    component: (resolve) => require(['@/views/sys/receive/BqJcbjLog'], resolve),
  },
  {//操作日志表
    path: '/sys/log/SysLog',
    name: 'SysLog',
    component: (resolve) => require(['@/views/sys/log/SysLog'], resolve),
  },
  {//用户角色
    path: '/sys/user/SysUserRole',
    name: 'SysUserRole',
    component: (resolve) => require(['@/views/sys/user/SysUserRole'], resolve)
  },
  {//数据字典下拉
    path: '/sys/pub/SysTypegroup',
    name: 'SysTypegroup',
    component: (resolve) => require(['@/views/sys/pub/SysTypegroup'], resolve)
  },
  {//数据字典下拉项值
    path: '/sys/pub/SysType',
    name: 'sysType',
    component: (resolve) => require(['@/views/sys/pub/SysType'], resolve)
  },
  {//权限
    path: 'sys/user/sysPermission',
    name: 'SysPermission',
    component: (resolve) => require(['@/views/sys/user/SysPermission'], resolve),
  },
  {//系统参数表
         path: 'sys/pub/sysParams',
         name: 'SysParams',
         component: (resolve) => require(['@/views/sys/pub/SysParams'], resolve),
     },
   {//系统角色表
          path: 'sys/user/sysRole',
          name: 'SysRole',
          component: (resolve) => require(['@/views/sys/user/SysRole'], resolve),
      },
  {//系统用户表
      path: 'sys/user/sysUser',
      name: 'SysUser',
      component: (resolve) => require(['@/views/sys/user/SysUser'], resolve),
  },
  {//组织机构表
       path: 'sys/user/sysOrg',
       name: 'SysOrg',
       component: (resolve) => require(['@/views/sys/user/SysOrg'], resolve),
   },
  {//权限维护
    path: 'sys/user/sysPermissionManage',
    name: 'SysPermissionTree',
    component: (resolve) => require(['@/views/sys/user/SysPermissionManage'], resolve),
  },
  {//组织维护树
    path: 'sys/user/OrgTree',
    name: 'OrgTree',
    component: (resolve) => require(['@/views/sys/user/OrgTree'], resolve),
  },
  {//角色权限维护树
    path: 'sys/user/OrgRolePermissionTree',
    name: 'OrgRolePermissionTree',
    component: (resolve) => require(['@/views/sys/user/SysRolePermissionTree'], resolve),
  },
  {//组织机构树
    path: 'sys/user/UserOrgTree',
    name: 'UserOrgTree',
    component: (resolve) => require(['@/views/sys/user/UserOrgTree'], resolve),
  },
  {//组织机构树和用户列表选择
    path: 'sys/OrgUserTree',
    name: 'OrgUserTreeselect',
    component: (resolve) => require(['@/views/sys/components/OrgUserTree/OrgUserTree'], resolve),
  },
  {//区域表维护
    path: '/sys/area/SysArea',
    name: 'SysArea',
    component: (resolve) => require(['@/views/sys/area/SysArea'], resolve)
  },
  {//公共代码管理
    path: 'sys/pub/SysGgdmManage',
    name: 'SysGgdmManage',
    component: (resolve) => require(['@/views/sys/pub/SysGgdmManage'], resolve),
  },
  {//附件
    path: 'sys/attach/sysAttach',
    name: 'SysAttach',
    component: (resolve) => require(['@/views/sys/attach/SysAttach'], resolve),
  },
  {//APP升级维护
    path: 'sys/appHistory/sysAppHistory',
    name: 'SysAppHistory',
    component: (resolve) => require(['@/views/sys/appHistory/SysAppHistory'], resolve),
  },
  {//08待办任务动态配置表
    path: 'sys/pub/sysTodoConfig',
    name: 'SysTodoConfig',
    component: (resolve) => require(['@/views/sys/pub/SysTodoConfig'], resolve),
  },
  {//标签数据日志
    path: 'sys/log/bqRfidLog',
    name: 'BqRfidLog',
    component: (resolve) => require(['@/views/sys/log/BqRfidLog'], resolve),
  },
]
