/** components */
import CalendarPanel from './calendar.js'

/** constants */
import {
  ONE_DAY_MILLION_SECONDS,
  ONE_WEEK_MILLION_SECONDS,
  THIRTY_DAYS_MILLION_SECONDS
} from './utils/constants'

/** directives */
import clickoutside from './directives/clickoutside'

/** mixins */
import locale from './mixins/locale'

/** utils */
import {
  isValidDate,
  isValidRangeDate,
  isDateObejct,
  isPlainObject,
  formatDate,
  parseDate,
  throttle,
  nextMonth
} from './utils/index'
import { transformDate } from './utils/transform'
import Languages from './locale/languages'

export default {
  name: 'Datepicker',

  components: { CalendarPanel },

  mixins: [locale],

  directives: {
    clickoutside
  },

  props: {
    value: null,

    valueType: {
      default: 'date',
      validator: function (value) {
        return ['timestamp', 'format', 'date'].indexOf(value) !== -1 || isPlainObject(value)
      }
    },

    placeholder: {
      type: String,
      default: null
    },

    lang: {
      type: [String, Object],
      default: 'zh'
    },

    format: {
      type: [String, Object],
      default: 'YYYY-MM-DD'
    },

    dateFormat: {
      type: String // format the time header and date tooltip
    },

    type: {
      type: String,
      default: 'date' // ['date', 'datetime'] zendy added 'month', 'year', mxie added "time"
    },

    range: {
      type: Boolean,
      default: false
    },

    rangeSeparator: {
      type: String,
      default: '~'
    },

    width: {
      type: [String, Number],
      default: null
    },

    confirmText: {
      type: String,
      default: '确认'
    },

    cancelText: {
      type: String,
      default: '取消'
    },

    confirm: {
      type: Boolean,
      default: false
    },

    editable: {
      type: Boolean,
      default: true
    },

    disabled: {
      type: Boolean,
      default: false
    },

    clearable: {
      type: Boolean,
      default: false
    },

    shortcuts: {
      type: [Boolean, Array],
      default: true
    },

    inputName: {
      type: String,
      default: 'date'
    },

    inputClass: {
      type: [String, Array],
      default: 'mx-input'
    },

    inputAttr: Object,

    appendToBody: {
      type: Boolean,
      default: false
    },

    popupStyle: {
      type: Object
    }
  },

  data () {
    return {
      currentValue: this.range ? [null, null] : null,
      userInput: null,
      popupVisible: false,
      position: {},
      clickCount: 0,
      minDate: '',
      maxDate: ''
    }
  },

  watch: {
    value: {
      immediate: true,
      handler: 'handleValueChange'
    },

    popupVisible (val) {
      if (val) {
        this.initCalendar()
      } else {
        this.userInput = null
        this.blur()
      }
    },

    clickCount (val) {
      if (this.confirm) {
        return
      }
      if (val === 2) {
        this.closePopup()
        this.clickCount = 0
      }
    }
  },

  computed: {
    transform () {
      const type = this.valueType
      if (isPlainObject(type)) {
        return { ...transformDate.date, ...type }
      }
      if (type === 'format') {
        return {
          value2date: this.parse.bind(this),
          date2value: this.stringify.bind(this)
        }
      }
      return transformDate[type] || transformDate.date
    },

    language () {
      if (isPlainObject(this.lang)) {
        return { ...Languages.en, ...this.lang }
      }
      return Languages[this.lang] || Languages.en
    },

    innerPlaceholder () {
      if (typeof this.placeholder === 'string') {
        return this.placeholder
      }
      return this.range ? this.t('placeholder.dateRange') : this.t('placeholder.date')
    },

    text () {
      if (this.userInput !== null) {
        return this.userInput
      }
      const { value2date } = this.transform
      if (!this.range) {
        return this.isValidValue(this.value)
          ? this.stringify(value2date(this.value))
          : ''
      }
      return this.isValidRangeValue(this.value)
        ? `${this.stringify(value2date(this.value[0]))} ${this.rangeSeparator} ${this.stringify(value2date(this.value[1]))}`
        : ''
    },

    computedWidth () {
      if (typeof this.width === 'number' || (typeof this.width === 'string' && /^\d+$/.test(this.width))) {
        return this.width + 'px'
      }
      return this.width
    },

    showClearIcon () {
      return !this.disabled && this.clearable && (this.range ? this.isValidRangeValue(this.value) : this.isValidValue(this.value))
    },

    innerType () {
      return String(this.type).toLowerCase()
    },

    innerShortcuts () {
      if (Array.isArray(this.shortcuts)) {
        return this.shortcuts
      }
      if (this.shortcuts === false) {
        return []
      }
      const pickers = this.t('pickers')
      const arr = [
        {
          text: pickers[0],
          onClick (self) {
            self.currentValue = [new Date(), new Date(Date.now() + ONE_DAY_MILLION_SECONDS)]
            self.updateDate(true)
          }
        },
        {
          text: pickers[1],
          onClick (self) {
            self.currentValue = [new Date(), new Date(Date.now() + THIRTY_DAYS_MILLION_SECONDS)]
            self.updateDate(true)
          }
        },
        {
          text: pickers[2],
          onClick (self) {
            self.currentValue = [new Date(Date.now() - ONE_WEEK_MILLION_SECONDS), new Date()]
            self.updateDate(true)
          }
        },
        {
          text: pickers[3],
          onClick (self) {
            self.currentValue = [new Date(Date.now() - THIRTY_DAYS_MILLION_SECONDS), new Date()]
            self.updateDate(true)
          }
        }
      ]
      return arr
    },

    innerDateFormat () {
      if (this.dateFormat) {
        return this.dateFormat
      }
      if (typeof this.format !== 'string') {
        return 'YYYY-MM-DD'
      }
      if (this.innerType === 'date') {
        return this.format
      }
      return this.format.replace(/[Hh]+.*[msSaAZ]|\[.*?\]/g, '').trim() || 'YYYY-MM-DD'
    },

    innerPopupStyle () {
      return { ...this.position, ...this.popupStyle }
    },

    pickerInputClass () {
      let classes = this.inputClass || []
      if (!Array.isArray(classes)) {
        classes = classes.split(' ')
      }
      if (this.popupVisible) {
        classes.push('active')
      } else {
        classes = classes.filter(item => {
          return item !== 'active'
        })
      }
      return classes
    }
  },

  mounted () {
    if (this.appendToBody) {
      this.popupElm = this.$refs.calendar
      document.body.appendChild(this.popupElm)
    }
    this._displayPopup = throttle(() => {
      if (this.popupVisible) {
        this.displayPopup()
      }
    }, 200)
    window.addEventListener('resize', this._displayPopup)
    window.addEventListener('scroll', this._displayPopup)
    window.addEventListener('keydown', this.handleKeydown)
  },

  beforeDestroy () {
    if (this.popupElm && this.popupElm.parentNode === document.body) {
      document.body.removeChild(this.popupElm)
    }
    window.removeEventListener('resize', this._displayPopup)
    window.removeEventListener('scroll', this._displayPopup)
    window.removeEventListener('keydown', this.handleKeydown)
  },

  methods: {

    initCalendar () {
      this.handleValueChange(this.value)
      this.range && this.initLeftAndRightDate()
      this.displayPopup()
    },

    initLeftAndRightDate () {
      let [minDate, maxDate] = this.currentValue
      const diff = new Date(maxDate).getTime() - new Date(minDate).getTime()
      if (diff <= THIRTY_DAYS_MILLION_SECONDS) {
        maxDate = nextMonth(minDate)
      }
      this.minDate = minDate
      this.maxDate = maxDate
    },

    stringify (date) {
      return (isPlainObject(this.format) && typeof this.format.stringify === 'function')
        ? this.format.stringify(date)
        : formatDate(date, this.format)
    },

    parse (value) {
      return (isPlainObject(this.format) && typeof this.format.parse === 'function')
        ? this.format.parse(value)
        : parseDate(value, this.format)
    },

    isValidValue (value) {
      const { value2date } = this.transform
      return isValidDate(value2date(value))
    },

    isValidRangeValue (value) {
      const { value2date } = this.transform
      return Array.isArray(value) && value.length === 2 && this.isValidValue(value[0]) &&
        this.isValidValue(value[1]) && (value2date(value[1]).getTime() >= value2date(value[0]).getTime())
    },

    dateEqual (a, b) {
      return isDateObejct(a) && isDateObejct(b) && a.getTime() === b.getTime()
    },

    rangeEqual (a, b) {
      return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, index) => this.dateEqual(item, b[index]))
    },

    selectShortcut (range) {
      if (typeof range.onClick === 'function') {
        const close = range.onClick(this)
        if (close !== false) {
          this.closePopup()
        }
      } else {
        this.currentValue = [new Date(range.start), new Date(range.end)]
        this.updateDate(true)
        this.closePopup()
      }
    },

    clearDate (event) {
      event.stopPropagation()
      const date = this.range ? [null, null] : null
      this.currentValue = date
      this.updateDate(true)
      this.$emit('clear')
    },

    confirmDate () {
      const valid = this.range ? isValidRangeDate(this.currentValue) : isValidDate(this.currentValue)
      if (valid) {
        this.updateDate(true)
      }
      this.emitDate('confirm')
      this.closePopup()
    },

    updateDate (confirm = false) {
      if ((this.confirm && !confirm) || this.disabled) {
        return false
      }
      const equal = this.range ? this.rangeEqual(this.value, this.currentValue) : this.dateEqual(this.value, this.currentValue)
      if (equal) {
        return false
      }
      this.emitDate('input')
      this.emitDate('change')
      return true
    },

    emitDate (eventName) {
      const { date2value } = this.transform
      const value = this.range
        ? this.currentValue.map(date2value)
        : date2value(this.currentValue)
      this.$emit(eventName, value)
    },

    handleValueChange (value) {
      const { value2date } = this.transform
      if (this.range) {
        this.currentValue = this.isValidRangeValue(value) ? value.map(value2date) : this.getDefaultRangeValue()
      } else {
        this.currentValue = this.isValidValue(value) ? value2date(value) : null
      }
    },

    getDefaultRangeValue () {
      let date = new Date()
      date = date.setMonth(date.getMonth() + 1)
      return [new Date(), date]
    },

    selectDate (date) {
      this.currentValue = date
      this.updateDate() && this.closePopup()
    },

    selectRangeDate (date, index) {
      if (this.clickCount === 0) {
        this.currentValue = []
      }
      this.clickCount += 1
      if (this.clickCount === 1) {
        this.$set(this.currentValue, index, date)
        return
      }
      if (this.clickCount === 2) {
        index = this.currentValue[0] ? 1 : 0
        if (this.confirm) {
          this.clickCount = 0
        }
      }
      this.$set(this.currentValue, index, date)
      this.currentValue.sort((a, b) => new Date(a) - new Date(b))
      this.updateDate()
    },

    selectStartDate (date) {
      this.selectRangeDate(date, 0)
    },

    selectEndDate (date) {
      this.selectRangeDate(date, 1)
    },

    selectTime (time, close) {
      this.currentValue = time
      this.updateDate() && close && this.closePopup()
    },

    selectStartTime (time) {
      this.selectStartDate(time)
    },

    selectEndTime (time) {
      this.selectEndDate(time)
    },

    showPopup () {
      if (this.disabled) {
        return
      }
      this.popupVisible = true
    },

    closePopup () {
      this.popupVisible = false
    },

    getPopupSize (element) {
      const originalDisplay = element.style.display
      const originalVisibility = element.style.visibility
      element.style.display = 'block'
      element.style.visibility = 'hidden'
      const styles = window.getComputedStyle(element)
      const width = element.offsetWidth + parseInt(styles.marginLeft) + parseInt(styles.marginRight)
      const height = element.offsetHeight + parseInt(styles.marginTop) + parseInt(styles.marginBottom)
      const result = { width, height }
      element.style.display = originalDisplay
      element.style.visibility = originalVisibility
      return result
    },

    displayPopup () {
      const dw = document.documentElement.clientWidth
      const dh = document.documentElement.clientHeight
      const InputRect = this.$el.getBoundingClientRect()
      const PopupRect = this._popupRect || (this._popupRect = this.getPopupSize(this.$refs.calendar))
      const position = {}
      let offsetRelativeToInputX = 0
      let offsetRelativeToInputY = 0
      if (this.appendToBody) {
        offsetRelativeToInputX = window.pageXOffset + InputRect.left
        offsetRelativeToInputY = window.pageYOffset + InputRect.top
      }
      if (
        dw - InputRect.left < PopupRect.width &&
        InputRect.right < PopupRect.width
      ) {
        position.left = offsetRelativeToInputX - InputRect.left + 1 + 'px'
      } else if (InputRect.left + InputRect.width / 2 <= dw / 2) {
        position.left = offsetRelativeToInputX + 'px'
      } else {
        position.left = offsetRelativeToInputX + InputRect.width - PopupRect.width + 'px'
      }
      if (
        InputRect.top <= PopupRect.height &&
        dh - InputRect.bottom <= PopupRect.height
      ) {
        position.top = offsetRelativeToInputY + dh - InputRect.top - PopupRect.height + 'px'
      } else if (InputRect.top + InputRect.height / 2 <= dh / 2) {
        position.top = offsetRelativeToInputY + InputRect.height + 'px'
      } else {
        position.top = offsetRelativeToInputY - PopupRect.height + 'px'
      }
      if (position.top !== this.position.top || position.left !== this.position.left) {
        this.position = position
      }
    },

    blur () {
      this.$refs.input.blur()
    },

    handleBlur (event) {
      this.$emit('blur', event)
    },

    handleFocus (event) {
      if (!this.popupVisible) {
        this.showPopup()
      }
      this.$emit('focus', event)
    },

    handleKeydown (event) {
      const keyCode = event.keyCode
      // Tab 9 or Enter 13
      if (keyCode === 9 || keyCode === 13) {
        // ie emit the watch before the change event
        event.stopPropagation()
        this.handleChange()
        this.userInput = null
        this.closePopup()
      }
    },

    handleInput (event) {
      this.userInput = event.target.value
    },

    handleChange () {
      if (this.editable && this.userInput !== null) {
        const value = this.text
        const checkDate = this.$refs.calendarPanel.isDisabledTime
        if (!value) {
          this.clearDate()
          return
        }
        if (this.range) {
          const range = value.split(` ${this.rangeSeparator} `)
          if (range.length === 2) {
            const start = this.parse(range[0])
            const end = this.parse(range[1])
            if (start && end && !checkDate(start, null, end) && !checkDate(end, start, null)) {
              this.currentValue = [start, end]
              this.updateDate(true)
              this.closePopup()
              return
            }
          }
        } else {
          const date = this.parse(value)
          if (date && !checkDate(date, null, null)) {
            this.currentValue = date
            this.updateDate(true)
            this.closePopup()
            return
          }
        }
        this.$emit('input-error', value)
      }
    },

    renderInputIcon () {
      const currentDay = new Date().getDate()

      return (
        <span class="mx-input-append">
          <slot name="calendar-input-icon">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 200 200" class="mx-calendar-icon">
              <rect x="13" y="29" rx="14" ry="14" width="174" height="158" fill="transparent" />
              <line x1="46" x2="46" y1="8" y2="50" />
              <line x1="154" x2="154" y1="8" y2="50" />
              <line x1="13" x2="187" y1="70" y2="70" />
              <text x="50%" y="135" font-size="90" stroke-width="1" text-anchor="middle" dominant-baseline="middle">{ currentDay }</text>
            </svg>
          </slot>
        </span>
      )
    },

    renderInput () {
      const { pickerInputClass, inputName, inputAttr, disabled, editable, text, innerPlaceholder } = this
      return (
        <input
          class={pickerInputClass}
          name={inputName}
          {...{ inputAttr }}
          ref="input"
          type="text"
          autocomplete="off"
          disabled={disabled}
          readonly={!editable}
          value={text}
          placeholder={innerPlaceholder}
          onKeydown={$event => this.handleKeydown($event)}
          onFocus={$event => this.handleFocus($event)}
          onBlur={$event => this.handleBlur($event)}
          onInput={$event => this.handleInput($event)}
          onChange={$event => this.handleChange($event)}
        />
      )
    },

    renderClearIcon () {
      return (
        <span
          class="mx-input-append mx-clear-wrapper"
          onClick={$event => this.clearDate($event) }>
          <slot name="mx-clear-icon">
            <i class="mx-input-icon mx-clear-icon"></i>
          </slot>
        </span>
      )
    },

    renderPickerShortcuts () {
      if (!this.range || !this.innerShortcuts.length) {
        return
      }
      const vnodes = this.innerShortcuts.map((range, index) => {
        return (
          <li
            class="mx-shortcuts"
            key={index}
            onClick={$event => this.selectShortcut(range, $event)}>
            { range.text }
          </li>
        )
      })
      return vnodes
    },

    renderPickerFooter () {
      const { confirmDate, closePopup, confirmText, confirm, cancelText } = this
      if (confirm) {
        return (
          <slot name="picker-footer" confirm={confirmDate}>
            <div class="mx-datepicker-footer">
              <button type="button"
                class="mx-datepicker-btn mx-datepicker-btn-cancel"
                onClick={ $event => closePopup($event) }>{ cancelText }</button>
              <button type="button"
                class="mx-datepicker-btn mx-datepicker-btn-confirm"
                onClick={ $event => confirmDate($event) }>{ confirmText }</button>
            </div>
          </slot>
        )
      }
      return (
        <slot name="picker-footer" confirm={confirmDate}></slot>
      )
    },

    renderCalendarPanel () {
      const index = -1
      const { innerDateFormat, currentValue, popupVisible, innerType } = this
      return (
        <calendar-panel
          ref="calendarPanel"
          index={index}
          type={innerType}
          date-format={innerDateFormat}
          value={currentValue}
          visible={popupVisible}
          on-select-date={ $event => this.selectDate($event) }
          on-select-time={ $event => this.selectTime($event) }></calendar-panel>
      )
    },

    renderRangeCalendarPanel () {
      const { innerType, innerDateFormat, currentValue, popupVisible, minDate, maxDate } = this
      const [startIndex, endIndex] = [0, 1]
      return (
        <div class="mx-range-wrapper">
          <calendar-panel
            style="box-shadow:1px 0 rgba(0, 0, 0, .1)"
            ref="calendarPanel"
            index={startIndex}
            type={innerType}
            date-format={innerDateFormat}
            value={currentValue[0]}
            end-at={currentValue[1]}
            start-at={null}
            min-date={minDate}
            visible={popupVisible}
            on-select-date={ $event => this.selectStartDate($event) }
            on-select-time={ $event => this.selectStartTime($event) }/>
          <calendar-panel
            index={endIndex}
            type={innerType}
            date-format={innerDateFormat}
            value={currentValue[1]}
            start-at={currentValue[0]}
            end-at={null}
            max-date={maxDate}
            visible={popupVisible}
            on-select-date={ $event => this.selectEndDate($event) }
            on-select-time={$event => this.selectEndTime($event) }/>
        </div>
      )
    }
  },

  render (h) {
    const { range, disabled, computedWidth, showClearIcon, innerPopupStyle, closePopup, popupVisible } = this
    const directives = [{ name: 'clickoutside', value: closePopup }]
    const classObj = {
      'mx-datepicker-range': range,
      'disabled': disabled,
      'mx-datepicker': true
    }
    const style = { width: computedWidth }
    return (
      <div
        class={classObj}
        style={style}
        { ...{ directives } }>
        <div class="mx-input-wrapper" onClick={$event => this.showPopup($event) }>
          { this.renderInput() }
          { showClearIcon ? this.renderClearIcon() : null }
          { this.renderInputIcon() }
        </div>
        <div class="mx-datepicker-popup"
          style={innerPopupStyle}
          v-show={popupVisible}
          OnClick={($event) => { $event.stopPropagation(); $event.preventDefault() }}
          ref="calendar">
          <div class="mx-datepicker-conetnt">
            { range ? this.renderRangeCalendarPanel() : this.renderCalendarPanel() }
            <ul
              v-show={range}
              class="mx-shortcuts-wrapper">
              { this.renderPickerShortcuts() }
            </ul>
          </div>
          { this.renderPickerFooter() }
        </div>
      </div>
    )
  }
}
