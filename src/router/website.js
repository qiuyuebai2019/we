export default [
  {//菜单维护
    path: 'website/sysPermission',
    name: 'SysPermission',
    component: (resolve) => require(['@/views/website/SysPermissionManage'], resolve),
  },
  {//资讯
    path: 'website/websitePictureInfo',
    name: 'WebsitePictureInfo',
    component: (resolve) => require(['@/views/website/WebsitePictureInfo'], resolve),
  },
  {//公司简介
    path: 'website/companyProfile',
    name: 'CompanyProfile',
    component: (resolve) => require(['@/views/website/CompanyProfile'], resolve),
  },
  {//项目介绍
    path: 'website/projectIntroduction',
    name: 'ProjectIntroduction',
    component: (resolve) => require(['@/views/website/ProjectIntroduction'], resolve),
  },
  {//招聘信息
    path: 'website/recruitment',
    name: 'Recruitment',
    component: (resolve) => require(['@/views/website/Recruitment'], resolve),
  },
]
