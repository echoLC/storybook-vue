import { storiesOf } from '@storybook/vue'
import Vue from 'vue'

Vue.prototype.$Alert = alert

import alert from './alert'

storiesOf('Alert', module).add('alert', () => ({
  template: `<div style="margin: 50px;"><button @click="alert" style="font-size: 18px;width: 90px; height: 45px;background: green;color: #fff;">alert</button></div>`,
  methods: {
    alert() {
      this.$Alert.info({
        content: '我是提示信息 1',
        duration: 3
      })
    }
  }
}))
