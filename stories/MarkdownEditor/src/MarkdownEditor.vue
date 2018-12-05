<template>
  <div class="container">
    <div :id="id"></div>
  </div>  
</template>

<script>
import 'codemirror/lib/codemirror.css' // codemirror
import 'tui-editor/dist/tui-editor.css' // editor ui
import 'tui-editor/dist/tui-editor-contents.css' // editor content
import Editor from 'tui-editor'
import defaultOptions from './defaultOptions'
import { qiniuFactory } from './qiniu.js'

export default {
  name: 'MarkdownEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: false,
      default () {
        return 'markdown-editor-' + (+new Date()) + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    options: {
      type: Object,
      default () {
        return defaultOptions
      }
    },
    mode: {
      type: String,
      default: 'markdown'
    },
    height: {
      type: String,
      required: false,
      default: '300px'
    },
    language: {
      type: String,
      required: false,
      default: 'zh_CN' // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
    },
    qiniu: {
      type: Object,
      default: () => ({ token: 'wJVyfxRH-bu913tD5RfnsOGqQEGDELSYxmQ3pXlf:jL1L3h-yKB6XKe90UHl3tYgszUo=:eyJzY29wZSI6ImJpbmd1by1jb21tb24iLCJkZWFkbGluZSI6LTkyMjMzNzIwMzUzMTM3MjE4Nzl9', uploadDomain: '', host: 'http://qn.365rich.com/' })
    },
    prefix: {
      type: String,
      default: 'article/'
    }
  },
  data () {
    return {
      editor: null
    }
  },
  computed: {
    editorOptions () {
      const options = Object.assign({}, defaultOptions, this.options)
      options.initialEditType = this.mode
      options.height = this.height
      options.language = this.language
      return options
    }
  },
  watch: {
    value (newValue, preValue) {
      if (this.isEditorValueChange(newValue, preValue)) {
        this.setValue(newValue)
      }
    },
    height (newValue) {
      this.editor.height(newValue)
    },
    mode (newValue) {
      this.editor.changeMode(newValue)
    }
  },
  mounted () {
    this.initEditor()
  },
  destroyed () {
    this.destroyEditor()
  },
  methods: {
    initEditor () {
      const self = this
      this.editor = new Editor({
        el: document.getElementById(this.id),
        hooks: {
          addImageBlobHook (file, callback) {
            const qiniu = qiniuFactory(self.qiniu)
            const filename = qiniu.getFilename(self.prefix, file.name)
            qiniu.upload(file, filename).then((res) =>{
              callback(`${self.qiniu.host}${res.data.key}`, 'alt text')
            }).catch((err) => {
              console.error(err)
            })
          }
        },
        ...this.editorOptions
      })
      if (this.value) {
        this.setValue(this.value)
      }
      this.editor.on('change', () => {
        this.$emit('input', this.getValue())
      })
    },
    destroyEditor () {
      if (!this.editor) return
      this.editor.off('change')
      this.editor.remove()
    },
    setValue (value) {
      this.editor.setValue(value)
    },
    getValue () {
      return this.editor.getValue()
    },
    isEditorValueChange (newVal, preVal) {
      return (newVal !== preVal) && (newVal !== this.getValue())
    }
  }
}
</script>


