import offer from './views/offer'
import services from './views/services/index'
import servicesDetail from './views/services/detail'
import profile from './views/profile'
import profileEdit from './views/profile/edit'
import nodes from './views/nodes'
import nodesDetail from './views/nodes/detail'
import nodesEdit from './views/nodes/edit'
import users from './views/users'
import usersDetail from './views/users/detail'
import usersEdit from './views/users/edit'
import transferStat from './views/transfer/stat'

let title = ' - 科学上网'

export default {
  routes: [
    {path: '', redirect: { name: 'ss-services' }},
    {path: 'services', name: 'ss-services', component: services, meta: {title: '服务' + title}},
    {path: 'services/:service_id', name: 'ss-service-detail', component: servicesDetail, meta: {title: '服务详情' + title}},
    {path: 'profile', name: 'ss-profile', component: profile, meta: {title: '我' + title}},
    {path: 'profile/edit', name: 'ss-profile-edit', component: profileEdit, meta: {title: '修改资料' + title}},
    {path: 'offer', name: 'ss-offer', component: offer, meta: {title: '捐助' + title}},
    {path: 'nodes', name: 'ss-nodes', component: nodes, meta: {title: '节点' + title}},
    {path: 'nodes/add', name: 'ss-node-add', component: nodesEdit, meta: {title: '添加节点' + title}},
    {path: 'nodes/:node_id/detail', name: 'ss-node-detail', component: nodesDetail, meta: {title: '节点详情' + title}},
    {path: 'nodes/:node_id/edit', name: 'ss-node-edit', component: nodesEdit, meta: {title: '编辑节点' + title}},
    {path: 'users', name: 'ss-users', component: users, meta: {title: '用户' + title}},
    {path: 'users/:user_id', name: 'ss-user-detail', component: usersDetail, meta: {title: '用户详情' + title}},
    {path: 'users/:user_id/edit', name: 'ss-user-edit', component: usersEdit, meta: {title: '编辑用户' + title}},
    {path: 'transfer/stat/:user_id?', name: 'ss-transfer-stat', component: transferStat, meta: {title: '流量详情' + title}}
  ]
}
