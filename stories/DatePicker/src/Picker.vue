<template>
<div :class="`${pre}`">
  <div :class="`${pre}-head`">
    <a :class="`${pre}-prev-decade-btn`" v-show="showYears" @click="preTenYears">«</a>
    <a :class="`${pre}-prev-year-btn`" v-show="!showYears" @click="preYear">«</a>
    <a :class="`${pre}-prev-month-btn`" v-show="!showYears&&!showMonths" @click="preMonth">‹</a>
    <a :class="`${pre}-year-select`" v-show="showYears">{{ year + '-' + tenYears }}</a>
    <template v-if="local.yearSuffix">
      <a :class="`${pre}-year-select`" @click="showYears = !showYears" v-show="!showYears">{{ year }}{{ local.yearSuffix }}</a>
      <a :class="`${pre}-month-select`" @click="showMonths = !showMonths" v-show="!showYears && !showMonths">{{ local.monthsHead[month] }}</a>
    </template>
    <template v-else>
      <a :class="`${pre}-month-select`" @click="showMonths=!showMonths" v-show="!showYears && !showMonths">{{ local.monthsHead[month] }}</a>
      <a :class="`${pre}-year-select`" @click="showYears=!showYears" v-show="!showYears">{{ year }}</a>
    </template>
    <a :class="`${pre}-next-month-btn`" v-show="!showYears&&!showMonths" @click="nextMonth">›</a>
    <a :class="`${pre}-next-year-btn`" v-show="!showYears" @click="nextYear">»</a>
    <a :class="`${pre}-next-decade-btn`" v-show="showYears" @click="nextTenYears">»</a>
  </div>

  <!--各种日期选择面板-->
  <div :class="`${pre}-body`">
    <!--date的选择面板-->
    <div :class="`${pre}-days`">
      <a :class="`${pre}-week`" v-for="week in local.weeks"  :key="week">{{ week }}</a>
      <a
        :class="getCellDayClasses(day)" 
        v-for="(day, index) in days" 
        @click="selectDay(index, day, $event)" 
        :key="index">{{ day.i }}</a>
    </div>

     <!--year的选择面板-->
    <div :class="`${pre}-years`" v-show="showYears">
      <a 
        :class="getCellYearClasses(index, year)" 
        v-for="(year, index) in years" 
        @click="selectYear(year, $event)" 
        :key="year">{{ year }}</a>
    </div>

    <!--month的选择面板-->
    <div :class="`${pre}-months`" v-show="showMonths">
      <a
        :class="[generateCellClasses(year, month, day, hour, minute, second, 'YYYYMM')]" 
        v-for="(monthText, month) in local.months" 
        @click="selectMonth(month, $event)" 
        :key="month">{{ monthText }}</a>
    </div>
  
    <!--hour的选择面板-->
    <div :class="`${pre}-hours`" v-show="showHours">
      <div :class="`${pre}-title`">{{ local.hourTip }}</div>
      <a 
        :class="[generateCellClasses(year, month, day, i, minute, second, 'YYYYMMDDHH')]"
        v-for="(j, i) in 24" 
        @click="selectHour(i, $event)" 
        :key="i">{{ i }}</a>
    </div>

    <!--minute的选择面板-->
    <div :class="`${pre}-minutes`" v-show="showMinutes">
      <div :class="`${pre}-title`">{{ local.minuteTip }}</div>
      <a 
        :class="[generateCellClasses(year, month, day, hour, i, second, 'YYYYMMDDHHmm')]" 
        v-for="(j, i) in 60" 
        @click="selectMinute(i, $event)" 
        :key="i">{{ i }}</a>
    </div>

    <!--second的选择面板-->
    <div :class="`${pre}-seconds`" v-show="showSeconds">
      <div :class="`${pre}-title`">{{ local.secondTip }}</div>
      <a 
        :class="[generateCellClasses(year, month, day, hour, minute, i, 'YYYYMMDDHHmmss')]" 
        v-for="(j, i) in 60" 
        @click="selectSecond(i, $event)" 
        :key="i">{{ i }}</a>
    </div>
  </div>
  
  <!--HH:mm:ss展示面板-->
  <div :class="`${pre}-foot`" v-if="formateType === 'H'">
    <div :class="`${pre}-hour`">
      <a :title="local.hourTip" @click="showHoursPicker" :class="{ on:showHours }">{{ hour | pad }}</a>
      <span>:</span>
      <a :title="local.minuteTip" @click="showMinutesPicker" :class="{ on:showMinutes }">{{ minute | pad }}</a>
      <span>:</span>
      <a :title="local.secondTip" @click="showSecondsPicker" :class="{ on:showSeconds }">{{ second | pad }}</a>
    </div>
  </div>
</div>
</template>

<script>
import { pad } from './utils'

