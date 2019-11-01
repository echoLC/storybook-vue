/** utils */
import { isValidDate, isDateObejct, formatDate, getYearMonthDate } from './utils/index'
import scrollIntoView from './utils/scroll-into-view'

/** mixins */
import locale from './mixins/locale'
import emitter from './mixins/emitter'

/** components */
import PanelDate from './panel/date'
import PanelYear from './panel/year'
import PanelMonth from './panel/month'
import PanelTime from './panel/time'

export default {
  name: 'CalendarPanel',

  components: {
    PanelDate,
    PanelYear,
    PanelMonth,
    PanelTime
  },

  mixins: [locale, emitter],

  props: {
    value: {
      default: null,
      validator: function (val) {
        return val === null || isValidDate(val)
      }
    },

    startAt: null,

    endAt: null,

    // minDate和maxDate用于初始化面板
    minDate: null,

    maxDate: null,

    visible: {
      type: Boolean,
      default: false
    },

    type: {
      type: String,
      default: 'date' // ['date', 'datetime'] zendy added 'month', 'year', mxie added "time"
    },

    dateFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },

    index: Number,
    // below user set
    defaultValue: {
      validator: function (val) {
        return isValidDate(val)
      }
    },

    firstDayOfWeek: {
      default: 7,
      type: Number,
      validator: val => val >= 1 && val <= 7
    },

    notBefore: {
      default: null,
      validator: function (val) {
        return !val || isValidDate(val)
      }
    },

    notAfter: {
      default: null,
      validator: function (val) {
        return !val || isValidDate(val)
      }
    },

    disabledDays: {
      type: [Array, Function],
      default: function () {
        return []
      }
    },

    minuteStep: {
      type: Number,
      default: 0,
      validator: val => val >= 0 && val <= 60
    },

    timeSelectOptions: {
      type: Object,
      default () {
        return null
      }
    },

    timePickerOptions: {
      type: [Object, Function],
      default () {
        return null
      }
    }
  },

  data () {
    const { year, month } = getYearMonthDate(this.curDate)
    const calendarYear = year
    const calendarMonth = month
    const firstYear = Math.floor(calendarYear / 10) * 10
    return {
      panel: 'NONE',
      dates: [],
      calendarMonth,
      calendarYear,
      firstYear
    }
  },

  computed: {
    now: {
      get () {
        return new Date(this.calendarYear, this.calendarMonth).getTime()
      },
      set (val) {
        const { year, month } = getYearMonthDate(val)
        this.calendarYear = year
        this.calendarMonth = month
      }
    },

    curDate () {
      return this.minDate ? this.minDate : (this.maxDate ? this.maxDate : this.value)
    },

    timeType () {
      const h = /h+/.test(this.$parent.format) ? '12' : '24'
      const a = /A/.test(this.$parent.format) ? 'A' : 'a'
      return [h, a]
    },

    timeHeader () {
      if (this.type === 'time') {
        return this.$parent.format
      }
      return this.value && formatDate(this.value, this.dateFormat)
    },

    yearHeader () {
      return this.firstYear + ' ~ ' + (this.firstYear + 9)
    },

    months () {
      return this.t('months')
    },

    notBeforeTime () {
      return this.getCriticalTime(this.notBefore)
    },

    notAfterTime () {
      return this.getCriticalTime(this.notAfter)
    }
  },

  watch: {
    curDate: {
      immediate: true,
      handler: 'updateNow'
    },
    visible: {
      immediate: true,
      handler: 'init'
    },
    panel: {
      handler: 'handelPanelChange'
    }
  },

  methods: {
    handelPanelChange (panel, oldPanel) {
      this.dispatch('DatePicker', 'panel-change', [panel, oldPanel])
      if (panel === 'YEAR') {
        this.firstYear = Math.floor(this.calendarYear / 10) * 10
      } else if (panel === 'TIME') {
        this.$nextTick(() => {
          const list = this.$el.querySelectorAll('.mx-panel-time .mx-time-list')
          for (let i = 0, len = list.length; i < len; i++) {
            const el = list[i]
            scrollIntoView(el, el.querySelector('.actived'))
          }
        })
      }
    },

    init (val) {
      if (val) {
        const type = this.type.toUpperCase() || 'Date'
        this.showPanel(type)
      } else {
        this.showPanel('NONE')
        this.updateNow(this.value)
      }
    },

    getNow (value) {
      return value
        ? new Date(value)
        : this.defaultValue && isValidDate(this.defaultValue)
          ? new Date(this.defaultValue)
          : new Date()
    },

    // 根据value更新日历
    updateNow (value) {
      const oldNow = this.now
      this.now = this.getNow(value)
      if (this.visible && this.now !== oldNow) {
        this.dispatch('DatePicker', 'calendar-change', [
          new Date(this.now),
          new Date(oldNow)
        ])
      }
    },

    getCriticalTime (value) {
      if (!value) {
        return null
      }
      const date = new Date(value)
      if (this.type === 'year') {
        return new Date(date.getFullYear(), 0).getTime()
      } else if (this.type === 'month') {
        return new Date(date.getFullYear(), date.getMonth()).getTime()
      } else if (this.type === 'date') {
        return date.setHours(0, 0, 0, 0)
      }
      return date.getTime()
    },

    inBefore (time, startAt) {
      if (startAt === undefined) {
        startAt = this.startAt
      }
      return (
        (this.notBeforeTime && time < this.notBeforeTime) ||
        (startAt && time < this.getCriticalTime(startAt))
      )
    },

    inAfter (time, endAt) {
      if (endAt === undefined) {
        endAt = this.endAt
      }
      return (
        (this.notAfterTime && time > this.notAfterTime) ||
        (endAt && time > this.getCriticalTime(endAt))
      )
    },

    inDisabledDays (time) {
      if (Array.isArray(this.disabledDays)) {
        return this.disabledDays.some(v => this.getCriticalTime(v) === time)
      } else if (typeof this.disabledDays === 'function') {
        return this.disabledDays(new Date(time))
      }
      return false
    },

    isDisabledYear (year) {
      const time = new Date(year, 0).getTime()
      const maxTime = new Date(year + 1, 0).getTime() - 1
      return (
        this.inBefore(maxTime) ||
        this.inAfter(time) ||
        (this.type === 'year' && this.inDisabledDays(time))
      )
    },

    isDisabledMonth (month) {
      const time = new Date(this.calendarYear, month).getTime()
      const maxTime = new Date(this.calendarYear, month + 1).getTime() - 1
      return (
        this.inBefore(maxTime) ||
        this.inAfter(time) ||
        (this.type === 'month' && this.inDisabledDays(time))
      )
    },

    isDisabledDate (date) {
      const time = new Date(date).getTime()
      return this.inDisabledDays(time)
    },

    isDisabledTime (date, startAt, endAt) {
      const time = new Date(date).getTime()
      return (
        this.inBefore(time, startAt) ||
        this.inAfter(time, endAt) ||
        this.inDisabledDays(time)
      )
    },

    selectDate (date) {
      if (this.type === 'datetime') {
        let time = new Date(date)
        if (isDateObejct(this.value)) {
          time.setHours(
            this.value.getHours(),
            this.value.getMinutes(),
            this.value.getSeconds()
          )
        }
        if (this.isDisabledTime(time)) {
          time.setHours(0, 0, 0, 0)
          if (
            this.notBefore &&
            time.getTime() < new Date(this.notBefore).getTime()
          ) {
            time = new Date(this.notBefore)
          }
          if (
            this.startAt &&
            time.getTime() < new Date(this.startAt).getTime()
          ) {
            time = new Date(this.startAt)
          }
        }
        this.selectTime(time)
        this.showPanel('TIME')
        return
      }
      this.$emit('select-date', date)
    },

    selectYear (year) {
      this.changeCalendarYear(year)
      if (this.type.toLowerCase() === 'year') {
        return this.selectDate(new Date(this.now))
      }
      this.dispatch('DatePicker', 'select-year', [year, this.index])
      this.showPanel('MONTH')
    },

    selectMonth (month) {
      if (this.isSameComparedWithSibling(undefined, month)) {
        month = month + 1
      }
      this.changeCalendarMonth(month)
      if (this.type.toLowerCase() === 'month') {
        return this.selectDate(new Date(this.now))
      }
      this.dispatch('DatePicker', 'select-month', [month, this.index])
      this.showPanel('DATE')
    },

    selectTime (time) {
      this.$emit('select-time', time, false)
    },

    pickTime (time) {
      this.$emit('select-time', time, true)
    },

    changeCalendarYear (year) {
      this.updateNow(new Date(year, this.calendarMonth))
    },

    changeCalendarMonth (month) {
      this.updateNow(new Date(this.calendarYear, month))
    },

    getSibling () {
      const calendars = this.$parent.$children.filter(
        v => v.$options.name === this.$options.name
      )
      const index = calendars.indexOf(this)
      const sibling = calendars[index ^ 1]
      return sibling
    },

    isSameComparedWithSibling (newYear, newMonth) {
      if (this.index === -1) {
        return
      }
      const { calendarYear: siblingYear, calendarMonth: siblingMonth } = this.getSibling()
      const currentYear = newYear || this.calendarYear
      const currentMonth = newMonth || this.calendarMonth
      return siblingYear === currentYear && siblingMonth === currentMonth
    },

    handleIconMonth (flag) {
      const oldMonth = this.calendarMonth
      let newMonth = oldMonth + flag
      // 如果range的calendarYear值相等，切换月份的时候，当切到相同月份的时候应该跳过
      if (this.isSameComparedWithSibling(undefined, newMonth)) {
        newMonth = newMonth + flag
        flag = 2 * flag
      }
      this.changeCalendarMonth(newMonth)
      this.$parent.$emit('change-calendar-month', {
        month: oldMonth,
        flag,
        vm: this,
        sibling: this.getSibling()
      })
    },

    handleIconYear (flag) {
      if (this.panel === 'YEAR') {
        this.changePanelYears(flag)
      } else {
        const oldYear = this.calendarYear
        const newYear = oldYear + flag
        if (this.isSameComparedWithSibling(newYear)) {
          const sibling = this.getSibling()
          const handleIconMonth = this.index === 1 ? this.handleIconMonth : sibling.handleIconMonth
          handleIconMonth(1)
        }
        this.changeCalendarYear(newYear)
        this.$parent.$emit('change-calendar-year', {
          year: oldYear,
          flag,
          vm: this,
          sibling: this.getSibling()
        })
      }
    },

    handleBtnYear () {
      this.showPanel('YEAR')
    },

    handleBtnMonth () {
      this.showPanel('MONTH')
    },

    handleTimeHeader () {
      if (this.type === 'time') {
        return
      }
      this.showPanel('DATE')
    },

    changePanelYears (flag) {
      this.firstYear = this.firstYear + flag * 10
    },

    showPanel (type) {
      this.panel = type
    },

    showChangeYearBtn (panelIndex) {
      const { index, panel } = this
      if (index === -1 || index === panelIndex) {
        return panel !== 'TIME'
      } else {
        const date = panelIndex === 1 ? this.endAt : this.startAt
        let { year: calendarYear } = getYearMonthDate(date)
        const sibling = this.getSibling()
        if (sibling) {
          calendarYear = sibling.calendarYear
        }
        // 根据传进来的panelIndex取不同的maxYear和minYear值
        let [maxYear, minYear] = [this.calendarYear, calendarYear]
        if (panelIndex === 1) {
          [maxYear, minYear] = [calendarYear, this.calendarYear]
        }

        return (maxYear - minYear > 0 && panel !== 'TIME') || panel === 'YEAR'
      }
    },

    showChangeMonthBtn (panelIndex) {
      const { index, panel } = this
      // 如果不是range或者是range右边panel，切换上一月的按钮可以只要panel为date时一直展示
      if (index === -1 || index === panelIndex) {
        return panel === 'DATE'
      } else {
        const date = panelIndex === 1 ? this.endAt : this.startAt
        let { year: calendarYear, month: calendarMonth } = getYearMonthDate(date)
        const sibling = this.getSibling()
        if (sibling) {
          calendarYear = sibling.calendarYear
          calendarMonth = sibling.calendarMonth
        }
        const [maxYear, minYear] = panelIndex === 0 ? [this.calendarYear, calendarYear] : [calendarYear, this.calendarYear]
        const [maxMonth, minMonth] = panelIndex === 0 ? [this.calendarMonth, calendarMonth] : [calendarMonth, this.calendarMonth]
        return ((maxYear - minYear === 0 && maxMonth - minMonth > 1) || maxYear - minYear > 0) && panel === 'DATE'
      }
    },

    renderCalendarHeader () {
      const { panel, months, calendarMonth, calendarYear, yearHeader, timeHeader } = this
      return (
        <div class="mx-calendar-header">
          <a v-show={this.showChangeYearBtn(0)} class="mx-pre-year-btn" onClick={$event => this.handleIconYear(-1, $event)}></a>
          <a v-show={this.showChangeMonthBtn(0)} class="mx-pre-month-btn" onClick={$event => this.handleIconMonth(-1, $event)}></a>
          <a v-show={this.showChangeYearBtn(1)} class="mx-next-year-btn" onClick={$event => this.handleIconYear(1, $event)}></a>
          <a v-show={this.showChangeMonthBtn(1)} class="mx-next-month-btn" onClick={$event => this.handleIconMonth(1, $event)}></a>
          <a
            v-show={panel === 'DATE'}
            class="mx-current-month"
            onClick={$event => this.handleBtnMonth($event) }>{months[calendarMonth]}</a>
          <a
            v-show={panel === 'DATE' || panel === 'MONTH'}
            class="mx-current-year"
            onClick={$event => this.handleBtnYear($event)}>{calendarYear}</a>
          <a v-show={panel === 'YEAR'} class="mx-current-year">{yearHeader}</a>
          <a v-show={panel === 'TIME'}
            class="mx-time-header"
            onClick={$event => this.handleTimeHeader($event)}>{timeHeader}</a>
        </div>
      )
    },

    renderPicker () {
      const {
        panel,
        value,
        dateFormat,
        calendarMonth,
        calendarYear,
        startAt,
        endAt,
        firstDayOfWeek,
        isDisabledDate,
        isDisabledMonth,
        firstYear,
        isDisabledYear,
        minuteStep,
        timePickerOptions,
        timeSelectOptions,
        timeType,
        isDisabledTime
      } = this
      const monthValue = this.index === 0 ? this.minDate : this.maxDate
      return (
        <div class="mx-calendar-content">
          <panel-date
            v-show={panel === 'DATE'}
            value={value}
            date-format={dateFormat}
            calendar-month={calendarMonth}
            calendar-year={calendarYear}
            start-at={startAt}
            end-at={endAt}
            first-day-of-week={firstDayOfWeek}
            disabled-date={isDisabledDate}
            on-select={this.selectDate}
          />
          <panel-year
            v-show={panel === 'YEAR'}
            value={value}
            disabled-year={isDisabledYear}
            first-year={firstYear}
            on-select={this.selectYear}
          />
          <panel-month
            v-show={panel === 'MONTH'}
            value={monthValue}
            disabled-month={isDisabledMonth}
            calendar-year={calendarYear}
            on-select={this.selectMonth}
          />
          <panel-time
            v-show={panel === 'TIME'}
            minute-step={minuteStep}
            time-picker-options={timePickerOptions}
            time-select-options={timeSelectOptions}
            value={value}
            disabled-time={isDisabledTime}
            time-type={timeType}
            o-select={this.selectTime}
            on-pick={this.pickTime}
          />
        </div>
      )
    }
  },

  render (h) {
    const { panel } = this
    const classes = ['mx-calendar', 'mx-calendar-panel-' + panel.toLowerCase()]
    return (
      <div class={classes}>
        { this.renderCalendarHeader() }
        { this.renderPicker() }
      </div>
    )
  }
}
