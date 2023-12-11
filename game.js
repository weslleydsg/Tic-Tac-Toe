import Board from './board.js';
import CONSTS from './consts.js';

const { game: gameValues, player: playerValues } = CONSTS.values;

class Game {
  constructor(mode, boardSize, onChange, onGameOver) {
    this.onChange = onChange;
    this.onGameOver = onGameOver;
    this.startGame(mode, boardSize);
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getLastMove() {
    return this.lastMove;
  }

  getBoardCells() {
    return this.board.getCells();
  }

  startGame(mode, boardSize) {
    this.currentPlayer = playerValues.symbols.X;
    this.mode = mode;
    this.board = new Board(boardSize);
    this.lastMove = null;
    this.isPlaying = true;
  }

  restartGame(mode, boardSize) {
    this.startGame(mode, boardSize);
  }

  listenCellPress() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      if (cell.innerText) {
        return;
      }
      cell.addEventListener('click', ({ target }) => {
        this.onCellPress(target.row, target.col);
      });
    });
  }

  onCellPress(row, col) {
    if (!this.isPlaying) {
      return;
    }
    const gameOver = this.playTurn(row, col);
    this.changePlayerTurn();
    this.onChange();
    if (gameOver) {
      this.onGameOver(gameOver);
    }
  }

  playTurn(row, col) {
    this.makeMove(row, col);
    this.lastMove = { player: { row, col } };
    const gameOver = this.isGameOver();
    if (gameOver) {
      return gameOver;
    }
    if (this.mode == gameValues.mode.singlePlayer) {
      const computerMove = this.makeComputerPlayerMove();
      this.lastMove.computer = computerMove;
      const computerTurnGameOver = this.isGameOver();
      if (computerTurnGameOver) {
        return computerTurnGameOver;
      }
    }
    return false;
  }

  makeComputerPlayerMove() {
    this.changePlayerTurn();
    const emptyCells = this.board.getEmptyCells();
    if (emptyCells.length == 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    this.makeMove(row, col);
    return { row, col };
  }

  makeMove(row, col) {
    const symbol = playerValues.symbols[this.currentPlayer];
    this.board.updateCell(symbol, row, col);
  }

  changePlayerTurn() {
    this.currentPlayer = this.currentPlayer == playerValues.symbols.X
      ? playerValues.symbols.O
      : playerValues.symbols.X;
  }

  undoLastMove() {
    if (!this.lastMove) {
      return;
    }
    const { player, computer } = this.lastMove;
    if (player) {
      this.board.removeCellValue(player.row, player.col);
    }
    if (computer) {
      this.board.removeCellValue(computer.row, computer.col);
    }
    this.currentPlayer = playerValues.symbols.X;
    this.isPlaying = true;
    this.lastMove = null;
    this.onChange();
  }

  isGameOver() {
    const playerSymbols = Object.values(playerValues.symbols);
    const playerWon = playerSymbols.find(symbol => {
      return this.checkWin(symbol);
    });
    if (playerWon) {
      this.isPlaying = false;
      return playerWon;
    }
    if (this.board.isBoardFull()) {
      this.isPlaying = false;
      return 'draw';
    }
    return false;
  }

  checkWin(player) {
    if (this.checkRowWin(player)) {
      return true;
    }
    if (this.checkColWin(player)) {
      return true;
    }
    if (this.checkDiagonalWin(player)) {
      return true;
    }
  }

  checkRowWin(player) {
    const boardValues = this.board.getCells();
    const rowWin = boardValues.some(row => {
      const someDifferent = row.some(value => value != player);
      return !someDifferent;
    });
    return rowWin;
  }

  checkColWin(player) {
    const boardValues = this.board.getCells();
    const boardSize = boardValues.length;
    for (let colIndex = 0; colIndex < boardSize; colIndex++) {
      let colWin = true;
      for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
        if (boardValues[rowIndex][colIndex] != player) {
          colWin = false;
          break;
        }
      }
      if (colWin) {
        return true;
      }
    }
    return false;
  }

  checkDiagonalWin(player) {
    const boardValues = this.board.getCells();
    const boardSize = boardValues.length;
    let diagonalWin = true;
    let antiDiagonalWin = true;
    for (let index = 0; index < boardSize; index++) {
      if (boardValues[index][index] != player) {
        if (!antiDiagonalWin) {
          return false;
        }
        diagonalWin = false;
      }
      if (boardValues[index][boardSize - 1 - index] != player) {
        if (!diagonalWin) {
          return false;
        }
        antiDiagonalWin = false;
      }
    }
    return diagonalWin || antiDiagonalWin;
  }
}

export default Game;
