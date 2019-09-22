import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import configStore from './store'
import Index from './pages/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/moment/moment',
      'pages/user/user',
      'pages/user-login/user-login'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'Reminder',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      backgroundColor: "#fafafa",
      borderStyle: "white",
      selectedColor: "#2C8CF0",
      color: "#666",
      list: [
        {
          pagePath: "pages/index/index",
          iconPath: "assets/images/tab_today.png",
          selectedIconPath: "assets/images/tab_today_focus.png",
          text: "今日"
        },
        {
          pagePath: "pages/moment/moment",
          iconPath: "assets/images/tab_moment.png",
          selectedIconPath: "assets/images/tab_moment_focus.png",
          text: "列表"
        },
        {
          pagePath: "pages/user/user",
          iconPath: "assets/images/tab_user.png",
          selectedIconPath: "assets/images/tab_user_focus.png",
          text: "我的"
        }
      ]
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
