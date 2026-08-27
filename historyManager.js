//hard to wrap my head around undo/redo. laying it out clean
class HistoryManager {
  constructor(options = {}) {
    this.undoStack = [];
    this.redoStack = [];

    this.maxHistory = options.maxHistory ?? 20;
  }

  execute(action) {
    action.do();
    this.undoStack.push(action);
    this.redoStack.length = 0;

    this.limitHistory();
  }

  undo() {
    if (!this.canUndo()) return;

    const action = this.undoStack.pop();
    action.undo();
    this.redoStack.push(action);
  }

  redo() {
    if (!this.canRedo()) return;

    const action = this.redoStack.pop();
    action.do();
    this.undoStack.push(action);
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
  }

  limitHistory() {
    while (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
  }
}
