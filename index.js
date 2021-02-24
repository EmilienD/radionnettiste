const puppeteer = require('puppeteer')
const keypress = require('keypress')
const shell = require('shelljs')
const stations = require('./radios')

// TODO: use play/stop buttons instead of closing and reloading the page
// pregenerate all the pages with wrapper that offer play/stop functions

const createRadioStation = async (page, { name, init, play, pause }) => {
  await init(page).catch((e) => {
    speak(
      `Désolé, je n'ai pas réussi à trouver ${name}. Veuillez appeler Milosse.`
    )
    console.log(`Init failed for ${name}`, e)
  })
  return {
    name,
    play: async () => {
      await page.bringToFront()
      console.log('play', name)
      return play(page).catch((e) => {
        speak(
          `Désolé, je n'arrive pas à démarrer ${name}. Veuillez appeler Milosse.`
        )
        console.log(e)
      })
    },
    pause: async () => {
      await page.bringToFront()
      console.log('pause', name)
      return pause(page).catch((e) => {
        speak(
          `Oh là c'est quoi ce bordel, j'arrive pas à couper ${name}. Veuillez appeler Milosse.`
        )
        console.log(e)
      })
    },
  }
}

const speak = (sentence) =>
  new Promise((resolve) => {
    try {
      shell.exec(`espeak -v french "${sentence}"`)
      resolve()
    } catch (e) {
      console.log(`Could not say "${sentence}":`, e)
    }
  })

const start = async () => {
  speak('Chargement des stations de radio en cours.')
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    defaultViewport: { height: 800, width: 1200 },
    ignoreDefaultArgs: ['--mute-audio', '--hide-scrollbars'],
  })

  let i = 0

  const initialisedStations = await stations.reduce(async (acc, s) => {
    const list = await acc

    const page = await browser.newPage()
    const initialisedStation = await createRadioStation(page, s)
    list.push(initialisedStation)
    return list
  }, Promise.resolve([]))
  speak(stations[i].name)
  await initialisedStations[i].play()

  const stdin = process.stdin
  keypress(stdin)
  stdin.setRawMode(true)

  stdin.on('keypress', async (char, key) => {
    await initialisedStations.find((s) => s === initialisedStations[i]).pause()
    i =
      key.name === 'pageup'
        ? (i + 1) % initialisedStations.length
        : i === 0
        ? initialisedStations.length - 1
        : i - 1
    speak(initialisedStations[i].name)
    await initialisedStations[i].play()
  })
}

start()
