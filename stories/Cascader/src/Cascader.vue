<template>
  <div class="dv-cascader">
    <div class="dv-cascader-input-wrapper">
      <input type="text" readonly class="dv-cascader-input" @focus="toggleMenuStatus">
    </div>  
    <div class="dv-cascader-panel">
      <cascader-menu :data="this.nomalizeOptions(options)"></cascader-menu>
    </div>
  </div>
</template>

<script>
import CascaderMenu from './CascaderMenu'

export default {
  name: 'DvCascader',

  components: {
    CascaderMenu
  },
  
  props: {
    options: {
      type: Array,
      default: () => ([])
    }
  },

  data () {
    return {
      showMenu: false
    }
  },

  methods: {
    toggleMenuStatus () {
      this.showMmenu = !this.showMenu
    },

    nomalizeOptions (options) {
      return options.map((item) => {
        if (item.children && item.children.length > 0) {
          item.expand = false
          this.nomalizeOptions(item.children)
        }
        return item
      })
    }
  },

  created () {
    console.log(this.options)
  }
}
</script>

<style scoped>
.dv-cascader {
  position: relative;
}

.dv-cascader-input {
  width: 180px;
}

.dv-cascader-panel {
  position: absolute;
  background: #fff;
  border-radius: 6px;
  z-index: 2000;
  border: 1px solid #efefef;
  padding: 6px 0;
}
</style>