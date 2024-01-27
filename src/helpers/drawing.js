const drawLine = (x1, y1, x2, y2, color, context) => {
  context.strokeStyle = color
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
}

const drawSquare = (x, y, color, context) => {
  context.fillStyle = color
  context.fillRect(x + 1, y + 1, SQUARE_SIZE - 2, SQUARE_SIZE - 2)

  const colorLighter = colorShade(color, -30)
  const colorDarker = colorShade(color, 30)

  drawLine(x, y + SQUARE_SIZE - 1, x, y, colorLighter, context)
  drawLine(x, y, x + SQUARE_SIZE - 1, y, colorLighter, context)
  drawLine(x + 1, y + SQUARE_SIZE - 1, x + SQUARE_SIZE - 1, y + SQUARE_SIZE - 1, colorDarker, context)
  drawLine(x + SQUARE_SIZE - 1, y + SQUARE_SIZE - 1, x + SQUARE_SIZE - 1, y + 1, colorDarker, context)
}

const drawPiece = (shape, currentX, currentY, context) => {
  for (let i = 0; i < shape.coordinates.length; i++) {
    const x = (shape.coordinates[i][0] + currentX) * SQUARE_SIZE
    const y = (shape.coordinates[i][1] + currentY) * SQUARE_SIZE

    drawSquare(x, y, shape.color, context)
  }
}