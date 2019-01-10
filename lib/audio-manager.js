class AudioManager {
  
  constructor() {
    if (!AudioManager.instance) {
      AudioManager.instance = this;
    }
    return AudioManager.instance;
  }
  
  get notifyBeforeEnd() {
    return this._notifyBeforeEnd || false;
  }
  
  set notifyBeforeEnd(bool) {
    this._notifyBeforeEnd = bool;
  }
  
  
  
}

export {AudioManager};