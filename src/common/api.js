import 'whatwg-fetch'
import url from 'url'

let status, ok

export default function (uri, params) {
  params = params || {}
  params.method = (params.method || 'GET').toUpperCase()

  // 提交 Cookie
  params.credentials = 'same-origin'

  // 处理 POST参数，POST 使用 JSON
  if (['POST', 'PUT'].indexOf(params.method) !== -1) {
    params.headers = params.headers || {}
    if (!(params.body instanceof FormData)) {
      if (!params.headers['Content-Type'] && !params.headers['content-type']) {
        params.headers['Content-Type'] = 'application/json'
        if (params.body && typeof body !== 'string') {
          params.body = JSON.stringify(params.body)
        }
      }
    }
  }

  // 处理 GET 参数
  uri = uri + url.format({query: params.query})
  delete params.query

  return fetch(uri, params)
    .then((res) => {
      ok = res.ok
      status = res.status
      return res.json()
    })
    .then((data) => {
      if (typeof data !== 'object') {
        data = {message: '服务器错误'}
      }
      return {status, ok, data}
    }, (err) => {
      return {status: 500, ok: false, data: {message: err}}
    })
}
