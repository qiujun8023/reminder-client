import list from './views/list'
import upload from './views/upload'
import spider from './views/spider'

let title = ' - 又拍云CDN'

export default {
  routes: [
    {path: '', name: 'upyun-list', component: list, meta: {title: '文件列表' + title}},
    {path: 'upload', name: 'upyun-upload', component: upload, meta: {title: '文件上传' + title}},
    {path: 'spider', name: 'upyun-spider', component: spider, meta: {title: '离线下载' + title}}
  ]
}
