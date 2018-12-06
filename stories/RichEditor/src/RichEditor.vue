<template>
  <div class='tinymce-container editor-container'>
    <textarea class='tinymce-textarea' :id="tinymceId"></textarea>
    <div class="editor-custom-btn-container"></div>
  </div>
</template>

<script>
import { toolbar } from './defaultToolBar.js'

export default {
  name: 'Editor',
  props: {
    id: {
      type: String,
      default: `tinymce-${+new Date()}`
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      default: () => (toolbar)
    },
    menubar: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      require: false,
      default: 360
    },
    language: {
      type: String,
      default: 'zh_CN'
    }
  },
  data () {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id
    }
  },
  methods: {
    initTinymce () {
      const self = this
      window.tinymce.init({
        language: this.language,
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar,
        menubar: this.menubar,
        plugins: 'advlist,autolink,code,paste,textcolor, colorpicker,fullscreen,link,lists,media,wordcount, imagetools',
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        block_formats: '普通标签=p;小标题=h2;',
        // imagetools_cors_hosts: ['wpimg.wallstcn.com', 'wallstreetcn.com'],
        imagetools_toolbar: 'watermark',
        default_link_target: '_blank',
        link_title: false,
        init_instance_callback (editor) {
          if (self.value) {
            editor.setContent(self.value)
          }
          self.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            self.hasChange = true
            self.$emit('input', editor.getContent())
          })
        },
        setup (editor) {
          editor.addButton('h2', {
            title: '小标题', // tooltip text seen on mouseover
            text: '小标题',
            onclick () {
              editor.execCommand('mceToggleFormat', false, 'h2')
            },
            onPostRender () {
              const btn = this
              editor.on('init', () => {
                editor.formatter.formatChanged('h2', (state) => {
                  btn.active(state)
                })
              })
            }
          })
          editor.addButton('p', {
            title: '正文',
            text: '正文',
            onclick () {
              editor.execCommand('mceToggleFormat', false, 'p')
            },
            onPostRender () {
              const btn = this
              editor.on('init', () => {
                editor.formatter.formatChanged('p', (state) => {
                  btn.active(state)
                })
              })
            }
          })
        }
      })
    },
    getTinymceInstance () {
      return window.tinymce.get(this.tinymiceId)
    },
    destoryTinymce () {
      if (this.getTinymceInstance()) {
        tinymce.destory()
      }
    },
    setContent(value) {
      this.getTinymceInstance().setContent(value)
    },
    getContent() {
      this.getTinymceInstance().getContent()
    }
  },
  watch: {
    value (newVal) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => this.getTinymceInstance().setContent(newVal))
      }
    }
  },
  mounted () {
    this.initTinymce()
    console.log(this.getTinymceInstance())
  },
  destroyed () {
    this.destoryTinymce()
  }
}
</script>

<style lang="css" scoped>
  .tinymce-container {
    position: relative
  }
  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }
  .editor-custom-btn-container {
    position: absolute;
    right: 15px;
    /*z-index: 2005;*/
    top: 18px;
  }
  .editor-upload-btn {
    display: inline-block;
  }
</style>
