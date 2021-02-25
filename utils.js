const shell = require('shelljs')
const speak = (sentence) =>
  new Promise((resolve) => {
    try {
      shell.exec(`espeak -v french "${sentence}"`)
      resolve()
    } catch (e) {
      write(`Could not say "${sentence}":`, e)
    }
  })
const write = (...args) => console.log(...args)
module.exports = {
  speak,
  write,
}
