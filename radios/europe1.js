const europe = {
  name: 'europe 1',
  init: async (page) => {
    await page.goto('https://www.europe1.fr/', { waitUntil: 'networkidle2' })
  },
  play: async (page) => {
    const gdprSelector = '#didomi-notice-agree-button'
    const gdprButton = await page.$(gdprSelector).catch(() => null)
    if (gdprButton) {
      await page
        .click(gdprSelector)
        .catch((e) => console.log('failed to click Europe gdpr button: ', e))
    }
    await page.click('button.direct.unmute')
  },
  pause: async (page) => {
    await page.click('button.direct')
  },
}
module.exports = europe
