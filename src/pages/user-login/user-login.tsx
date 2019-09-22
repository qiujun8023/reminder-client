import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'
import * as userActions from '../../actions/user'
import './user-login.scss'

@connect(state => state.user, { ...userActions })
export default class UserLogin extends Component {

  config: Config = {
    navigationBarTitleText: '登录'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='user-login'style="display: flex; justify-content: center; align-items: center;">
        <AtButton type='primary' circle={true}>点击登录</AtButton>
      </View>
    )
  }
}
