<template>
  <div :id="id">
    <h1>富文本框</h1>
  </div>
</template>

<script>
export default {
  name: 'Editor',
  props: {
    id: {
      type: String,
      default: `tinyce-${new Date()}`
    }
  }
}
</script>
