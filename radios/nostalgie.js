const nostalgie = {
  name: 'Nostalgie',
  init: async (page) => {
    await page.goto('https://www.nostalgie.be/radioplayer/nostalgie', {
      waitUntil: 'domcontentloaded',
    })
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 1000)
    })
    const gdprSelector = '.qc-cmp2-summary-buttons > button:nth-child(3)'
    const gdprButton = await page.$(gdprSelector).catch(() => null)
    if (gdprButton) {
      await gdprButton.click().catch((e) => {
        console.log('failed to click Nostalgie gdpr button: ', e)
        throw e
      })
    }
    await page.click('button[aria-label="play"]').catch((e) => {
      console.log('failed to click nostalgie play button: ', e)
      throw e
    })

    const stopButton = await page.$('button[aria-label="stop"]')
    if (stopButton) {
      return stopButton.click().catch((e) => {
        console.log('failed to click nostalgie stop button: ', e)
        throw e
      })
    }
  },
  play: async (page) => {
    const gdprSelector = '.qc-cmp2-summary-buttons > button:nth-child(3)'
    const gdprButton = await page.$(gdprSelector).catch(() => null)
    if (gdprButton) {
      await gdprButton.click().catch((e) => {
        console.log('failed to click Nostalgie gdpr button: ', e)
        throw e
      })
    }
    return page.click('button[aria-label="play"]').catch((e) => {
      console.log('failed to click nostalgie play button: ', e)
      throw e
    })
  },
  pause: async (page) => {
    const stopButton = await page.$('button[aria-label=stop]')
    if (stopButton) {
      return stopButton.click().catch((e) => {
        console.log('failed to click nostalgie stop button: ', e)
        throw e
      })
    }
  },
}
module.exports = nostalgie
