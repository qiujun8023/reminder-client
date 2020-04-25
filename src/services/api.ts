import Taro, { RequestParams } from '@tarojs/taro'
import { BASE_URL, STATUS_UNAUTHORIZED } from '../constants/http'

export default {
  async _login() {
    let { code } = await Taro.login()
    console.log(code)
  },

  async _request(config: RequestParams, retry = true): Promise<any> {
    let response = await Taro.request(config)
    console.log(retry, response.statusCode)
    if (retry && response.statusCode === STATUS_UNAUTHORIZED) {
      await this._login()
    }

    console.log(response)
    return 'hello'
  },

  async _onLoginSuccess(code: string): Promise<any> {
    return this._request({
      method: 'POST',
      url: BASE_URL + '/api/wechat/onLogin',
      data: { code }
    })
  },

  async getProfile(): Promise<any> {
    return this._request({
      method: 'GET',
      url: BASE_URL + '/api/user/profile'
    })
  }
}
