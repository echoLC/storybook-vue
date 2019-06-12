<template>
  <div class="dv-cascader">
    <h1>级联组件</h1>
  </div>
</template>

<script>
export default {
  name: 'DvCascader',
  
  props: {
    options: {
      type: Array,
      default: () => ([])
    }
  },

  data () {
    return {}
  },

  methods: {},

  created () {
    console.log(this.options)
  }
}
</script>

<style lang="scss" scoped>

</style>