import url from 'url'
import Api from '../../common/api'

export default function (...args) {
  return Api(...args).then((res) => {
    if (res.status !== 401) {
      return res
    }

    location.href = url.format({
      protocol: 'https',
      host: 'open.weixin.qq.com',
      pathname: '/connect/oauth2/authorize',
      query: Object.assign(res.data.extra, {state: location.href}),
      hash: '#wechat_redirect'
    })
  })
}
