#! /usr/bin/env node
const shell = require('shelljs')
const puppeteer = require('puppeteer')
const stations = require('./radios')
const initPageUpDownControls = require('./controls/pageUpDown')
const { speak, write } = require('./utils')
const createPlayer = require('./player/player')

const start = async () => {
  speak('Chargement des stations de radio en cours.')
  const browser = await puppeteer
    .launch({
      executablePath: shell.which('google-chrome').stdout,
      headless: true,
      defaultViewport: { height: 800, width: 1200 },
      ignoreDefaultArgs: ['--mute-audio', '--hide-scrollbars'],
    })
    .catch((e) => {
      speak('Désolé, ça marche pas, dommage.')
      write('Failed to start puppeteer:', e)
      process.exit()
    })

  await createPlayer(browser, stations, initPageUpDownControls).catch((e) =>
    write('Shit crashed:', e)
  )
}

start()
