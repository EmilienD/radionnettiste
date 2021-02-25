const { write } = require('../utils')

const rmc = {
  name: 'rmc',
  init: async (page) => {
    await page.goto('https://rmc.bfmtv.com/mediaplayer/live-audio/', {
      waitUntil: 'load',
    })
    const gdprSelector = '#didomi-notice-agree-button'
    const gdprButton = await page.$(gdprSelector).catch(() => null)
    if (gdprButton) {
      await page
        .click(gdprSelector)
        .catch((e) => write('failed to click Rmc gdpr button: ', e))
    }
    await page.reload()
    await new Promise((resolve) => setTimeout(() => resolve(), 3000))
  },
  play: async (page) => {
    const gdprSelector = '#didomi-notice-agree-button'
    const gdprButton = await page.$(gdprSelector).catch(() => null)
    if (gdprButton) {
      await page
        .click(gdprSelector)
        .catch((e) => write('failed to click Rmc gdpr button: ', e))
    }
    await page.hover('#video_player_0_vjs')
    await page.click('button.vjs-mute-control.vjs-control.vjs-button.vjs-vol-0')
  },
  pause: async (page) => {
    await page.click('button.vjs-mute-control.vjs-control.vjs-button.vjs-vol-3')
  },
}
module.exports = rmc
