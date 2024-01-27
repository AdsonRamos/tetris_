const stage = document.getElementById('stage')
const ctxMain = stage.getContext('2d')

const GRID_WIDTH = 10
const GRID_HEIGHT = 20
const SQUARE_SIZE = 25

const STAGE_NEXT_PIECE_SIZE = 125

const scoreParagraph = document.getElementById('score')
const levelParagraph = document.getElementById('level')

const pauseBtn = document.getElementById('pauseBtn')

const nextPieceStage = document.getElementById('nextPieceStage')
const ctxNextPiece = nextPieceStage.getContext('2d')
nextPieceStage.setAttribute('width', STAGE_NEXT_PIECE_SIZE)
nextPieceStage.setAttribute('height', STAGE_NEXT_PIECE_SIZE)
ctxNextPiece.fillStyle = '#FFFFFF'
ctxNextPiece.fillRect(0, 0, STAGE_NEXT_PIECE_SIZE, STAGE_NEXT_PIECE_SIZE)

let score = 0

const DELAY = 500
const DELAY_DECREASED = 20

let level = 1

let gameOver = false
let interval
let pause = false

let board = Array(GRID_HEIGHT * GRID_WIDTH).fill(undefined)

let currX = 4
let currY = 1

const COLOR_BACKGROUND = '#808F87'
stage.setAttribute('width', GRID_WIDTH * SQUARE_SIZE)
stage.setAttribute('height', GRID_HEIGHT * SQUARE_SIZE)

const shapes = [Z_SHAPE, S_SHAPE, LINE_SHAPE, T_SHAPE, SQUARE_SHAPE, L_SHAPE, MIRRORED_L_SHAPE]

let currentShape = shapes[Math.floor(Math.random() * 7)]
let nextShape = shapes[0]

const switchPause = () => {
  pause = !pause
  if (pause) {
    pauseBtn.innerText = 'Continue'
  } else {
    pauseBtn.innerText = 'Pause'
  }
}

const newGame = () => {
  score = 0

  currX = 4
  currY = 1

  gameOver = false
  pause = false

  board = Array(GRID_HEIGHT * GRID_WIDTH).fill(undefined)
  currentShape = shapes[Math.floor(Math.random() * 7)]
  nextShape = shapes[Math.floor(Math.random() * 7)]
}

const dropDown = () => {
  let newY = currY

  while (newY > 0) {
    if (!canMove(currX, newY + 1, currentShape)) {
      break
    }
    newY++
  }
}

const renderNextPiece = () => {
  // repaint background
  ctxNextPiece.fillStyle = '#FFFFFF'
  ctxNextPiece.fillRect(0, 0, STAGE_NEXT_PIECE_SIZE, STAGE_NEXT_PIECE_SIZE)

  const widthShape = Math.abs(Math.max(...nextShape.coordinates.map(el => el[0])) - Math.min(...nextShape.coordinates.map(el => el[0]))) + 1
  const heightShape = Math.abs(Math.max(...nextShape.coordinates.map(el => el[1])) - Math.min(...nextShape.coordinates.map(el => el[1]))) + 1


  const { x: xPadding, y: yPadding } = paddingNextShape[nextShape.name]

  drawPiece(nextShape, 5 - xPadding * widthShape, 5 - yPadding * heightShape, ctxNextPiece)
}

const generateNewShape = () => {
  if (currY - 1 <= 0) {
    gameOver = true
  }

  currX = 4
  currY = 1

  currentShape = nextShape
  nextShape = shapes[Math.floor(Math.random() * 7)]

  renderOnStage()
}

const checkLinesToRemove = () => {
  let numFullLines = 0

  for (let i = 0; i < GRID_HEIGHT; i++) {

    let lineIsFull = true

    for (let j = 0; j < GRID_WIDTH; j++) {
      if (shapeAt(j, i) == undefined) {
        lineIsFull = false
        break
      }

    }

    if (lineIsFull) {
      numFullLines++
      for (let k = i; k > 0; k--) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          board[k * GRID_WIDTH + x] = shapeAt(x, k - 1)
        }
      }
    }
  }

  score += numFullLines
  scoreParagraph.innerText = score

  level = Math.floor(score / 10) + 1
  levelParagraph.innerText = level
}

const savePieceOnBoard = () => {
  currentShape.coordinates.forEach(el => {
    board[(currY + el[1]) * GRID_WIDTH + currX + el[0]] = { filled: true, color: structuredClone(currentShape.color) }
  });

  checkLinesToRemove()

  generateNewShape()
}

const renderOnStage = () => {
  // repaint background
  ctxMain.fillStyle = COLOR_BACKGROUND
  ctxMain.fillRect(0, 0, stage.width, stage.height)

  drawPiece(currentShape, currX, currY, ctxMain)

  // draw Board
  for (let i = 0; i < GRID_HEIGHT; i++) {
    for (let j = 0; j < GRID_WIDTH; j++) {
      if (board[i * GRID_WIDTH + j]) {
        drawSquare(j * SQUARE_SIZE, i * SQUARE_SIZE, board[i * GRID_WIDTH + j].color, ctxMain)
      }
    }
  }
}

const shapeAt = (x, y) => {
  return board[y * GRID_WIDTH + x]
}

const canMove = (newX, newY, shape) => {
  for (let i = 0; i < 4; i++) {
    const x = newX + shape.getX(i)
    const y = newY + shape.getY(i)

    // boundaries
    if (x < 0 || x >= GRID_WIDTH || y >= GRID_HEIGHT) {
      return false
    }

    // collision
    if (shapeAt(x, y)) {
      return false
    }
  }

  currX = newX
  currY = newY

  currentShape = shape

  renderOnStage()
  return true
}

const oneLineDown = () => {
  if (!canMove(currX, currY + 1, currentShape)) {
    savePieceOnBoard()
  }
}

const gameLoop = () => {
  if (!pause) {
    clearInterval(interval)
    if (!gameOver) {
      oneLineDown()
      renderNextPiece()
    } else {
      ctxMain.fillStyle = 'white'
      ctxMain.font = '15px Trebuchet MS'
      ctxMain.fillText('Game Over', stage.width / 2 - 30, stage.height / 2)
      ctxMain.fillText('Press New Game to Restart ;)', stage.width / 2 - 80, stage.height / 2 + 20)
    }
    interval = setInterval(gameLoop, DELAY - (level - 1) * DELAY_DECREASED)
  }
  //pause = true
}

const startGame = () => {
  interval = setInterval(gameLoop, DELAY - (level - 1) * DELAY_DECREASED)
}

window.onload = function () {
  startGame()
}

window.addEventListener('keydown', event => {
  if (pause) return
  if (event.key === 'a') {
    canMove(currX - 1, currY, currentShape)
  } else if (event.key === 'd') {
    canMove(currX + 1, currY, currentShape)
  } else if (event.key === 'e') {
    canMove(currX, currY, currentShape.rotateRight())
  } else if (event.key === 'q') {
    canMove(currX, currY, currentShape.rotateLeft())
  } else if (event.key === 's') {
    canMove(currX, currY + 1, currentShape)
  } else if (event.code === 'Space') {
    dropDown()
  }
})