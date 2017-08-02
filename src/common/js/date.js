export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

export function fromNow (date) {
  const time = Date.now() - date.getTime()
  const second = Math.round(time / 1000)
  if (second <= 60) {
    return '刚刚'
  } else {
    const minute = Math.round(second / 60)
    if (minute <= 60) {
      return minute + '分钟前'
    } else {
      const hour = Math.round(minute / 60)
      if (hour <= 24) {
        return hour + '小时前'
      } else {
        const day = Math.round(hour / 24)
        if (day <= 30) {
          return day + '天前'
        } else {
          const month = Math.round(day / 30)
          if (month <= 12) {
            return month + '月前'
          } else {
            const year = Math.round(month / 12)
            return year + '年前'
          }
        }
      }
    }
  }
}
