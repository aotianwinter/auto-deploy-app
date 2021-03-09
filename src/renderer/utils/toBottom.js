// el is the document node need to bottom
function toBottom (el) {
  const cubic = value => Math.pow(value, 3)
  const easeInOutCubic = value => value < 0.5
    ? cubic(value * 2) / 2
    : 1 - cubic((1 - value) * 2) / 2
  const beginTime = Date.now()
  const bottomValue = el.scrollHeight
  const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))
  const frameFunc = () => {
    const progress = (Date.now() - beginTime) / 500
    if (progress < 1) {
      el.scrollTop += bottomValue * easeInOutCubic(progress)
      rAF(frameFunc)
    } else {
      el.scrollTop = bottomValue
    }
  }
  rAF(frameFunc)
}

export default toBottom
