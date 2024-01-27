  class Shape {
    constructor({ coordinates, color, name }) {
      this.coordinates = coordinates
      this.color = color
      this.name = name
    }

    getX(index) {
      return this.coordinates[index][0]
    }

    getY(index) {
      return this.coordinates[index][1]
    }

    rotateLeft() {
      if (this == SQUARE_SHAPE) {
        return this
      }

      const result = multiplyMatrices(this.coordinates, rotationMatrixLeft)
      return new Shape({ coordinates: result, color: this.color, name: this.name })
    }

    rotateRight() {
      if (this == SQUARE_SHAPE) {
        return this
      }

      const result = multiplyMatrices(this.coordinates, rotationMatrixRight)
      return new Shape({ coordinates: result, color: this.color, name: this.name })
    }
  }