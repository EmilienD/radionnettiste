const { write } = require('../utils')

const rireEtChansons = {
  name: 'Rire et Chansons',
  init: async (page) => {
    await page.goto('https://www.rireetchansons.fr/webradios/rire-chansons', {
      waitUntil: 'domcontentloaded',
    })
  },
  play: async (page) => {
    const gdprSelector = '.qc-cmp2-summary-buttons > button:nth-child(3)'
    const gdprButton = await page.$(gdprSelector).catch(() => null)
    if (gdprButton) {
      await gdprButton.click().catch((e) => {
        write('failed to click Rire et Chansons gdpr button: ', e)
        throw e
      })
    }
    return page.click('#webradioPlay').catch((e) => {
      write('failed to click Rire et Chansons play button: ', e)
      throw e
    })
  },
  pause: async (page) => {
    const stopButton = await page.$('#webradioPlay.a-button--active')
    if (stopButton) {
      return stopButton.click().catch((e) => {
        write('failed to click Rire et Chansons stop button: ', e)
        throw e
      })
    }
  },
}

module.exports = rireEtChansons
