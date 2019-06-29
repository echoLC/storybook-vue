<template>
  <div class="carousel-wrapper">
    <select name="animationType" class="select" v-model="animationType">
      <option value="fade">fade</option>
      <option value="zoom">zoom</option>
    </select>
    <div class="carousel">
      <div class="panels">
        <a href="#">
          <img src="http://cdn.jirengu.com/book.jirengu.com/img/1.jpg">
        </a>
        <a href="#">
          <img src="http://cdn.jirengu.com/book.jirengu.com/img/2.jpg">
        </a>
        <a href="#">
          <img src="http://cdn.jirengu.com/book.jirengu.com/img/3.jpg">
        </a>
        <a href="#">
          <img src="http://cdn.jirengu.com/book.jirengu.com/img/4.jpg">
        </a>
      </div>
      <div class="action">
        <span class="pre">上一个</span>
        <span class="next">下一个</span>
        <div class="dots">
          <span class="active"></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Carousel from './Carousel'
import Animation from './Animation'

export default {
  name: 'Carousel',

  data () {
    return {
      animationType: 'fade'
    }
  },

  watch: {
    animationType () {
      this.carousel.setAnimation(Animation[this.animationType](1800))
    }
  },

  mounted () {
    this.carousel = new Carousel(document.querySelector('.carousel'), Animation[this.animationType](1800))
  }
}
</script>

<style scoped>
.carousel {
  margin: 30px auto;
  max-width: 800px;
}  

.carousel .panels {
  position: relative;
  height: 100%;
  height: 200px;
  overflow: hidden;
}  

.carousel .panels > a {
  position: absolute;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  object-fit: cover;
}  

.carousel .panels > a:first-child {
  z-index: 10;
}  

.carousel .panels img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}  

.carousel .dots {
  text-align: center;
}


.carousel .dots > span {
  width: 6px;
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  display: inline-block;
  transition: width .3s;
  cursor: pointer;
}  

.carousel .dots span.active {
  background: #aaa;
  width: 10px;
}  

.carousel .action {
  display: flex;
  font-size: 12px;
  color: #666;
  align-items: center;
  margin-top: 6px;
}

.carousel .action .pre {
  order: 1;
  cursor: pointer;
}  

.carousel .action .next {
  order: 3;
  cursor: pointer;
}  

.carousel .action .dots {
  order: 2;
  flex: 1;
}

.select {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>