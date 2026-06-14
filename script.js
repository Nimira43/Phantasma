const scene = document.getElementById('scene')
const tear1 = document.getElementById('tear1')
const tear2 = document.getElementById('tear2')
const tear3 = document.getElementById('tear3')
const noiseCanvas = document.getElementById('noiseCanvas')
const noiseCtx = noiseCanvas.getContext('2d')
const blackout = document.getElementById('blackout')
const redBand = document.getElementById('redBand')
const statusBar = document.getElementById('statusBar')
const intensitySlider = document.getElementById('intensitySlider')
const intensityVal = document.getElementById('intensityVal')
const autoBtn = document.getElementById('autoBtn')

let autoMode = true
let autoTimer = null
let glitching = false

const statuses = ['SIGNAL NOMINAL', 'SYNC LOST', 'BUFFER OVERFLOW', 'MEMORY CORRUPTION', 'CARRIER LOST', 'ERROR 0xDEAD', 'SIGNAL DEGRADED', 'FRAME DROP', 'CLOCK DESYNC', 'SIGNAL NOMINAL']