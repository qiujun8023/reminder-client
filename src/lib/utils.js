import _ from 'lodash'

const COLORS = [
  '#fdbe53',
  '#b590d2',
  '#da767c',
  '#f88c96',
  '#fed486',
  '#fe966e',
  '#fb7886',
  '#61b8fa'
]

let randomDiffColor = (color) => {
  let diffColor
  do {
    diffColor = _.sample(COLORS)
  } while (diffColor === color)
  return diffColor
}

let randomBgImage = () => {
  let random = Math.floor(Math.random() * 4)
  return `//cdn.qiujun.me/images/birthday/bg-${random}.jpg!birthday`
}

export default {
  randomDiffColor,
  randomBgImage
}
