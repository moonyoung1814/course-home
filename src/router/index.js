import en from "../i18n/lang/en"
import Vue from "vue"
import Router from "vue-router"
import Login from "@/views/login/index"
import Layout from "@/views/layout/layout"
import HomeMain from "@/views/index/mainIndex"

// 不是必须加载的组件使用懒加载
const NotFound = () => import("@/views/page404")
const pagePermissions = () => import("@/views/permissions/pagePermissions")
const btnPermissions = () => import("@/views/permissions/btnPermissions")
// const test = () => import('../views/teacher/test')

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(Router)
let routeName = en.routeName
let defaultRouter = [
  { path: "/",
    redirect: "/index",
    hidden: true,
    children: []
  },
  {
    path: "/login",
    component: Login,
    name: "",
    hidden: true,
    children: []
  },
  {
    path: "/index",
    iconCls: "fa fa-dashboard", // 图标样式class
    name: routeName.home,
    component: Layout,
    alone: true,
    children: [
      {
        path: "/index",
        iconCls: "fa fa-dashboard", // 图标样式class
        name: "主页",
        component: HomeMain,
        children: []
      }
    ]
  },
  {
    path: "/404",
    component: NotFound,
    name: "404",
    hidden: true,
    children: []
  }
]

let addRouter = [
  {
    path: "/",
    iconCls: "fa fa-universal-access", // 图标样式class
    name: routeName.permissions,
    component: Layout,
    children: [
      {
        path: "/pagePermissions",
        iconCls: "fa fa-expeditedssl", // 图标样式class
        name: routeName.pageControl,
        component: pagePermissions,
        children: []
      },
      {
        path: "/btnPermissions",
        iconCls: "fa fa-toggle-on", // 图标样式class
        name: routeName.btnControl,
        component: btnPermissions,
        children: []
      }
    ]
  },
  {
    path: '/teacher',
    iconCls: 'fa fa-universal-access',
    name: routeName.teacher,
    component: Layout,
    meta: {role: ["teacher"]},
    children: [
      {
        path: '/test',
        iconCls: 'fa fa-expeditedssl',
        name: routeName.test,
        component: () => import('../views/teacher/test'),
        children: []
      }
    ]
  },
  {
    path: '/student',
    iconCls: 'fa fa-universal-access',
    name: routeName.student,
    component: Layout,
    meta: {role: ["student"]},
    children: [
      {
        path: '/stest',
        iconCls: 'fa fa-expeditedssl',
        name: routeName.stest,
        component: () => import('../views/student/test'),
        children: []
      }
    ]
  },
  { path: "*",
    redirect: "/404",
    hidden: true,
    children: []
  }

]
export default new Router({
  routes: defaultRouter
})
export {defaultRouter, addRouter}
