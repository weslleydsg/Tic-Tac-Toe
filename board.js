class Board {
  constructor(size) {
    this.size = size;
    this.cells = this.getInitialCells();
  }

  getInitialCells() {
    const cells = [];
    for (let i = 0; i < this.size; i++) {
      cells.push([]);
      for (let j = 0; j < this.size; j++) {
        cells[i].push('');
      }
    }
    return cells;
  }

  getCells() {
    return this.cells;
  }

  updateCell(value, row, col) {
    this.cells[row][col] = value;
  }

  removeCellValue(row, col) {
    this.cells[row][col] = '';
  }

  getEmptyCells() {
    const emptyCells = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.cells[row][col] == '') {
          emptyCells.push({ row, col });
        }
      }
    }
    return emptyCells;
  }

  isBoardFull() {
    const hasSomeEmpty = this.cells.some(row => row.some(value => value == ''));
    return !hasSomeEmpty;
  }
}

export default Board;