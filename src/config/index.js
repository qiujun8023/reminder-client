import _ from 'lodash'

export default {
  colors: [
    '#FDBE53',
    '#B590D2',
    '#DA767C',
    '#F88C96',
    '#FED486',
    '#FE966E',
    '#FB7886',
    '#61B8FA'
  ],

  images: [
    'https://cdn.qiujun.me/image/2018/09/04/96a0e415aa66d7b8bec5289e5ace9617.jpg!/both/1200x600',
    'https://cdn.qiujun.me/image/2018/09/04/9dd0eba8f5a017d6da1a9ca6264a09bf.jpg!/both/1200x600',
    'https://cdn.qiujun.me/image/2018/09/04/25088ca1394cf1652d901acee45f0936.jpg!/both/1200x600',
    'https://cdn.qiujun.me/image/2018/09/04/43dd7c54d985db808714f2dd0f88114d.jpg!/both/1200x600'
  ],

  months: {
    solar: _.range(1, 13).map((item) => item + '月'),
    lunar: [
      '正月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '冬月', '腊月'
    ]
  },

  days: {
    solar: _.range(1, 32).map((item) => item + '日'),
    lunar: [
      '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
    ]
  }
}
