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

let randDiffColor = function (color) {
  let diffColor
  do {
    diffColor = _.sample(COLORS)
  } while (diffColor === color)
  return diffColor
}

export {randDiffColor}
