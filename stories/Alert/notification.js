import Alert from './Alert.vue'
import Vue from 'vue'

Alert.newInstance = properties => {
  const props = properties || {}

  const Instance = new Vue({
    data: () => props,
    render(h) {
      return h(Alert, {
        props
      })
    }
  })

  const component = Instance.$mount()
  document.body.append(component.$el)

  const alert = Instance.$children[0]

  return {
    add(notice) {
      alert.add(notice)
    },
    remove(name) {
      alert.remove(name)
    }
  }
}

export default Alert
