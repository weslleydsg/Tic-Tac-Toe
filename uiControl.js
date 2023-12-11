import CONSTS from './consts.js';
import Game from './game.js';

const { selectGameMode: selectGameModeQuery, board: boardQuery, actionButtons: actionButtonsQuery, boardOverlay: boardOverlayQuery } = CONSTS.queryElements;
const { boardSize: defaultBoardSize } = CONSTS.defaultValues;
const { game: gameValues, board: boardValues } = CONSTS.values;

class UiControl {
  constructor() {
    this.isGameOver = false;
    this.gameMode = gameValues.mode.singlePlayer;
    this.setBoardSize(defaultBoardSize);
    this.boardElement = document.querySelector(boardQuery.container);
    this.boardOverlay = document.querySelector(boardOverlayQuery.overlay);
    this.game = new Game(this.gameMode, this.boardSize, this.rerender.bind(this), this.onGameOver.bind(this));
    this.initActions();
    this.render();
  }

  setBoardSize(size) {
    this.boardSize = size;
    const fontSize = 12 / size;
    document.documentElement.style.setProperty('--boardSize', size);
    document.documentElement.style.setProperty('--cellFontSize', `${fontSize}em`);
  }

  updateBoardSize(size) {
    this.setBoardSize(size);
    this.restartGame();
  }

  updateGameMode(mode) {
    this.gameMode = mode;
    this.restartGame();
  }

  initActions() {
    this.selectBoardSizeElement = document.querySelector(boardQuery.selectSizes);
    this.selectGameModeElement = document.querySelector(selectGameModeQuery);
    this.undoButtonElement = document.querySelector(actionButtonsQuery.undoButton);
    this.restartButtonElement = document.querySelector(actionButtonsQuery.restartButton);
    this.listenSelectGameMode();
    this.renderSelectBoardSize();
    this.listenSelectBoardSize();
    this.listenUndoButton();
    this.listenRestartButton();
  }

  rerender() {
    this.destroy();
    this.render();
  }

  render() {
    this.renderBoard();
    const isSinglePlayer = this.gameMode == gameValues.mode.singlePlayer
    const lastMove = this.game.getLastMove();
    this.undoButtonElement.disabled = !isSinglePlayer || !lastMove;
    this.game.listenCellPress();
  }

  destroy() {
    this.boardElement.innerHTML = "";
  }

  restartGame() {
    this.game.restartGame(this.gameMode, this.boardSize);
    this.boardOverlay.classList.add('hidden');
    this.rerender();
  }

  listenSelectGameMode() {
    this.selectGameModeElement.addEventListener('change', ({ target }) => {
      this.restartGame();
      this.updateGameMode(gameValues.mode[target.value]);
    });
  }

  renderSelectBoardSize() {
    const { minSize, maxSize } = boardValues;
    for (let index = minSize; index <= maxSize; index++) {
      const optionElement = document.createElement('option');
      const selected = defaultBoardSize == index;
      optionElement.text = `${index}x${index}`;
      optionElement.value = index;
      optionElement.selected = selected;
      this.selectBoardSizeElement.add(optionElement);
    }
  }

  listenSelectBoardSize() {
    this.selectBoardSizeElement.addEventListener('change', ({ target }) => {
      this.updateBoardSize(target.value);
    });
  }

  listenUndoButton() {
    this.undoButtonElement.addEventListener('click', this.undoLastMove.bind(this));
  }

  undoLastMove() {
    this.boardOverlay.classList.add('hidden');
    this.game.undoLastMove();
  }

  listenRestartButton() {
    this.restartButtonElement.addEventListener('click', this.restartGame.bind(this));
  }

  renderBoard() {
    const cells = this.game.getBoardCells();
    cells.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const cell = document.createElement('button');
        const currentPlayer = this.game.getCurrentPlayer();
        cell.className = `cell ${value || `player-${currentPlayer}`}`;
        if (value) {
          cell.classList.add(value);
          cell.innerText = value;
        } else {
          cell.classList.add(`player-${currentPlayer}`);
        }
        cell.row = rowIndex;
        cell.col = colIndex;
        this.boardElement.appendChild(cell);
      });
    });
  }

  onGameOver(winner) {
    this.isGameOver = true;
    this.renderGameOver(winner);
  }

  renderGameOver(winner) {
    const message = winner == 'draw' ? "It's a draw!" : `\nWINNER!`;
    const overlayMessage = this.boardOverlay.querySelector(boardOverlayQuery.message);
    overlayMessage.innerText = message;
    overlayMessage.className = `player-${winner}`;
    this.boardOverlay.classList.remove('hidden');
  }
}

export default UiControl;