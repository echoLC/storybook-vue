import parse from 'date-fns/parse'
import format from 'date-fns/format'

export function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isDateObejct (value) {
  return value instanceof Date
}

export function isValidDate (date) {
  if (date === null || date === undefined) {
    return false
  }
  return !isNaN(new Date(date).getTime())
}

export function isValidRangeDate (date) {
  return (
    Array.isArray(date) &&
    date.length === 2 &&
    isValidDate(date[0]) &&
    isValidDate(date[1]) &&
    (new Date(date[1]).getTime() >= new Date(date[0]).getTime())
  )
}

export function parseTime (time) {
  const values = (time || '').split(':')
  if (values.length >= 2) {
    const hours = parseInt(values[0], 10)
    const minutes = parseInt(values[1], 10)
    return {
      hours,
      minutes
    }
  }
  return null
}

export function formatTime (time, type = '24', a = 'a') {
  let hours = time.hours
  hours = (type === '24') ? hours : (hours % 12 || 12)
  hours = hours < 10 ? '0' + hours : hours
  let minutes = time.minutes < 10 ? '0' + time.minutes : time.minutes
  let result = hours + ':' + minutes
  if (type === '12') {
    let suffix = time.hours >= 12 ? 'pm' : 'am'
    if (a === 'A') {
      suffix = suffix.toUpperCase()
    }
    result = `${result} ${suffix}`
  }
  return result
}

export function formatDate (date, formatStr) {
  if (!date) {
    return ''
  }
  try {
    return format(new Date(date), formatStr)
  } catch (e) {
    return ''
  }
}

export function parseDate (value, format) {
  try {
    return parse(value, format) || null
  } catch (e) {
    return null
  }
}

export function throttle (action, delay) {
  let lastRun = 0
  let timeout = null
  return function () {
    if (timeout) {
      return
    }
    const args = arguments
    const elapsed = Date.now() - lastRun
    const callBack = () => {
      lastRun = Date.now()
      timeout = null
      action.apply(this, args)
    }
    if (elapsed >= delay) {
      callBack()
    } else {
      timeout = setTimeout(callBack, delay)
    }
  }
}

export const isLeapYear = function (year) {
  if (isNaN(year)) {
    return false
  }
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export const getDaysOfMonth = function (year, month) {
  if (isNaN(year) || isNaN(month)) {
    throw new Error(`daysOfMonth: parameter's value may be not a number`)
  }

  if ([4, 6, 9, 11].includes(month)) {
    return 30
  }

  return month === 2 ? (isLeapYear(year) ? 29 : 28) : 31
}

// 进行上下月切换时，判断当前的日期是否超出了当前月的天数
export function getValidDate (year, month, date) {
  const days = getDaysOfMonth(year, month + 1)
  return date > days ? days : date
}

export const nextMonth = date => {
  if (!isValidDate(date)) {
    throw new Error(`nextMonth: 1st parameter may be not a valid date`)
  }

  date = new Date(date)
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  if (m === 11) {
    return new Date(y + 1, 0, getValidDate(y, 0, d))
  } else {
    return new Date(y, m + 1, getValidDate(y, m + 1, d))
  }
}

export const preMonth = date => {
  if (!isValidDate(date)) {
    throw new Error(`nextMonth: 1st parameter may be not a valid date`)
  }

  date = new Date(date)
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  if (m === 0) {
    return new Date(y - 1, 11, getValidDate(y, 11, d))
  } else {
    return new Date(y, m - 1, getValidDate(y, m - 1, d))
  }
}

export const getDateClearHours = function (date) {
  if (!date) {
    return
  }

  date = new Date(date)

  if (isNaN(date.getTime())) {
    throw new Error('valid date')
  }

  return date.setHours(0, 0, 0, 0)
}

export const getYearMonthDate = function (date) {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return {
    year,
    month,
    date: day
  }
}
