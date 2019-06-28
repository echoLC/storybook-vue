class Carousel {
  constructor(root, animation) {
    this.animation = animation || ((to, from, onFinish) => onFinish())
    this.root = root
    this.panels = Array.from(root.querySelectorAll('.panels a'))
    this.dotCt = root.querySelector('.dots')
    this.dots = Array.from(root.querySelectorAll('.dots span'))
    this.pre = root.querySelector('.pre')
    this.next = root.querySelector('.next')

    this.bind()
  }

  get index() {
    return this.dots.indexOf(this.root.querySelector('.dots .active'))
  }

  get preIndex() {
    return (this.index - 1 + this.dots.length) % this.dots.length
  }

  get nextIndex () {
    return (this.index + 1) % this.dots.length
  }

  bind() {
    this.dotCt.onclick = e => {
      if(e.target.tagName !== 'SPAN') return

      let lastIndex = this.index
      let index = this.dots.indexOf(e.target)
      this.setDot(index)
      this.showPage(index, lastIndex) 
    }

    this.pre.onclick = e => {
      let index = this.preIndex
      this.setDot(index)
      this.showPage(index, this.preIndex)  
    }

    this.next.onclick = e => {
      let index = this.nextIndex
      this.setDot(index)
      this.showPage(index, this.preIndex)  
    }
  }

  setDot(index) {
    this.dots.forEach(dot => dot.classList.remove('active'))
    this.dots[index].classList.add('active')
  }

  showPage(toIndex, fromIndex) {
    //执行动画，执行完成后最终结果
    //如果没传递动画，直接执行结果
    this.animation(this.panels[toIndex], this.panels[fromIndex], () => {
      this.panels.forEach(panel => panel.style.zIndex = 0)
      this.panels[toIndex].style.zIndex = 10            
    })
  }

  setAnimation(animation) {
    this.animation = animation
  }
}

export default Carousel
