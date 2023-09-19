const WIN_CASES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
let selectedCells, playerSelections, cpuSelections, test, win, point, cell

const isSelected = (cellID) => {
  for (cell of selectedCells) {
    if (cell == cellID)
      return false
  }
  selectedCells.push(cellID)
  return true
}

const getCPUCell = () => {
  let cpuCell = selectedCells[0]
  while (!isSelected(cpuCell)) { cpuCell = Math.floor(Math.random() * 9) }
  cpuSelections.push(cpuCell)
  return cpuCell
}

const clear = () => {
  selectedCells = []
  playerSelections = []
  cpuSelections = []

  for (cell of document.getElementsByClassName("cell"))
    cell.style.backgroundImage = "None"
}

const gameOver = who => {
  setTimeout(() => {
    if (who == "none")
      document.getElementById("winner").innerText = "Draw Match"
    else
      document.getElementById("winner").innerText = who + " Won"
    document.getElementById("overlay").style.display = "block"
    document.getElementById("modal").style.transform = "scale(1)"
    clear()
    return true
  }, 400)
}

const check = (array, who) => {
  test = array.join()
  for (win of WIN_CASES) {
    point = 0
    for (cell of win) {
      if (test.search(cell) != -1)
        point++
    }
    if (point == 3)
      return gameOver(who)
  }
}

const select = playerCell => {
  if (isSelected(playerCell)) {
    playerSelections.push(playerCell)
    document.getElementById(playerCell).style.backgroundImage = "url(../images/x.png)"
    if (check(playerSelections, "You")) return

    if (selectedCells.length == 9)
      return gameOver("none")

    let cpuCell = getCPUCell()
    setTimeout(() => {
      document.getElementById(cpuCell).style.backgroundImage = "url(../images/o.png)"
      check(cpuSelections, "CPU")
    }, 100)
  }
}

const play = () => {
  document.getElementById("overlay").style.display = "none"
  document.getElementById("modal").style.transform = "scale(0)"
}

window.addEventListener('load', () => {
  const board = document.getElementById('board')
  for (let i = 0; i < 9; i++) {
    const btn = document.createElement('button')
    btn.classList.add('cell')
    btn.setAttribute('id', i)
    btn.addEventListener('click', () => select(i))
    board.appendChild(btn)
  }
  clear()
  play()
  document.querySelector('.play-again').addEventListener('click', play)
})