export default {
  name: 'DatepickerCalendar',

  props: {
    value: {
      type: Date,
      default: null
    },
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    }
  },

  data () {
    const time = this.formatDateToObject(this.value)
    return {
      pre: 'calendar',
      formateType: 'D',
      showYears: false,
      showMonths: false,
      showHours: false,
      showMinutes: false,
      showSeconds: false,
      year: time.year,
      month: time.month,
      day: time.day,
      hour: time.hour,
      minute: time.minute,
      second: time.second
    }
  },
  watch: {
    value (val) {
      const {
        year,
        month,
        day,
        hour,
        minute,
        second
      } = this.formatDateToObject(val)
      this.year = year
      this.month = month
      this.day = day
      this.hour = hour
      this.minute = minute
      this.second = second
    }
  },
  computed: {
    local () {
      return this.$parent.local
    },
    format () {
      return this.$parent.format
    },
    start () {
      return this.parseToSeconds(this.$parent.dates[0])
    },
    end () {
      return this.parseToSeconds(this.$parent.dates[1])
    },
    tenYears () {
      return this.year + 10
    },
    years () {
      const arr = []
      let start = this.year - 1
      while (arr.length < 12) {
        arr.push(start++)
      }
      return arr
    },
    days () {
      const days = []
      const year = this.year
      const month = this.month
      const time = new Date(year, month, 1)
      const dow = this.local.dow || 7
      time.setDate(0) // switch to the last day of last month
      let lastDay = time.getDate()
      const week = time.getDay() || 7
      let count = dow <= week ? (week - dow + 1) : (week + (7 - dow + 1))
      while (count > 0) {
        days.push({
          i: lastDay - count + 1,
          y: month > 0 ? year : year - 1,
          m: month > 0 ? month - 1 : 11,
          p: true
        })
        count--
      }
      time.setMonth(time.getMonth() + 2, 0) // switch to the last day of the current month
      lastDay = time.getDate()
      let i = 1
      for (i = 1; i <= lastDay; i++) {
        days.push({
          i: i,
          y: year,
          m: month
        })
      }
      for (i = 1; days.length < 42; i++) {
        days.push({
          i: i,
          y: month < 11 ? year : year + 1,
          m: month < 11 ? month + 1 : 0,
          n: true
        })
      }
      return days
    }
  },
  filters: {
    pad
  },
  methods: {
    formatDateToObject (time) {
      return {
        year: time.getFullYear(),
        month: time.getMonth(),
        day: time.getDate(),
        hour: time.getHours(),
        minute: time.getMinutes(),
        second: time.getSeconds()
      }
    },
    getCellDayClasses (day) {
      const classes = []
      if (day.p || day.n) {
        classes.push (`${this.pre}-date-out`)
      }
      const selectedClass = this.generateCellClasses(day.y, day.m, day.i, this.hour, this.minute, this.second, 'YYYYMMDD')
      classes.push(selectedClass)
      return classes
    },
    getCellYearClasses (year, index) {
      const classes = []
      if ( year === 0 || year === 1) {
        classes.push(`${this.pre}-date-out`)
      }
      const selectedClass = this.generateCellClasses(index, this.month, this.day, this.hour, this.minute, this.second, 'YYYY')
      classes.push(selectedClass)
      return classes
    },
    parseToSeconds (num) {
      return parseInt(num / 1000)
    },
    generateCellClasses (year, month, day, hour, minute, second, format) {
      const maxDay = new Date(year, month + 1, 0).getDate()
      const currentDate = new Date(year, month, day > maxDay ? maxDay : day, hour, minute, second)
      const currentSeconds = this.parseToSeconds(currentDate)
      const formatDate = this.$parent.formatDate
      const classMap = {}
      let selected = false
      if (format === 'YYYY') {
        selected = year === this.year
      } else if (format === 'YYYYMM') {
        selected = month === this.month
      } else {
        selected = formatDate(this.value, format) === formatDate(currentDate, format)
      }
      classMap[`${this.pre}-date`] = true
      classMap[`${this.pre}-date-disabled`] = (this.right && currentSeconds < this.start) || this.$parent.disabledDate(currentDate, format)
      classMap[`${this.pre}-date-on`] = (this.left && currentSeconds > this.start) || (this.right && currentSeconds < this.end)
      classMap[`${this.pre}-date-selected`] = selected
      return classMap
    },
    nextYear () {
      this.year += 1
    },
    preYear () {
      this.year -= 1
    },
    nextTenYears () {
      this.year += 10
    },
    preTenYears () {
      this.year -= 10
    },
    nextMonth () {
      if (this.month < 11) {
        this.month += 1
      } else {
        this.month = 0
        this.year += 1
      }
    },
    preMonth () {
      if (this.month > 0) {
        this.month -= 1
      } else {
        this.month = 11
        this.year -= 1
      }
    },
    showHoursPicker () {
      this.showHours = !this.showHours
      this.showMinutes = false
      this.showSeconds = false
    },
    showMinutesPicker () {
      this.showMinutes = !this.showMinutes
      this.showHours = false
      this.showSeconds = false
    },
    showSecondsPicker () {
      this.showSeconds = !this.showSeconds
      this.showHours = false
      this.showMinutes = false
    },
    canSelected (e) {
      return e.target.className.indexOf(`${this.pre}-date-disabled`) === -1
    },
    selectYear (year, event) {
      if (this.canSelected(event)) {
        this.showYears = this.formateType === 'Y'
        this.year = year
        this.confirmSelect('y')
      }
    },
    selectMonth (month, event) {
      if (this.canSelected(event)) {
        this.showMonths = this.formateType === 'M'
        this.month = month
        this.confirmSelect('m')
      }
    },
    selectDay (i, j, event) {
      if (this.canSelected(event)) {
        this.day = j.i
        this.confirmSelect(j)
      }
    },
    selectHour (hour, event) {
      if (this.canSelected(event)) {
        this.showHours = false
        this.hour = hour
        this.confirmSelect('h')
      }
    },
    selectMinute (minute, event) {
      if (this.canSelected(event)) {
        this.showMinutes = false
        this.minute = minute
        this.confirmSelect('h')
      }
    },
    selectSecond (second, event) {
      if (this.canSelected(event)) {
        this.showSeconds = false
        this.second = second
        this.confirmSelect('h')
      }
    },
    confirmSelect (info) {
      let year = ''
      let month = ''
      let day = ''
      info && info.n && this.nextMonth()
      info && info.p && this.preMonth()
      if (info === 'h') {
        const time = this.formatDateToObject(this.value)
        year = time.year
        month = time.month
      } else if (info === 'm' || info === 'y') {
        day = 1
      }
      const currentSelected = new Date(year || this.year, month || this.month, day || this.day, this.hour, this.minute, this.second)
      const isStartDateOverEndDate = this.left && parseInt(currentSelected.getTime() / 1000) > this.end
      if (isStartDateOverEndDate) {
        this.$parent.dates[1] = currentSelected
      }
      this.$emit('input', currentSelected)
      this.$parent.confirmSelect(info === 'h')
    }
  },
  mounted () {
    const isIncludeFormatKey = formatKey => this.format.indexOf(formatKey) !== -1

    if (isIncludeFormatKey('s') && isIncludeFormatKey('m') && (isIncludeFormatKey('h') || isIncludeFormatKey('H'))) {
      this.formateType = 'H'
    } else if (isIncludeFormatKey('D')) {
      this.formateType = 'D'
    } else if (isIncludeFormatKey('M')) {
      this.formateType = 'M'
      this.showMonths = true
    } else if (isIncludeFormatKey('Y')) {
      this.formateType = 'Y'
      this.showYears = true
    }
  }
}
</script>

