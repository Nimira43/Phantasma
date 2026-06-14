const scene = document.getElementById('scene')
const tear1 = document.getElementById('tear1')
const tear2 = document.getElementById('tear2')
const tear3 = document.getElementById('tear3')
const noiseCanvas = document.getElementById('noiseCanvas')
const noiseCtx = noiseCanvas.getContext('2d')
const blackout = document.getElementById('blackout')
const greenBand = document.getElementById('greenBand')
const statusBar = document.getElementById('statusBar')
const intensitySlider = document.getElementById('intensitySlider')
const intensityVal = document.getElementById('intensityVal')
const autoBtn = document.getElementById('autoBtn')

let autoMode = true
let autoTimer = null
let glitching = false

const statuses = [
  'SIGNAL NOMINAL',
  'SYNC LOST',
  'BUFFER OVERFLOW',
  'MEMORY CORRUPTION',
  'CARRIER LOST',
  'ERROR 0xDEAD',
  'SIGNAL DEGRADED',
  'FRAME DROP',
  'CLOCK DESYNC',
  'SIGNAL NOMINAL'
]

intensitySlider.addEventListener('input', () => {
  intensityVal.textContent = intensitySlider.value
})

autoBtn.addEventListener('click', () => {
  autoMode = !autoMode
  autoBtn.textContent = 'AUTO: ' + (autoMode ? 'ON' : 'OFF')

  if (autoMode) scheduleAuto()
  else if (autoTimer) clearTimeout(autoTimer)
})

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1))
}

function drawNoise(opacity) {
  const w = noiseCanvas.width, h = noiseCanvas.height
  const imageData = noiseCtx.createImageData(w, h)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() > 0.5 ? 255 : 0
    data[i] = 0
    data[i + 1] = Math.random() > 0.3 ? v : 0
    data[i + 2] = 0
    data[i + 3] = Math.random() > 0.85 ? 180 : 0
  }

  noiseCtx.putImageData(imageData, 0, 0)
}

function showTear(el, intensity) {
  const h = parseInt(rand(2, 4 + intensity))
  const top = randInt(10, 320)
  el.style.top = top + 'px'
  el.style.height = h + 'px'
  el.style.transform = 'translateX(' + rand(-intensity * 2, intensity * 2) + 'px)'
  el.style.background = Math.random() > 0.5
    ? 'rgba(0,255,0,0.2)'
    : 'rgba(255,255,255,0.08)'
  el.style.display = 'block'
}

const glitchEffects = {
  tears(intensity, dur) {
    showTear(tear1, intensity)
    showTear(tear2, intensity)

    if (intensity > 5) showTear(tear3, intensity)
    
    setTimeout(() => {
      tear1.style.display = 'none'
      tear2.style.display = 'none'
      tear3.style.display = 'none'
    }, dur)
  },

  noise(intensity, dur) {
    drawNoise()
    noiseCanvas.style.display = 'block'
    
    noiseCanvas.style.opacity = Math.min(
      0.1 + intensity * 0.05, 0.5
    )
    
    let t = 0
    const flicker = setInterval(() => {
      drawNoise()
      if (++t > dur / 40) {
        clearInterval(flicker)
        noiseCanvas.style.display = 'none'
      }
    }, 40)
  },

  blackout(intensity, dur) {
    blackout.style.display = 'block'
    blackout.style.opacity = rand(0.3, 0.8)
    
    setTimeout(
      () => blackout.style.display = 'none',
      Math.min(dur * 0.4, 80)
    )
  },

  chromatic(intensity, dur) {
    scene.classList.add('glitch-chromatic')
    
    setTimeout(
      () => scene.classList.remove('glitch-chromatic'),
      dur
    )
  },

  skew(intensity, dur) {
    scene.classList.add('glitch-skew')
    
    scene.style.transform =
      `scale(1.02) skewX(${rand(-intensity * 0.5, intensity * 0.5)}deg) translateX(${rand(-intensity, intensity)}px)`
    
    setTimeout(() => {
      scene.classList.remove('glitch-skew')
      scene.style.transform = ''
    }, dur * 0.6)
  },
  
  shake(intensity, dur) {
    scene.classList.add('glitch-shake')
    
    setTimeout(
      () => scene.classList.remove('glitch-shake'),
      dur
    )
  },

  flicker(intensity, dur) {
    scene.classList.add('glitch-flicker')

    setTimeout(
      () => scene.classList.remove('glitch-flicker'),
      dur * 0.5)
    
  },

  greenBand(intensity, dur) {
    greenBand.style.top = randInt(20, 300) + 'px'
    greenBand.style.height = randInt(2, 6 + intensity) + 'px'
    greenBand.style.display = 'block'
    
    setTimeout(
      () => greenBand.style.display = 'none',
      Math.min(dur * 0.3, 100)
    )
  },

  multiTear(intensity, dur) {
    let count = 0
    const maxRips = Math.min(intensity + 2, 8)

    const rip = () => {
      [tear1, tear2, tear3]
        .forEach(
          t => showTear(t, intensity)
        )
      
      if (++count < maxRips) setTimeout(rip, rand(30, 80))
      
      else setTimeout(() => {
        tear1.style.display = 'none'
        tear2.style.display = 'none'
        tear3.style.display = 'none'
      }, dur)
    }
    rip()
  }
}

const effectKeys = Object.keys(glitchEffects)

function triggerGlitch(manual) {
  if (glitching && !manual) return
  
  glitching = true

  const intensity = parseInt(intensitySlider.value)

  const dur = randInt(
    80 + intensity * 10, 200 + intensity * 30
  )
  
  statusBar.textContent = statuses[randInt(1, statuses.length - 2)]

  const numEffects = manual ?
    randInt(3, 6) :
    randInt(1 + Math.floor(intensity / 4), 3 + Math.floor(intensity / 3))
  
  const shuffled = [...effectKeys].sort(
    () => Math.random() - 0.5).slice(0, numEffects)
  
  shuffled.forEach(k => glitchEffects[k](intensity, dur))

  setTimeout(() => {
    glitching = false
    statusBar.textContent = 'SIGNAL NOMINAL'
  }, dur + 50)
}

function scheduleAuto() {
  if (!autoMode) return

  const intensity = parseInt(intensitySlider.value)
  const delay = rand(800, 5000 - intensity * 300)
  
  autoTimer = setTimeout(() => {
    triggerGlitch(false)
    scheduleAuto()
  }, delay)
}

scheduleAuto()