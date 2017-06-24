import _ from 'lodash'

let getTransferPercent = function (transfer_enable, transfer_used) {
  let unused = transfer_enable - transfer_used
  if (unused < 0 || transfer_enable <= 0) {
    return 0
  }
  return _.round(unused / transfer_enable, 4)
}

let formatTransfer = function (input, reverse) {
  let weight = 1073741824
  if (reverse) {
    return input / weight
  }
  return input * weight
}

let formatBoolean = function (input, reverse) {
  if (reverse) {
    return input ? 'Y' : 'N'
  }
  return input === 'Y'
}

export {getTransferPercent, formatTransfer, formatBoolean}