<style scoped>
.calendar {
  float: left;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.calendar + .calendar{
  border-left: solid 1px #eaeaea;
  margin-left: 5px;
  padding-left: 5px;
}
.calendar-head {
  line-height: 34px;
  height: 34px;
  text-align: center;
  position: relative;
}

.calendar-head a {
  color: #666;
  font-weight: bold;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  position: absolute;
  padding: 0 5px;
  font-size: 16px;
}

.calendar-head a:hover {
  color: #1284e7;
}

.calendar-head .calendar-year-select,
.calendar-head .calendar-month-select {
  font-size: 12px;
  padding: 0 2px;
  position: relative;
}

.calendar-prev-decade-btn,
.calendar-prev-year-btn {
  left: 6px;
}

.calendar-prev-month-btn {
  left: 24px;
}

.calendar-next-decade-btn,
.calendar-next-year-btn {
  right: 6px;
}

.calendar-next-month-btn {
  right: 24px;
}

.calendar-body {
  position: relative;
  width: 196px;
  height: 196px;
}

.calendar-days {
  width: 100%;
  height: 100%;
}

.calendar-week,
.calendar-date {
  font-weight: normal;
  width: 14.28%;
  height: 14.28%;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
  float: left;
}

.calendar-week:before,
.calendar-date:before {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

.calendar-date {
  cursor: pointer;
}

.calendar-date-out {
  color: #ccc;
}

.calendar-date:hover,
.calendar-date-on {
  background: #eaf8fe;
}

.calendar-date-selected,
.calendar-date-selected:hover {
  color: #fff;
  font-weight: bold;
  background: #1284e7;
}

.calendar-date-disabled {
  cursor: not-allowed !important;
  color: #bcbcbc !important;
  background: #f3f3f3 !important;
}

.calendar-foot {
  margin-top: 5px;
}

.calendar-hour {
  display: inline-block;
  border: 1px solid #e6e5e5;
  color: #9e9e9e;
}

.calendar-hour a {
  display: inline-block;
  padding: 2px 4px;
  cursor: pointer;
}

.calendar-hour a:hover,
.calendar-hour a.on {
  color: #1284e7;
}

.calendar-years,
.calendar-months,
.calendar-hours,
.calendar-minutes,
.calendar-seconds {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #fff;
  left: 0;
  top: 0;
}

.calendar-months a {
  width: 33.33%;
  height: 25%;
}

.calendar-years a {
  width: 33.33%;
  height: 25%;
}

.calendar-hours a {
  width: 20%;
  height: 20%;
}

.calendar-minutes a,
.calendar-seconds a {
  width: 16.66%;
  height: 10%;
}

.calendar-title {
  margin-top: -30px;
  height: 30px;
  line-height: 30px;
  background: #fff;
  text-align: center;
  font-weight: bold;
}
</style>
﻿
