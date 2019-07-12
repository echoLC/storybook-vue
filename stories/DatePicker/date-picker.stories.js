import { storiesOf } from '@storybook/vue'
import DatePicker from './src/DatePicker.vue'

storiesOf('DatePicker', module)
  .add('basic date picker', () => ({
    components: {
      DatePicker
    },
    data () {
      return { 
        date: []
      }
    },
    template: `<date-picker v-model="date" type="daterange" format="YYYY-MM-DD HH:mm:ss"></date-picker>`
  }))