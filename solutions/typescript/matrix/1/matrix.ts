export class Matrix {
  private matrix: number[][]
  constructor(matrix: string) {
    this.matrix = matrix.trim()
        .split("\n")
        .map((row) => row.split(" ").map(Number));
  }

  get rows(): number[][] {
    return this.matrix;
  }

  get columns(): number[][] {
    return this.transpose(this.matrix)
  }

  private transpose(matrix: number[][]) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]))
  }
}
