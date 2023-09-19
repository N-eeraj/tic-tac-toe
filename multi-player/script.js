import log from './console.js'

const WIN_CASES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

const playBtn = document.getElementById('play')
const qrCode = document.getElementById('qrCode')

let peer, connection
let player1 = null
let turn = false
const selections = {
  player: [],
  opponent: [],
}

const generateQR = id => {
  playBtn.classList.add('hidden')
  qrCode.classList.remove('hidden')
  const url = `${location.href}?matchId=${id}`
  const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=${url}`
  log(url)
  qrCode.src = qrCodeURL
  qrCode.alt = qrCodeURL
}

const sendMessage = message => connection.send(JSON.stringify(message))
const handleMessage = () => connection.on('data', data => {
  const { type, message } = JSON.parse(data)
  switch (type) {
    case 'connection':
      log(`Connected to ${message}`, 'success')
      if (message === 'client') {
        sendMessage({
          type: 'connection',
          message: 'host',
        })
        qrCode.classList.add('hidden')
      }
      else {
        const toss = Math.random() > 0.5
        log(`${toss ? 'client' : 'host'} goes first`, 'info')
        sendMessage({
          type: 'toss',
          message: toss,
        })
      }
      break
    case 'toss':
      if (player1 === null) {
        turn = message
        log(`Is player 1: ${message}`, 'message')
        player1 = message
        sendMessage({
          type: 'toss',
          message: !message,
        })
        const board = document.getElementById('board')
        for (let i = 0; i < 9; i++) {
          const btn = document.createElement('button')
          btn.classList.add('cell')
          btn.setAttribute('id', i)
          btn.addEventListener('click', () => selectCell(i))
          board.appendChild(btn)
        }
        alert(message ? 'You go first': 'You go second')
      }
      break
    case 'selection':
      selections.opponent.push(message)
      turn = true
      log(`Opponent selected cell: ${message}`, 'message')
      document.getElementById(message).style.backgroundImage = "url(../images/o.png)"
      break
    default:
      console.error(`Invalid data type ${type}`)
  }
})

const selectCell = id => {
  if (!turn || Object.values(selections).flat().some(cell => cell === id)) return
  selections.player.push(id)
  log(`You selected cell: ${id}`, 'info')
  document.getElementById(id).style.backgroundImage = "url(../images/x.png)"
  turn = false
  sendMessage({
    type: 'selection',
    message: id,
  })
}

window.addEventListener('load', async () => {
  peer = await new Peer()
  peer.on('open', id => {
    const queryParams = new URLSearchParams(window.location.search)
    const matchId = queryParams.get('matchId')
    if (matchId) {
      connection = peer.connect(matchId)
      connection.on('open', () => {
        handleMessage(connection)
        log('Client initiated', 'info')
        sendMessage({
          type: 'connection',
          message: 'client',
        })
      })
    }
    else {
      playBtn.classList.remove('hidden')
      playBtn.addEventListener('click', () => generateQR(id))
      peer.on('connection', conn => {
        connection = conn
        log('Host initiated', 'info')
        handleMessage()
      })

    }
  })
})
