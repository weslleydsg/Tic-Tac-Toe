const QUERY_ELEMENTS = {
  selectGameMode: '#select-game-mode',
  board: {
    selectSizes: '#select-board-size',
    container: '#board',
  },
  boardOverlay: {
    overlay: '#board-overlay',
    message: '#board-overlay-message',
  },
  actionButtons: {
    undoButton: '#undo-button',
    restartButton: '#restart-button',
  }
}

const CONSTS = {
  queryElements: { ...QUERY_ELEMENTS },
  defaultValues: {
    boardSize: 3,
    board: {
      size: 3,
    },
  },
  values: {
    game: {
      mode: {
        singlePlayer: 'singlePlayer',
        twoPlayers: 'twoPlayers',
      }
    },
    board: {
      minSize: 3,
      maxSize: 10,
    },
    player: {
      symbols: {
        X: 'X',
        O: 'O'
      }
    }
  }
}

export default CONSTS;