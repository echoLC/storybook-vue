<template>
  <ul class="cascader-menu">
    <li 
      class="cascader-menu-item" 
      v-for="item in data" 
      :key="item.value" 
      @click="expandChildren(item)"
      :class="{'cascader-menu-item__clickable': isHasChildren(item) }">
      <span class="cascader-menu-label">{{ item.label }}</span>
      <span class="cascader-menu-icon" v-if="isHasChildren(item)">></span>
      <template v-if="isHasChildren(item) && item.expand">
        <cascader-menu :data="item.children" class="cascader-menu-child"></cascader-menu>
      </template>
      </li>
  </ul>
</template>

<script>
export default {
  name: 'CascaderMenu',

  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },

  methods: {
    isHasChildren (item) {
      return item.children && item.children.length > 0
    },
    expandChildren (item) {
      item.expand = !item.expand
    }
  }
}
</script>

<style scoped>
.cascader-menu {
  min-width: 122px;
  margin: 8px 0;
  padding: 0 16px;
  line-height: 1.8;
  z-index: 200;
  background: #fff;
}

.cascader-menu-child {
  position: absolute;
  right: calc(-100% - 24px);
  top: 0;
  border: 1px solid #efefef;
  padding: 6px 16px;
}

.cascader-menu > .cascader-menu-item {
  list-style-type: none;
}

.cascader-menu-item__clickable {
  cursor: pointer;
}

.cascader-menu-item > .cascader-menu-icon {
  color: #999;
}
</style>