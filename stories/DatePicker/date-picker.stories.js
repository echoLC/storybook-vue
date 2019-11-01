import { storiesOf } from '@storybook/vue'
import DatePicker from './src/datepicker'

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
    template: `<datepicker v-model="date" type="daterange" format="YYYY-MM-DD"></datepicker>`
  }))