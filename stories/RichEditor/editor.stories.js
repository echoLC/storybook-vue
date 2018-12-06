import { storiesOf } from '@storybook/vue'

import Editor from './src/RichEditor.vue'

storiesOf('rich editor', module).add('default editor', () => ({
  components: { Editor },
  template: '<editor></editor>'
}))
