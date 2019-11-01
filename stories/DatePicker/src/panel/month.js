import locale from '../mixins/locale'

export default {
  name: 'panelMonth',
  mixins: [locale],
  props: {
    value: null,
    calendarYear: {
      default: new Date().getFullYear()
    },
    disabledMonth: Function
  },
  methods: {
    isDisabled (month) {
      if (typeof this.disabledMonth === 'function' && this.disabledMonth(month)) {
        return true
      }
      return false
    },
    selectMonth (month) {
      if (this.isDisabled(month)) {
        return
      }
      this.$emit('select', month)
    },
    getMonthCellClass (month) {
      const classes = ['cell']
      const currentYear = this.value && new Date(this.value).getFullYear()
      const currentMonth = this.value && new Date(this.value).getMonth()
      if (currentYear === this.calendarYear && currentMonth === month) {
        classes.push('actived')
      }
      if (this.isDisabled(month)) {
        classes.push('disabled')
      }
      return classes
    }
  },
  render (h) {
    let months = this.t('months')
    months = months.map((v, i) => {
      return <span
        class={this.getMonthCellClass(i)}
        onClick={this.selectMonth.bind(this, i)}>
        {v}
      </span>
    })
    return <div class="mx-panel mx-panel-month">{months}</div>
  }
}
