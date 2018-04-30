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

  images: _.range(0, 3).map((i) => `//cdn.qiujun.me/images/birthday/bg-${i}.jpg!birthday`),

  months: {
    solar: _.range(1, 12).map((item) => item + '月'),
    lunar: [
      '正月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '冬月', '腊月'
    ]
  },

  days: {
    solar: [
      '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
    ],
    lunar: _.range(1, 31).map((item) => item + '日')
  }
}
