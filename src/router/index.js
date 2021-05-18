import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    meta: {
      title: '登录'
    },
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    meta: {
      title: '注册'
    },
    hidden: true
  },
  {
    path: '/activation',
    component: () => import('@/views/register/activation'),
    meta: {
      title: '账号激活'
    },
    hidden: true
  },
  {
    path: '/resetpass',
    component: () => import('@/views/register/resetpass'),
    meta: {
      title: '重置密码'
    },
    hidden: true
  },
  {
    path: '/forget',
    component: () => import('@/views/register/forget'),
    meta: {
      title: '忘记密码'
    },
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 侧边栏
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/code',
    component: Layout,
    redirect: '/code/mybatis',
    name: 'Code',
    alwaysShow: true,
    meta: { title: '自动生成代码', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'mybatis',
        name: 'Mybatis',
        component: () => import('@/views/code/index'),
        meta: { title: '数据库连接信息', icon: 'table' }
      },
      {
        path: 'history',
        name: 'istory',
        component: () => import('@/views/code/history'),
        meta: { title: '导出文件历史', icon: 'excel' }
      }
    ]
  },

  // {
  //   path: '/doc',
  //   component: Layout,
  //   redirect: '/doc/index',
  //   name: 'Doc',
  //   alwaysShow: true,
  //   meta: { title: '自动生成文档', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'db',
  //       name: 'DB',
  //       component: () => import('@/views/doc/index'),
  //       meta: { title: 'DB', icon: 'table' }
  //     },
  //     {
  //       path: 'history',
  //       name: 'History',
  //       component: () => import('@/views/doc/history'),
  //       meta: { title: 'History', icon: 'tree' }
  //     }
  //   ]
  // },

  {
    path: 'external-link',
    component: Layout,
    meta: { title: '源码库', icon: 'el-icon-link' },
    children: [
      {
        path: 'https://github.com/WANNA959/work-platform',
        name: 'backend',
        meta: { title: '后端项目', icon: 'guide' }
      },
      {
        path: 'https://github.com/WANNA959/vue-admin-template',
        name: 'frontend',
        meta: { title: '前端项目', icon: 'link' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
