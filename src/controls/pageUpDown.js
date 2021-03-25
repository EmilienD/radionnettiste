const readline = require('readline')
const { default: PQueue } = require('p-queue')

function debounce(func, wait, immediate) {
  var timeout
  return function () {
    var context = this,
      args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

const stdin = process.stdin
readline.emitKeypressEvents(stdin)
stdin.setRawMode(true)

const initControls = ({ next, previous, toggleOnOff }) => {
  const keypressList = []
  const debouncedListener = debounce(() => {
    const [key1, key2] = keypressList
    const isDoublePageup = key1 === 'pageup' && key2 === 'pageup'
    if (isDoublePageup) {
      queue.add(toggleOnOff)
    } else if (key1 === 'pageup') {
      queue.add(next)
    } else if (key1 === 'pagedown') {
      queue.add(previous)
    }
    keypressList.splice(0, keypressList.length)
  }, 500)
  const queue = new PQueue({ concurrency: 1 })
  stdin.on('keypress', async (c, k) => {
    keypressList.push(k.name)
    debouncedListener()
  })
}

module.exports = initControls
