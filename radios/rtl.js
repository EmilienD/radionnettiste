const rtl = {
  name: 'RTL',
  init: async (page) => {
    await page.goto('https://www.rtl.fr/direct', {
      waitUntil: 'networkidle2',
    })
  },
  play: async (page) => {
    const gdprSelector = '#didomi-notice-agree-button'
    const gdprButton = await page.$(gdprSelector).catch(() => null)
    if (gdprButton) {
      await page
        .click(gdprSelector)
        .catch((e) => console.log('failed to click RTL gdpr button: ', e))
    }
    const frames = await page.frames()
    const playerFrameSelectors = await Promise.all(
      frames.map((f) => {
        return f ? f.$('.jwplayer-container') : null
      })
    )
    const playerFrame = await playerFrameSelectors.find((v) => v)
    if (playerFrame) {
      const mutedVolume = await playerFrame.$(
        '[aria-valuenow="0"][aria-label="Volume"]'
      )
      const play = await playerFrame.$('[aria-label="Play"]')
      if (play) {
        await playerFrame.click('[aria-label="Play"]')
      }

      if (mutedVolume) {
        await mutedVolume.click()
      }
    }
  },
  pause: async (page) => {
    const frames = await page.frames()
    const playerFrameSelectors = await Promise.all(
      frames.map((f) => {
        return f.$('.jwplayer-container')
      })
    )
    const playerFrame = playerFrameSelectors.find((v) => v)

    const stopButton = await playerFrame.$('[aria-label="Stop"]')
    if (stopButton) {
      await stopButton.click()
    }
  },
}
module.exports = rtl
