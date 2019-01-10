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
  
  // Boolean if we already fired the fake 'ended' event
  get beforeEndNotified() {
    return this._beforeEndNotified || false;
  }
  
  set beforeEndNotified(bool) {
    this._beforeEndNotified = bool;
  }
  
  get loadTimeout() {
    return this._loadTimeout || 15000; 
  } 
  
  set loadTimeout(num) {
    this._loadTimeout = num; 
  }
  
  get notifySongHalf() {
    return this._notifySongHalf || false; 
  } 
  
  set notifySongHalf(bool) {
    this._notifySongHalf = bool; 
  }
  
  // Boolean if we already fired the song half event
  get songHalfNotified() {
    return this._songHalfNotified || false;
  }
  
  set songHalfNotified(bool) {
    this._songHalfNotified = bool;
  }
  
  get isStopped() {
    if (this._isStopped !== undefined) {
      return this._isStopped;
    }
    return true;
  }
  
  set isStopped(bool) {
    this._isStopped = bool;
  }
  
  
  // todo - should this be an option or just always do it?
  // should we first check if client is online before
  // trying to load a song
  this.checkOnlineStatus = false;
  
  get validatePlayFunction() {
    return this._validatePlayFunction;
  }
  
  set validatePlayFunction(fn) {
    this._validatePlayFunction = fn;
  }
  
}

export {AudioManager};