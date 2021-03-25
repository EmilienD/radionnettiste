const { speak, write } = require('../utils')

const initRadioStation = async (page, { name, init, play, pause }) => {
  await init(page).catch((e) => {
    speak(
      `Désolé, je n'ai pas réussi à trouver ${name}. Veuillez appeler Milosse.`
    )
    write(`Init failed for ${name}`, e)
  })
  let isPaused = true
  const wrappedPlay = async () => {
    if (isPaused) {
      await page.bringToFront()
      await play(page).catch((e) => {
        speak(
          `Désolé, je n'arrive pas à démarrer ${name}. Veuillez appeler Milosse.`
        )
        write(e)
      })
      isPaused = false
    }
  }
  const wrappedPause = async () => {
    if (!isPaused) {
      await page.bringToFront()
      await pause(page).catch((e) => {
        speak(
          `Oh là, c'est quoi ce bordel ! J'arrive pas à couper ${name}. Veuillez appeler Milosse.`
        )
        write(e)
      })
      isPaused = true
    }
  }
  return {
    name,
    play: wrappedPlay,
    pause: wrappedPause,
    togglePlayPause: async () => (isPaused ? wrappedPlay() : wrappedPause()),
    isPaused: () => isPaused,
  }
}

const createPlayer = async (browser, radioStations, initControls) => {
  let i = 0

  const initialisedStations = await radioStations.reduce(async (acc, s) => {
    const list = await acc

    const page = await browser.newPage()
    const initialisedStation = await initRadioStation(page, s)
    list.push(initialisedStation)
    return list
  }, Promise.resolve([]))
  speak(initialisedStations[i].name)
  await initialisedStations[i].play()

  const playStationAt = async (newIndex) => {
    if (initialisedStations.length) {
      await initialisedStations
        .find((s) => s === initialisedStations[i])
        .pause()
      i = newIndex
      speak(initialisedStations[i].name)
      await initialisedStations[newIndex].play()
    }
  }

  return initControls({
    next: async () =>
      initialisedStations[i].isPaused()
        ? initialisedStations[i].play()
        : playStationAt((i + 1) % initialisedStations.length),
    previous: async () =>
      initialisedStations[i].isPaused()
        ? initialisedStations[i].play()
        : playStationAt(i === 0 ? initialisedStations.length - 1 : i - 1),
    toggleOnOff: async () => {
      await initialisedStations[i].togglePlayPause()
    },
  })
}

module.exports = createPlayer
