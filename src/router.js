
import births from './views/births'
import detail from './views/detail'
import edit from './views/edit'
import editSetting from './views/edit/setting'

let title = ' - 生日管家'

export default {
  routes: [
    {path: '/', name: 'births', component: births, meta: {title: '列表' + title}},
    {path: '/add', name: 'birth-add', component: edit, meta: {title: '添加' + title}},
    {path: '/:birthId', name: 'birth-detail', component: detail, meta: {title: '详情' + title}},
    {path: '/:birthId/edit', name: 'birth-edit', component: edit, meta: {title: '编辑' + title}},
    {path: '/:birthId/settings/:settingId?', name: 'birth-edit-setting', component: editSetting, meta: {title: '提醒' + title}}
  ]
}
