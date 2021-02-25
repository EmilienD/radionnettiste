const puppeteer = require('puppeteer')
const stations = require('./radios')
const initPageUpDownControls = require('./controls/pageUpDown')
const { speak } = require('./utils')
const createPlayer = require('./player/player')

const start = async () => {
  speak('Chargement des stations de radio en cours.')
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    defaultViewport: { height: 800, width: 1200 },
    ignoreDefaultArgs: ['--mute-audio', '--hide-scrollbars'],
  })

  createPlayer(browser, stations, initPageUpDownControls)
}

start()
