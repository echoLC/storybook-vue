const Animation = (function(){
  const css = (node, styles) => Object.entries(styles)
  .forEach(([key, value]) => node.style[key] = value)
  const reset = node => node.style = ''

  return {
    fade(during) {
      return function(to, from, onFinish) {
        css(from, {
          opacity: 1,
          transition: `all ${during/1000}s`,
          zIndex: 10
        })
        css(to, {
          opacity: 0,
          transition: `all ${during/1000}s`,
          zIndex: 9
        })

        setTimeout(() => {
          css(from, {
            opacity: 0,
          })
          css(to, {
            opacity: 1,
          })              
        }, 100)

        setTimeout(() => {
          reset(from)
          reset(to)
          onFinish && onFinish()
        }, during)

      }
    },

    zoom(scale = 5, during = 1000) {
      return function(to, from, onFinish) {
        css(from, {
          opacity: 1,
          transform: `scale(1)`,
          transition: `all ${during/1000}s`,
          zIndex: 10
        })
        css(to, {
          zIndex: 9
        })

        setTimeout(() => {
          css(from, {
            opacity: 0,
            transform: `scale(${scale})`
          })             
        }, 100)

        setTimeout(() => {
          reset(from)
          reset(to)
          onFinish && onFinish()
        }, during)

      }
    }
  }
})()

export default Animation