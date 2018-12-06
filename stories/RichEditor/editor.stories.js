import { storiesOf } from '@storybook/vue'

import Editor from './src/RichEditor.vue'

const defaultVal = '<h1>标题</h1>'
const defaultToolbar = [
  '|  bullist numlist | outdent indent |',
  'bold italic | h2 p link | alignleft aligncenter alignright'
]

storiesOf('rich editor', module)
  .add('default editor', () => ({
    components: { Editor },
    template: '<editor></editor>'
  }))
  .add('inital value', () => ({
    components: { Editor },
    template: `<editor v-model="defaultVal"></editor>`,
    data: () => ({ defaultVal })
  }))
  .add('simple toolbar editor', () => ({
    components: { Editor },
    template: `<editor :toolbar="defaultToolbar"></editor>`,
    data: () => ({ defaultToolbar })
  }))
  .add('480px height editor', () => ({
    components: { Editor },
    template: `<editor :toolbar="defaultToolbar" :height="480"></editor>`,
    data: () => ({ defaultToolbar })
  }))
