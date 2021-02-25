const { write } = require('../utils')

const franceInter = {
  name: 'France intère.',
  init: async (page) => {
    await page.goto('https://www.franceinter.fr/', {
      waitUntil: 'load',
    })
  },
  play: async (page) => {
    const gdprSelector = '#didomi-notice-agree-button'
    const gdprButton = await page.$(gdprSelector).catch(() => null)
    if (gdprButton) {
      await page
        .click(gdprSelector)
        .catch((e) => write('failed to click France Inter gdpr button: ', e))
    }
    await page.click('button.replay-button.playable.action-button.black')
  },
  pause: async (page) => {
    await page.click(
      'button.replay-button.playable.action-button.black.playing'
    )
  },
}
module.exports = franceInter
