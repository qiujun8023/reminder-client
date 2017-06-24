import ssBase from './ss/base'
import ssRouter from './ss/router'
import birthdayRouter from './birthday/router'
import upyunRouter from './upyun/router'

const NotFound = {
  template: '<p>Page Not Found</p>'
}

const RouterView = {
  render (c) { return c('router-view') }
}

export default {
  routes: [
    {
      path: '/ss',
      component: ssBase,
      children: ssRouter.routes
    },
    {
      path: '/birthday',
      component: RouterView,
      children: birthdayRouter.routes
    },
    {
      path: '/upyun',
      component: RouterView,
      children: upyunRouter.routes
    },
    {path: '*', component: NotFound, meta: {title: '页面未找到'}}
  ]
}
