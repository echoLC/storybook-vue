import { storiesOf } from '@storybook/vue'
// import { action } from '@storybook/addon-actions';

import MarkdownEditor from './src/MarkdownEditor.vue'

const defaultValue = '## 标题'
const defaultOptions = {
  toolbarItems: ['heading', 'bold', 'italic']
}

storiesOf('MarkdownEditor', module)
  .add('default editor', () => ({
    components: { MarkdownEditor },
    template: '<markdown-editor></markdown-editor>'
  }))
  .add('inital value editor', () => ({
    components: { MarkdownEditor },
    template: `<markdown-editor :value="defaultValue"></markdown-editor>`,
    data: () => ({ defaultValue })
  }))
  .add('En language editor', () => ({
    components: { MarkdownEditor },
    template: `<markdown-editor language="en_US"></markdown-editor>`
  }))
  .add('simple editor', () => ({
    components: { MarkdownEditor },
    template: `<markdown-editor :options="defaultOptions"></markdown-editor>`,
    data: () => ({ defaultOptions })
  }))
  .add('500px height editor', () => ({
    components: { MarkdownEditor },
    template: `<markdown-editor height="500px"></markdown-editor>`,
    data: () => ({ defaultOptions })
  }))
