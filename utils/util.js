const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [month, day].map(formatNumber).join('-')
}


// 比较版本号
// a >= b 返回 true
// a < b 返回 false
const checkVersion = (veriona , versionb) => {
  var isSat = false;
  var versionBArr = versionb.split('.')
  var versionAArr = veriona.split('.')
  for (var i = 0 ; i< versionBArr.length ; i++) {
      if (Number(versionAArr[i]) > Number(versionBArr[i])) {
        isSat = true
        break;
      } else if (Number(versionAArr[i]) == Number(versionBArr[i])) {
        isSat = true
        break;
      } else {
        isSat = false
        break;
      }
  }
  return isSat;
}

module.exports = {
  formatTime: formatTime,
  formatDate,
  checkVersion
}
