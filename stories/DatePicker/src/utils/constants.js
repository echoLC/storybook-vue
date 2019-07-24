const DEFAULT_MONTH_HEAD = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const DEFAULT_MONTH_DATA = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const DEFAULT_WEEK_DATA = ['一', '二', '三', '四', '五', '六', '日']

export const DEFAULT_OPTION = {
  dow: 1, // Monday is the first day of the week
  hourTip: '选择小时', // tip of select hour
  minuteTip: '选择分钟', // tip of select minute
  secondTip: '选择秒数', // tip of select second
  yearSuffix: '年', // format of head
  monthsHead: DEFAULT_MONTH_HEAD, // months of head
  months: DEFAULT_MONTH_DATA, // months of panel
  weeks: DEFAULT_WEEK_DATA, // weeks
  cancelTip: '取消', // default text for cancel button
  submitTip: '确定' // default text for submit button
}
