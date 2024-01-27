const rotationMatrixRight = [[0, 1], [-1, 0]]
const rotationMatrixLeft = [[0, -1], [1, 0]]

const multiplyMatrices = (M1, M2) => {
  const result = []
  for (let i = 0; i < M1.length; i++) {
    result[i] = []
    for (let j = 0; j < M2[0].length; j++) {
      let sum = 0
      for (let k = 0; k < M1[0].length; k++) {
        sum += M1[i][k] * M2[k][j]
      }
      result[i][j] = sum
    }
  }
  return result
}