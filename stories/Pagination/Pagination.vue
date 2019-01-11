<template>
<div class="pagination-conatiner" v-if="total > 0">
  <ul class="pagination-list">
    <li @click="pre" :class="[ newPage === 1 ? 'text-disable' : '']">&lt;</li>
    <li v-for="(page, index) in pageArray" 
      @click="pageChange(page)" 
      :key="index" 
      :class="[ (newPage === page ? 'text-primary' : '') ]">
      {{ page }}
      </li>
    <li @click="next" :class="[ newPage === pageCount ? 'text-disable' : '']">&gt;</li>
  </ul>
</div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      newPage: this.currentPage
    }
  },
  computed: {
    pageCount () {
      return Math.ceil(this.total / this.pageSize)
    },
    pageArray () {
      let arr = []
      for (let i = 0; i < this.pageCount; i++) {
        arr.push(i + 1)
      }
      return arr
    }
  },
  methods: {
    pageChange (page) {
      if (page === this.newPage) {
        return
      }
      this.newPage = page
      this.$emit('page-change', this.newPage)
    },
    pre () {
      if (this.newPage === 1) {
        return
      }
      this.newPage -= 1
      this.$emit('page-change', this.newPage)
    },
    next () {
      if (this.newPage === this.pageCount) {
        return
      }
      this.newPage += 1
      this.$emit('page-change', this.newPage)
    }
  }
}
</script>

<style lang="css" scoped>
.pagination-conatiner {
  padding: 30px;
}
.pagination-list li {
  list-style-type: none;
  display: inline-block;
  width: 35px;
  padding: 0 4px;
  font-size: 13px;
  text-align: center;
  height: 28px;
  line-height: 28px;
  margin: 0;
  cursor: pointer;
}
.pagination-list li.text-primary {
  color: #409eff;
  cursor: default;
}
.pagination-list li.text-disable {
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>

